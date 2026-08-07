import { EventEmitter } from 'node:events';
import { API_DELAY_MS, formatMoney, sleep } from './utils.js';
import {
    fetchMarketLowestPrice,
    fetchMyPlayerId,
    fetchUserBazaar,
    fetchUserItemMarket,
    fetchWeav3rBazaarLowest
} from './torn-api.js';
import { notifyUndercutAlert } from './notify.js';

export class UndercutMonitor extends EventEmitter {
    constructor(getConfig) {
        super();
        this.getConfig = getConfig;
        this.timer = null;
        this.running = false;
        this.checks = 0;
        this.alerts = 0;
        this.activeKeys = new Set();
        this.alertMap = new Map();
        this.playerCache = {};
        this.nextScanAt = null;
        this.statusMessage = '';
    }

    getState() {
        return {
            running: this.running,
            checks: this.checks,
            alerts: this.alerts,
            nextScanAt: this.nextScanAt,
            statusMessage: this.statusMessage,
            alertsList: Array.from(this.alertMap.values())
        };
    }

    start() {
        if (this.running) return;
        var config = this.getConfig();
        if (!config.tornApiKey) throw new Error('请填写 Torn API Key');
        var interval = Math.max(30, Number(config.undercut?.intervalSeconds) || 60);
        this.running = true;
        this.emit('state', this.getState());
        this.runOnce().catch(function(err) {
            this.emit('error', err.message);
        }.bind(this));
        this.timer = setInterval(function() {
            this.runOnce().catch(function(err) {
                this.emit('error', err.message);
            }.bind(this));
        }.bind(this), interval * 1000);
        this.scheduleNext(interval);
    }

    stop() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
        this.running = false;
        this.nextScanAt = null;
        this.statusMessage = '';
        this.emit('state', this.getState());
    }

    scheduleNext(intervalSeconds) {
        this.nextScanAt = Date.now() + intervalSeconds * 1000;
        this.emit('state', this.getState());
    }

    buildAlertText(alert) {
        var tag = alert.source === 'Bazaar' ? '[Bazaar]' : '[Item Market]';
        if (alert.source === 'Bazaar' && alert.undercutBy) {
            return tag + ' ' + alert.name + '：你的 ' + formatMoney(alert.myPrice) + ' 被 '
                + alert.undercutBy.playerName + '（ID ' + alert.undercutBy.playerId + '）'
                + ' 压至 ' + formatMoney(alert.compareLow);
        }
        var lowLabel = alert.source === 'Bazaar' ? '巴扎最低' : '市场最低';
        return tag + ' ' + alert.name + '：你的 ' + formatMoney(alert.myPrice) + ' 已被压至 '
            + lowLabel + ' ' + formatMoney(alert.compareLow);
    }

    async runOnce() {
        var config = this.getConfig();
        var apiKey = config.tornApiKey;
        var undercut = config.undercut || {};
        var watchBazaar = undercut.watchBazaar !== false;
        var watchItemMarket = undercut.watchItemMarket !== false;
        var selectedIds = new Set();
        (undercut.selectedItems || []).forEach(function(item) {
            selectedIds.add(Number(item.id));
        });
        if (!selectedIds.size && undercut.selectedItemIds) {
            undercut.selectedItemIds.forEach(function(id) { selectedIds.add(Number(id)); });
        }

        if (!watchBazaar && !watchItemMarket) {
            this.stop();
            throw new Error('请至少选择一种监听范围');
        }

        this.checks++;
        this.statusMessage = '正在获取你的货物...';
        this.emit('state', this.getState());

        var myPlayerId = watchBazaar ? await fetchMyPlayerId(apiKey, this.playerCache) : null;
        var listings = [];

        if (watchItemMarket) {
            var imRows = await fetchUserItemMarket(apiKey);
            imRows.forEach(function(row) {
                var item = row.item || {};
                var itemId = item.id || item.ID;
                listings.push({
                    key: 'im-' + row.id,
                    itemId: itemId,
                    name: item.name || item.title || ('Item #' + (itemId || row.id)),
                    myPrice: Number(row.price) || 0,
                    source: 'Item Market',
                    kind: 'im'
                });
            });
        }

        if (watchBazaar) {
            var bazaar = await fetchUserBazaar(apiKey);
            bazaar.forEach(function(row) {
                var itemId = row.ID || row.id;
                listings.push({
                    key: 'bazaar-' + itemId + '-' + (Number(row.price) || 0),
                    itemId: itemId,
                    name: row.name || ('Item #' + itemId),
                    myPrice: Number(row.price) || 0,
                    source: 'Bazaar',
                    kind: 'bazaar'
                });
            });
        }

        if (selectedIds.size) {
            listings = listings.filter(function(entry) { return selectedIds.has(Number(entry.itemId)); });
        }

        if (!listings.length) {
            this.activeKeys.clear();
            this.alertMap.clear();
            this.statusMessage = selectedIds.size ? '指定物品当前没有在售货物' : '当前没有在售货物';
            this.emit('alerts', []);
            this.emit('state', this.getState());
            return;
        }

        var imPriceCache = {};
        var bazaarPriceCache = {};
        var currentUndercuts = new Set();
        var newAlerts = [];

        for (var i = 0; i < listings.length; i++) {
            var entry = listings[i];
            if (!entry.itemId) continue;
            this.statusMessage = '正在扫描' + (entry.kind === 'bazaar' ? '巴扎' : '市场')
                + '价格（' + (i + 1) + '/' + listings.length + '）...';
            this.emit('state', this.getState());

            var compareLow = null;
            var undercutBy = null;
            if (entry.kind === 'bazaar') {
                var bazaarLow = await fetchWeav3rBazaarLowest(entry.itemId, myPlayerId, bazaarPriceCache);
                if (bazaarLow) {
                    compareLow = bazaarLow.price;
                    undercutBy = { playerId: bazaarLow.playerId, playerName: bazaarLow.playerName };
                }
            } else {
                compareLow = await fetchMarketLowestPrice(apiKey, entry.itemId, imPriceCache);
            }

            if (compareLow !== null && compareLow < entry.myPrice) {
                currentUndercuts.add(entry.key);
                var alert = {
                    key: entry.key,
                    itemId: entry.itemId,
                    name: entry.name,
                    source: entry.source,
                    myPrice: entry.myPrice,
                    compareLow: compareLow,
                    undercutBy: undercutBy,
                    detectedAt: Math.floor(Date.now() / 1000)
                };
                if (!this.activeKeys.has(entry.key)) newAlerts.push(alert);
                this.alertMap.set(entry.key, alert);
            }

            if (i < listings.length - 1) await sleep(API_DELAY_MS);
        }

        this.activeKeys.forEach(function(key) {
            if (!currentUndercuts.has(key)) this.alertMap.delete(key);
        }.bind(this));
        this.activeKeys = currentUndercuts;

        if (newAlerts.length) {
            this.alerts += newAlerts.length;
            for (var j = 0; j < newAlerts.length; j++) {
                var text = this.buildAlertText(newAlerts[j]);
                await notifyUndercutAlert(config.notify, newAlerts[j], text);
            }
        }

        this.statusMessage = currentUndercuts.size
            ? '发现 ' + currentUndercuts.size + ' 个货物被压价'
            : '所有货物均为对应渠道最低价';
        this.emit('alerts', Array.from(this.alertMap.values()));
        this.emit('state', this.getState());

        if (this.running) {
            var interval = Math.max(30, Number(undercut.intervalSeconds) || 60);
            this.scheduleNext(interval);
        }
    }
}
