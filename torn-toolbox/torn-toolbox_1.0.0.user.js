// ==UserScript==
// @name         Torn 工具箱
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  整合购买均价、出售均价、攻击筛选、公司监听的统一工具箱
// @author       xiansakana[2754627]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';

    var MUG_WINDOW_SECONDS = 5 * 60;
    var API_DELAY_MS = 1000;
    var ATTACKS_API_DELAY_MS = 100;
    var RATE_LIMIT_RETRIES = 5;
    var SELL_LOG_TYPES = {
        bazaar: { ids: [1221, 1226] },
        market: { ids: [1113, 1104] }
    };

    var itemsCache = [];
    var buySelected = { id: null, name: '' };
    var sellSelected = { id: null, name: '' };
    var buyMugStats = { total: 0, matched: 0 };

    var companyState = {
        monitoring: false,
        timer: null,
        checks: 0,
        apps: 0,
        seen: new Set()
    };

    GM_addStyle(`
        #ttb-root {
            --ttb-bg: #1e2128; --ttb-surface: #282c34; --ttb-surface2: #32373f;
            --ttb-border: #4a5260; --ttb-text: #f0f2f5; --ttb-muted: #b4bcc8;
            --ttb-accent: #6eb0ff; --ttb-accent-dk: #2563c7; --ttb-accent2: #8b7cf8;
            --ttb-success: #4ade80; --ttb-success-dk: #15803d;
            --ttb-danger: #fb7185; --ttb-danger-dk: #be123c;
            --ttb-warn: #fcd34d; --ttb-radius: 12px;
            position: fixed; top: 50%; right: 16px; z-index: 99998;
            transform: translateY(-50%);
            display: flex; flex-direction: row-reverse; align-items: center; gap: 12px;
            font-family: "Segoe UI", system-ui, sans-serif; font-size: 13px;
        }
        #ttb-root.ttb-dragging { user-select: none; }
        #ttb-root.ttb-dragging, #ttb-root.ttb-dragging * { cursor: grabbing !important; }
        #ttb-fab {
            position: relative; flex-shrink: 0;
            width: 52px; height: 52px; border: none; border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #6366f1);
            color: #fff; font-size: 22px; cursor: grab;
            box-shadow: 0 4px 20px rgba(59,130,246,.5);
            transition: transform .2s, box-shadow .2s;
        }
        #ttb-fab:hover { transform: scale(1.06); box-shadow: 0 6px 28px rgba(59,130,246,.6); }
        #ttb-root.ttb-expanded #ttb-fab { display: none; }
        #ttb-fab.monitoring::after {
            content: ''; position: absolute; top: 4px; right: 4px;
            width: 10px; height: 10px; border-radius: 50%;
            background: var(--ttb-warn); border: 2px solid #1e2128;
        }
        #ttb-panel {
            display: none; position: relative; flex-shrink: 0;
            width: min(460px, calc(100vw - 100px)); height: min(85vh, 720px);
            max-height: min(85vh, 720px);
            background: var(--ttb-bg); color: var(--ttb-text);
            border: 1px solid var(--ttb-border); border-radius: var(--ttb-radius);
            box-shadow: 0 12px 48px rgba(0,0,0,.55); overflow: hidden;
            flex-direction: column;
        }
        #ttb-panel.open { display: flex; }
        .ttb-top {
            flex-shrink: 0; z-index: 10; background: var(--ttb-bg);
            border-bottom: 1px solid var(--ttb-border);
        }
        .ttb-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 14px 16px; background: linear-gradient(135deg, #2f3540, #252930);
            border-bottom: 1px solid var(--ttb-border);
            cursor: grab;
        }
        .ttb-header h1 { margin: 0; font-size: 15px; font-weight: 600; letter-spacing: .3px; color: var(--ttb-text); }
        .ttb-header-btns { display: flex; gap: 6px; }
        .ttb-icon-btn {
            width: 28px; height: 28px; border: none; border-radius: 6px;
            background: rgba(255,255,255,.1); color: var(--ttb-text);
            cursor: pointer; font-size: 16px; line-height: 1;
        }
        .ttb-icon-btn:hover { background: rgba(255,255,255,.18); color: #fff; }
        .ttb-api-bar {
            padding: 10px 14px; background: var(--ttb-surface);
            border-bottom: 1px solid var(--ttb-border);
        }
        .ttb-api-bar input {
            width: 100%; padding: 8px 10px; border: 1px solid var(--ttb-border);
            border-radius: 8px; background: var(--ttb-surface2); color: var(--ttb-text);
            font-size: 13px; box-sizing: border-box;
        }
        .ttb-api-bar input::placeholder { color: #8b95a5; }
        .ttb-api-bar input:focus { outline: none; border-color: var(--ttb-accent); }
        .ttb-tabs {
            display: flex; gap: 4px; padding: 8px 10px 0;
            background: var(--ttb-surface);
            overflow-x: auto; flex-shrink: 0;
        }
        .ttb-tab {
            flex: 1; min-width: 0; padding: 8px 6px; border: none; border-radius: 8px 8px 0 0;
            background: transparent; color: var(--ttb-muted); font-size: 12px;
            cursor: pointer; white-space: nowrap; transition: .15s;
            border-bottom: 2px solid transparent; margin-bottom: -1px;
        }
        .ttb-tab:hover { color: var(--ttb-text); background: rgba(255,255,255,.06); }
        .ttb-tab.active {
            color: #fff; background: var(--ttb-bg);
            border-bottom-color: var(--ttb-accent); font-weight: 600;
        }
        .ttb-tab.active-monitoring { color: var(--ttb-warn); }
        .ttb-tab.active-monitoring.active { color: #fff; border-bottom-color: var(--ttb-warn); }
        .ttb-body {
            flex: 1 1 auto; min-height: 0; overflow-x: hidden; overflow-y: auto;
            padding: 14px; color: var(--ttb-text); position: relative;
        }
        .ttb-pane { display: none; }
        .ttb-pane.active { display: block; }
        .ttb-result { margin-top: 14px; display: none; }
        .ttb-result.show { display: block; }
        .ttb-field label {
            display: block; margin-bottom: 5px; color: var(--ttb-muted);
            font-size: 12px; font-weight: 600; letter-spacing: .2px;
        }
        .ttb-field input, .ttb-field select {
            width: 100%; padding: 9px 10px; border: 1px solid var(--ttb-border);
            border-radius: 8px; background: var(--ttb-surface2); color: var(--ttb-text);
            font-size: 13px; box-sizing: border-box;
        }
        .ttb-field input::placeholder { color: #8b95a5; }
        .ttb-field input:focus, .ttb-field select:focus { outline: none; border-color: var(--ttb-accent); }
        .ttb-field select option { background: #32373f; color: var(--ttb-text); }
        .ttb-field input[type="date"], .ttb-field input[type="time"],
        .ttb-field input[type="datetime-local"] { color-scheme: dark; }
        .ttb-row { display: flex; gap: 8px; }
        .ttb-row .ttb-field { flex: 1; min-width: 0; }
        .ttb-checks { display: flex; flex-direction: column; gap: 6px; }
        .ttb-check {
            display: flex; align-items: center; gap: 8px; font-weight: normal;
            color: var(--ttb-text); cursor: pointer; font-size: 13px;
        }
        .ttb-check input { width: auto; margin: 0; accent-color: var(--ttb-accent); }
        .ttb-btn {
            display: inline-block; padding: 10px 16px; border: none; border-radius: 8px;
            background: var(--ttb-accent-dk); color: #fff; font-size: 13px;
            font-weight: 600; cursor: pointer; width: 100%;
            text-shadow: 0 1px 1px rgba(0,0,0,.25);
        }
        .ttb-btn:hover { background: #1d4ed8; filter: none; }
        .ttb-btn:disabled { opacity: .65; cursor: not-allowed; background: #4b5563; color: #d1d5db; }
        .ttb-btn.green { background: var(--ttb-success-dk); }
        .ttb-btn.green:hover { background: #166534; }
        .ttb-btn.red { background: var(--ttb-danger-dk); }
        .ttb-btn.red:hover { background: #9f1239; }
        .ttb-btn-row { display: flex; gap: 8px; }
        .ttb-btn-row .ttb-btn { flex: 1; }
        .ttb-msg-error { color: #fca5a5; margin-top: 8px; font-size: 12px; font-weight: 500; }
        .ttb-msg-info { color: var(--ttb-warn); margin-top: 8px; font-size: 12px; font-weight: 500; }
        .ttb-field { margin-bottom: 12px; }
        .ttb-card {
            background: var(--ttb-surface); border: 1px solid var(--ttb-border);
            border-radius: 10px; padding: 12px; margin-bottom: 10px;
        }
        .ttb-card h3 { margin: 0 0 10px; font-size: 14px; color: var(--ttb-text); font-weight: 600; }
        .ttb-stat-row {
            display: flex; justify-content: space-between; gap: 10px;
            padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,.08); font-size: 13px;
        }
        .ttb-stat-row:last-child { border-bottom: none; }
        .ttb-stat-row .k { color: var(--ttb-muted); }
        .ttb-stat-row .v { color: var(--ttb-text); font-weight: 600; text-align: right; word-break: break-word; }
        .ttb-stat-row .v.emphasis { font-size: 15px; font-weight: 700; }
        .ttb-stat-row .v.ttb-negative { color: var(--ttb-success); }
        .ttb-mug { color: var(--ttb-success); font-weight: 600; }
        .ttb-section-title { margin: 12px 0 8px; font-size: 13px; color: var(--ttb-muted); font-weight: 600; }
        .ttb-item {
            background: var(--ttb-surface); border: 1px solid var(--ttb-border);
            border-radius: 8px; padding: 10px; margin-bottom: 8px;
            border-left: 3px solid var(--ttb-border); font-size: 13px;
        }
        .ttb-item.bazaar { border-left-color: var(--ttb-warn); }
        .ttb-item.market { border-left-color: #67d4f0; }
        .ttb-item.trade { border-left-color: var(--ttb-success); }
        .ttb-item.attack { border-left-color: var(--ttb-danger); }
        .ttb-item.company { border-left-color: var(--ttb-success); animation: ttbIn .25s ease; }
        .ttb-item h4 { margin: 0 0 6px; font-size: 13px; color: var(--ttb-text); font-weight: 600; }
        .ttb-item p { margin: 3px 0; color: #cdd3dc; line-height: 1.5; }
        .ttb-item .ttb-note { color: var(--ttb-muted); font-size: 12px; }
        .ttb-select-wrap { position: relative; }
        .ttb-select-display {
            padding: 9px 10px; border: 1px solid var(--ttb-border); border-radius: 8px;
            background: var(--ttb-surface2); color: var(--ttb-text); cursor: pointer;
        }
        .ttb-select-display:hover { border-color: var(--ttb-accent); }
        .ttb-select-drop {
            display: none; position: absolute; top: 100%; left: 0; right: 0; z-index: 30;
            background: var(--ttb-surface2); border: 1px solid var(--ttb-border);
            border-radius: 0 0 8px 8px; max-height: 180px; flex-direction: column;
            box-shadow: 0 8px 24px rgba(0,0,0,.4);
        }
        .ttb-select-drop.show { display: flex; }
        .ttb-select-search {
            padding: 8px; border: none; border-bottom: 1px solid var(--ttb-border);
            background: var(--ttb-surface); color: var(--ttb-text); outline: none;
        }
        .ttb-select-search::placeholder { color: #8b95a5; }
        .ttb-select-list { overflow-y: auto; }
        .ttb-select-opt {
            padding: 8px 10px; cursor: pointer; color: var(--ttb-text);
            border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .ttb-select-opt:hover { background: rgba(110,176,255,.2); color: #fff; }
        .ttb-status {
            display: none; margin-top: 12px; padding: 10px; border-radius: 8px;
            background: var(--ttb-surface); border: 1px solid var(--ttb-border); font-size: 13px;
        }
        .ttb-status.show { display: block; }
        .ttb-status.stopped { border-color: var(--ttb-border); opacity: .9; }
        .ttb-status p { margin: 3px 0; color: #cdd3dc; }
        .ttb-status strong { color: var(--ttb-text); }
        .ttb-status span { color: var(--ttb-text); font-weight: 600; }
        @keyframes ttbIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
        @media (max-width: 500px) {
            #ttb-root { right: 10px; gap: 8px; }
            #ttb-panel { width: calc(100vw - 88px); height: 80vh; max-height: 80vh; }
        }
    `);

    // ─── Shared utils ───
    function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

    function toNumber(v) {
        if (v == null) return 0;
        if (typeof v === 'number') return v;
        if (typeof v === 'object') return toNumber(v.id || v.user_id || v.player_id || v.defender || v.target);
        return Number(String(v).replace(/[$,]/g, '')) || 0;
    }

    function setRateLimitProgress(el, waitMs, attempt) {
        el.textContent = '请求过快，等待 ' + Math.round(waitMs / 1000) + ' 秒后重试（' + attempt + '/' + RATE_LIMIT_RETRIES + '）...';
    }

    function formatMoney(n) {
        var v = Math.round(toNumber(n));
        return (v < 0 ? '-' : '') + '$' + Math.abs(v).toLocaleString();
    }

    function formatTime(ts) { return new Date(ts * 1000).toLocaleString('zh-CN'); }

    function toTimestamp(s) { return s ? Math.floor(new Date(s).getTime() / 1000) : null; }

    function normalizeItems(items) {
        if (Array.isArray(items)) return items;
        return Object.keys(items || {}).map(function(id) {
            var item = items[id] || {};
            item.id = item.id || Number(id);
            return item;
        });
    }

    function getApiKey() {
        return (document.getElementById('ttb-api-key').value || '').trim();
    }

    function saveApiKey() {
        var key = getApiKey();
        if (key) GM_setValue('tornApiKey', key);
        return key;
    }

    function isRateLimitError(data) {
        if (!data || !data.error) return false;
        return data.error.code === 5 || (data.error.error || '').toLowerCase().indexOf('too many') !== -1;
    }

    async function fetchLogsPage(apiKey, logTypes, from, to, onWait) {
        var attempt = 0;
        while (true) {
            var url = 'https://api.torn.com/user/?selections=log&key=' + encodeURIComponent(apiKey)
                + '&log=' + encodeURIComponent(logTypes) + '&from=' + from + '&to=' + to;
            var data = await (await fetch(url)).json();
            if (isRateLimitError(data)) {
                attempt++;
                if (attempt > RATE_LIMIT_RETRIES) throw new Error(data.error.error);
                var waitMs = 5000 * attempt;
                if (onWait) onWait(waitMs, attempt);
                await sleep(waitMs);
                continue;
            }
            if (data.error) throw new Error(data.error.error || data.error);
            return data.log || {};
        }
    }

    async function fetchAllLogs(apiKey, logTypes, from, to, onProgress) {
        var allLogs = {}, hasMore = true, currentTo = to, page = 0;
        while (hasMore && page < 1000) {
            page++;
            if (onProgress) onProgress(page);
            var logs = await fetchLogsPage(apiKey, logTypes, from, currentTo, function(w, a) {
                if (onProgress) onProgress(page, w, a);
            });
            var entries = Object.entries(logs);
            if (!entries.length) { hasMore = false; continue; }
            Object.assign(allLogs, logs);
            if (entries.length < 100) hasMore = false;
            else {
                var minTs = Math.min.apply(null, entries.map(function(e) { return e[1].timestamp; }));
                currentTo = minTs - 1;
                if (currentTo <= from) hasMore = false;
            }
            if (hasMore) await sleep(API_DELAY_MS);
        }
        return allLogs;
    }

    async function loadItemsList(displayEl, errEl) {
        var apiKey = saveApiKey();
        if (!apiKey) { displayEl.textContent = '-- 请先填写 API Key --'; return; }
        displayEl.textContent = '-- 加载中... --';
        if (errEl) errEl.textContent = '';
        try {
            var data = await (await fetch('https://api.torn.com/v2/torn/items?key=' + encodeURIComponent(apiKey))).json();
            if (data.error) throw new Error(data.error.error || data.error);
            itemsCache = normalizeItems(data.items);
            displayEl.textContent = '-- 请选择物品 (' + itemsCache.length + ') --';
        } catch (e) {
            displayEl.textContent = '-- 加载失败，点击重试 --';
            if (errEl) errEl.textContent = e.message;
        }
    }

    function setupItemSelect(prefix, state, errEl) {
        var display = document.getElementById(prefix + '-select-display');
        var drop = document.getElementById(prefix + '-select-drop');
        var search = document.getElementById(prefix + '-select-search');
        var list = document.getElementById(prefix + '-select-list');

        function render(filter) {
            list.innerHTML = '';
            var s = (filter || '').toLowerCase();
            itemsCache.filter(function(i) {
                return !s || i.name.toLowerCase().includes(s) || String(i.id).includes(s);
            }).forEach(function(item) {
                var div = document.createElement('div');
                div.className = 'ttb-select-opt';
                div.textContent = item.name + ' (ID: ' + item.id + ')';
                div.addEventListener('click', function(e) {
                    e.stopPropagation();
                    state.id = Number(item.id);
                    state.name = item.name;
                    display.textContent = item.name + ' (ID: ' + item.id + ')';
                    drop.classList.remove('show');
                });
                list.appendChild(div);
            });
        }

        display.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!itemsCache.length) { loadItemsList(display, errEl); return; }
            drop.classList.toggle('show');
            if (drop.classList.contains('show')) { search.value = ''; render(''); search.focus(); }
        });
        search.addEventListener('input', function() { render(search.value); });
        search.addEventListener('click', function(e) { e.stopPropagation(); });
    }

    // ─── DOM ───
    var root = document.createElement('div');
    root.id = 'ttb-root';
    root.innerHTML = `
        <button id="ttb-fab" title="点击打开 · 拖动移动">⚙</button>
        <div id="ttb-panel">
            <div class="ttb-top">
            <div class="ttb-header" title="拖动标题栏移动工具箱">
                <h1>🛠 Torn 工具箱</h1>
                <div class="ttb-header-btns">
                    <button class="ttb-icon-btn" id="ttb-minimize" title="收起">−</button>
                </div>
            </div>
            <div class="ttb-api-bar">
                <input type="text" id="ttb-api-key" placeholder="API Key (FULL)" autocomplete="off" />
            </div>
            <div class="ttb-tabs">
                <button class="ttb-tab active" data-tab="buy">购买均价</button>
                <button class="ttb-tab" data-tab="sell">出售均价</button>
                <button class="ttb-tab" data-tab="attacks">攻击筛选</button>
                <button class="ttb-tab" data-tab="company" id="ttb-tab-company">公司监听</button>
            </div>
            </div>
            <div class="ttb-body">
                <div class="ttb-pane active" data-pane="buy">
                    <div class="ttb-field">
                        <label>物品</label>
                        <div class="ttb-select-wrap">
                            <div class="ttb-select-display" id="buy-select-display">-- 点击加载物品 --</div>
                            <div class="ttb-select-drop" id="buy-select-drop">
                                <input class="ttb-select-search" id="buy-select-search" placeholder="搜索..." />
                                <div class="ttb-select-list" id="buy-select-list"></div>
                            </div>
                        </div>
                    </div>
                    <div class="ttb-row">
                        <div class="ttb-field"><label>开始</label><input type="date" id="buy-start-date" /><input type="time" id="buy-start-time" value="00:00" style="margin-top:4px" /></div>
                        <div class="ttb-field"><label>结束</label><input type="date" id="buy-end-date" /><input type="time" id="buy-end-time" value="23:59" style="margin-top:4px" /></div>
                    </div>
                    <button class="ttb-btn" id="buy-query">查询购买记录（含 Mug 抵扣）</button>
                    <div class="ttb-msg-error" id="buy-error"></div>
                    <div class="ttb-msg-info" id="buy-info"></div>
                    <div class="ttb-result" id="buy-result">
                        <div class="ttb-card" id="buy-summary"></div>
                        <div id="buy-list"></div>
                    </div>
                </div>
                <div class="ttb-pane" data-pane="sell">
                    <div class="ttb-field">
                        <label>物品</label>
                        <div class="ttb-select-wrap">
                            <div class="ttb-select-display" id="sell-select-display">-- 点击加载物品 --</div>
                            <div class="ttb-select-drop" id="sell-select-drop">
                                <input class="ttb-select-search" id="sell-select-search" placeholder="搜索..." />
                                <div class="ttb-select-list" id="sell-select-list"></div>
                            </div>
                        </div>
                    </div>
                    <div class="ttb-field"><label>出售来源</label>
                        <div class="ttb-checks">
                            <label class="ttb-check"><input type="checkbox" id="sell-bazaar" checked /> Bazaar（1221 / 1226）</label>
                            <label class="ttb-check"><input type="checkbox" id="sell-market" checked /> Item Market（1113 / 1104）</label>
                        </div>
                    </div>
                    <div class="ttb-row">
                        <div class="ttb-field"><label>开始</label><input type="date" id="sell-start-date" /><input type="time" id="sell-start-time" value="00:00" style="margin-top:4px" /></div>
                        <div class="ttb-field"><label>结束</label><input type="date" id="sell-end-date" /><input type="time" id="sell-end-time" value="23:59" style="margin-top:4px" /></div>
                    </div>
                    <button class="ttb-btn green" id="sell-query">查询出售记录</button>
                    <div class="ttb-msg-error" id="sell-error"></div>
                    <div class="ttb-msg-info" id="sell-info"></div>
                    <div class="ttb-result" id="sell-result">
                        <div class="ttb-card" id="sell-summary"></div>
                        <div id="sell-list"></div>
                    </div>
                </div>
                <div class="ttb-pane" data-pane="attacks">
                    <div class="ttb-field"><label>方向</label>
                        <select id="atk-filter"><option value="outgoing">Outgoing（发出的攻击）</option><option value="incoming">Incoming（收到的攻击）</option></select>
                    </div>
                    <div class="ttb-field"><label>Defender Faction ID</label><input type="number" id="atk-faction" placeholder="8076" /></div>
                    <div class="ttb-field"><label>Warlord Bonus（可选）</label><input type="number" step="0.01" id="atk-warlord" placeholder="1.39" /></div>
                    <div class="ttb-row">
                        <div class="ttb-field"><label>开始</label><input type="datetime-local" id="atk-start" /></div>
                        <div class="ttb-field"><label>结束</label><input type="datetime-local" id="atk-end" /></div>
                    </div>
                    <button class="ttb-btn red" id="atk-query">查询并筛选</button>
                    <div class="ttb-msg-error" id="atk-error"></div>
                    <div class="ttb-msg-info" id="atk-info"></div>
                    <div class="ttb-result" id="atk-result">
                        <div class="ttb-card"><div class="ttb-stat-row"><span class="k">符合条件</span><span class="v" id="atk-count">0</span></div></div>
                        <div id="atk-list"></div>
                    </div>
                </div>
                <div class="ttb-pane" data-pane="company">
                    <div class="ttb-field"><label>检查间隔（秒）</label><input type="number" id="co-interval" value="30" min="10" max="300" /></div>
                    <div class="ttb-btn-row">
                        <button class="ttb-btn green" id="co-start">开始监听</button>
                        <button class="ttb-btn red" id="co-stop" style="display:none">停止</button>
                    </div>
                    <div class="ttb-msg-error" id="co-error"></div>
                    <div class="ttb-status" id="co-status">
                        <p><strong id="co-status-text">监听中</strong></p>
                        <p>下次检查：<span id="co-next">--</span></p>
                        <p>已检查：<span id="co-checks">0</span> 次 · 申请：<span id="co-apps">0</span> 个</p>
                    </div>
                    <div id="co-list"></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(root);

    var fab = document.getElementById('ttb-fab');
    var panel = document.getElementById('ttb-panel');
    var savedKey = localStorage.getItem('APIKey') || GM_getValue('tornApiKey', '');
    if (savedKey) document.getElementById('ttb-api-key').value = savedKey;

    var fabDidDrag = false;

    (function setupDrag() {
        var drag = { active: false, moved: false, source: null, startX: 0, startY: 0, startLeft: 0, startTop: 0 };
        var THRESHOLD = 5;

        function clampPosition(left, top) {
            var w = root.offsetWidth;
            var h = root.offsetHeight;
            return {
                left: Math.max(0, Math.min(left, window.innerWidth - w)),
                top: Math.max(0, Math.min(top, window.innerHeight - h))
            };
        }

        function applyPosition(left, top) {
            var p = clampPosition(left, top);
            root.style.left = p.left + 'px';
            root.style.top = p.top + 'px';
            root.style.right = 'auto';
            root.style.transform = 'none';
        }

        function savePosition() {
            var rect = root.getBoundingClientRect();
            GM_setValue('ttbPosition', { left: rect.left, top: rect.top });
        }

        function pointerXY(e) {
            if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            return { x: e.clientX, y: e.clientY };
        }

        function startDrag(e, source) {
            var pt = pointerXY(e);
            drag.active = true;
            drag.moved = false;
            drag.source = source;
            drag.startX = pt.x;
            drag.startY = pt.y;
            var rect = root.getBoundingClientRect();
            drag.startLeft = rect.left;
            drag.startTop = rect.top;
            root.classList.add('ttb-dragging');
            e.preventDefault();
        }

        function onMove(e) {
            if (!drag.active) return;
            var pt = pointerXY(e);
            var dx = pt.x - drag.startX;
            var dy = pt.y - drag.startY;
            if (!drag.moved && Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
            drag.moved = true;
            applyPosition(drag.startLeft + dx, drag.startTop + dy);
            e.preventDefault();
        }

        function endDrag() {
            if (!drag.active) return { moved: false, source: null };
            var result = { moved: drag.moved, source: drag.source };
            if (drag.moved) savePosition();
            drag.active = false;
            drag.moved = false;
            drag.source = null;
            root.classList.remove('ttb-dragging');
            return result;
        }

        var saved = GM_getValue('ttbPosition', null);
        if (saved && typeof saved.left === 'number' && typeof saved.top === 'number') {
            applyPosition(saved.left, saved.top);
        }

        document.querySelector('.ttb-header').addEventListener('mousedown', function(e) {
            if (e.target.closest('.ttb-icon-btn, button, input, select, a')) return;
            startDrag(e, 'header');
        });
        fab.addEventListener('mousedown', function(e) { startDrag(e, 'fab'); });
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', function() {
            var r = endDrag();
            fabDidDrag = r.moved && r.source === 'fab';
        });
        document.querySelector('.ttb-header').addEventListener('touchstart', function(e) {
            if (e.target.closest('.ttb-icon-btn, button, input, select, a')) return;
            startDrag(e, 'header');
        }, { passive: false });
        fab.addEventListener('touchstart', function(e) { startDrag(e, 'fab'); }, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', function() {
            var r = endDrag();
            fabDidDrag = r.moved && r.source === 'fab';
        });
    })();

    function openToolbox() {
        panel.classList.add('open');
        void root.offsetHeight;
        root.classList.add('ttb-expanded');
        if (!itemsCache.length && getApiKey()) {
            loadItemsList(document.getElementById('buy-select-display'), null);
        }
    }

    function closeToolbox() {
        root.classList.remove('ttb-expanded');
        panel.classList.remove('open');
    }

    fab.addEventListener('click', function() {
        if (fabDidDrag) { fabDidDrag = false; return; }
        if (panel.classList.contains('open')) closeToolbox();
        else openToolbox();
    });
    document.getElementById('ttb-minimize').addEventListener('click', closeToolbox);
    function closeAllSelectDrops() {
        document.querySelectorAll('.ttb-select-drop.show').forEach(function(el) { el.classList.remove('show'); });
    }

    function scrollBodyToTop() {
        var body = document.querySelector('.ttb-body');
        if (body) body.scrollTop = 0;
    }

    function showResult(resEl) {
        closeAllSelectDrops();
        resEl.classList.add('show');
        scrollBodyToTop();
    }

    document.addEventListener('click', function() {
        closeAllSelectDrops();
    });

    document.querySelectorAll('.ttb-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.ttb-tab').forEach(function(t) { t.classList.remove('active'); });
            document.querySelectorAll('.ttb-pane').forEach(function(p) { p.classList.remove('active'); });
            tab.classList.add('active');
            document.querySelector('[data-pane="' + tab.dataset.tab + '"]').classList.add('active');
        });
    });

    setupItemSelect('buy', buySelected, document.getElementById('buy-error'));
    setupItemSelect('sell', sellSelected, document.getElementById('sell-error'));

    // ─── Buy + Mug ───
    function processPurchaseLogs(logs, targetId) {
        var out = [];
        Object.entries(logs).forEach(function(e) {
            var log = e[1], data = log.data || {};
            if (log.log !== 1112 && log.log !== 1225) return;
            (data.items || []).forEach(function(item) {
                if (Number(item.id) !== Number(targetId)) return;
                var qty = toNumber(item.qty), costEach = toNumber(data.cost_each);
                out.push({
                    id: e[0], type: log.log === 1112 ? 'market' : 'bazaar',
                    typeName: log.log === 1112 ? 'Item Market' : 'Bazaar',
                    timestamp: log.timestamp, qty: qty, costEach: costEach,
                    costTotal: qty * costEach, seller: data.seller, sellerId: toNumber(data.seller),
                    hasOtherItems: false
                });
            });
        });
        return out;
    }

    function processTradeLogs(logs, targetId) {
        var groups = {};
        Object.entries(logs).forEach(function(e) {
            var log = e[1], data = log.data || {}, tid = data.parsed_trade_id;
            if (!tid) return;
            if (!groups[tid]) groups[tid] = { timestamp: log.timestamp, user: data.user, userId: toNumber(data.user) };
            if (log.log === 4440) groups[tid].money = toNumber(data.money);
            if (log.log === 4446) groups[tid].items = data.items || [];
        });
        var trades = [];
        Object.entries(groups).forEach(function(e) {
            var trade = e[1];
            if (!trade.items || trade.money == null) return;
            var targets = trade.items.filter(function(i) { return Number(i.id) === Number(targetId); });
            if (!targets.length) return;
            var qty = targets.reduce(function(s, i) { return s + toNumber(i.qty); }, 0);
            var hasOther = trade.items.some(function(i) { return Number(i.id) !== Number(targetId); });
            trades.push({
                id: e[0], type: 'trade', typeName: 'Trade', timestamp: trade.timestamp,
                qty: qty, costEach: hasOther ? 0 : Math.round(trade.money / qty),
                costTotal: hasOther ? 0 : trade.money, seller: trade.user, sellerId: trade.userId,
                hasOtherItems: hasOther
            });
        });
        return trades;
    }

    function processMugLogs(logs) {
        var mugs = [];
        Object.entries(logs).forEach(function(e) {
            var log = e[1], data = log.data || {};
            if (log.log !== 8155) return;
            var targetId = toNumber(
                data.defender || data.defender_id || data.user || data.target ||
                data.victim || data.opponent || data.user_id || data.target_id || data.victim_id
            );
            var amount = toNumber(
                data.money_mugged || data.money || data.amount ||
                data.mugged || data.stolen || data.cash
            );
            if (!targetId || amount <= 0) return;
            mugs.push({ id: e[0], timestamp: log.timestamp, targetId: targetId, amount: amount });
        });
        return mugs;
    }

    function applyMixedTradeEstimate(purchases) {
        var clean = purchases.filter(function(p) { return !p.hasOtherItems; });
        var q = clean.reduce(function(s, p) { return s + p.qty; }, 0);
        var c = clean.reduce(function(s, p) { return s + p.costTotal; }, 0);
        var avg = q > 0 ? Math.round(c / q) : 0;
        purchases.forEach(function(p) {
            if (p.hasOtherItems) { p.costEach = avg; p.costTotal = avg * p.qty; p.estimatedCost = true; }
        });
    }

    function applyMugOffsets(purchases, mugs) {
        var matched = 0;
        purchases.forEach(function(p) {
            p.mugOffset = 0; p.adjustedCostTotal = p.costTotal; p.adjustedCostEach = p.costEach; p.matchedMugs = [];
        });
        mugs.sort(function(a, b) { return a.timestamp - b.timestamp; });
        mugs.forEach(function(mug) {
            var cands = purchases.filter(function(p) {
                var sid = toNumber(p.sellerId || p.seller);
                return sid && sid === mug.targetId && p.timestamp <= mug.timestamp &&
                    mug.timestamp <= p.timestamp + MUG_WINDOW_SECONDS;
            });
            if (!cands.length) return;
            cands.sort(function(a, b) { return a.timestamp - b.timestamp; });
            var remaining = mug.amount, last = cands[cands.length - 1];
            function apply(p, amt) {
                if (amt <= 0) return;
                p.mugOffset += amt;
                p.adjustedCostTotal = p.costTotal - p.mugOffset;
                p.adjustedCostEach = p.qty > 0 ? Math.round(p.adjustedCostTotal / p.qty) : 0;
                p.matchedMugs.push({ id: mug.id, timestamp: mug.timestamp, targetId: mug.targetId, amount: amt });
            }
            cands.forEach(function(p) {
                if (remaining <= 0) return;
                var room = Math.max(0, p.costTotal - p.mugOffset);
                var amt = Math.min(remaining, room);
                apply(p, amt); remaining -= amt;
            });
            if (remaining > 0) apply(last, remaining);
            matched++;
        });
        return matched;
    }

    function statRow(k, v, cls) {
        return '<div class="ttb-stat-row"><span class="k">' + k + '</span><span class="v' + (cls ? ' ' + cls : '') + '">' + v + '</span></div>';
    }

    function qtyByType(items, type) {
        return items.filter(function(p) { return p.type === type; }).reduce(function(s, p) { return s + p.qty; }, 0);
    }

    function renderBuyResults(purchases, name) {
        var qty = purchases.reduce(function(s, p) { return s + p.qty; }, 0);
        var orig = purchases.reduce(function(s, p) { return s + p.costTotal; }, 0);
        var mug = purchases.reduce(function(s, p) { return s + (p.mugOffset || 0); }, 0);
        var cost = purchases.reduce(function(s, p) { return s + (p.adjustedCostTotal != null ? p.adjustedCostTotal : p.costTotal); }, 0);
        var avg = qty > 0 ? Math.round(cost / qty) : 0;
        var avgCls = (avg < 0 ? 'emphasis ttb-negative' : 'emphasis');
        document.getElementById('buy-summary').innerHTML =
            '<h3>购买统计 · ' + name + '</h3>' +
            statRow('数量', qty.toLocaleString()) +
            statRow('原始花费', formatMoney(orig)) +
            statRow('Mug 抵扣', '-' + formatMoney(mug)) +
            statRow('实际成本', formatMoney(cost), cost < 0 ? 'ttb-negative' : '') +
            statRow('实际均价', formatMoney(avg), avgCls) +
            statRow('Mug 纪录/匹配', buyMugStats.total + ' / ' + buyMugStats.matched) +
            statRow('Bazaar', qtyByType(purchases, 'bazaar').toLocaleString() + ' 件') +
            statRow('Item Market', qtyByType(purchases, 'market').toLocaleString() + ' 件') +
            statRow('Trade', qtyByType(purchases, 'trade').toLocaleString() + ' 件');
        var list = document.getElementById('buy-list');
        list.innerHTML = '<div class="ttb-section-title">购买明细</div>';
        purchases.sort(function(a, b) { return b.timestamp - a.timestamp; }).forEach(function(p) {
            var div = document.createElement('div');
            div.className = 'ttb-item ' + p.type;
            var adjTotal = p.adjustedCostTotal != null ? p.adjustedCostTotal : p.costTotal;
            var adjEach = p.adjustedCostEach != null ? p.adjustedCostEach : p.costEach;
            var mugLine = p.matchedMugs && p.matchedMugs.length
                ? '<p class="ttb-note">匹配 Mug：' + p.matchedMugs.map(function(m) {
                    return formatTime(m.timestamp) + ' ' + formatMoney(m.amount);
                }).join('；') + '</p>' : '';
            div.innerHTML = '<h4>' + p.typeName + ' · ' + formatTime(p.timestamp) + '</h4>' +
                (p.estimatedCost ? '<p class="ttb-note">含其他物品，成本按非混合交易均价估算</p>' : '') +
                '<p>数量 ' + p.qty.toLocaleString() + ' · 原单价 ' + formatMoney(p.costEach) + ' · 原总价 ' + formatMoney(p.costTotal) + '</p>' +
                '<p><span class="ttb-mug">Mug -' + formatMoney(p.mugOffset || 0) + '</span> · 实际总价 ' + formatMoney(adjTotal) + ' · 实际单价 ' + formatMoney(adjEach) + '</p>' +
                mugLine +
                '<p>卖家 ' + (p.sellerId || p.seller || '匿名') + '</p>';
            list.appendChild(div);
        });
    }

    document.getElementById('buy-query').addEventListener('click', async function() {
        var btn = this, err = document.getElementById('buy-error'), info = document.getElementById('buy-info');
        var res = document.getElementById('buy-result');
        err.textContent = ''; info.textContent = ''; res.classList.remove('show');
        buyMugStats = { total: 0, matched: 0 };
        var apiKey = saveApiKey();
        if (!apiKey) { err.textContent = '请填写 API Key'; return; }
        if (!buySelected.id) { err.textContent = '请选择物品'; return; }
        var sd = document.getElementById('buy-start-date').value, ed = document.getElementById('buy-end-date').value;
        if (!sd || !ed) { err.textContent = '请选择时间范围'; return; }
        var startTs = toTimestamp(sd + 'T' + (document.getElementById('buy-start-time').value || '00:00'));
        var endTs = toTimestamp(ed + 'T' + (document.getElementById('buy-end-time').value || '23:59'));
        if (startTs >= endTs) { err.textContent = '开始时间不能晚于结束'; return; }
        btn.disabled = true; btn.textContent = '查询中...';
        try {
            info.textContent = '正在获取购买记录...';
            var pLogs = await fetchAllLogs(apiKey, '1112,1225', startTs, endTs, function(pg, w, a) {
                if (w) setRateLimitProgress(info, w, a);
                else info.textContent = '正在获取购买记录（第 ' + pg + ' 页）...';
            });
            var purchases = processPurchaseLogs(pLogs, buySelected.id);
            info.textContent = '正在获取交易记录...';
            var tLogs = await fetchAllLogs(apiKey, '4430,4440,4446', startTs, endTs, function(pg, w, a) {
                if (w) setRateLimitProgress(info, w, a);
                else info.textContent = '正在获取交易记录（第 ' + pg + ' 页）...';
            });
            var all = purchases.concat(processTradeLogs(tLogs, buySelected.id));
            if (!all.length) { err.textContent = '未找到该物品的购买记录'; info.textContent = ''; return; }
            applyMixedTradeEstimate(all);
            info.textContent = '正在获取 Mug 记录...';
            var mugs = processMugLogs(await fetchAllLogs(apiKey, '8155', startTs, endTs + MUG_WINDOW_SECONDS, function(pg, w, a) {
                if (w) setRateLimitProgress(info, w, a);
                else if (pg > 1) info.textContent = '正在获取 Mug 记录（第 ' + pg + ' 页）...';
            }));
            buyMugStats.total = mugs.length;
            buyMugStats.matched = applyMugOffsets(all, mugs);
            info.textContent = '';
            showResult(res);
            renderBuyResults(all, buySelected.name);
        } catch (e) { err.textContent = '错误：' + e.message; }
        finally { btn.disabled = false; btn.textContent = '查询购买记录（含 Mug 抵扣）'; }
    });

    // ─── Sell ───
    function getSellLogIds() {
        var ids = [];
        if (document.getElementById('sell-bazaar').checked) ids = ids.concat(SELL_LOG_TYPES.bazaar.ids);
        if (document.getElementById('sell-market').checked) ids = ids.concat(SELL_LOG_TYPES.market.ids);
        return ids;
    }

    function calcSellAmounts(log, item, cat) {
        var grossEach = log.data.cost_each || 0, grossTotal = grossEach * item.qty;
        var totalQty = (log.data.items || []).reduce(function(s, i) { return s + i.qty; }, 0);
        var share = totalQty > 0 ? item.qty / totalQty : 1;
        if (cat !== 'market') {
            var t = log.data.cost_total != null ? Math.round(log.data.cost_total * share) : grossTotal;
            return { grossEach: item.qty > 0 ? Math.round(t / item.qty) : 0, grossTotal: t, fee: 0, netEach: item.qty > 0 ? Math.round(t / item.qty) : 0, netTotal: t };
        }
        var fee = Math.round((log.data.fee || 0) * share);
        var net = log.data.cost_total != null ? Math.round(log.data.cost_total * share) : grossTotal - fee;
        return { grossEach: grossEach, grossTotal: grossTotal, fee: fee, netEach: item.qty > 0 ? Math.round(net / item.qty) : 0, netTotal: net };
    }

    function sellLogName(id) {
        return ({ 1221: 'Bazaar', 1226: 'Bazaar (legacy)', 1113: 'Item Market', 1104: 'Item Market (old)' })[id] || '?';
    }

    function sellCategory(id) {
        return (id === 1221 || id === 1226) ? 'bazaar' : (id === 1113 || id === 1104) ? 'market' : null;
    }

    document.getElementById('sell-query').addEventListener('click', async function() {
        var btn = this, err = document.getElementById('sell-error'), info = document.getElementById('sell-info');
        var res = document.getElementById('sell-result');
        err.textContent = ''; info.textContent = ''; res.classList.remove('show');
        var apiKey = saveApiKey(), logIds = getSellLogIds();
        if (!apiKey) { err.textContent = '请填写 API Key'; return; }
        if (!sellSelected.id) { err.textContent = '请选择物品'; return; }
        if (!logIds.length) { err.textContent = '请勾选出售来源'; return; }
        var sd = document.getElementById('sell-start-date').value, ed = document.getElementById('sell-end-date').value;
        if (!sd || !ed) { err.textContent = '请选择时间范围'; return; }
        var startTs = toTimestamp(sd + 'T' + (document.getElementById('sell-start-time').value || '00:00'));
        var endTs = toTimestamp(ed + 'T' + (document.getElementById('sell-end-time').value || '23:59'));
        if (startTs >= endTs) { err.textContent = '开始时间不能晚于结束'; return; }
        btn.disabled = true; btn.textContent = '查询中...';
        try {
            var allowed = {}; logIds.forEach(function(id) { allowed[id] = true; });
            var logs = await fetchAllLogs(apiKey, logIds.join(','), startTs, endTs, function(pg, w, a) {
                if (w) setRateLimitProgress(info, w, a);
                else info.textContent = '正在获取出售记录（第 ' + pg + ' 页）...';
            });
            var sells = [];
            Object.entries(logs).forEach(function(e) {
                var log = e[1];
                if (!allowed[log.log]) return;
                var cat = sellCategory(log.log);
                if (!cat) return;
                (log.data.items || []).forEach(function(item) {
                    if (Number(item.id) !== Number(sellSelected.id)) return;
                    var a = calcSellAmounts(log, item, cat);
                    sells.push({ type: cat, typeName: sellLogName(log.log), timestamp: log.timestamp, qty: item.qty,
                        grossEach: a.grossEach, grossTotal: a.grossTotal, fee: a.fee, priceEach: a.netEach, revenueTotal: a.netTotal,
                        buyer: log.data.buyer || log.data.seller });
                });
            });
            if (!sells.length) { err.textContent = '未找到该物品的出售记录'; info.textContent = ''; return; }
            var tQty = sells.reduce(function(s, p) { return s + p.qty; }, 0);
            var tRev = sells.reduce(function(s, p) { return s + p.revenueTotal; }, 0);
            var tFee = sells.reduce(function(s, p) { return s + p.fee; }, 0);
            document.getElementById('sell-summary').innerHTML =
                '<h3>出售统计 · ' + sellSelected.name + '</h3>' +
                statRow('数量', tQty.toLocaleString()) +
                statRow('实际收入', formatMoney(tRev)) +
                statRow('出售均价（税后）', formatMoney(tQty > 0 ? Math.round(tRev / tQty) : 0), 'emphasis') +
                statRow('Market 税费', formatMoney(tFee)) +
                statRow('Bazaar', qtyByType(sells, 'bazaar').toLocaleString() + ' 件') +
                statRow('Item Market', qtyByType(sells, 'market').toLocaleString() + ' 件');
            var list = document.getElementById('sell-list');
            list.innerHTML = '<div class="ttb-section-title">出售明细</div>';
            sells.sort(function(a, b) { return b.timestamp - a.timestamp; }).forEach(function(p) {
                var div = document.createElement('div');
                div.className = 'ttb-item ' + p.type;
                var price = p.type === 'market'
                    ? '挂牌 ' + formatMoney(p.grossEach) + ' × ' + p.qty + ' = ' + formatMoney(p.grossTotal) +
                      ' · 税 ' + formatMoney(p.fee) + ' · 实收 ' + formatMoney(p.revenueTotal) + '（均价 ' + formatMoney(p.priceEach) + '）'
                    : '数量 ' + p.qty + ' · 单价 ' + formatMoney(p.priceEach) + ' · 总价 ' + formatMoney(p.revenueTotal);
                div.innerHTML = '<h4>' + p.typeName + ' · ' + formatTime(p.timestamp) + '</h4><p>' + price + '</p><p>买家ID：' + (p.buyer || '匿名') + '</p>';
                list.appendChild(div);
            });
            info.textContent = '';
            showResult(res);
        } catch (e) { err.textContent = '错误：' + e.message; }
        finally { btn.disabled = false; btn.textContent = '查询出售记录'; }
    });

    // ─── Attacks ───
    async function fetchAllAttacks(apiKey, filters, from, to) {
        var all = [], hasMore = true, page = 0;
        while (hasMore && page < 1000) {
            page++;
            var params = new URLSearchParams();
            filters.forEach(function(f) { params.append('filters', f); });
            params.append('limit', '100'); params.append('sort', 'DESC');
            if (from) params.append('from', from); if (to) params.append('to', to);
            params.append('key', apiKey);
            var data = await (await fetch('https://api.torn.com/v2/user/attacks?' + params)).json();
            if (data.error) throw new Error(data.error.error || data.error);
            if (data.attacks && data.attacks.length) {
                all = all.concat(data.attacks);
                if (data.attacks.length < 100) hasMore = false;
                else { to = data.attacks[data.attacks.length - 1].started - 1; if (to <= from) hasMore = false; }
            } else hasMore = false;
            if (hasMore) await sleep(ATTACKS_API_DELAY_MS);
        }
        var seen = new Set(), uniq = [];
        all.forEach(function(a) { if (!seen.has(a.id)) { seen.add(a.id); uniq.push(a); } });
        return uniq;
    }

    function renderAttackItem(a) {
        var div = document.createElement('div');
        div.className = 'ttb-item attack';
        div.innerHTML = '<h4>攻击ID：' + a.id + '</h4>' +
            '<p>攻击者：' + (a.attacker?.name || '未知') + '（ID：' + (a.attacker?.id || '未知') +
            '，派系：' + (a.attacker?.faction?.name || '未知') + ' [' + (a.attacker?.faction?.id || '未知') + ']）</p>' +
            '<p>防御者：' + (a.defender?.name || '未知') + '（ID：' + (a.defender?.id || '未知') +
            '，派系：' + (a.defender?.faction?.name || '未知') + ' [' + (a.defender?.faction?.id || '未知') + ']）</p>' +
            '<p>开始：' + formatTime(a.started) + ' | 结束：' + formatTime(a.ended) + '</p>' +
            '<p>结果：' + (a.result || '未知') + ' | Respect +' + (a.respect_gain || 0) + ' / -' + (a.respect_loss || 0) + '</p>' +
            '<p>Chain：' + (a.chain || 0) + ' | Warlord：' + (a.modifiers?.warlord ?? '无') + '</p>' +
            '<p>Ranked War：' + (a.is_ranked_war ? '是' : '否') + ' | Raid：' + (a.is_raid ? '是' : '否') + ' | Stealthed：' + (a.is_stealthed ? '是' : '否') + '</p>';
        return div;
    }

    document.getElementById('atk-query').addEventListener('click', async function() {
        var btn = this, err = document.getElementById('atk-error'), info = document.getElementById('atk-info');
        var res = document.getElementById('atk-result');
        err.textContent = ''; info.textContent = ''; res.classList.remove('show');
        var apiKey = saveApiKey();
        var faction = parseInt(document.getElementById('atk-faction').value);
        var warlord = document.getElementById('atk-warlord').value.trim();
        var startTs = toTimestamp(document.getElementById('atk-start').value);
        var endTs = toTimestamp(document.getElementById('atk-end').value);
        if (!apiKey) { err.textContent = '请填写 API Key'; return; }
        if (isNaN(faction)) { err.textContent = '请输入 Faction ID'; return; }
        if (!startTs || !endTs || startTs >= endTs) { err.textContent = '请选择有效时间范围'; return; }
        var wb = warlord ? parseFloat(warlord) : null;
        btn.disabled = true; btn.textContent = '查询中...';
        try {
            info.textContent = '正在获取数据...';
            var all = await fetchAllAttacks(apiKey, [document.getElementById('atk-filter').value], startTs, endTs);
            if (!all.length) {
                err.textContent = '未获取到任何攻击数据';
                info.textContent = '';
                return;
            }
            info.textContent = '已获取 ' + all.length + ' 条数据，正在筛选...';
            var filtered = all.filter(function(a) {
                if (a.defender?.faction?.id !== faction) return false;
                if (a.ended < startTs || a.ended > endTs) return false;
                if (wb !== null && a.modifiers?.warlord !== wb) return false;
                return true;
            });
            document.getElementById('atk-count').textContent = filtered.length;
            var list = document.getElementById('atk-list');
            list.innerHTML = '';
            if (!filtered.length) {
                list.innerHTML = '<p style="color:#cdd3dc">暂无符合条件的条目</p>';
            } else {
                filtered.forEach(function(a) { list.appendChild(renderAttackItem(a)); });
            }
            info.textContent = '';
            showResult(res);
        } catch (e) { err.textContent = '错误：' + e.message; }
        finally { btn.disabled = false; btn.textContent = '查询并筛选'; }
    });

    // ─── Company monitor ───
    function setMonitoringUI(on) {
        companyState.monitoring = on;
        fab.classList.toggle('monitoring', on);
        document.getElementById('ttb-tab-company').classList.toggle('active-monitoring', on);
        document.getElementById('co-start').style.display = on ? 'none' : 'block';
        document.getElementById('co-stop').style.display = on ? 'block' : 'none';
        document.getElementById('co-interval').disabled = on;
        document.getElementById('ttb-api-key').disabled = on;
        var statusEl = document.getElementById('co-status');
        statusEl.classList.toggle('show', on || companyState.checks > 0);
        statusEl.classList.toggle('stopped', !on && companyState.checks > 0);
        document.getElementById('co-status-text').textContent = on ? '● 监听中' : '已停止监听';
    }

    function renderCoApp(app, id) {
        var div = document.createElement('div');
        div.className = 'ttb-item company';
        div.innerHTML = '<h4>新申请 #' + id + '</h4>' +
            '<p>申请人：' + (app.name || '未知') + ' (ID ' + (app.userID || '未知') + ') · Lv ' + (app.level || '未知') + '</p>' +
            '<p>INT ' + (app.stats?.intelligence?.toLocaleString() || '?') + ' · END ' + (app.stats?.endurance?.toLocaleString() || '?') + ' · MAN ' + (app.stats?.manual_labor?.toLocaleString() || '?') + '</p>' +
            '<p>状态：' + (app.status || '未知') + '</p>' +
            '<p>过期：' + new Date(app.expires * 1000).toLocaleString('zh-CN') + '</p>' +
            '<p>消息：' + (app.message || '无消息') + '</p>';
        document.getElementById('co-list').insertBefore(div, document.getElementById('co-list').firstChild);
    }

    async function coCheck() {
        var apiKey = getApiKey();
        if (!apiKey) { stopCompanyMonitor(); document.getElementById('co-error').textContent = 'API Key 不能为空'; return; }
        try {
            document.getElementById('co-error').textContent = '';
            companyState.checks++;
            document.getElementById('co-checks').textContent = companyState.checks;
            var data = await (await fetch('https://api.torn.com/company/?selections=applications&key=' + encodeURIComponent(apiKey))).json();
            if (data.error) throw new Error(data.error.error || 'API返回错误');
            if (data.applications && typeof data.applications === 'object') {
                var newApps = [];
                Object.keys(data.applications).forEach(function(id) {
                    if (!companyState.seen.has(id)) {
                        companyState.seen.add(id);
                        companyState.apps++;
                        newApps.push({ id: id, data: data.applications[id] });
                    }
                });
                if (newApps.length) {
                    document.getElementById('co-apps').textContent = companyState.apps;
                    newApps.forEach(function(a) { renderCoApp(a.data, a.id); });
                    GM_notification({
                        title: 'Torn 公司新申请',
                        text: '发现 ' + newApps.length + ' 个新申请',
                        timeout: 10000,
                        onclick: function() { window.focus(); }
                    });
                }
            }
        } catch (e) { document.getElementById('co-error').textContent = '检查失败：' + e.message; }
    }

    function stopCompanyMonitor() {
        if (companyState.timer) clearInterval(companyState.timer);
        companyState.timer = null;
        setMonitoringUI(false);
        document.getElementById('co-next').textContent = '--';
    }

    document.getElementById('co-start').addEventListener('click', async function() {
        var apiKey = saveApiKey();
        var interval = parseInt(document.getElementById('co-interval').value) || 30;
        if (!apiKey) { document.getElementById('co-error').textContent = '请填写 API Key'; return; }
        if (interval < 10) { document.getElementById('co-error').textContent = '间隔不能小于 10 秒'; return; }
        setMonitoringUI(true);
        document.getElementById('co-error').textContent = '';
        await coCheck();
        companyState.timer = setInterval(async function() {
            await coCheck();
            document.getElementById('co-next').textContent = new Date(Date.now() + interval * 1000).toLocaleTimeString('zh-CN');
        }, interval * 1000);
        document.getElementById('co-next').textContent = new Date(Date.now() + interval * 1000).toLocaleTimeString('zh-CN');
    });

    document.getElementById('co-stop').addEventListener('click', stopCompanyMonitor);
    window.addEventListener('beforeunload', stopCompanyMonitor);

})();
