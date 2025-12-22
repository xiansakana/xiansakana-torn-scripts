// ==UserScript==
// @name         Torn 物品购买均价计算器
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  计算购买某种物品的数量、单价、购买方式和均价
// @author       xiansakana[2754627]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
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
            width: 400px;
            max-width: 100%;
            color: #ccc;
            font-family: Arial, sans-serif;
            position: relative;
            box-shadow: -5px 0 20px rgba(0,0,0,0.5);
            box-sizing: border-box;
        }
        .apt-close {
            position: absolute;
            top: 10px; right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #888;
        }
        .apt-close:hover { color: #fff; }
        .apt-container h2 { color: #ccc; margin-top: 0; }
        .apt-input-group { margin-bottom: 15px; }
        .apt-input-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .apt-input-group input, .apt-input-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #2d2d2d;
            color: #ccc;
            font-size: 14px;
            box-sizing: border-box;
        }
        .apt-input-group input:focus, .apt-input-group select:focus {
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

        /* 可搜索下拉框 */
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

        /* 结果区域 */
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
            padding: 5px 0;
            border-bottom: 1px solid #444;
        }
        .apt-summary-row:last-child { border-bottom: none; }
        .apt-summary-row .label { color: #aaa; }
        .apt-summary-row .value { color: #4da6ff; font-weight: bold; }
        .apt-avg-price { font-size: 20px; color: #28a745 !important; }
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

        /* 移动端适配 */
        @media (max-width: 500px) {
            .apt-container {
                width: calc(100vw - 50px);
                max-width: 350px;
            }
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            #avgPriceToolBtn {
                right: -30px;
                transition: right 0.3s ease;
            }
            #avgPriceToolBtn.btn-visible { right: 0; }
            #avgPriceToolBtn:hover { right: -30px; }
            #avgPriceToolBtn.btn-visible:hover { right: 0; }
        }
    `);

    // 创建按钮
    var btn = document.createElement('button');
    btn.id = 'avgPriceToolBtn';
    btn.innerHTML = '均价';
    btn.title = '物品购买均价计算器';
    document.body.appendChild(btn);

    // 移动端滑动手势支持（左滑显示按钮，右滑隐藏按钮）
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

        // 确保是水平滑动
        if (Math.abs(diffX) > diffY && Math.abs(diffX) > swipeThreshold) {
            if (diffX < 0 && touchStartX > screenWidth - edgeThreshold) {
                // 从右边缘左滑，显示按钮
                btn.classList.add('btn-visible');
            } else if (diffX > 0 && btn.classList.contains('btn-visible') && !modal.classList.contains('show')) {
                // 右滑且面板未打开，隐藏按钮
                btn.classList.remove('btn-visible');
            }
        }
    }, { passive: true });

    // 创建弹窗
    var modal = document.createElement('div');
    modal.id = 'avgPriceModal';
    modal.innerHTML = `
        <div class="apt-container">
            <span class="apt-close">&times;</span>
            <h2>物品购买均价计算器</h2>
            <div class="apt-input-group">
                <label>API Key (FULL)</label>
                <input type="text" id="aptApiKey" placeholder="请输入你的Torn API Key" />
            </div>
            <div class="apt-input-group">
                <label>选择物品</label>
                <div class="apt-custom-select">
                    <div class="apt-select-display" id="aptSelectDisplay">-- 加载中... --</div>
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
                    <div class="apt-summary-row"><span class="label">总花费</span><span class="value" id="aptSumCost">$0</span></div>
                    <div class="apt-summary-row"><span class="label">购买均价</span><span class="value apt-avg-price" id="aptSumAvg">$0</span></div>
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

    // 变量
    var itemsCache = [];
    var selectedItemId = null;
    var selectedItemName = '';

    // 元素
    var apiKeyInput = document.getElementById('aptApiKey');
    var selectDisplay = document.getElementById('aptSelectDisplay');
    var selectDropdown = document.getElementById('aptSelectDropdown');
    var selectSearch = document.getElementById('aptSelectSearch');
    var selectOptions = document.getElementById('aptSelectOptions');
    var queryBtn = document.getElementById('aptQueryBtn');
    var errorEl = document.getElementById('aptError');
    var infoEl = document.getElementById('aptInfo');
    var resultEl = document.getElementById('aptResult');

    // 加载保存的API Key，优先从localStorage获取
    var savedKey = localStorage.getItem('APIKey') || GM_getValue('tornApiKey', '');
    if (savedKey) apiKeyInput.value = savedKey;

    // 打开/关闭弹窗，首次打开时加载物品列表
    var hasLoadedItems = false;
    btn.addEventListener('click', function() { 
        modal.classList.toggle('show');
        btn.classList.toggle('panel-open');
        if (!hasLoadedItems && savedKey && itemsCache.length === 0) {
            hasLoadedItems = true;
            loadItemsList();
        }
    });
    modal.querySelector('.apt-close').addEventListener('click', function() { 
        modal.classList.remove('show'); 
        btn.classList.remove('panel-open');
    });

    // 工具函数
    function formatMoney(n) { return '$' + n.toLocaleString(); }
    function formatTime(ts) { return new Date(ts * 1000).toLocaleString('zh-CN'); }
    function toTimestamp(s) { return s ? Math.floor(new Date(s).getTime() / 1000) : null; }

    // 渲染下拉选项
    function renderOptions(items) {
        selectOptions.innerHTML = '';
        items.forEach(function(item) {
            var div = document.createElement('div');
            div.className = 'apt-select-option';
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

    // 加载物品列表函数
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

    // 点击下拉框时如果没有数据则尝试加载
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

    // 获取日志
    async function fetchLogsPage(apiKey, logTypes, from, to) {
        var resp = await fetch('https://api.torn.com/user/?selections=log&key=' + apiKey + '&log=' + logTypes + '&from=' + from + '&to=' + to);
        var data = await resp.json();
        if (data.error) throw new Error(data.error.error);
        return data.log || {};
    }

    async function fetchAllLogs(apiKey, logTypes, from, to) {
        var allLogs = {}, hasMore = true, currentTo = to, pageCount = 0;
        while (hasMore && pageCount < 1000) {
            pageCount++;
            var logs = await fetchLogsPage(apiKey, logTypes, from, currentTo);
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
            if (hasMore) await new Promise(function(r) { setTimeout(r, 100); });
        }
        return allLogs;
    }

    function processPurchaseLogs(logs, targetId) {
        var purchases = [];
        Object.entries(logs).forEach(function(e) {
            var logId = e[0], log = e[1];
            if (log.log === 1112 || log.log === 1225) {
                (log.data.items || []).forEach(function(item) {
                    if (item.id === targetId) {
                        purchases.push({
                            id: logId,
                            type: log.log === 1112 ? 'market' : 'bazaar',
                            typeName: log.log === 1112 ? 'Item Market' : 'Bazaar',
                            timestamp: log.timestamp,
                            qty: item.qty,
                            costEach: log.data.cost_each,
                            costTotal: item.qty * log.data.cost_each,
                            seller: log.data.seller
                        });
                    }
                });
            }
        });
        return purchases;
    }

    // 获取物品市场均价
    async function fetchItemMarketPrices(apiKey, itemIds) {
        var prices = {};
        for (var i = 0; i < itemIds.length; i++) {
            var itemId = itemIds[i];
            try {
                var resp = await fetch('https://api.torn.com/v2/market/' + itemId + '/itemmarket?key=' + apiKey);
                var data = await resp.json();
                if (data.error) {
                    prices[itemId] = 0;
                } else {
                    // 优先使用 average_price，如果为0则尝试使用第一个listing的价格
                    var avgPrice = (data.itemmarket && data.itemmarket.average_price) || 0;
                    if (avgPrice === 0 && data.itemmarket && data.itemmarket.listings && data.itemmarket.listings.length > 0) {
                        avgPrice = data.itemmarket.listings[0].price || 0;
                    }
                    prices[itemId] = avgPrice;
                }
            } catch (err) {
                prices[itemId] = 0;
            }
            if (i < itemIds.length - 1) await new Promise(function(r) { setTimeout(r, 100); });
        }
        return prices;
    }

    function groupTradeLogs(logs) {
        var groups = {};
        Object.entries(logs).forEach(function(e) {
            var log = e[1], tradeId = log.data.parsed_trade_id;
            if (!tradeId) return;
            if (!groups[tradeId]) groups[tradeId] = { timestamp: log.timestamp, user: log.data.user };
            if (log.log === 4440) groups[tradeId].money = log.data.money;
            if (log.log === 4446) groups[tradeId].items = log.data.items;
        });
        return groups;
    }

    async function processTradeLogs(logs, targetId, apiKey) {
        var trades = [];
        var groups = groupTradeLogs(logs);

        // 收集所有需要查询价格的其他物品ID
        var otherItemIds = new Set();
        Object.values(groups).forEach(function(trade) {
            if (!trade.items || !trade.money) return;
            var hasTarget = trade.items.some(function(i) { return i.id === targetId; });
            if (!hasTarget) return;
            trade.items.forEach(function(i) {
                if (i.id !== targetId) otherItemIds.add(i.id);
            });
        });

        // 批量获取其他物品的市场均价
        var marketPrices = {};
        if (otherItemIds.size > 0) {
            infoEl.textContent = '正在获取其他物品市场价格...';
            marketPrices = await fetchItemMarketPrices(apiKey, Array.from(otherItemIds));
        }

        Object.entries(groups).forEach(function(e) {
            var tradeId = e[0], trade = e[1];
            if (!trade.items || !trade.money) return;
            var targetItems = trade.items.filter(function(i) { return i.id === targetId; });
            if (targetItems.length === 0) return;

            var totalQty = targetItems.reduce(function(s, i) { return s + i.qty; }, 0);
            var otherItems = trade.items.filter(function(i) { return i.id !== targetId; });

            var cost;
            if (otherItems.length === 0) {
                // 只有目标物品，直接用总金额
                cost = trade.money;
            } else {
                // 计算其他物品的总价值
                var otherValue = otherItems.reduce(function(s, i) {
                    var price = marketPrices[i.id] || 0;
                    return s + (price * i.qty);
                }, 0);
                // 目标物品成本 = 总金额 - 其他物品市场价值
                cost = Math.max(0, trade.money - otherValue);
            }

            trades.push({
                id: tradeId, type: 'trade', typeName: 'Trade', timestamp: trade.timestamp,
                qty: totalQty, costEach: Math.round(cost / totalQty), costTotal: cost, seller: trade.user,
                hasOtherItems: otherItems.length > 0
            });
        });
        return trades;
    }

    function renderResults(purchases, itemName) {
        var totalQty = purchases.reduce(function(s, p) { return s + p.qty; }, 0);
        var totalCost = purchases.reduce(function(s, p) { return s + p.costTotal; }, 0);
        var avgPrice = totalQty > 0 ? Math.round(totalCost / totalQty) : 0;
        var bazaarQty = purchases.filter(function(p) { return p.type === 'bazaar'; }).reduce(function(s, p) { return s + p.qty; }, 0);
        var marketQty = purchases.filter(function(p) { return p.type === 'market'; }).reduce(function(s, p) { return s + p.qty; }, 0);
        var tradeQty = purchases.filter(function(p) { return p.type === 'trade'; }).reduce(function(s, p) { return s + p.qty; }, 0);

        document.getElementById('aptSumName').textContent = itemName;
        document.getElementById('aptSumQty').textContent = totalQty.toLocaleString();
        document.getElementById('aptSumCost').textContent = formatMoney(totalCost);
        document.getElementById('aptSumAvg').textContent = formatMoney(avgPrice);
        document.getElementById('aptSumBazaar').textContent = bazaarQty.toLocaleString() + ' 件';
        document.getElementById('aptSumMarket').textContent = marketQty.toLocaleString() + ' 件';
        document.getElementById('aptSumTrade').textContent = tradeQty.toLocaleString() + ' 件';

        var listEl = document.getElementById('aptPurchaseList');
        listEl.innerHTML = '';
        purchases.sort(function(a, b) { return b.timestamp - a.timestamp; });
        purchases.forEach(function(p) {
            var div = document.createElement('div');
            div.className = 'apt-purchase-item ' + p.type;
            var extraInfo = p.hasOtherItems ? ' <span style="color:#ffc107;">(含其他物品，其他物品按市场价估算)</span>' : '';
            div.innerHTML = '<h4>' + p.typeName + ' - ' + formatTime(p.timestamp) + extraInfo + '</h4>' +
                '<p>数量：' + p.qty + ' | 单价：' + formatMoney(p.costEach) + ' | 总价：' + formatMoney(p.costTotal) + '</p>' +
                '<p>卖家ID：' + (p.seller || '匿名') + '</p>';
            listEl.appendChild(div);
        });
    }

    // 查询按钮
    queryBtn.addEventListener('click', async function() {
        errorEl.textContent = '';
        infoEl.textContent = '';
        resultEl.classList.remove('show');

        var apiKey = apiKeyInput.value.trim();
        var startDate = document.getElementById('aptStartDate').value;
        var startTime = document.getElementById('aptStartTime').value || '00:00';
        var endDate = document.getElementById('aptEndDate').value;
        var endTime = document.getElementById('aptEndTime').value || '23:59';

        if (!apiKey) { errorEl.textContent = '请输入API Key！'; return; }
        if (!selectedItemId) { errorEl.textContent = '请选择物品！'; return; }
        if (!startDate || !endDate) { errorEl.textContent = '请选择完整的时间范围！'; return; }

        var startStr = startDate + 'T' + startTime;
        var endStr = endDate + 'T' + endTime;
        var startTs = toTimestamp(startStr), endTs = toTimestamp(endStr);
        if (startTs >= endTs) { errorEl.textContent = '开始时间不能晚于结束时间！'; return; }

        GM_setValue('tornApiKey', apiKey);
        queryBtn.disabled = true;
        queryBtn.textContent = '查询中...';

        try {
            infoEl.textContent = '正在获取购买记录...';
            var purchaseLogs = await fetchAllLogs(apiKey, '1112,1225', startTs, endTs);
            var purchases = processPurchaseLogs(purchaseLogs, selectedItemId);

            infoEl.textContent = '正在获取交易记录...';
            var tradeLogs = await fetchAllLogs(apiKey, '4430,4440,4446', startTs, endTs);
            var trades = await processTradeLogs(tradeLogs, selectedItemId, apiKey);

            var all = purchases.concat(trades);
            if (all.length === 0) {
                errorEl.textContent = '未找到该物品的购买记录';
                infoEl.textContent = '';
            } else {
                infoEl.textContent = '';
                resultEl.classList.add('show');
                renderResults(all, selectedItemName);
            }
        } catch (err) {
            errorEl.textContent = '错误：' + err.message;
        } finally {
            queryBtn.disabled = false;
            queryBtn.textContent = '查询购买记录';
        }
    });

})();
