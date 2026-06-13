// ==UserScript==
// @name         Torn 物品购买均价计算器 - Mug抵扣版
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  计算购买物品成本，并扣除购买后5分钟内对同一卖家的mug金额
// @author       xiansakana[2754627]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    var MUG_WINDOW_SECONDS = 5 * 60;

    GM_addStyle(`
        #avgPriceToolBtn {
            position: fixed;
            top: 50%;
            right: -25px;
            transform: translateY(-50%);
            width: 30px;
            height: 80px;
            border-radius: 8px 0 0 8px;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            z-index: 9999;
            box-shadow: -2px 0 10px rgba(0,0,0,0.3);
            writing-mode: vertical-rl;
            text-orientation: mixed;
            transition: right 0.3s ease;
        }
        #avgPriceToolBtn:hover { background: #0056b3; right: 0; }
        #avgPriceToolBtn.panel-open { right: 0; }
        #avgPriceModal {
            display: none;
            position: fixed;
            top: 50%;
            right: 35px;
            transform: translateY(-50%);
            z-index: 10000;
            max-height: 90vh;
            max-width: calc(100vw - 50px);
            overflow-y: auto;
        }
        #avgPriceModal.show { display: block; }
        .apt-container {
            background: #333;
            padding: 20px;
            border-radius: 8px;
            width: 460px;
            max-width: 100%;
            color: #ccc;
            font-family: Arial, sans-serif;
            position: relative;
            box-shadow: -5px 0 20px rgba(0,0,0,0.5);
            box-sizing: border-box;
        }
        .apt-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #888;
        }
        .apt-close:hover { color: #fff; }
        .apt-container h2 { color: #ccc; margin-top: 0; }
        .apt-input-group { margin-bottom: 15px; }
        .apt-input-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .apt-input-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #2d2d2d;
            color: #ccc;
            font-size: 14px;
            box-sizing: border-box;
        }
        .apt-input-group input:focus {
            outline: none;
            border-color: #4da6ff;
        }
        .apt-input-group input[type="date"],
        .apt-input-group input[type="time"] { color-scheme: dark; }
        .apt-datetime-row {
            display: flex;
            gap: 8px;
        }
        .apt-datetime-row input[type="date"] { flex: 1; }
        .apt-datetime-row input[type="time"] { width: 110px; }
        .apt-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
            margin-top: 5px;
        }
        .apt-btn:hover { background: #0056b3; }
        .apt-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .apt-error { color: #ff6b6b; margin-top: 10px; }
        .apt-info { color: #ffc107; margin-top: 10px; }
        .apt-custom-select { position: relative; }
        .apt-select-display {
            width: 100%;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #2d2d2d;
            color: #ccc;
            cursor: pointer;
            box-sizing: border-box;
        }
        .apt-select-display:hover { border-color: #4da6ff; }
        .apt-select-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #2d2d2d;
            border: 1px solid #444;
            border-top: none;
            border-radius: 0 0 4px 4px;
            z-index: 10001;
            display: none;
            max-height: 300px;
            flex-direction: column;
        }
        .apt-select-dropdown.show { display: flex; }
        .apt-select-search {
            padding: 10px;
            border: none;
            border-bottom: 1px solid #444;
            background: #333;
            color: #ccc;
            outline: none;
        }
        .apt-select-options { overflow-y: auto; max-height: 250px; }
        .apt-select-option {
            padding: 8px 10px;
            cursor: pointer;
            border-bottom: 1px solid #3a3a3a;
        }
        .apt-select-option:hover { background: #444; }
        .apt-result { margin-top: 20px; display: none; }
        .apt-result.show { display: block; }
        .apt-summary {
            background: #2d2d2d;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        .apt-summary h3 { margin-top: 0; color: #4da6ff; }
        .apt-summary-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 5px 0;
            border-bottom: 1px solid #444;
        }
        .apt-summary-row:last-child { border-bottom: none; }
        .apt-summary-row .label { color: #aaa; }
        .apt-summary-row .value {
            color: #4da6ff;
            font-weight: bold;
            text-align: right;
            word-break: break-word;
        }
        .apt-avg-price { font-size: 20px; color: #28a745 !important; }
        .apt-negative { color: #28d17c !important; }
        .apt-purchase-item {
            background: #2d2d2d;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 4px;
            border-left: 4px solid #444;
        }
        .apt-purchase-item.bazaar { border-left-color: #ffc107; }
        .apt-purchase-item.market { border-left-color: #17a2b8; }
        .apt-purchase-item.trade { border-left-color: #28a745; }
        .apt-purchase-item h4 { margin: 0 0 8px 0; color: #ccc; font-size: 14px; }
        .apt-purchase-item p { margin: 3px 0; color: #aaa; font-size: 13px; }
        .apt-mug { color: #28d17c; font-weight: bold; }
        @media (max-width: 500px) {
            .apt-container {
                width: calc(100vw - 50px);
                max-width: 370px;
            }
        }
        @media (max-width: 768px) {
            #avgPriceToolBtn { right: -30px; }
            #avgPriceToolBtn.btn-visible { right: 0; }
            #avgPriceToolBtn:hover { right: -30px; }
            #avgPriceToolBtn.btn-visible:hover { right: 0; }
        }
    `);

    var btn = document.createElement('button');
    btn.id = 'avgPriceToolBtn';
    btn.textContent = '均价';
    btn.title = '物品购买均价计算器';
    document.body.appendChild(btn);

    var modal = document.createElement('div');
    modal.id = 'avgPriceModal';
    modal.innerHTML = `
        <div class="apt-container">
            <span class="apt-close">&times;</span>
            <h2>物品购买均价计算器</h2>
            <div class="apt-input-group">
                <label>API Key</label>
                <input type="text" id="aptApiKey" placeholder="请输入你的Torn API Key" />
            </div>
            <div class="apt-input-group">
                <label>选择物品</label>
                <div class="apt-custom-select">
                    <div class="apt-select-display" id="aptSelectDisplay">-- 输入API Key后点击加载 --</div>
                    <div class="apt-select-dropdown" id="aptSelectDropdown">
                        <input type="text" class="apt-select-search" id="aptSelectSearch" placeholder="搜索物品名称或ID..." />
                        <div class="apt-select-options" id="aptSelectOptions"></div>
                    </div>
                </div>
            </div>
            <div class="apt-input-group">
                <label>开始时间</label>
                <div class="apt-datetime-row">
                    <input type="date" id="aptStartDate" />
                    <input type="time" id="aptStartTime" value="00:00" />
                </div>
            </div>
            <div class="apt-input-group">
                <label>结束时间</label>
                <div class="apt-datetime-row">
                    <input type="date" id="aptEndDate" />
                    <input type="time" id="aptEndTime" value="23:59" />
                </div>
            </div>
            <button class="apt-btn" id="aptQueryBtn">查询购买记录</button>
            <div class="apt-error" id="aptError"></div>
            <div class="apt-info" id="aptInfo"></div>
            <div class="apt-result" id="aptResult">
                <div class="apt-summary">
                    <h3>购买统计</h3>
                    <div class="apt-summary-row"><span class="label">物品名称</span><span class="value" id="aptSumName">-</span></div>
                    <div class="apt-summary-row"><span class="label">总购买数量</span><span class="value" id="aptSumQty">0</span></div>
                    <div class="apt-summary-row"><span class="label">原始总花费</span><span class="value" id="aptSumOriginalCost">$0</span></div>
                    <div class="apt-summary-row"><span class="label">Mug抵扣</span><span class="value" id="aptSumMug">$0</span></div>
                    <div class="apt-summary-row"><span class="label">实际总成本</span><span class="value" id="aptSumCost">$0</span></div>
                    <div class="apt-summary-row"><span class="label">实际购买均价</span><span class="value apt-avg-price" id="aptSumAvg">$0</span></div>
                    <div class="apt-summary-row"><span class="label">Mug纪录 / 匹配</span><span class="value" id="aptSumMugMatch">0 / 0</span></div>
                    <div class="apt-summary-row"><span class="label">Bazaar</span><span class="value" id="aptSumBazaar">0 件</span></div>
                    <div class="apt-summary-row"><span class="label">Item Market</span><span class="value" id="aptSumMarket">0 件</span></div>
                    <div class="apt-summary-row"><span class="label">Trade</span><span class="value" id="aptSumTrade">0 件</span></div>
                </div>
                <h3 style="color:#ccc;">购买明细</h3>
                <div id="aptPurchaseList"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    var itemsCache = [];
    var selectedItemId = null;
    var selectedItemName = '';
    var lastMugCount = 0;
    var lastMatchedMugCount = 0;

    var apiKeyInput = document.getElementById('aptApiKey');
    var selectDisplay = document.getElementById('aptSelectDisplay');
    var selectDropdown = document.getElementById('aptSelectDropdown');
    var selectSearch = document.getElementById('aptSelectSearch');
    var selectOptions = document.getElementById('aptSelectOptions');
    var queryBtn = document.getElementById('aptQueryBtn');
    var errorEl = document.getElementById('aptError');
    var infoEl = document.getElementById('aptInfo');
    var resultEl = document.getElementById('aptResult');

    var savedKey = GM_getValue('tornApiKey', '');
    if (savedKey) apiKeyInput.value = savedKey;

    var touchStartX = 0;
    var touchStartY = 0;
    var swipeThreshold = 50;
    var edgeThreshold = 50;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        var touchEndX = e.changedTouches[0].screenX;
        var touchEndY = e.changedTouches[0].screenY;
        var diffX = touchEndX - touchStartX;
        var diffY = Math.abs(touchEndY - touchStartY);
        var screenWidth = window.innerWidth;

        if (Math.abs(diffX) > diffY && Math.abs(diffX) > swipeThreshold) {
            if (diffX < 0 && touchStartX > screenWidth - edgeThreshold) {
                btn.classList.add('btn-visible');
            } else if (diffX > 0 && btn.classList.contains('btn-visible') && !modal.classList.contains('show')) {
                btn.classList.remove('btn-visible');
            }
        }
    }, { passive: true });

    btn.addEventListener('click', function() {
        modal.classList.toggle('show');
        btn.classList.toggle('panel-open');
    });

    modal.querySelector('.apt-close').addEventListener('click', function() {
        modal.classList.remove('show');
        btn.classList.remove('panel-open');
    });

    function toNumber(value) {
        if (value == null) return 0;
        if (typeof value === 'number') return value;
        if (typeof value === 'object') {
            return toNumber(value.id || value.user_id || value.player_id || value.defender || value.target);
        }
        return Number(String(value).replace(/[$,]/g, '')) || 0;
    }

    function formatMoney(n) {
        var value = Math.round(toNumber(n));
        var sign = value < 0 ? '-' : '';
        return sign + '$' + Math.abs(value).toLocaleString();
    }

    function formatTime(ts) {
        return new Date(ts * 1000).toLocaleString('zh-TW');
    }

    function toTimestamp(s) {
        return s ? Math.floor(new Date(s).getTime() / 1000) : null;
    }

    function normalizeItems(items) {
        if (Array.isArray(items)) return items;
        return Object.keys(items || {}).map(function(id) {
            var item = items[id] || {};
            item.id = item.id || Number(id);
            return item;
        });
    }

    function renderOptions(items) {
        selectOptions.innerHTML = '';
        items.forEach(function(item) {
            var div = document.createElement('div');
            div.className = 'apt-select-option';
            div.textContent = item.name + ' (ID: ' + item.id + ')';
            div.addEventListener('click', function() {
                selectedItemId = Number(item.id);
                selectedItemName = item.name;
                selectDisplay.textContent = item.name + ' (ID: ' + item.id + ')';
                selectDropdown.classList.remove('show');
            });
            selectOptions.appendChild(div);
        });
    }

    selectSearch.addEventListener('input', function() {
        var s = selectSearch.value.toLowerCase();
        var filtered = itemsCache.filter(function(i) {
            return String(i.name || '').toLowerCase().includes(s) || String(i.id).includes(s);
        });
        renderOptions(filtered);
    });

    selectSearch.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    document.addEventListener('click', function() {
        selectDropdown.classList.remove('show');
    });

    async function loadItemsList() {
        var apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            selectDisplay.textContent = '-- 请先输入API Key --';
            return;
        }

        GM_setValue('tornApiKey', apiKey);
        selectDisplay.textContent = '-- 加载中... --';
        errorEl.textContent = '';

        try {
            var resp = await fetch('https://api.torn.com/v2/torn/items?key=' + encodeURIComponent(apiKey));
            var data = await resp.json();

            if (data.error) throw new Error(data.error.error || data.error);

            itemsCache = normalizeItems(data.items);
            selectDisplay.textContent = '-- 请选择物品 (' + itemsCache.length + '个) --';
        } catch (err) {
            selectDisplay.textContent = '-- 加载失败，点击重试 --';
            errorEl.textContent = err.message;
        }
    }

    selectDisplay.addEventListener('click', function(e) {
        e.stopPropagation();

        if (itemsCache.length === 0) {
            loadItemsList();
            return;
        }

        selectDropdown.classList.toggle('show');
        if (selectDropdown.classList.contains('show')) {
            selectSearch.value = '';
            renderOptions(itemsCache);
            selectSearch.focus();
        }
    });

    async function fetchLogsPage(apiKey, logTypes, from, to) {
        var url = 'https://api.torn.com/user/?selections=log'
            + '&key=' + encodeURIComponent(apiKey)
            + '&log=' + encodeURIComponent(logTypes)
            + '&from=' + encodeURIComponent(from)
            + '&to=' + encodeURIComponent(to);

        var resp = await fetch(url);
        var data = await resp.json();

        if (data.error) throw new Error(data.error.error || data.error);
        return data.log || {};
    }

    async function fetchAllLogs(apiKey, logTypes, from, to) {
        var allLogs = {};
        var hasMore = true;
        var currentTo = to;
        var pageCount = 0;

        while (hasMore && pageCount < 1000) {
            pageCount++;

            var logs = await fetchLogsPage(apiKey, logTypes, from, currentTo);
            var entries = Object.entries(logs);

            if (entries.length === 0) {
                hasMore = false;
                continue;
            }

            Object.assign(allLogs, logs);

            if (entries.length < 100) {
                hasMore = false;
            } else {
                var minTs = Math.min.apply(null, entries.map(function(e) {
                    return e[1].timestamp;
                }));
                currentTo = minTs - 1;
                if (currentTo <= from) hasMore = false;
            }

            if (hasMore) {
                await new Promise(function(resolve) {
                    setTimeout(resolve, 700);
                });
            }
        }

        return allLogs;
    }

    function processPurchaseLogs(logs, targetId) {
        var purchases = [];

        Object.entries(logs).forEach(function(e) {
            var logId = e[0];
            var log = e[1];
            var data = log.data || {};

            if (log.log !== 1112 && log.log !== 1225) return;

            (data.items || []).forEach(function(item) {
                if (Number(item.id) !== Number(targetId)) return;

                var qty = toNumber(item.qty);
                var costEach = toNumber(data.cost_each);

                purchases.push({
                    id: logId,
                    type: log.log === 1112 ? 'market' : 'bazaar',
                    typeName: log.log === 1112 ? 'Item Market' : 'Bazaar',
                    timestamp: log.timestamp,
                    qty: qty,
                    costEach: costEach,
                    costTotal: qty * costEach,
                    seller: data.seller,
                    sellerId: toNumber(data.seller),
                    hasOtherItems: false
                });
            });
        });

        return purchases;
    }

    function groupTradeLogs(logs) {
        var groups = {};

        Object.entries(logs).forEach(function(e) {
            var log = e[1];
            var data = log.data || {};
            var tradeId = data.parsed_trade_id;

            if (!tradeId) return;

            if (!groups[tradeId]) {
                groups[tradeId] = {
                    timestamp: log.timestamp,
                    user: data.user,
                    userId: toNumber(data.user)
                };
            }

            if (log.log === 4440) groups[tradeId].money = toNumber(data.money);
            if (log.log === 4446) groups[tradeId].items = data.items || [];
        });

        return groups;
    }

    function processTradeLogs(logs, targetId) {
        var trades = [];
        var groups = groupTradeLogs(logs);

        Object.entries(groups).forEach(function(e) {
            var tradeId = e[0];
            var trade = e[1];

            if (!trade.items || trade.money == null) return;

            var targetItems = trade.items.filter(function(i) {
                return Number(i.id) === Number(targetId);
            });

            if (targetItems.length === 0) return;

            var totalQty = targetItems.reduce(function(sum, item) {
                return sum + toNumber(item.qty);
            }, 0);

            var otherItems = trade.items.filter(function(i) {
                return Number(i.id) !== Number(targetId);
            });

            var hasOtherItems = otherItems.length > 0;
            var costTotal = hasOtherItems ? 0 : trade.money;
            var costEach = totalQty > 0 ? Math.round(costTotal / totalQty) : 0;

            trades.push({
                id: tradeId,
                type: 'trade',
                typeName: 'Trade',
                timestamp: trade.timestamp,
                qty: totalQty,
                costEach: costEach,
                costTotal: costTotal,
                seller: trade.user,
                sellerId: trade.userId,
                hasOtherItems: hasOtherItems
            });
        });

        return trades;
    }

    function processMugLogs(logs) {
        var mugs = [];

        Object.entries(logs).forEach(function(e) {
            var logId = e[0];
            var log = e[1];
            var data = log.data || {};

            if (log.log !== 8155) return;

            var targetId = toNumber(
                data.defender ||
                data.defender_id ||
                data.user ||
                data.target ||
                data.victim ||
                data.opponent ||
                data.user_id ||
                data.target_id ||
                data.victim_id
            );

            var amount = toNumber(
                data.money_mugged ||
                data.money ||
                data.amount ||
                data.mugged ||
                data.stolen ||
                data.cash
            );

            if (!targetId || amount <= 0) return;

            mugs.push({
                id: logId,
                timestamp: log.timestamp,
                targetId: targetId,
                amount: amount
            });
        });

        return mugs;
    }

    function applyMixedTradeEstimate(purchases) {
        var cleanPurchases = purchases.filter(function(p) {
            return !p.hasOtherItems;
        });

        var cleanQty = cleanPurchases.reduce(function(sum, p) {
            return sum + p.qty;
        }, 0);

        var cleanCost = cleanPurchases.reduce(function(sum, p) {
            return sum + p.costTotal;
        }, 0);

        var estimatedAvg = cleanQty > 0 ? Math.round(cleanCost / cleanQty) : 0;

        purchases.forEach(function(p) {
            if (p.hasOtherItems) {
                p.costEach = estimatedAvg;
                p.costTotal = estimatedAvg * p.qty;
                p.estimatedCost = true;
            }
        });
    }

    function applyMugOffsetsPrecisely(purchases, mugs) {
        var matchedMugCount = 0;

        purchases.forEach(function(p) {
            p.mugOffset = 0;
            p.adjustedCostTotal = p.costTotal;
            p.adjustedCostEach = p.costEach;
            p.matchedMugs = [];
        });

        mugs.sort(function(a, b) {
            return a.timestamp - b.timestamp;
        });

        mugs.forEach(function(mug) {
            var candidates = purchases.filter(function(p) {
                var sellerId = toNumber(p.sellerId || p.seller);
                if (!sellerId) return false;

                return sellerId === mug.targetId &&
                    p.timestamp <= mug.timestamp &&
                    mug.timestamp <= p.timestamp + MUG_WINDOW_SECONDS;
            });

            if (candidates.length === 0) return;

            // 同一卖家多笔购买时，按购买时间从旧到新分摊 mug，避免全部扣在最近一笔上
            candidates.sort(function(a, b) {
                return a.timestamp - b.timestamp;
            });

            var remaining = mug.amount;
            var lastCandidate = candidates[candidates.length - 1];

            function applyMugToPurchase(targetPurchase, applyAmount) {
                if (applyAmount <= 0) return;
                targetPurchase.mugOffset += applyAmount;
                targetPurchase.adjustedCostTotal = targetPurchase.costTotal - targetPurchase.mugOffset;
                targetPurchase.adjustedCostEach = targetPurchase.qty > 0
                    ? Math.round(targetPurchase.adjustedCostTotal / targetPurchase.qty)
                    : 0;
                targetPurchase.matchedMugs.push({
                    id: mug.id,
                    timestamp: mug.timestamp,
                    targetId: mug.targetId,
                    amount: applyAmount
                });
            }

            candidates.forEach(function(targetPurchase) {
                if (remaining <= 0) return;

                var room = Math.max(0, targetPurchase.costTotal - targetPurchase.mugOffset);
                var applyAmount = Math.min(remaining, room);
                applyMugToPurchase(targetPurchase, applyAmount);
                remaining -= applyAmount;
            });

            if (remaining > 0) {
                applyMugToPurchase(lastCandidate, remaining);
            }

            matchedMugCount++;
        });

        return matchedMugCount;
    }

    function renderResults(purchases, itemName) {
        var totalQty = purchases.reduce(function(sum, p) {
            return sum + p.qty;
        }, 0);

        var originalCost = purchases.reduce(function(sum, p) {
            return sum + p.costTotal;
        }, 0);

        var mugOffset = purchases.reduce(function(sum, p) {
            return sum + (p.mugOffset || 0);
        }, 0);

        var totalCost = purchases.reduce(function(sum, p) {
            return sum + (p.adjustedCostTotal != null ? p.adjustedCostTotal : p.costTotal);
        }, 0);

        var avgPrice = totalQty > 0 ? Math.round(totalCost / totalQty) : 0;

        var bazaarQty = purchases.filter(function(p) { return p.type === 'bazaar'; }).reduce(function(s, p) { return s + p.qty; }, 0);
        var marketQty = purchases.filter(function(p) { return p.type === 'market'; }).reduce(function(s, p) { return s + p.qty; }, 0);
        var tradeQty = purchases.filter(function(p) { return p.type === 'trade'; }).reduce(function(s, p) { return s + p.qty; }, 0);

        document.getElementById('aptSumName').textContent = itemName;
        document.getElementById('aptSumQty').textContent = totalQty.toLocaleString();
        document.getElementById('aptSumOriginalCost').textContent = formatMoney(originalCost);
        document.getElementById('aptSumMug').textContent = '-' + formatMoney(mugOffset);
        document.getElementById('aptSumCost').textContent = formatMoney(totalCost);
        document.getElementById('aptSumAvg').textContent = formatMoney(avgPrice);
        document.getElementById('aptSumMugMatch').textContent = lastMugCount.toLocaleString() + ' / ' + lastMatchedMugCount.toLocaleString();
        document.getElementById('aptSumBazaar').textContent = bazaarQty.toLocaleString() + ' 件';
        document.getElementById('aptSumMarket').textContent = marketQty.toLocaleString() + ' 件';
        document.getElementById('aptSumTrade').textContent = tradeQty.toLocaleString() + ' 件';

        document.getElementById('aptSumCost').classList.toggle('apt-negative', totalCost < 0);
        document.getElementById('aptSumAvg').classList.toggle('apt-negative', avgPrice < 0);

        var listEl = document.getElementById('aptPurchaseList');
        listEl.innerHTML = '';

        purchases.sort(function(a, b) {
            return b.timestamp - a.timestamp;
        });

        purchases.forEach(function(p) {
            var div = document.createElement('div');
            div.className = 'apt-purchase-item ' + p.type;

            var title = document.createElement('h4');
            title.textContent = p.typeName + ' - ' + formatTime(p.timestamp);
            div.appendChild(title);

            if (p.estimatedCost) {
                var estimate = document.createElement('p');
                estimate.style.color = '#ffc107';
                estimate.textContent = '含其他物品，成本按非混合交易均价估算';
                div.appendChild(estimate);
            }

            var costLine = document.createElement('p');
            costLine.textContent =
                '数量：' + p.qty.toLocaleString() +
                ' | 原单价：' + formatMoney(p.costEach) +
                ' | 原总价：' + formatMoney(p.costTotal);
            div.appendChild(costLine);

            var adjustedLine = document.createElement('p');
            var mugSpan = document.createElement('span');
            mugSpan.className = 'apt-mug';
            mugSpan.textContent = 'Mug抵扣：-' + formatMoney(p.mugOffset || 0);
            adjustedLine.appendChild(mugSpan);
            adjustedLine.appendChild(document.createTextNode(
                ' | 实际总价：' + formatMoney(p.adjustedCostTotal != null ? p.adjustedCostTotal : p.costTotal) +
                ' | 实际单价：' + formatMoney(p.adjustedCostEach != null ? p.adjustedCostEach : p.costEach)
            ));
            div.appendChild(adjustedLine);

            if (p.matchedMugs && p.matchedMugs.length > 0) {
                var mugLine = document.createElement('p');
                mugLine.textContent = '匹配Mug：' + p.matchedMugs.map(function(m) {
                    return formatTime(m.timestamp) + ' ' + formatMoney(m.amount);
                }).join('；');
                div.appendChild(mugLine);
            }

            var sellerLine = document.createElement('p');
            sellerLine.textContent = '卖家ID：' + (p.sellerId || p.seller || '匿名');
            div.appendChild(sellerLine);

            listEl.appendChild(div);
        });
    }

    queryBtn.addEventListener('click', async function() {
        errorEl.textContent = '';
        infoEl.textContent = '';
        resultEl.classList.remove('show');
        lastMugCount = 0;
        lastMatchedMugCount = 0;

        var apiKey = apiKeyInput.value.trim();
        var startDate = document.getElementById('aptStartDate').value;
        var startTime = document.getElementById('aptStartTime').value || '00:00';
        var endDate = document.getElementById('aptEndDate').value;
        var endTime = document.getElementById('aptEndTime').value || '23:59';

        if (!apiKey) {
            errorEl.textContent = '请输入API Key！';
            return;
        }

        if (!selectedItemId) {
            errorEl.textContent = '请选择物品！';
            return;
        }

        if (!startDate || !endDate) {
            errorEl.textContent = '请选择完整的时间范围！';
            return;
        }

        var startTs = toTimestamp(startDate + 'T' + startTime);
        var endTs = toTimestamp(endDate + 'T' + endTime);

        if (startTs >= endTs) {
            errorEl.textContent = '开始时间不能晚于结束时间！';
            return;
        }

        GM_setValue('tornApiKey', apiKey);
        queryBtn.disabled = true;
        queryBtn.textContent = '查询中...';

        try {
            infoEl.textContent = '正在获取购买记录...';
            var purchaseLogs = await fetchAllLogs(apiKey, '1112,1225', startTs, endTs);
            var purchases = processPurchaseLogs(purchaseLogs, selectedItemId);

            infoEl.textContent = '正在获取交易记录...';
            var tradeLogs = await fetchAllLogs(apiKey, '4430,4440,4446', startTs, endTs);
            var trades = processTradeLogs(tradeLogs, selectedItemId);

            var all = purchases.concat(trades);

            if (all.length === 0) {
                errorEl.textContent = '未找到该物品的购买记录';
                infoEl.textContent = '';
                return;
            }

            applyMixedTradeEstimate(all);

            infoEl.textContent = '正在获取mug记录...';
            var mugLogs = await fetchAllLogs(apiKey, '8155', startTs, endTs + MUG_WINDOW_SECONDS);
            var mugs = processMugLogs(mugLogs);

            lastMugCount = mugs.length;
            lastMatchedMugCount = applyMugOffsetsPrecisely(all, mugs);

            infoEl.textContent = '';
            resultEl.classList.add('show');
            renderResults(all, selectedItemName);
        } catch (err) {
            errorEl.textContent = '错误：' + err.message;
        } finally {
            queryBtn.disabled = false;
            queryBtn.textContent = '查询购买记录';
        }
    });
})();
