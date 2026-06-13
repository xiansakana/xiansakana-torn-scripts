// ==UserScript==
// @name         Torn 物品出售均价计算器
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  计算出售某种物品的数量、单价、出售方式和均价
// @author       xiansakana[2754627]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    var SELL_LOG_TYPES = {
        bazaar: { ids: [1221, 1226], label: 'Bazaar' },
        market: { ids: [1113, 1104], label: 'Item Market' }
    };
    var API_DELAY_MS = 1000;
    var RATE_LIMIT_RETRIES = 5;

    function sleep(ms) {
        return new Promise(function(r) { setTimeout(r, ms); });
    }

    function isRateLimitError(data) {
        if (!data || !data.error) return false;
        var code = data.error.code;
        var msg = (data.error.error || '').toLowerCase();
        return code === 5 || msg.indexOf('too many') !== -1;
    }

    GM_addStyle(`
        #avgSellPriceToolBtn {
            position: fixed;
            top: calc(50% + 180px);
            right: -25px;
            transform: translateY(-50%);
            width: 30px;
            height: 80px;
            border-radius: 8px 0 0 8px;
            background: #28a745;
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
        #avgSellPriceToolBtn:hover { background: #1e7e34; right: 0; }
        #avgSellPriceToolBtn.panel-open { right: 0; }

        #avgSellPriceModal {
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
        #avgSellPriceModal.show { display: block; }

        .asp-container {
            background: #333;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            max-width: 100%;
            color: #ccc;
            font-family: Arial, sans-serif;
            position: relative;
            box-shadow: -5px 0 20px rgba(0,0,0,0.5);
            box-sizing: border-box;
        }
        .asp-close {
            position: absolute;
            top: 10px; right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #888;
        }
        .asp-close:hover { color: #fff; }
        .asp-container h2 { color: #ccc; margin-top: 0; }
        .asp-input-group { margin-bottom: 15px; }
        .asp-input-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .asp-input-group input, .asp-input-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #2d2d2d;
            color: #ccc;
            font-size: 14px;
            box-sizing: border-box;
        }
        .asp-input-group input:focus, .asp-input-group select:focus {
            outline: none;
            border-color: #4da6ff;
        }
        .asp-input-group input[type="date"],
        .asp-input-group input[type="time"] { color-scheme: dark; }
        .asp-datetime-row {
            display: flex;
            gap: 8px;
        }
        .asp-datetime-row input[type="date"] { flex: 1; }
        .asp-datetime-row input[type="time"] { width: 110px; }
        .asp-checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .asp-checkbox-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: normal;
            cursor: pointer;
        }
        .asp-checkbox-label input[type="checkbox"] {
            width: auto;
            margin: 0;
            cursor: pointer;
        }
        .asp-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
            margin-top: 5px;
        }
        .asp-btn:hover { background: #1e7e34; }
        .asp-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .asp-error { color: #ff6b6b; margin-top: 10px; }
        .asp-info { color: #ffc107; margin-top: 10px; }

        .asp-custom-select { position: relative; }
        .asp-select-display {
            width: 100%;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #2d2d2d;
            color: #ccc;
            cursor: pointer;
            box-sizing: border-box;
        }
        .asp-select-display:hover { border-color: #4da6ff; }
        .asp-select-dropdown {
            position: absolute;
            top: 100%; left: 0; right: 0;
            background: #2d2d2d;
            border: 1px solid #444;
            border-top: none;
            border-radius: 0 0 4px 4px;
            z-index: 10001;
            display: none;
            max-height: 300px;
            flex-direction: column;
        }
        .asp-select-dropdown.show { display: flex; }
        .asp-select-search {
            padding: 10px;
            border: none;
            border-bottom: 1px solid #444;
            background: #333;
            color: #ccc;
            outline: none;
        }
        .asp-select-options { overflow-y: auto; max-height: 250px; }
        .asp-select-option {
            padding: 8px 10px;
            cursor: pointer;
            border-bottom: 1px solid #3a3a3a;
        }
        .asp-select-option:hover { background: #444; }

        .asp-result { margin-top: 20px; display: none; }
        .asp-result.show { display: block; }
        .asp-summary {
            background: #2d2d2d;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        .asp-summary h3 { margin-top: 0; color: #4da6ff; }
        .asp-summary-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #444;
        }
        .asp-summary-row:last-child { border-bottom: none; }
        .asp-summary-row .label { color: #aaa; }
        .asp-summary-row .value { color: #4da6ff; font-weight: bold; }
        .asp-avg-price { font-size: 20px; color: #28a745 !important; }
        .asp-sell-item {
            background: #2d2d2d;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 4px;
            border-left: 4px solid #444;
        }
        .asp-sell-item.bazaar { border-left-color: #ffc107; }
        .asp-sell-item.market { border-left-color: #17a2b8; }
        .asp-sell-item h4 { margin: 0 0 8px 0; color: #ccc; font-size: 14px; }
        .asp-sell-item p { margin: 3px 0; color: #aaa; font-size: 13px; }

        @media (max-width: 500px) {
            .asp-container {
                width: calc(100vw - 50px);
                max-width: 350px;
            }
        }

        @media (max-width: 768px) {
            #avgSellPriceToolBtn {
                right: -30px;
                transition: right 0.3s ease;
            }
            #avgSellPriceToolBtn.btn-visible { right: 0; }
            #avgSellPriceToolBtn:hover { right: -30px; }
            #avgSellPriceToolBtn.btn-visible:hover { right: 0; }
        }
    `);

    var btn = document.createElement('button');
    btn.id = 'avgSellPriceToolBtn';
    btn.innerHTML = '售均';
    btn.title = '物品出售均价计算器';
    document.body.appendChild(btn);

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

    var modal = document.createElement('div');
    modal.id = 'avgSellPriceModal';
    modal.innerHTML = `
        <div class="asp-container">
            <span class="asp-close">&times;</span>
            <h2>物品出售均价计算器</h2>
            <div class="asp-input-group">
                <label>API Key (FULL)</label>
                <input type="text" id="aspApiKey" placeholder="请输入你的Torn API Key" />
            </div>
            <div class="asp-input-group">
                <label>选择物品</label>
                <div class="asp-custom-select">
                    <div class="asp-select-display" id="aspSelectDisplay">-- 加载中... --</div>
                    <div class="asp-select-dropdown" id="aspSelectDropdown">
                        <input type="text" class="asp-select-search" id="aspSelectSearch" placeholder="搜索物品名称或ID..." />
                        <div class="asp-select-options" id="aspSelectOptions"></div>
                    </div>
                </div>
            </div>
            <div class="asp-input-group">
                <label>出售来源</label>
                <div class="asp-checkbox-group">
                    <label class="asp-checkbox-label">
                        <input type="checkbox" id="aspIncludeBazaar" checked />
                        Bazaar（1221 / 1226 legacy）
                    </label>
                    <label class="asp-checkbox-label">
                        <input type="checkbox" id="aspIncludeMarket" checked />
                        Item Market（1113 / 1104 old）
                    </label>
                </div>
            </div>
            <div class="asp-input-group">
                <label>开始时间</label>
                <div class="asp-datetime-row">
                    <input type="date" id="aspStartDate" />
                    <input type="time" id="aspStartTime" value="00:00" />
                </div>
            </div>
            <div class="asp-input-group">
                <label>结束时间</label>
                <div class="asp-datetime-row">
                    <input type="date" id="aspEndDate" />
                    <input type="time" id="aspEndTime" value="23:59" />
                </div>
            </div>
            <button class="asp-btn" id="aspQueryBtn">查询出售记录</button>
            <div class="asp-error" id="aspError"></div>
            <div class="asp-info" id="aspInfo"></div>
            <div class="asp-result" id="aspResult">
                <div class="asp-summary">
                    <h3>出售统计</h3>
                    <div class="asp-summary-row"><span class="label">物品名称</span><span class="value" id="aspSumName">-</span></div>
                    <div class="asp-summary-row"><span class="label">总出售数量</span><span class="value" id="aspSumQty">0</span></div>
                    <div class="asp-summary-row"><span class="label">实际收入</span><span class="value" id="aspSumRevenue">$0</span></div>
                    <div class="asp-summary-row"><span class="label">出售均价（税后）</span><span class="value asp-avg-price" id="aspSumAvg">$0</span></div>
                    <div class="asp-summary-row"><span class="label">Market 税费</span><span class="value" id="aspSumFee">$0</span></div>
                    <div class="asp-summary-row"><span class="label">Bazaar</span><span class="value" id="aspSumBazaar">0 件</span></div>
                    <div class="asp-summary-row"><span class="label">Item Market</span><span class="value" id="aspSumMarket">0 件</span></div>
                </div>
                <h3 style="color:#ccc;">出售明细</h3>
                <div id="aspSellList"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    var itemsCache = [];
    var selectedItemId = null;
    var selectedItemName = '';

    var apiKeyInput = document.getElementById('aspApiKey');
    var selectDisplay = document.getElementById('aspSelectDisplay');
    var selectDropdown = document.getElementById('aspSelectDropdown');
    var selectSearch = document.getElementById('aspSelectSearch');
    var selectOptions = document.getElementById('aspSelectOptions');
    var includeBazaarCheckbox = document.getElementById('aspIncludeBazaar');
    var includeMarketCheckbox = document.getElementById('aspIncludeMarket');
    var queryBtn = document.getElementById('aspQueryBtn');
    var errorEl = document.getElementById('aspError');
    var infoEl = document.getElementById('aspInfo');
    var resultEl = document.getElementById('aspResult');

    var savedKey = localStorage.getItem('APIKey') || GM_getValue('tornApiKey', '');
    if (savedKey) apiKeyInput.value = savedKey;

    var hasLoadedItems = false;
    btn.addEventListener('click', function() {
        modal.classList.toggle('show');
        btn.classList.toggle('panel-open');
        if (!hasLoadedItems && savedKey && itemsCache.length === 0) {
            hasLoadedItems = true;
            loadItemsList();
        }
    });
    modal.querySelector('.asp-close').addEventListener('click', function() {
        modal.classList.remove('show');
        btn.classList.remove('panel-open');
    });

    function formatMoney(n) { return '$' + n.toLocaleString(); }
    function formatTime(ts) { return new Date(ts * 1000).toLocaleString('zh-CN'); }
    function toTimestamp(s) { return s ? Math.floor(new Date(s).getTime() / 1000) : null; }

    function getLogTypeName(logId) {
        if (logId === 1221) return 'Bazaar';
        if (logId === 1226) return 'Bazaar (legacy)';
        if (logId === 1113) return 'Item Market';
        if (logId === 1104) return 'Item Market (old)';
        return 'Unknown';
    }

    function getSellCategory(logId) {
        if (logId === 1221 || logId === 1226) return 'bazaar';
        if (logId === 1113 || logId === 1104) return 'market';
        return null;
    }

    function getSelectedLogTypes() {
        var types = [];
        if (includeBazaarCheckbox.checked) types = types.concat(SELL_LOG_TYPES.bazaar.ids);
        if (includeMarketCheckbox.checked) types = types.concat(SELL_LOG_TYPES.market.ids);
        return types;
    }

    function renderOptions(items) {
        selectOptions.innerHTML = '';
        items.forEach(function(item) {
            var div = document.createElement('div');
            div.className = 'asp-select-option';
            div.textContent = item.name + ' (ID: ' + item.id + ')';
            div.addEventListener('click', function() {
                selectedItemId = item.id;
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
            return i.name.toLowerCase().includes(s) || i.id.toString().includes(s);
        });
        renderOptions(filtered);
    });
    selectSearch.addEventListener('click', function(e) { e.stopPropagation(); });
    document.addEventListener('click', function() { selectDropdown.classList.remove('show'); });

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
            var resp = await fetch('https://api.torn.com/v2/torn/items?key=' + apiKey);
            var data = await resp.json();
            if (data.error) throw new Error(data.error.error);
            itemsCache = data.items || [];
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

    async function fetchLogsPage(apiKey, logTypes, from, to, onWait) {
        var attempt = 0;
        while (true) {
            var resp = await fetch('https://api.torn.com/user/?selections=log&key=' + apiKey + '&log=' + logTypes + '&from=' + from + '&to=' + to);
            var data = await resp.json();
            if (isRateLimitError(data)) {
                attempt++;
                if (attempt > RATE_LIMIT_RETRIES) throw new Error(data.error.error);
                var waitMs = 5000 * attempt;
                if (onWait) onWait(waitMs, attempt);
                await sleep(waitMs);
                continue;
            }
            if (data.error) throw new Error(data.error.error);
            return data.log || {};
        }
    }

    async function fetchAllLogs(apiKey, logTypes, from, to, onProgress) {
        var allLogs = {}, hasMore = true, currentTo = to, pageCount = 0;
        while (hasMore && pageCount < 1000) {
            pageCount++;
            if (onProgress) onProgress(pageCount);
            var logs = await fetchLogsPage(apiKey, logTypes, from, currentTo, function(waitMs, attempt) {
                if (onProgress) onProgress(pageCount, waitMs, attempt);
            });
            var entries = Object.entries(logs);
            if (entries.length > 0) {
                Object.assign(allLogs, logs);
                if (entries.length < 100) {
                    hasMore = false;
                } else {
                    var minTs = Math.min.apply(null, entries.map(function(e) { return e[1].timestamp; }));
                    currentTo = minTs - 1;
                    if (currentTo <= from) hasMore = false;
                }
            } else {
                hasMore = false;
            }
            if (hasMore) await sleep(API_DELAY_MS);
        }
        return allLogs;
    }

    function calcSellAmounts(log, item, category) {
        var grossEach = log.data.cost_each || 0;
        var grossTotal = grossEach * item.qty;
        var totalItemsQty = (log.data.items || []).reduce(function(s, i) { return s + i.qty; }, 0);
        var share = totalItemsQty > 0 ? item.qty / totalItemsQty : 1;

        if (category !== 'market') {
            var bazaarTotal = log.data.cost_total != null ? Math.round(log.data.cost_total * share) : grossTotal;
            var bazaarEach = item.qty > 0 ? Math.round(bazaarTotal / item.qty) : 0;
            return {
                grossEach: bazaarEach,
                grossTotal: bazaarTotal,
                fee: 0,
                netEach: bazaarEach,
                netTotal: bazaarTotal
            };
        }

        var fee = Math.round((log.data.fee || 0) * share);
        var netTotal = log.data.cost_total != null
            ? Math.round(log.data.cost_total * share)
            : grossTotal - fee;
        var netEach = item.qty > 0 ? Math.round(netTotal / item.qty) : 0;
        return { grossEach: grossEach, grossTotal: grossTotal, fee: fee, netEach: netEach, netTotal: netTotal };
    }

    function processSellLogs(logs, targetId, allowedLogIds) {
        var sells = [];
        var allowedSet = {};
        allowedLogIds.forEach(function(id) { allowedSet[id] = true; });

        Object.entries(logs).forEach(function(e) {
            var logId = e[0], log = e[1];
            if (!allowedSet[log.log]) return;

            var category = getSellCategory(log.log);
            if (!category) return;

            (log.data.items || []).forEach(function(item) {
                if (item.id !== targetId) return;

                var amounts = calcSellAmounts(log, item, category);
                sells.push({
                    id: logId,
                    type: category,
                    typeName: getLogTypeName(log.log),
                    timestamp: log.timestamp,
                    qty: item.qty,
                    grossEach: amounts.grossEach,
                    grossTotal: amounts.grossTotal,
                    fee: amounts.fee,
                    priceEach: amounts.netEach,
                    revenueTotal: amounts.netTotal,
                    buyer: log.data.buyer || log.data.seller || null
                });
            });
        });
        return sells;
    }

    function renderResults(sells, itemName) {
        var totalQty = sells.reduce(function(s, p) { return s + p.qty; }, 0);
        var totalRevenue = sells.reduce(function(s, p) { return s + p.revenueTotal; }, 0);
        var totalFee = sells.reduce(function(s, p) { return s + p.fee; }, 0);
        var avgPrice = totalQty > 0 ? Math.round(totalRevenue / totalQty) : 0;
        var bazaarQty = sells.filter(function(p) { return p.type === 'bazaar'; }).reduce(function(s, p) { return s + p.qty; }, 0);
        var marketQty = sells.filter(function(p) { return p.type === 'market'; }).reduce(function(s, p) { return s + p.qty; }, 0);

        document.getElementById('aspSumName').textContent = itemName;
        document.getElementById('aspSumQty').textContent = totalQty.toLocaleString();
        document.getElementById('aspSumRevenue').textContent = formatMoney(totalRevenue);
        document.getElementById('aspSumAvg').textContent = formatMoney(avgPrice);
        document.getElementById('aspSumFee').textContent = formatMoney(totalFee);
        document.getElementById('aspSumBazaar').textContent = bazaarQty.toLocaleString() + ' 件';
        document.getElementById('aspSumMarket').textContent = marketQty.toLocaleString() + ' 件';

        var listEl = document.getElementById('aspSellList');
        listEl.innerHTML = '';
        sells.sort(function(a, b) { return b.timestamp - a.timestamp; });
        sells.forEach(function(p) {
            var div = document.createElement('div');
            div.className = 'asp-sell-item ' + p.type;
            var priceInfo = p.type === 'market'
                ? '<p>挂牌：' + formatMoney(p.grossEach) + ' × ' + p.qty + ' = ' + formatMoney(p.grossTotal) +
                  ' | 税费：' + formatMoney(p.fee) + ' | 实际：' + formatMoney(p.revenueTotal) + '（均价 ' + formatMoney(p.priceEach) + '）</p>'
                : '<p>数量：' + p.qty + ' | 单价：' + formatMoney(p.priceEach) + ' | 总价：' + formatMoney(p.revenueTotal) + '</p>';
            div.innerHTML = '<h4>' + p.typeName + ' - ' + formatTime(p.timestamp) + '</h4>' +
                priceInfo +
                '<p>买家ID：' + (p.buyer || '匿名') + '</p>';
            listEl.appendChild(div);
        });
    }

    queryBtn.addEventListener('click', async function() {
        errorEl.textContent = '';
        infoEl.textContent = '';
        resultEl.classList.remove('show');

        var apiKey = apiKeyInput.value.trim();
        var startDate = document.getElementById('aspStartDate').value;
        var startTime = document.getElementById('aspStartTime').value || '00:00';
        var endDate = document.getElementById('aspEndDate').value;
        var endTime = document.getElementById('aspEndTime').value || '23:59';
        var selectedLogIds = getSelectedLogTypes();

        if (!apiKey) { errorEl.textContent = '请输入API Key！'; return; }
        if (!selectedItemId) { errorEl.textContent = '请选择物品！'; return; }
        if (selectedLogIds.length === 0) { errorEl.textContent = '请至少勾选一个出售来源！'; return; }
        if (!startDate || !endDate) { errorEl.textContent = '请选择完整的时间范围！'; return; }

        var startStr = startDate + 'T' + startTime;
        var endStr = endDate + 'T' + endTime;
        var startTs = toTimestamp(startStr), endTs = toTimestamp(endStr);
        if (startTs >= endTs) { errorEl.textContent = '开始时间不能晚于结束时间！'; return; }

        GM_setValue('tornApiKey', apiKey);
        queryBtn.disabled = true;
        queryBtn.textContent = '查询中...';

        try {
            infoEl.textContent = '正在获取出售记录...';
            var sellLogs = await fetchAllLogs(apiKey, selectedLogIds.join(','), startTs, endTs, function(page, waitMs, attempt) {
                if (waitMs) {
                    infoEl.textContent = '请求过快，等待 ' + Math.round(waitMs / 1000) + ' 秒后重试（' + attempt + '/' + RATE_LIMIT_RETRIES + '）...';
                } else {
                    infoEl.textContent = '正在获取出售记录（第 ' + page + ' 页）...';
                }
            });
            var sells = processSellLogs(sellLogs, selectedItemId, selectedLogIds);

            if (sells.length === 0) {
                errorEl.textContent = '未找到该物品的出售记录';
                infoEl.textContent = '';
            } else {
                infoEl.textContent = '';
                resultEl.classList.add('show');
                renderResults(sells, selectedItemName);
            }
        } catch (err) {
            errorEl.textContent = '错误：' + err.message;
        } finally {
            queryBtn.disabled = false;
            queryBtn.textContent = '查询出售记录';
        }
    });

})();
