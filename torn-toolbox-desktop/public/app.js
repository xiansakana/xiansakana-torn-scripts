var selectedItems = new Map();
var itemsCache = [];
var companyWatchers = [];

function $(id) { return document.getElementById(id); }

function formatMoney(n) {
    var v = Math.round(Number(n) || 0);
    return '$' + Math.abs(v).toLocaleString('en-US');
}

function formatTime(ts) {
    return new Date(ts * 1000).toLocaleString('zh-CN');
}

function formatNext(ts) {
    if (!ts) return '--';
    return new Date(ts).toLocaleTimeString('zh-CN');
}

async function api(path, options) {
    var resp = await fetch('api/' + path, options || {});
    var data = await resp.json();
    if (!resp.ok || data.ok === false) throw new Error(data.error || resp.statusText);
    return data;
}

function renderUndercutAlerts(alerts) {
    var list = $('uc-list');
    list.innerHTML = '';
    if (!alerts.length) {
        list.innerHTML = '<p class="hint">暂无压价提醒</p>';
        return;
    }
    alerts.forEach(function(alert) {
        var div = document.createElement('div');
        div.className = 'item';
        var seller = alert.undercutBy
            ? '<p>压价者：' + alert.undercutBy.playerName + '（ID ' + alert.undercutBy.playerId + '）</p>'
            : '';
        var lowLabel = alert.source === 'Bazaar' ? '巴扎最低' : '市场最低';
        div.innerHTML = '<h4>' + alert.name + '（ID ' + alert.itemId + '）</h4>'
            + '<p>来源：' + alert.source + '</p>'
            + '<p>你的价格：' + formatMoney(alert.myPrice) + ' · ' + lowLabel + '：' + formatMoney(alert.compareLow) + '</p>'
            + seller
            + '<p>检测时间：' + formatTime(alert.detectedAt) + '</p>';
        list.appendChild(div);
    });
}

function renderCompanyApps(apps) {
    var list = $('co-list');
    list.innerHTML = '';
    if (!apps.length) {
        list.innerHTML = '<p class="hint">暂无新申请</p>';
        return;
    }
    apps.forEach(function(app) {
        var div = document.createElement('div');
        div.className = 'item company';
        div.innerHTML = '<h4>新申请 #' + app.id + (app.watcherLabel ? ' · ' + app.watcherLabel : '') + '</h4>'
            + '<p>申请人：' + app.name + ' (ID ' + app.userId + ') · Lv ' + (app.level || '?') + '</p>'
            + '<p>状态：' + (app.status || '未知') + '</p>'
            + '<p>过期：' + new Date(app.expires * 1000).toLocaleString('zh-CN') + '</p>'
            + '<p>消息：' + (app.message || '无消息') + '</p>';
        list.appendChild(div);
    });
}

function updateUndercutState(state) {
    var running = state.running;
    $('uc-start').hidden = running;
    $('uc-stop').hidden = !running;
    setItemSelectDisabled(running);
    $('uc-status-text').textContent = running ? '● 监听中' : '已停止';
    $('uc-status').classList.toggle('stopped', !running);
    $('uc-checks').textContent = state.checks || 0;
    $('uc-alerts').textContent = state.alerts || 0;
    $('uc-next').textContent = formatNext(state.nextScanAt);
    $('uc-message').textContent = state.statusMessage || '';
    $('global-status').textContent = running ? '压价监听中' : '就绪';
}

function updateCompanyState(state) {
    var running = state.running;
    $('co-start').hidden = running;
    $('co-stop').hidden = !running;
    $('co-status-text').textContent = running ? '● 监听中' : '已停止';
    $('co-status').classList.toggle('stopped', !running);
    $('co-checks').textContent = state.checks || 0;
    $('co-apps').textContent = state.apps || 0;
    $('co-next').textContent = formatNext(state.nextScanAt);
    $('co-message').textContent = state.statusMessage || '';
    renderWatcherMeta(state.watchers || []);
}

function defaultWatcher(label) {
    return {
        id: 'w-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        label: label || '新账号',
        enabled: true,
        apiKey: '',
        hasApiKey: false,
        notify: {
            desktop: true,
            qq: {
                enabled: true,
                type: 'group',
                groupId: '',
                atUserId: '',
                userId: ''
            }
        }
    };
}

function renderWatcherMeta(watchers) {
    document.querySelectorAll('[data-watcher-meta]').forEach(function(node) {
        var id = node.dataset.watcherMeta;
        var info = watchers.find(function(w) { return w.id === id; });
        if (!info) {
            node.textContent = '';
            return;
        }
        var parts = ['已检查 ' + (info.checks || 0) + ' 次', '申请 ' + (info.apps || 0) + ' 个'];
        if (info.lastError) parts.push('错误: ' + info.lastError);
        node.textContent = parts.join(' · ');
    });
}

function toggleWatcherTargetFields(card, type) {
    var isGroup = type === 'group';
    card.querySelector('[data-field="groupId"]').closest('.field').hidden = !isGroup;
    card.querySelector('[data-field="atUserId"]').closest('.field').hidden = !isGroup;
    card.querySelector('[data-field="userId"]').closest('.field').hidden = isGroup;
}

function renderCompanyWatchers() {
    var container = $('co-watchers');
    container.innerHTML = '';
    if (!companyWatchers.length) {
        container.innerHTML = '<p class="hint">暂无监听账号，点击「添加账号」开始配置</p>';
        return;
    }

    companyWatchers.forEach(function(watcher, index) {
        var card = document.createElement('div');
        card.className = 'watcher-card';
        card.dataset.id = watcher.id;
        card.innerHTML = ''
            + '<div class="watcher-card-head">'
            + '<h3>账号 ' + (index + 1) + '</h3>'
            + '<div class="watcher-actions">'
            + '<label><input type="checkbox" data-field="enabled"' + (watcher.enabled !== false ? ' checked' : '') + '> 启用</label>'
            + '<button type="button" class="btn small danger" data-action="remove">删除</button>'
            + '</div>'
            + '</div>'
            + '<div class="watcher-grid">'
            + '<div class="field"><label>名称</label><input type="text" data-field="label" value="' + escapeHtml(watcher.label || '') + '"></div>'
            + '<div class="field"><label>Torn API Key</label><input type="password" data-field="apiKey" placeholder="' + (watcher.hasApiKey ? '已保存 ' + escapeHtml(watcher.apiKey || '***') : '填写后保存') + '"></div>'
            + '<div class="field full checks">'
            + '<label><input type="checkbox" data-field="notifyDesktop"' + (watcher.notify?.desktop !== false ? ' checked' : '') + '> 桌面通知</label>'
            + '<label><input type="checkbox" data-field="qqEnabled"' + (watcher.notify?.qq?.enabled !== false ? ' checked' : '') + '> QQ 通知</label>'
            + '</div>'
            + '<div class="field"><label>QQ 目标</label><select data-field="qqType">'
            + '<option value="group"' + ((watcher.notify?.qq?.type || 'group') === 'group' ? ' selected' : '') + '>群聊</option>'
            + '<option value="private"' + (watcher.notify?.qq?.type === 'private' ? ' selected' : '') + '>私聊</option>'
            + '</select></div>'
            + '<div class="field"><label>群号</label><input type="text" data-field="groupId" value="' + escapeHtml(watcher.notify?.qq?.groupId || '') + '"></div>'
            + '<div class="field"><label>@ QQ 号（留空则直接发送）</label><input type="text" data-field="atUserId" value="' + escapeHtml(watcher.notify?.qq?.atUserId || '') + '"></div>'
            + '<div class="field"><label>私聊 QQ 号</label><input type="text" data-field="userId" value="' + escapeHtml(watcher.notify?.qq?.userId || '') + '"></div>'
            + '</div>'
            + '<div class="watcher-meta" data-watcher-meta="' + watcher.id + '"></div>';
        container.appendChild(card);
        toggleWatcherTargetFields(card, watcher.notify?.qq?.type || 'group');
    });
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function collectCompanyWatchersFromDom() {
    return Array.from(document.querySelectorAll('.watcher-card')).map(function(card) {
        var id = card.dataset.id;
        var existing = companyWatchers.find(function(w) { return w.id === id; }) || {};
        return {
            id: id,
            label: card.querySelector('[data-field="label"]').value.trim() || '未命名',
            enabled: card.querySelector('[data-field="enabled"]').checked,
            apiKey: card.querySelector('[data-field="apiKey"]').value.trim() || undefined,
            notify: {
                desktop: card.querySelector('[data-field="notifyDesktop"]').checked,
                qq: {
                    enabled: card.querySelector('[data-field="qqEnabled"]').checked,
                    type: card.querySelector('[data-field="qqType"]').value,
                    groupId: card.querySelector('[data-field="groupId"]').value.trim(),
                    atUserId: card.querySelector('[data-field="atUserId"]').value.trim(),
                    userId: card.querySelector('[data-field="userId"]').value.trim()
                }
            },
            hasApiKey: existing.hasApiKey,
            apiKeyMask: existing.apiKey
        };
    });
}

function renderChips() {
    var chips = $('uc-chips');
    var display = $('uc-select-display');
    chips.innerHTML = '';
    if (!selectedItems.size) {
        display.textContent = itemsCache.length
            ? '-- 全部物品（点击添加指定物品）--'
            : '-- 点击加载物品 --';
        return;
    }
    display.textContent = '已选 ' + selectedItems.size + ' 个物品（点击继续添加）';
    selectedItems.forEach(function(name, id) {
        var chip = document.createElement('span');
        chip.className = 'chip';
        chip.innerHTML = name + ' <button type="button" data-id="' + id + '">×</button>';
        chips.appendChild(chip);
    });
}

async function loadItemsCache() {
    var data = await api('items');
    itemsCache = data.items || [];
    return itemsCache;
}

function renderItemList(filter) {
    var list = $('uc-select-list');
    list.innerHTML = '';
    var s = (filter || '').toLowerCase();
    itemsCache.filter(function(item) {
        return !s || String(item.name).toLowerCase().includes(s) || String(item.id).includes(s);
    }).forEach(function(item) {
        var id = Number(item.id);
        var opt = document.createElement('div');
        opt.className = 'select-opt' + (selectedItems.has(id) ? ' selected' : '');
        opt.textContent = item.name + ' (ID: ' + item.id + ')' + (selectedItems.has(id) ? ' ✓' : '');
        if (!selectedItems.has(id)) {
            opt.addEventListener('click', function(e) {
                e.stopPropagation();
                selectedItems.set(id, item.name);
                renderChips();
                renderItemList($('uc-select-search').value);
            });
        }
        list.appendChild(opt);
    });
}

function setupItemSelect() {
    var wrap = $('uc-select-wrap');
    var display = $('uc-select-display');
    var drop = $('uc-select-drop');
    var search = $('uc-select-search');

    display.addEventListener('click', function(e) {
        e.stopPropagation();
        if (wrap.classList.contains('disabled')) return;
        if (!itemsCache.length) {
            $('uc-message').textContent = '正在加载物品列表...';
            loadItemsCache().then(function() {
                $('uc-message').textContent = '已加载 ' + itemsCache.length + ' 个物品';
                renderChips();
                drop.classList.add('show');
                search.value = '';
                renderItemList('');
                search.focus();
            }).catch(function(err) {
                $('uc-message').textContent = err.message;
            });
            return;
        }
        drop.classList.toggle('show');
        if (drop.classList.contains('show')) {
            search.value = '';
            renderItemList('');
            search.focus();
        }
    });

    search.addEventListener('input', function() { renderItemList(search.value); });
    search.addEventListener('click', function(e) { e.stopPropagation(); });

    document.addEventListener('click', function() {
        drop.classList.remove('show');
    });
}

function setItemSelectDisabled(disabled) {
    $('uc-select-wrap').classList.toggle('disabled', disabled);
}

async function loadState() {
    var data = await api('state');
    var cfg = data.config;
    if (cfg.undercut) {
        $('uc-interval').value = cfg.undercut.intervalSeconds || 60;
        $('uc-bazaar').checked = cfg.undercut.watchBazaar !== false;
        $('uc-itemmarket').checked = cfg.undercut.watchItemMarket !== false;
        selectedItems.clear();
        (cfg.undercut.selectedItems || []).forEach(function(item) {
            selectedItems.set(Number(item.id), item.name || ('Item #' + item.id));
        });
        if (!selectedItems.size && cfg.undercut.selectedItemIds) {
            cfg.undercut.selectedItemIds.forEach(function(id) {
                selectedItems.set(Number(id), 'Item #' + id);
            });
        }
        renderChips();
    }
    if (cfg.company) {
        $('co-interval').value = cfg.company.intervalSeconds || 30;
        companyWatchers = (cfg.company.watchers || []).map(function(watcher) {
            return {
                id: watcher.id,
                label: watcher.label || '未命名',
                enabled: watcher.enabled !== false,
                apiKey: watcher.apiKey || '',
                hasApiKey: !!watcher.hasApiKey,
                notify: {
                    desktop: watcher.notify?.desktop !== false,
                    qq: {
                        enabled: watcher.notify?.qq?.enabled !== false,
                        type: watcher.notify?.qq?.type || 'group',
                        groupId: watcher.notify?.qq?.groupId || '',
                        atUserId: watcher.notify?.qq?.atUserId || '',
                        userId: watcher.notify?.qq?.userId || ''
                    }
                }
            };
        });
        if (!companyWatchers.length && cfg.hasApiKey) {
            companyWatchers = [{
                id: 'default',
                label: '默认',
                enabled: true,
                apiKey: cfg.tornApiKey || '',
                hasApiKey: true,
                notify: {
                    desktop: cfg.notify?.desktop !== false,
                    qq: {
                        enabled: cfg.notify?.qq?.enabled !== false,
                        type: 'group',
                        groupId: '',
                        atUserId: '',
                        userId: ''
                    }
                }
            }];
        }
        renderCompanyWatchers();
    }
    if (cfg.notify) {
        $('notify-desktop').checked = cfg.notify.desktop !== false;
        $('notify-qq').checked = cfg.notify.qq?.enabled !== false;
        $('qq-url').value = cfg.notify.qq?.url || '';
        if (cfg.notify.qq?.hasToken) {
            $('qq-token').value = '';
            $('qq-token').placeholder = '已保存 ' + (cfg.notify.qq.token || '***');
        } else {
            $('qq-token').value = '';
            $('qq-token').placeholder = '与 qq-bot notifyToken 一致';
        }
    }
    if (cfg.hasApiKey) $('api-key').placeholder = '已保存 ' + cfg.tornApiKey;
    updateUndercutState(data.undercut);
    updateCompanyState(data.company);
    renderUndercutAlerts(data.undercut.alertsList || []);
    renderCompanyApps(data.company.applications || []);
    renderWatcherMeta(data.company.watchers || []);
}

async function saveConfig() {
    await api('config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tornApiKey: $('api-key').value.trim() || undefined,
            undercut: {
                intervalSeconds: Number($('uc-interval').value) || 60,
                watchBazaar: $('uc-bazaar').checked,
                watchItemMarket: $('uc-itemmarket').checked,
                selectedItemIds: Array.from(selectedItems.keys()),
                selectedItems: Array.from(selectedItems.entries()).map(function(entry) {
                    return { id: entry[0], name: entry[1] };
                })
            },
            company: {
                intervalSeconds: Number($('co-interval').value) || 30,
                watchers: collectCompanyWatchersFromDom()
            },
            notify: {
                desktop: $('notify-desktop').checked,
                qq: {
                    enabled: $('notify-qq').checked,
                    url: $('qq-url').value.trim(),
                    token: $('qq-token').value.trim() || undefined
                }
            }
        })
    });
    $('global-status').textContent = '设置已保存';
    $('api-key').value = '';
    await loadState();
}

function connectEvents() {
    var es = new EventSource('api/events');
    es.addEventListener('undercut', function(e) { updateUndercutState(JSON.parse(e.data)); });
    es.addEventListener('undercutAlerts', function(e) { renderUndercutAlerts(JSON.parse(e.data)); });
    es.addEventListener('company', function(e) { updateCompanyState(JSON.parse(e.data)); });
    es.addEventListener('companyApps', function(e) { renderCompanyApps(JSON.parse(e.data)); });
    es.addEventListener('error', function(e) {
        if (!e.data) return;
        var payload = JSON.parse(e.data);
        $('global-status').textContent = payload.message;
    });
}

document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
        document.querySelectorAll('.tab-pane').forEach(function(p) { p.classList.remove('active'); });
        tab.classList.add('active');
        document.querySelector('[data-pane="' + tab.dataset.tab + '"]').classList.add('active');
    });
});

$('save-config').addEventListener('click', function() {
    saveConfig().catch(function(err) { $('global-status').textContent = err.message; });
});

$('uc-start').addEventListener('click', function() {
    saveConfig().then(function() {
        return api('undercut/start', { method: 'POST' });
    }).catch(function(err) { $('uc-message').textContent = err.message; });
});

$('uc-stop').addEventListener('click', function() {
    api('undercut/stop', { method: 'POST' }).catch(function(err) { $('uc-message').textContent = err.message; });
});

$('co-start').addEventListener('click', function() {
    saveConfig().then(function() {
        return api('company/start', { method: 'POST' });
    }).catch(function(err) { $('co-message').textContent = err.message; });
});

$('co-stop').addEventListener('click', function() {
    api('company/stop', { method: 'POST' }).catch(function(err) { $('co-message').textContent = err.message; });
});

$('uc-chips').addEventListener('click', function(e) {
    if (e.target.tagName !== 'BUTTON') return;
    selectedItems.delete(Number(e.target.dataset.id));
    renderChips();
    if ($('uc-select-drop').classList.contains('show')) {
        renderItemList($('uc-select-search').value);
    }
});

$('co-add-watcher').addEventListener('click', function() {
    companyWatchers.push(defaultWatcher('账号 ' + (companyWatchers.length + 1)));
    renderCompanyWatchers();
});

$('co-watchers').addEventListener('click', function(e) {
    var card = e.target.closest('.watcher-card');
    if (!card) return;
    if (e.target.dataset.action === 'remove') {
        companyWatchers = companyWatchers.filter(function(w) { return w.id !== card.dataset.id; });
        renderCompanyWatchers();
        return;
    }
    if (e.target.dataset.field === 'qqType') {
        toggleWatcherTargetFields(card, e.target.value);
    }
});

$('co-watchers').addEventListener('change', function(e) {
    if (e.target.dataset.field !== 'qqType') return;
    var card = e.target.closest('.watcher-card');
    if (card) toggleWatcherTargetFields(card, e.target.value);
});

setupItemSelect();
loadState().then(function() {
    if ($('api-key').placeholder.indexOf('已保存') >= 0) {
        loadItemsCache().then(renderChips).catch(function() {});
    }
    connectEvents();
}).catch(function(err) {
    $('global-status').textContent = err.message;
});
