// ==UserScript==
// @name         Torn 工具箱
// @namespace    http://tampermonkey.net/
// @version      1.6.29
// @description  整合购买均价、出售均价、攻击筛选、压价助手、公司监听、Quick Items的统一工具箱
// @author       xiansakana[2754627]
// @match        https://www.torn.com/*
// @connect      weav3r.dev
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    var MUG_WINDOW_SECONDS = 5 * 60;
    var API_DELAY_MS = 1000;
    var ATTACKS_API_DELAY_MS = 1000;
    var RATE_LIMIT_RETRIES = 5;
    var TTB_LANG_KEY = 'ttbLang';
    var TTB_TIME_MODE_KEY = 'ttbTimeMode';
    var TTB_TIME_MODES = {
        torn: { label: 'Torn', offsetHours: 0 },
        beijing: { label: '北京', offsetHours: 8 }
    };
    var SELL_LOG_TYPES = {
        bazaar: { ids: [1221, 1226] },
        market: { ids: [1113, 1104] },
        trade: { ids: [4441, 4445] }
    };
    var TTB_HANT_PHRASES = [
        ['购买', '購買'], ['出售', '出售'], ['均价', '均價'], ['攻击', '攻擊'],
        ['筛选', '篩選'], ['压价', '壓價'], ['助手', '助手'], ['公司', '公司'],
        ['监听', '監聽'], ['整合', '整合'], ['记录', '紀錄'], ['查询', '查詢'],
        ['抵扣', '抵扣'], ['明细', '明細'], ['统计', '統計'], ['数量', '數量'],
        ['原始花费', '原始花費'], ['实际成本', '實際成本'], ['实际', '實際'],
        ['纪录', '紀錄'], ['请选择', '請選擇'], ['填写', '填寫'], ['物品', '物品'],
        ['时间', '時間'], ['范围', '範圍'], ['开始', '開始'], ['结束', '結束'],
        ['编号', '編號'], ['分母', '分母'], ['分子', '分子'], ['起始', '起始'],
        ['简单', '簡單'], ['详细', '詳細'], ['链接清单', '連結清單'], ['复制全部', '複製全部'],
        ['错误', '錯誤'], ['网络', '網路'], ['请求', '請求'], ['返回', '回傳'],
        ['加载', '載入'], ['重试', '重試'], ['点击', '點擊'], ['搜索', '搜尋'],
        ['移除', '移除'], ['来源', '來源'], ['勾选', '勾選'], ['收入', '收入'],
        ['税后', '稅後'], ['税费', '稅費'], ['出售来源', '出售來源'],
        ['发出的', '發出的'], ['收到的', '收到的'], ['可选', '可選'],
        ['留空', '留空'], ['全部', '全部'], ['结果', '結果'], ['失败', '失敗'],
        ['协助', '協助'], ['中断', '中斷'], ['特殊', '特殊'], ['数据', '資料'],
        ['符合条件', '符合條件'], ['防御者', '防禦者'], ['攻击者', '攻擊者'],
        ['派系', '派系'], ['未知', '未知'], ['开始监听', '開始監聽'],
        ['停止', '停止'], ['下次', '下次'], ['扫描', '掃描'], ['检查', '檢查'],
        ['申请', '申請'], ['当前', '目前'], ['货物', '貨物'], ['市场', '市場'],
        ['巴扎', '巴扎'], ['最低', '最低'], ['价格', '價格'], ['你的', '你的'],
        ['差价', '差價'], ['发现', '發現'], ['提醒', '提醒'], ['新申请', '新申請'],
        ['申请人', '申請人'], ['状态', '狀態'], ['过期', '過期'], ['消息', '訊息'],
        ['请输入', '請輸入'], ['有效', '有效'], ['获取', '取得'], ['正在', '正在'],
        ['等待', '等待'], ['过快', '過快'], ['后', '後'], ['秒', '秒'],
        ['次', '次'], ['笔', '筆'], ['件', '件'], ['混合', '混合'], ['已排除', '已排除'],
        ['未计入', '未計入'], ['无法', '無法'], ['准确', '準確'], ['分摊', '分攤'],
        ['金额', '金額'], ['单价', '單價'], ['总价', '總價'], ['总', '總'],
        ['卖家', '賣家'], ['买家', '買家'], ['匿名', '匿名'], ['收起', '收合'],
        ['切换繁简', '切換繁簡'], ['切换时间模式', '切換時間模式'],
        ['时间模式', '時間模式'], ['已停止监听', '已停止監聽'], ['监听中', '監聽中']
    ];

    var itemsCache = [];
    var buySelected = { id: null, name: '' };
    var sellSelected = { id: null, name: '' };
    var ucSelectedItems = new Map();
    var buyMugStats = { total: 0, matched: 0 };
    var buyTradeSkips = { trades: 0, qty: 0 };
    var sellTradeSkips = { trades: 0, qty: 0 };
    var ttbLanguage = GM_getValue(TTB_LANG_KEY, 'zhHans') === 'zhHant' ? 'zhHant' : 'zhHans';
    var ttbTimeMode = GM_getValue(TTB_TIME_MODE_KEY, 'torn') === 'beijing' ? 'beijing' : 'torn';
    var ttbLanguageTimer = null;

    var companyState = {
        monitoring: false,
        timer: null,
        checks: 0,
        apps: 0,
        seen: new Set()
    };

    var undercutState = {
        monitoring: false,
        timer: null,
        checks: 0,
        alerts: 0,
        activeKeys: new Set(),
        playerId: null
    };

    var WEAV3R_MARKETPLACE_URL = 'https://weav3r.dev/api/marketplace/';

    GM_addStyle(`
        #ttb-root {
            --ttb-bg: #1e2128; --ttb-surface: #282c34; --ttb-surface2: #32373f;
            --ttb-border: #4a5260; --ttb-text: #f0f2f5; --ttb-muted: #b4bcc8;
            --ttb-accent: #6eb0ff; --ttb-accent-dk: #2563c7; --ttb-accent2: #8b7cf8;
            --ttb-success: #4ade80; --ttb-success-dk: #15803d;
            --ttb-danger: #fb7185; --ttb-danger-dk: #be123c;
            --ttb-warn: #fcd34d; --ttb-radius: 12px;
            --ttb-fab-size: 52px; --ttb-fab-peek: 26px;
            position: fixed; top: 50%; right: 0; z-index: 99998;
            transform: translateY(-50%);
            display: flex; flex-direction: row-reverse; align-items: center; gap: 12px;
            font-family: "Segoe UI", system-ui, sans-serif; font-size: 13px;
        }
        #ttb-fab {
            position: relative; flex-shrink: 0;
            width: var(--ttb-fab-size); height: var(--ttb-fab-size); border: none; border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #6366f1);
            color: #fff; font-size: 22px; cursor: pointer;
            box-shadow: 0 4px 20px rgba(59,130,246,.5);
            transition: transform .25s ease, box-shadow .2s, border-radius .25s ease;
            touch-action: manipulation; -webkit-tap-highlight-color: transparent;
        }
        #ttb-root:not(.ttb-expanded) #ttb-fab {
            transform: translateX(calc(var(--ttb-fab-size) - var(--ttb-fab-peek)));
            border-radius: 50% 0 0 50%;
        }
        #ttb-root:not(.ttb-expanded):hover #ttb-fab,
        #ttb-root:not(.ttb-expanded).ttb-fab-reveal #ttb-fab {
            transform: translateX(0) scale(1.06);
            border-radius: 50%;
            box-shadow: 0 6px 28px rgba(59,130,246,.6);
        }
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
        }
        .ttb-header h1 { margin: 0; font-size: 15px; font-weight: 600; letter-spacing: .3px; color: var(--ttb-text); }
        .ttb-header-btns { display: flex; gap: 6px; }
        .ttb-icon-btn {
            width: 28px; height: 28px; border: none; border-radius: 6px;
            background: rgba(255,255,255,.1); color: var(--ttb-text);
            cursor: pointer; font-size: 16px; line-height: 1;
        }
        #ttb-time-toggle { width: auto; min-width: 44px; padding: 0 8px; font-size: 12px; }
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
        .ttb-field input, .ttb-field select, .ttb-field textarea {
            width: 100%; padding: 9px 10px; border: 1px solid var(--ttb-border);
            border-radius: 8px; background: var(--ttb-surface2); color: var(--ttb-text);
            font-size: 13px; box-sizing: border-box;
        }
        .ttb-field textarea {
            min-height: 110px; resize: vertical; font-family: Consolas, "Courier New", monospace;
            line-height: 1.45;
        }
        .ttb-field input::placeholder, .ttb-field textarea::placeholder { color: #8b95a5; }
        .ttb-field input:focus, .ttb-field select:focus, .ttb-field textarea:focus { outline: none; border-color: var(--ttb-accent); }
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
        .ttb-item.undercut { border-left-color: var(--ttb-warn); animation: ttbIn .25s ease; }
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
        .ttb-select-opt.selected { color: var(--ttb-muted); cursor: default; }
        .ttb-select-opt.selected:hover { background: transparent; color: var(--ttb-muted); }
        .ttb-selected-items { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .ttb-selected-chip {
            display: inline-flex; align-items: center; gap: 4px;
            padding: 4px 8px; border-radius: 999px;
            background: rgba(110,176,255,.15); color: var(--ttb-text); font-size: 12px;
        }
        .ttb-selected-chip button {
            border: none; background: transparent; color: var(--ttb-muted);
            cursor: pointer; font-size: 14px; line-height: 1; padding: 0;
        }
        .ttb-selected-chip button:hover { color: #fff; }
        .ttb-select-wrap.disabled .ttb-select-display { opacity: .65; cursor: not-allowed; pointer-events: none; }
        .ttb-field-hint { margin-top: 4px; font-size: 11px; color: var(--ttb-muted); }
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
            #ttb-root { gap: 8px; }
            #ttb-panel { width: calc(100vw - 16px); height: 80vh; max-height: 80vh; }
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

    function pad2(n) { return String(n).padStart(2, '0'); }

    function parseTtbDateTime(s, mode) {
        if (!s) return null;
        var m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
        if (!m) return null;
        var cfg = TTB_TIME_MODES[mode || ttbTimeMode] || TTB_TIME_MODES.torn;
        var utcMs = Date.UTC(
            Number(m[1]), Number(m[2]) - 1, Number(m[3]),
            Number(m[4]) - cfg.offsetHours, Number(m[5]), Number(m[6] || 0)
        );
        return Math.floor(utcMs / 1000);
    }

    function formatTime(ts, mode) {
        var cfg = TTB_TIME_MODES[mode || ttbTimeMode] || TTB_TIME_MODES.torn;
        var d = new Date((Number(ts) + cfg.offsetHours * 3600) * 1000);
        return d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()) +
            ' ' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes()) + ':' + pad2(d.getUTCSeconds()) +
            ' ' + cfg.label;
    }

    function timeHtml(ts, mode) {
        return '<span data-ttb-time="' + Number(ts) + '">' + formatTime(ts, mode) + '</span>';
    }

    function toTimestamp(s) { return parseTtbDateTime(s); }

    function ttbToHant(text) {
        return TTB_HANT_PHRASES.reduce(function(out, pair) {
            return out.split(pair[0]).join(pair[1]);
        }, String(text));
    }

    function ttbText(text, lang) {
        return (lang || ttbLanguage) === 'zhHant' ? ttbToHant(text) : String(text);
    }

    function updateLanguageButton() {
        var btn = document.getElementById('ttb-lang-toggle');
        if (!btn) return;
        btn.textContent = ttbLanguage === 'zhHant' ? '简' : '繁';
        btn.title = ttbText('切换繁简');
    }

    function updateTimeModeButton() {
        var btn = document.getElementById('ttb-time-toggle');
        if (!btn) return;
        var cfg = TTB_TIME_MODES[ttbTimeMode] || TTB_TIME_MODES.torn;
        btn.textContent = cfg.label;
        if (btn.firstChild) btn.firstChild.__ttbSourceText = cfg.label;
        btn.title = ttbText('切换时间模式：当前 ' + cfg.label);
    }

    function refreshRenderedTimes(rootEl) {
        (rootEl || document).querySelectorAll('[data-ttb-time]').forEach(function(el) {
            el.textContent = formatTime(Number(el.dataset.ttbTime));
            if (el.firstChild) el.firstChild.__ttbSourceText = el.textContent;
        });
    }

    function applyTtbLanguage(target) {
        var rootEl = target || document.getElementById('ttb-root');
        if (!rootEl) return;
        var textNodes = [];
        var walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                var tag = node.parentNode && node.parentNode.tagName;
                return tag === 'SCRIPT' || tag === 'STYLE' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
        });
        var node;
        while ((node = walker.nextNode())) textNodes.push(node);
        textNodes.forEach(function(textNode) {
            if (textNode.__ttbSourceText == null) textNode.__ttbSourceText = textNode.nodeValue;
            var nextText = ttbText(textNode.__ttbSourceText);
            if (textNode.nodeValue !== nextText) textNode.nodeValue = nextText;
        });
        rootEl.querySelectorAll('[title], [placeholder]').forEach(function(el) {
            if (el.hasAttribute('title')) {
                if (!el.dataset.ttbSourceTitle) el.dataset.ttbSourceTitle = el.getAttribute('title');
                var nextTitle = ttbText(el.dataset.ttbSourceTitle);
                if (el.getAttribute('title') !== nextTitle) el.setAttribute('title', nextTitle);
            }
            if (el.hasAttribute('placeholder')) {
                if (!el.dataset.ttbSourcePlaceholder) el.dataset.ttbSourcePlaceholder = el.getAttribute('placeholder');
                var nextPlaceholder = ttbText(el.dataset.ttbSourcePlaceholder);
                if (el.getAttribute('placeholder') !== nextPlaceholder) el.setAttribute('placeholder', nextPlaceholder);
            }
        });
        updateLanguageButton();
        updateTimeModeButton();
    }

    function setTtbLanguage(lang) {
        ttbLanguage = lang === 'zhHant' ? 'zhHant' : 'zhHans';
        GM_setValue(TTB_LANG_KEY, ttbLanguage);
        applyTtbLanguage();
    }

    function setTtbTimeMode(mode) {
        ttbTimeMode = mode === 'beijing' ? 'beijing' : 'torn';
        GM_setValue(TTB_TIME_MODE_KEY, ttbTimeMode);
        refreshRenderedTimes(document.getElementById('ttb-root'));
        applyTtbLanguage();
    }

    function startTtbLanguageObserver(rootEl) {
        if (!window.MutationObserver || !rootEl) return;
        var observer = new MutationObserver(function() {
            clearTimeout(ttbLanguageTimer);
            ttbLanguageTimer = setTimeout(function() {
                applyTtbLanguage(rootEl);
            }, 0);
        });
        observer.observe(rootEl, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['title', 'placeholder']
        });
    }

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

    function apiErrorMessage(data) {
        if (!data || !data.error) return 'API 返回错误';
        return typeof data.error === 'object' ? (data.error.error || 'API 返回错误') : String(data.error);
    }

    var apiQueue=Promise.resolve(),apiNextAt=0,blockedApiKeys=new Set();
    function cancelApiError(){var error=new Error('任务已停止');error.cancelled=true;return error;}
    function enqueueApi(url,shouldRun){
        var key=new URL(url).searchParams.get('key');
        var job=apiQueue.catch(function(){}).then(function(){
            var request=async function(){
            if(shouldRun && !shouldRun() || !getApiKey() || key!==getApiKey())throw cancelApiError();
            if(blockedApiKeys.has(key)){stopCompanyMonitor();stopUndercutMonitor();throw new Error('此 API Key 已失效或禁用，请更换 Key 后再试');}
            var stored=Number(GM_getValue('ttbApiNextAtV1',0));
            if(Number.isFinite(stored) && stored<Date.now()+60000)apiNextAt=Math.max(apiNextAt,stored);
            var wait=Math.max(0,apiNextAt-Date.now());
            if(wait)await sleep(wait);
            if(shouldRun && !shouldRun() || !getApiKey() || key!==getApiKey())throw cancelApiError();
            if(blockedApiKeys.has(key)){stopCompanyMonitor();stopUndercutMonitor();throw new Error('此 API Key 已失效或禁用，请更换 Key 后再试');}
            apiNextAt=Date.now()+1100;GM_setValue('ttbApiNextAtV1',apiNextAt); // Shared budget with Web Locks across supported tabs.
            return fetch(url);
            };
            return navigator.locks?.request ? navigator.locks.request('ttbTornApiBudgetV1',request):request();
        });apiQueue=job.then(function(){},function(){});return job;
    }
    function rejectApiKey(url,code){
        if([1,2,10,13,18].includes(code))blockedApiKeys.add(new URL(url).searchParams.get('key'));
        if([1,2,8,9,10,13,16,18].includes(code)){stopCompanyMonitor();stopUndercutMonitor();}
    }
    function escapeHtml(value){return String(value ?? '').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    async function fetchJsonWithRetry(url, onWait, shouldRun) {
        var attempt = 0;
        while (true) {
            var response=await enqueueApi(url,shouldRun);
            var data=response.status===429 ? {error:{code:5,error:'Too many requests'}}:await response.json();
            if (isRateLimitError(data)) {
                attempt++;
                if (attempt > RATE_LIMIT_RETRIES) throw new Error(apiErrorMessage(data));
                var waitMs = 5000 * attempt;
                apiNextAt=Math.max(apiNextAt,Date.now()+waitMs);GM_setValue('ttbApiNextAtV1',apiNextAt);
                if (onWait) onWait(waitMs, attempt);
                await sleep(waitMs);
                continue;
            }
            if (data.error) {rejectApiKey(url,Number(data.error.code));var error=new Error(apiErrorMessage(data));error.apiCode=Number(data.error.code);throw error;}
            return data;
        }
    }

    function gmFetchJson(url, errorPrefix) {
        return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: { Accept: 'application/json' },
                timeout: 30000,
                onload: function(resp) {
                    if (resp.status < 200 || resp.status >= 300) {
                        reject(new Error((errorPrefix || 'API') + ' 请求失败 (' + resp.status + ')'));
                        return;
                    }
                    try {
                        resolve(JSON.parse(resp.responseText));
                    } catch (e) {
                        reject(new Error((errorPrefix || 'API') + ' 返回数据解析失败'));
                    }
                },
                onerror: function() {
                    reject(new Error((errorPrefix || 'API') + ' 网络请求失败，请检查 @connect 权限'));
                },
                ontimeout: function() {
                    reject(new Error((errorPrefix || 'API') + ' 请求超时'));
                }
            });
        });
    }

    async function fetchLogsPage(apiKey, logTypes, from, to, onWait) {
        var url = 'https://api.torn.com/user/?selections=log&key=' + encodeURIComponent(apiKey)
            + '&log=' + encodeURIComponent(logTypes) + '&from=' + from + '&to=' + to;
        var data = await fetchJsonWithRetry(url, onWait);
        return data.log || {};
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
            var data = await fetchJsonWithRetry(
                'https://api.torn.com/v2/torn/items?key=' + encodeURIComponent(apiKey)
            );
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

    function saveUcSelectedItems() {
        GM_setValue('ttbUcItems', Array.from(ucSelectedItems.entries()));
    }

    function loadUcSelectedItems() {
        ucSelectedItems.clear();
        (GM_getValue('ttbUcItems', []) || []).forEach(function(pair) {
            ucSelectedItems.set(Number(pair[0]), pair[1]);
        });
    }

    function setupMultiItemSelect(prefix, selectedMap, errEl) {
        var wrap = document.getElementById(prefix + '-select-wrap');
        var display = document.getElementById(prefix + '-select-display');
        var drop = document.getElementById(prefix + '-select-drop');
        var search = document.getElementById(prefix + '-select-search');
        var list = document.getElementById(prefix + '-select-list');
        var chips = document.getElementById(prefix + '-selected');

        function renderChips() {
            chips.innerHTML = '';
            if (!selectedMap.size) {
                display.textContent = itemsCache.length ? '-- 全部物品（点击添加指定物品）--' : '-- 点击加载物品 --';
                return;
            }
            display.textContent = '已选 ' + selectedMap.size + ' 个物品（点击继续添加）';
            selectedMap.forEach(function(name, id) {
                var chip = document.createElement('span');
                chip.className = 'ttb-selected-chip';
                chip.innerHTML = name + ' <button type="button" title="移除">&times;</button>';
                chip.querySelector('button').addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectedMap.delete(id);
                    saveUcSelectedItems();
                    renderChips();
                    if (drop.classList.contains('show')) render(search.value);
                });
                chips.appendChild(chip);
            });
        }

        function render(filter) {
            list.innerHTML = '';
            var s = (filter || '').toLowerCase();
            itemsCache.filter(function(i) {
                return !s || i.name.toLowerCase().includes(s) || String(i.id).includes(s);
            }).forEach(function(item) {
                var id = Number(item.id);
                var div = document.createElement('div');
                div.className = 'ttb-select-opt' + (selectedMap.has(id) ? ' selected' : '');
                div.textContent = item.name + ' (ID: ' + item.id + ')' + (selectedMap.has(id) ? ' ✓' : '');
                if (!selectedMap.has(id)) {
                    div.addEventListener('click', function(e) {
                        e.stopPropagation();
                        selectedMap.set(id, item.name);
                        saveUcSelectedItems();
                        renderChips();
                        render(search.value);
                    });
                }
                list.appendChild(div);
            });
        }

        display.addEventListener('click', function(e) {
            e.stopPropagation();
            if (wrap.classList.contains('disabled')) return;
            if (!itemsCache.length) { loadItemsList(display, errEl).then(function() { renderChips(); }); return; }
            drop.classList.toggle('show');
            if (drop.classList.contains('show')) { search.value = ''; render(''); search.focus(); }
        });
        search.addEventListener('input', function() { render(search.value); });
        search.addEventListener('click', function(e) { e.stopPropagation(); });
        renderChips();
    }

    function setUcSelectDisabled(disabled) {
        var wrap = document.getElementById('uc-select-wrap');
        if (!wrap) return;
        wrap.classList.toggle('disabled', disabled);
        wrap.querySelectorAll('.ttb-selected-chip button').forEach(function(btn) {
            btn.disabled = disabled;
        });
    }

    // ─── DOM ───
    var root = document.createElement('div');
    root.id = 'ttb-root';
    root.innerHTML = `
        <button id="ttb-fab" title="点击打开 · 悬停或轻触展开">⚙</button>
        <div id="ttb-panel">
            <div class="ttb-top">
            <div class="ttb-header">
                <h1>🛠 Torn 工具箱</h1>
                <div class="ttb-header-btns">
                    <button class="ttb-icon-btn" id="ttb-time-toggle" title="切换时间模式">Torn</button>
                    <button class="ttb-icon-btn" id="ttb-lang-toggle" title="切换繁简">繁</button>
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
                <button class="ttb-tab" data-tab="undercut" id="ttb-tab-undercut">压价助手</button>
                <button class="ttb-tab" data-tab="company" id="ttb-tab-company">公司监听</button>
<button class="ttb-tab" data-tab="quick">快捷物品</button>
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
                    <div class="ttb-field"><label>购买来源</label>
                        <div class="ttb-checks">
                            <label class="ttb-check"><input type="checkbox" id="buy-bazaar" checked /> Bazaar（1220 / 1225）</label>
                            <label class="ttb-check"><input type="checkbox" id="buy-market" checked /> Item Market（1103 / 1112）</label>
                            <label class="ttb-check"><input type="checkbox" id="buy-trade" checked /> Trade（4440 / 4446）</label>
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
                            <label class="ttb-check"><input type="checkbox" id="sell-trade" checked /> Trade（4441 / 4445）</label>
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
                    <div class="ttb-field"><label>Defender Faction ID（可选）</label><input type="number" id="atk-faction" placeholder="留空则不按派系筛选" /></div>
                    <div class="ttb-field"><label>Warlord Bonus（可选）</label><input type="number" step="0.01" id="atk-warlord" placeholder="1.39" /></div>
                    <div class="ttb-field"><label>攻击结果（可选）</label>
                        <select id="atk-result-filter">
                            <option value="">全部（不筛选）</option>
                            <option value="Mugged">Mugged（被抢）</option>
                            <option value="Hospitalized">Hospitalized（住院）</option>
                            <option value="Attacked">Attacked（攻击）</option>
                            <option value="Lost">Lost（失败）</option>
                            <option value="Stalemate">Stalemate（僵局）</option>
                            <option value="Escape">Escape（逃脱）</option>
                            <option value="Arrested">Arrested（被捕）</option>
                            <option value="Looted">Looted（被搜刮）</option>
                            <option value="Assist">Assist（协助）</option>
                            <option value="Interrupted">Interrupted（中断）</option>
                            <option value="Timeout">Timeout（超时）</option>
                            <option value="Special">Special（特殊）</option>
                        </select>
                    </div>
                    <div class="ttb-row">
                        <div class="ttb-field"><label>开始</label><input type="datetime-local" id="atk-start" /></div>
                        <div class="ttb-field"><label>结束</label><input type="datetime-local" id="atk-end" /></div>
                    </div>
                    <div class="ttb-row">
                        <div class="ttb-field"><label>编号分母</label><input type="number" min="1" step="1" id="atk-number-denominator" value="100" /></div>
                        <div class="ttb-field"><label>起始分子</label><input type="number" min="0" step="1" id="atk-number-start" value="1" /></div>
                    </div>
                    <button class="ttb-btn red" id="atk-query">查询并筛选</button>
                    <div class="ttb-msg-error" id="atk-error"></div>
                    <div class="ttb-msg-info" id="atk-info"></div>
                    <div class="ttb-result" id="atk-result">
                        <div class="ttb-card"><div class="ttb-stat-row"><span class="k">符合条件</span><span class="v" id="atk-count">0</span></div></div>
                        <div class="ttb-field">
                            <label>简单链接清单</label>
                            <textarea id="atk-copy-list" readonly placeholder="查询后将在这里生成 1/100 attacklog link 清单"></textarea>
                        </div>
                        <button class="ttb-btn" id="atk-copy-all" type="button">复制全部</button>
                        <div class="ttb-field" style="margin-top:12px;"><label>详细结果</label></div>
                        <div id="atk-list"></div>
                    </div>
                </div>
                <div class="ttb-pane" data-pane="undercut">
                    <div class="ttb-field"><label>指定物品（可选）</label>
                        <div class="ttb-select-wrap" id="uc-select-wrap">
                            <div class="ttb-select-display" id="uc-select-display">-- 全部物品（点击添加指定物品）--</div>
                            <div class="ttb-select-drop" id="uc-select-drop">
                                <input class="ttb-select-search" id="uc-select-search" placeholder="搜索..." />
                                <div class="ttb-select-list" id="uc-select-list"></div>
                            </div>
                        </div>
                        <div class="ttb-selected-items" id="uc-selected"></div>
                        <div class="ttb-field-hint">留空监听全部在售货物；Bazaar 对比 Weav3r 巴扎价，Item Market 对比 Torn 市场价</div>
                    </div>
                    <div class="ttb-field"><label>监听范围</label>
                        <div class="ttb-checks">
                            <label class="ttb-check"><input type="checkbox" id="uc-bazaar" checked /> Bazaar 货物</label>
                            <label class="ttb-check"><input type="checkbox" id="uc-itemmarket" checked /> Item Market 挂单</label>
                        </div>
                    </div>
                    <div class="ttb-field"><label>扫描间隔（秒）</label><input type="number" id="uc-interval" value="60" min="30" max="600" /></div>
                    <div class="ttb-btn-row">
                        <button class="ttb-btn green" id="uc-start">开始监听</button>
                        <button class="ttb-btn red" id="uc-stop" style="display:none">停止</button>
                    </div>
                    <div class="ttb-msg-error" id="uc-error"></div>
                    <div class="ttb-msg-info" id="uc-info"></div>
                    <div class="ttb-status" id="uc-status">
                        <p><strong id="uc-status-text">监听中</strong></p>
                        <p>下次扫描：<span id="uc-next">--</span></p>
                        <p>已扫描：<span id="uc-checks">0</span> 次 · 压价提醒：<span id="uc-alerts">0</span> 个</p>
                    </div>
                    <div id="uc-list"></div>
                </div>
                                <div class="ttb-pane" data-pane="quick">
                    <label><input type="checkbox" id="ttb-quick-enabled" /> 启用 Quick Items</label>
                    <p>点击“添加物品”，从已加载的物品分类加入收藏；点击使用或装备，↑↓调整顺序，×移除。无需 API Key。</p>
                    <p><a href="/item.php">打开物品页面</a></p>
                    <button class="ttb-btn" id="ttb-quick-add">添加物品</button><button class="ttb-btn" id="ttb-quick-refresh">刷新列表</button>
<details id="ttb-quick-picker"><summary>可收藏的物品</summary><div class="ttb-field ttb-quick-search-field"><label for="ttb-quick-search">搜索物品／RW 特效／来源</label><input type="search" id="ttb-quick-search" placeholder="名称、ID、分类、特效或帮派／个人" autocomplete="off" /></div><small id="ttb-quick-search-count" role="status"></small><div id="ttb-quick-available"></div></details>
                    <div id="ttb-quick-list"></div><div id="ttb-quick-response" role="status"></div>
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
    startTtbLanguageObserver(root);

    var fab = document.getElementById('ttb-fab');
    var panel = document.getElementById('ttb-panel');
    var savedKey = localStorage.getItem('APIKey') || GM_getValue('tornApiKey', '');
    if (savedKey) document.getElementById('ttb-api-key').value = savedKey;

    var fabPeekTimer = null;

    function revealFabPeek() {
        if (root.classList.contains('ttb-expanded')) return;
        root.classList.add('ttb-fab-reveal');
        clearTimeout(fabPeekTimer);
    }

    function hideFabPeek(delay) {
        clearTimeout(fabPeekTimer);
        if (root.classList.contains('ttb-expanded') || !root.classList.contains('ttb-fab-reveal')) return;
        fabPeekTimer = setTimeout(function() {
            root.classList.remove('ttb-fab-reveal');
        }, delay == null ? 0 : delay);
    }

    root.addEventListener('mouseenter', revealFabPeek);
    root.addEventListener('mouseleave', function() { hideFabPeek(0); });
    fab.addEventListener('touchstart', revealFabPeek, { passive: true });
    document.addEventListener('touchend', function() {
        if (!root.classList.contains('ttb-expanded')) hideFabPeek(2000);
    });

    function openToolbox() {
        root.classList.remove('ttb-fab-reveal');
        clearTimeout(fabPeekTimer);
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
        hideFabPeek(800);
    }

    function toggleToolbox() {
        if (panel.classList.contains('open')) closeToolbox();
        else openToolbox();
    }

    fab.addEventListener('click', toggleToolbox);
    document.getElementById('ttb-minimize').addEventListener('click', closeToolbox);
    document.getElementById('ttb-lang-toggle').addEventListener('click', function(e) {
        e.stopPropagation();
        setTtbLanguage(ttbLanguage === 'zhHant' ? 'zhHans' : 'zhHant');
    });
    document.getElementById('ttb-time-toggle').addEventListener('click', function(e) {
        e.stopPropagation();
        setTtbTimeMode(ttbTimeMode === 'beijing' ? 'torn' : 'beijing');
    });
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

    var apiNotice=document.createElement('p');apiNotice.className='ttb-note';apiNotice.textContent='API Key 仅保存在本地并发给 Torn 官方 API。记录查询使用 log／attacks；公司监听使用 applications；行情使用 bazaar／itemmarket／basic。Weav3r 仅接收公开物品 ID，不接收 Key。清空 Key 后点击删除可移除本地保存。';
    var clearKey=document.createElement('button');clearKey.type='button';clearKey.textContent='删除保存的 Key';clearKey.className='ttb-btn ttb-secondary';clearKey.addEventListener('click',function(){stopCompanyMonitor();stopUndercutMonitor();GM_setValue('tornApiKey','');blockedApiKeys.clear();document.getElementById('ttb-api-key').value='';});document.querySelector('.ttb-api-bar').append(apiNotice,clearKey);
    setupItemSelect('buy', buySelected, document.getElementById('buy-error'));
    setupItemSelect('sell', sellSelected, document.getElementById('sell-error'));
    loadUcSelectedItems();
    setupMultiItemSelect('uc', ucSelectedItems, document.getElementById('uc-error'));
    applyTtbLanguage();

    // ─── Buy + Mug ───
    function processPurchaseLogs(logs, targetId) {
        var out = [];
        Object.entries(logs).forEach(function(e) {
            var log = e[1], data = log.data || {};
            if (log.log !== 1103 && log.log !== 1112 && log.log !== 1220 && log.log !== 1225) return;
            (data.items || []).forEach(function(item) {
                if (Number(item.id) !== Number(targetId)) return;
                var qty = toNumber(item.qty), costEach = toNumber(data.cost_each);
                out.push({
                    id: e[0], type: (log.log === 1103 || log.log === 1112) ? 'market' : 'bazaar',
                    typeName: (log.log === 1103 || log.log === 1112) ? (log.log === 1103 ? 'Item Market (old)' : 'Item Market') : (log.log === 1220 ? 'Bazaar (old)' : 'Bazaar'),
                    timestamp: log.timestamp, qty: qty, costEach: costEach,
                    costTotal: qty * costEach, seller: data.seller, sellerId: toNumber(data.seller),
                    hasOtherItems: false
                });
            });
        });
        return out;
    }

    function registerMixedTradeSkip(stats, items, targetId) {
        if (!stats) return;
        var qty = (items || []).filter(function(i) {
            return Number(i.id) === Number(targetId);
        }).reduce(function(s, i) {
            return s + toNumber(i.qty);
        }, 0);
        if (qty <= 0) return;
        stats.trades++;
        stats.qty += qty;
    }

    function processTradeLogs(logs, targetId, skipped) {
        var groups = {};
        Object.entries(logs).forEach(function(e) {
            var log = e[1], data = log.data || {}, tid = data.parsed_trade_id;
            if (!tid) return;
            if (!groups[tid]) groups[tid] = { timestamp: log.timestamp, user: data.user, userId: toNumber(data.user_id || data.user) };
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
            if (hasOther) {
                registerMixedTradeSkip(skipped, trade.items, targetId);
                return;
            }
            trades.push({
                id: e[0], type: 'trade', typeName: 'Trade', timestamp: trade.timestamp,
                qty: qty, costEach: qty > 0 ? Math.round(trade.money / qty) : 0,
                costTotal: trade.money, seller: trade.user, sellerId: trade.userId,
                hasOtherItems: false
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

    function getBuyLogIds() {
        var ids = [];
        if (document.getElementById('buy-market').checked) ids = ids.concat([1103, 1112]);
        if (document.getElementById('buy-bazaar').checked) ids = ids.concat([1220, 1225]);
        return ids;
    }

    function isBuyTradeChecked() {
        return document.getElementById('buy-trade').checked;
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
            statRow('Trade', qtyByType(purchases, 'trade').toLocaleString() + ' 件') +
            statRow('混合 Trade（已排除）', buyTradeSkips.trades
                ? buyTradeSkips.trades + ' 笔 / ' + buyTradeSkips.qty.toLocaleString() + ' 件'
                : '0 笔');
        var list = document.getElementById('buy-list');
        list.innerHTML = '<div class="ttb-section-title">购买明细</div>';
        if (buyTradeSkips.trades) {
            var skip = document.createElement('div');
            skip.className = 'ttb-item';
            skip.innerHTML = '<h4>混合 Trade 未计入购买均价</h4><p>已排除 ' +
                buyTradeSkips.trades + ' 笔，目标物品 ' + buyTradeSkips.qty.toLocaleString() +
                ' 件，因为同一 trade 内含多种商品，无法准确分摊金额。</p>';
            list.appendChild(skip);
        }
        purchases.sort(function(a, b) { return b.timestamp - a.timestamp; }).forEach(function(p) {
            var div = document.createElement('div');
            div.className = 'ttb-item ' + p.type;
            var adjTotal = p.adjustedCostTotal != null ? p.adjustedCostTotal : p.costTotal;
            var adjEach = p.adjustedCostEach != null ? p.adjustedCostEach : p.costEach;
            var mugLine = p.matchedMugs && p.matchedMugs.length
                ? '<p class="ttb-note">匹配 Mug：' + p.matchedMugs.map(function(m) {
                    return timeHtml(m.timestamp) + ' ' + formatMoney(m.amount);
                }).join('；') + '</p>' : '';
            div.innerHTML = '<h4>' + p.typeName + ' · ' + timeHtml(p.timestamp) + '</h4>' +
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
        buyTradeSkips = { trades: 0, qty: 0 };
        var apiKey = saveApiKey();
        var buyLogIds = getBuyLogIds();
        var includeTrade = isBuyTradeChecked();
        if (!apiKey) { err.textContent = '请填写 API Key'; return; }
        if (!buySelected.id) { err.textContent = '请选择物品'; return; }
        if (!buyLogIds.length && !includeTrade) { err.textContent = '请勾选购买来源'; return; }
        var sd = document.getElementById('buy-start-date').value, ed = document.getElementById('buy-end-date').value;
        if (!sd || !ed) { err.textContent = '请选择时间范围'; return; }
        var startTs = toTimestamp(sd + 'T' + (document.getElementById('buy-start-time').value || '00:00'));
        var endTs = toTimestamp(ed + 'T' + (document.getElementById('buy-end-time').value || '23:59'));
        if (startTs >= endTs) { err.textContent = '开始时间不能晚于结束'; return; }
        btn.disabled = true; btn.textContent = '查询中...';
        try {
            var purchases = [];
            if (buyLogIds.length) {
                info.textContent = '正在获取购买记录...';
                var pLogs = await fetchAllLogs(apiKey, buyLogIds.join(','), startTs, endTs, function(pg, w, a) {
                    if (w) setRateLimitProgress(info, w, a);
                    else info.textContent = '正在获取购买记录（第 ' + pg + ' 页）...';
                });
                purchases = processPurchaseLogs(pLogs, buySelected.id);
            }
            var trades = [];
            if (includeTrade) {
                info.textContent = '正在获取交易记录...';
                var tLogs = await fetchAllLogs(apiKey, '4430,4440,4446', startTs, endTs, function(pg, w, a) {
                    if (w) setRateLimitProgress(info, w, a);
                    else info.textContent = '正在获取交易记录（第 ' + pg + ' 页）...';
                });
                trades = processTradeLogs(tLogs, buySelected.id, buyTradeSkips);
            }
            var all = purchases.concat(trades);
            if (!all.length) {
                err.textContent = buyTradeSkips.trades
                    ? '只找到混合 Trade 记录，因无法准确分摊金额，未计入购买均价'
                    : '未找到该物品的购买记录';
                info.textContent = '';
                return;
            }
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
        if (document.getElementById('sell-trade').checked) ids = ids.concat(SELL_LOG_TYPES.trade.ids);
        return ids;
    }

    function calcSellAmounts(log, item, cat) {
        var grossEach = log.data.cost_each || 0, grossTotal = grossEach * item.qty;
        var totalQty = (log.data.items || []).reduce(function(s, i) { return s + i.qty; }, 0);
        var share = totalQty > 0 ? item.qty / totalQty : 1;
        if (cat !== 'market') {
            return { grossEach: grossEach, grossTotal: grossTotal, fee: 0, netEach: grossEach, netTotal: grossTotal };
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

    function readTradeMoney(data) {
        var keys = ['money', 'amount', 'cash', 'value', 'cost', 'price', 'total', 'cost_total', 'total_cost'];
        for (var i = 0; i < keys.length; i++) {
            if (data[keys[i]] != null) return toNumber(data[keys[i]]);
        }
        return null;
    }

    function processSellTradeLogs(logs, targetId, skipped) {
        var groups = {};
        Object.entries(logs).forEach(function(e) {
            var log = e[1], data = log.data || {}, tid = data.parsed_trade_id;
            if (!tid) return;
            if (!groups[tid]) {
                groups[tid] = {
                    timestamp: log.timestamp,
                    user: data.user,
                    userId: toNumber(data.user_id || data.user)
                };
            }
            if (log.timestamp < groups[tid].timestamp) groups[tid].timestamp = log.timestamp;
            if (data.user) groups[tid].user = data.user;
            if (data.user_id || data.user) groups[tid].userId = toNumber(data.user_id || data.user);
            if (log.log === 4441) groups[tid].money = readTradeMoney(data);
            if (log.log === 4445) groups[tid].items = data.items || [];
        });

        var trades = [];
        Object.entries(groups).forEach(function(e) {
            var trade = e[1];
            if (!trade.items || trade.money == null) return;
            var targets = trade.items.filter(function(i) { return Number(i.id) === Number(targetId); });
            if (!targets.length) return;
            var qty = targets.reduce(function(s, i) { return s + toNumber(i.qty); }, 0);
            var hasOther = trade.items.some(function(i) { return Number(i.id) !== Number(targetId); });
            if (hasOther) {
                registerMixedTradeSkip(skipped, trade.items, targetId);
                return;
            }
            trades.push({
                id: e[0], type: 'trade', typeName: 'Trade', timestamp: trade.timestamp, qty: qty,
                grossEach: qty > 0 ? Math.round(trade.money / qty) : 0, grossTotal: trade.money,
                fee: 0, priceEach: qty > 0 ? Math.round(trade.money / qty) : 0, revenueTotal: trade.money,
                buyer: trade.userId || trade.user
            });
        });
        return trades;
    }

    document.getElementById('sell-query').addEventListener('click', async function() {
        var btn = this, err = document.getElementById('sell-error'), info = document.getElementById('sell-info');
        var res = document.getElementById('sell-result');
        err.textContent = ''; info.textContent = ''; res.classList.remove('show');
        sellTradeSkips = { trades: 0, qty: 0 };
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
            if (document.getElementById('sell-trade').checked) {
                sells = sells.concat(processSellTradeLogs(logs, sellSelected.id, sellTradeSkips));
            }
            if (!sells.length) {
                err.textContent = sellTradeSkips.trades
                    ? '只找到混合 Trade 记录，因无法准确分摊金额，未计入出售均价'
                    : '未找到该物品的出售记录';
                info.textContent = '';
                return;
            }
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
                statRow('Item Market', qtyByType(sells, 'market').toLocaleString() + ' 件') +
                statRow('Trade', qtyByType(sells, 'trade').toLocaleString() + ' 件') +
                statRow('混合 Trade（已排除）', sellTradeSkips.trades
                    ? sellTradeSkips.trades + ' 笔 / ' + sellTradeSkips.qty.toLocaleString() + ' 件'
                    : '0 笔');
            var list = document.getElementById('sell-list');
            list.innerHTML = '<div class="ttb-section-title">出售明细</div>';
            if (sellTradeSkips.trades) {
                var skip = document.createElement('div');
                skip.className = 'ttb-item';
                skip.innerHTML = '<h4>混合 Trade 未计入出售均价</h4><p>已排除 ' +
                    sellTradeSkips.trades + ' 笔，目标物品 ' + sellTradeSkips.qty.toLocaleString() +
                    ' 件，因为同一 trade 内含多种商品，无法准确分摊金额。</p>';
                list.appendChild(skip);
            }
            sells.sort(function(a, b) { return b.timestamp - a.timestamp; }).forEach(function(p) {
                var div = document.createElement('div');
                div.className = 'ttb-item ' + p.type;
                var price = p.type === 'market'
                    ? '挂牌 ' + formatMoney(p.grossEach) + ' × ' + p.qty + ' = ' + formatMoney(p.grossTotal) +
                      ' · 税 ' + formatMoney(p.fee) + ' · 实收 ' + formatMoney(p.revenueTotal) + '（均价 ' + formatMoney(p.priceEach) + '）'
                    : '数量 ' + p.qty + ' · 单价 ' + formatMoney(p.priceEach) + ' · 总价 ' + formatMoney(p.revenueTotal);
                div.innerHTML = '<h4>' + p.typeName + ' · ' + timeHtml(p.timestamp) + '</h4><p>' + price + '</p><p>买家ID：' + (p.buyer || '匿名') + '</p>';
                list.appendChild(div);
            });
            info.textContent = '';
            showResult(res);
        } catch (e) { err.textContent = '错误：' + e.message; }
        finally { btn.disabled = false; btn.textContent = '查询出售记录'; }
    });

    // ─── Attacks ───
    async function fetchAllAttacks(apiKey, filters, from, to, onProgress) {
        var all = [], hasMore = true, page = 0;
        while (hasMore && page < 1000) {
            page++;
            var params = new URLSearchParams();
            filters.forEach(function(f) { params.append('filters', f); });
            params.append('limit', '100'); params.append('sort', 'DESC');
            if (from) params.append('from', from); if (to) params.append('to', to);
            params.append('key', apiKey);
            var url = 'https://api.torn.com/v2/user/attacks?' + params;
            var data = await fetchJsonWithRetry(url, function(w, a) {
                if (onProgress) onProgress(page, w, a);
            });
            if (onProgress) onProgress(page);
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
            '<p>攻击者：' + escapeHtml((a.attacker?.name || '未知')) + '（ID：' + (a.attacker?.id || '未知') +
            '，派系：' + escapeHtml((a.attacker?.faction?.name || '未知')) + ' [' + (a.attacker?.faction?.id || '未知') + ']）</p>' +
            '<p>防御者：' + escapeHtml((a.defender?.name || '未知')) + '（ID：' + (a.defender?.id || '未知') +
            '，派系：' + escapeHtml((a.defender?.faction?.name || '未知')) + ' [' + (a.defender?.faction?.id || '未知') + ']）</p>' +
            '<p>开始：' + timeHtml(a.started) + ' | 结束：' + timeHtml(a.ended) + '</p>' +
            '<p>结果：' + escapeHtml((a.result || '未知')) + ' | Respect +' + (a.respect_gain || 0) + ' / -' + (a.respect_loss || 0) + '</p>' +
            '<p>Chain：' + (a.chain || 0) + ' | Warlord：' + (a.modifiers?.warlord ?? '无') + '</p>' +
            '<p>Ranked War：' + (a.is_ranked_war ? '是' : '否') + ' | Raid：' + (a.is_raid ? '是' : '否') + ' | Stealthed：' + (a.is_stealthed ? '是' : '否') + '</p>';
        return div;
    }

    function buildAttackCopyList(attacks, denominator, startNumber) {
        return attacks.map(function(a, index) {
            return (startNumber + index) + '/' + denominator + ' https://www.torn.com/page.php?sid=attackLog&ID=' + encodeURIComponent(a.code);
        }).join('\n');
    }

    document.getElementById('atk-copy-all').addEventListener('click', async function() {
        var copyList = document.getElementById('atk-copy-list');
        var info = document.getElementById('atk-info');
        if (!copyList.value) {
            info.textContent = '目前没有可复制的链接清单';
            return;
        }
        try {
            await navigator.clipboard.writeText(copyList.value);
        } catch (e) {
            copyList.focus();
            copyList.select();
            document.execCommand('copy');
        }
        info.textContent = '简单链接清单已复制';
    });

    document.getElementById('atk-query').addEventListener('click', async function() {
        var btn = this, err = document.getElementById('atk-error'), info = document.getElementById('atk-info');
        var res = document.getElementById('atk-result');
        err.textContent = ''; info.textContent = ''; res.classList.remove('show');
        var apiKey = saveApiKey();
        var factionRaw = document.getElementById('atk-faction').value.trim();
        var faction = factionRaw ? parseInt(factionRaw, 10) : null;
        var warlord = document.getElementById('atk-warlord').value.trim();
        var resultFilter = document.getElementById('atk-result-filter').value;
        var startTs = toTimestamp(document.getElementById('atk-start').value);
        var endTs = toTimestamp(document.getElementById('atk-end').value);
        var denominator = parseInt(document.getElementById('atk-number-denominator').value, 10);
        var startNumber = parseInt(document.getElementById('atk-number-start').value, 10);
        if (!apiKey) { err.textContent = '请填写 API Key'; return; }
        if (factionRaw && isNaN(faction)) { err.textContent = '请输入有效的 Faction ID'; return; }
        if (!startTs || !endTs || startTs >= endTs) { err.textContent = '请选择有效时间范围'; return; }
        if (!Number.isInteger(denominator) || denominator < 1) { err.textContent = '编号分母必须是大于 0 的整数'; return; }
        if (!Number.isInteger(startNumber) || startNumber < 0) { err.textContent = '起始分子必须是大于或等于 0 的整数'; return; }
        var wb = warlord ? parseFloat(warlord) : null;
        btn.disabled = true; btn.textContent = '查询中...';
        try {
            info.textContent = '正在获取数据...';
            var all = await fetchAllAttacks(apiKey, [document.getElementById('atk-filter').value], startTs, endTs, function(pg, w, a) {
                if (w) setRateLimitProgress(info, w, a);
                else info.textContent = '正在获取攻击数据（第 ' + pg + ' 页）...';
            });
            if (!all.length) {
                err.textContent = '未获取到任何攻击数据';
                info.textContent = '';
                return;
            }
            info.textContent = '已获取 ' + all.length + ' 条数据，正在筛选...';
            var filtered = all.filter(function(a) {
                if (faction !== null && a.defender?.faction?.id !== faction) return false;
                if (a.ended < startTs || a.ended > endTs) return false;
                if (wb !== null && a.modifiers?.warlord !== wb) return false;
                if (resultFilter && a.result !== resultFilter) return false;
                return true;
            });
            document.getElementById('atk-count').textContent = filtered.length;
            document.getElementById('atk-copy-list').value = buildAttackCopyList(filtered, denominator, startNumber);
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

    // ─── Shared monitor UI ───
    function updateMonitorFab() {
        fab.classList.toggle('monitoring', companyState.monitoring || undercutState.monitoring);
    }

    function updateApiKeyInputLock() {
        document.getElementById('ttb-api-key').disabled = companyState.monitoring || undercutState.monitoring;
    }

    // ─── Undercut monitor ───
    function setUndercutUI(on) {
        undercutState.monitoring = on;
        updateMonitorFab();
        document.getElementById('ttb-tab-undercut').classList.toggle('active-monitoring', on);
        document.getElementById('uc-start').style.display = on ? 'none' : 'block';
        document.getElementById('uc-stop').style.display = on ? 'block' : 'none';
        document.getElementById('uc-interval').disabled = on;
        document.getElementById('uc-bazaar').disabled = on;
        document.getElementById('uc-itemmarket').disabled = on;
        setUcSelectDisabled(on);
        updateApiKeyInputLock();
        var statusEl = document.getElementById('uc-status');
        statusEl.classList.toggle('show', on || undercutState.checks > 0);
        statusEl.classList.toggle('stopped', !on && undercutState.checks > 0);
        document.getElementById('uc-status-text').textContent = on ? '● 监听中' : '已停止监听';
    }

    async function fetchUserBazaar(apiKey) {
        var runId=undercutState.runId;
        var data = await fetchJsonWithRetry(
            'https://api.torn.com/v2/user/bazaar?key=' + encodeURIComponent(apiKey), null, function(){return undercutState.monitoring && undercutState.runId===runId;}
        );
        return data.bazaar || [];
    }

    async function fetchUserItemMarket(apiKey) {
        var runId=undercutState.runId;
        var all = [], offset = 0, limit = 100;
        while (true) {
            var url = 'https://api.torn.com/v2/user/itemmarket?key=' + encodeURIComponent(apiKey)
                + '&limit=' + limit + '&offset=' + offset;
            var data = await fetchJsonWithRetry(url,null,function(){return undercutState.monitoring && undercutState.runId===runId;});
            var rows = data.itemmarket || [];
            all = all.concat(rows);
            if (rows.length < limit) break;
            offset += limit;
            await sleep(API_DELAY_MS);
        }
        return all;
    }

    async function fetchMyPlayerId(apiKey) {
        var runId=undercutState.runId;
        if (undercutState.playerId) return undercutState.playerId;
        var data = await fetchJsonWithRetry(
            'https://api.torn.com/v2/user/basic?key=' + encodeURIComponent(apiKey), null, function(){return undercutState.monitoring && undercutState.runId===runId;}
        );
        var id = toNumber(data.player_id || (data.profile && data.profile.id));
        if (!id) throw new Error('无法获取玩家 ID');
        undercutState.playerId = id;
        return id;
    }

    async function fetchWeav3rBazaarLowest(itemId, myPlayerId, cache) {
        if (cache[itemId] !== undefined) return cache[itemId];
        var data = await gmFetchJson(WEAV3R_MARKETPLACE_URL + itemId + '?limit=100', 'Weav3r 巴扎 API');
        var listings = data.listings || [];
        var best = null;
        listings.forEach(function(row) {
            if (myPlayerId && toNumber(row.player_id) === myPlayerId) return;
            var price = toNumber(row.price);
            if (!price) return;
            if (!best || price < best.price) {
                best = {
                    price: price,
                    playerId: toNumber(row.player_id),
                    playerName: row.player_name || '未知'
                };
            }
        });
        cache[itemId] = best;
        return best;
    }

    async function fetchMarketLowestPrice(apiKey, itemId, cache) {
        var runId=undercutState.runId;
        if (cache[itemId] !== undefined) return cache[itemId];
        var data = await fetchJsonWithRetry(
            'https://api.torn.com/v2/market/' + itemId + '/itemmarket?key=' + encodeURIComponent(apiKey), null, function(){return undercutState.monitoring && undercutState.runId===runId;}
        );
        var listings = (data.itemmarket && data.itemmarket.listings) || [];
        var lowest = listings.length ? listings.reduce(function(min, row) {
            var price = toNumber(row.price);
            return min === null || price < min ? price : min;
        }, null) : null;
        cache[itemId] = lowest;
        return lowest;
    }

    function renderUndercutAlert(alert) {
        var lowLabel = alert.source === 'Bazaar' ? '巴扎最低' : '市场最低';
        var sellerLine = alert.undercutBy
            ? '<p>压价者：' + escapeHtml(alert.undercutBy.playerName) + '（ID：' + alert.undercutBy.playerId + '）</p>'
            : '';
        var div = document.createElement('div');
        div.className = 'ttb-item undercut';
        div.dataset.ucKey = alert.key;
        div.innerHTML = '<h4>' + escapeHtml(alert.name) + '（ID：' + alert.itemId + '）</h4>' +
            '<p>来源：' + alert.source + '</p>' +
            '<p>你的价格：' + formatMoney(alert.myPrice) + ' · ' + lowLabel + '：' + formatMoney(alert.compareLow) +
            ' · 差价：' + formatMoney(alert.myPrice - alert.compareLow) + '</p>' +
            sellerLine +
            '<p class="ttb-note">检测时间：' + timeHtml(alert.detectedAt) + '</p>';
        var list = document.getElementById('uc-list');
        var existing = list.querySelector('[data-uc-key="' + alert.key + '"]');
        if (existing) list.replaceChild(div, existing);
        else list.insertBefore(div, list.firstChild);
    }

    function removeUndercutAlert(key) {
        var el = document.querySelector('#uc-list [data-uc-key="' + key + '"]');
        if (el) el.remove();
    }

    async function ucCheck() {
        var runId=undercutState.runId;
        if(!undercutState.monitoring || undercutState.inFlight)return;
        undercutState.inFlight=true;
        try {
        var apiKey = getApiKey();
        if (!apiKey) { stopUndercutMonitor(); document.getElementById('uc-error').textContent = 'API Key 不能为空'; return; }
        var watchBazaar = document.getElementById('uc-bazaar').checked;
        var watchItemMarket = document.getElementById('uc-itemmarket').checked;
        if (!watchBazaar && !watchItemMarket) {
            stopUndercutMonitor();
            document.getElementById('uc-error').textContent = '请至少选择一种监听范围';
            return;
        }
        try {
            document.getElementById('uc-error').textContent = '';
            undercutState.checks++;
            document.getElementById('uc-checks').textContent = undercutState.checks;
            var info = document.getElementById('uc-info');
            info.textContent = '正在获取你的货物...';
            var myPlayerId = watchBazaar ? await fetchMyPlayerId(apiKey) : null;
                if(!undercutState.monitoring || undercutState.runId!==runId)return;
            var listings = [];
            if (watchItemMarket) {
                var imRows = await fetchUserItemMarket(apiKey);
                if(!undercutState.monitoring || undercutState.runId!==runId)return;
                imRows.forEach(function(row) {
                    var item = row.item || {};
                    var itemId = item.id || item.ID;
                    var price = toNumber(row.price);
                    listings.push({
                        key: 'im-' + row.id,
                        itemId: itemId,
                        name: item.name || item.title || ('Item #' + (itemId || row.id)),
                        myPrice: price,
                        source: 'Item Market',
                        kind: 'im'
                    });
                });
            }
            if (watchBazaar) {
                var bazaar = await fetchUserBazaar(apiKey);
                if(!undercutState.monitoring || undercutState.runId!==runId)return;
                bazaar.forEach(function(row) {
                    var itemId = row.ID || row.id;
                    listings.push({
                        key: 'bazaar-' + itemId + '-' + toNumber(row.price),
                        itemId: itemId,
                        name: row.name || ('Item #' + itemId),
                        myPrice: toNumber(row.price),
                        source: 'Bazaar',
                        kind: 'bazaar'
                    });
                });
            }
            if (!listings.length) {
                info.textContent = ucSelectedItems.size
                    ? '指定物品当前没有在售货物'
                    : '当前没有在售货物';
                undercutState.activeKeys.forEach(function(key) { removeUndercutAlert(key); });
                undercutState.activeKeys.clear();
                return;
            }
            if (ucSelectedItems.size) {
                listings = listings.filter(function(entry) {
                    return ucSelectedItems.has(Number(entry.itemId));
                });
                if (!listings.length) {
                    info.textContent = '指定物品当前没有在售货物';
                    undercutState.activeKeys.forEach(function(key) { removeUndercutAlert(key); });
                    undercutState.activeKeys.clear();
                    return;
                }
            }
            var imPriceCache = {};
            var bazaarPriceCache = {};
            var currentUndercuts = new Set();
            var newAlerts = [];
            for (var i = 0; i < listings.length; i++) {
                if(!undercutState.monitoring || undercutState.runId!==runId)return;
                var entry = listings[i];
                if (!entry.itemId) continue;
                info.textContent = '正在扫描' + (entry.kind === 'bazaar' ? '巴扎' : '市场') + '价格（' + (i + 1) + '/' + listings.length + '）...';
                var compareLow = null;
                var undercutBy = null;
                if (entry.kind === 'bazaar') {
                    var bazaarLow = await fetchWeav3rBazaarLowest(entry.itemId, myPlayerId, bazaarPriceCache);
                if(!undercutState.monitoring || undercutState.runId!==runId)return;
                    if (bazaarLow) {
                        compareLow = bazaarLow.price;
                        undercutBy = { playerId: bazaarLow.playerId, playerName: bazaarLow.playerName };
                    }
                } else {
                    compareLow = await fetchMarketLowestPrice(apiKey, entry.itemId, imPriceCache);
                if(!undercutState.monitoring || undercutState.runId!==runId)return;
                }
                var undercut = compareLow !== null && compareLow < entry.myPrice;
                if (undercut) {
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
                    if (!undercutState.activeKeys.has(entry.key)) newAlerts.push(alert);
                    renderUndercutAlert(alert);
                }
                if (i < listings.length - 1) await sleep(API_DELAY_MS);
            }
            undercutState.activeKeys.forEach(function(key) {
                if (!currentUndercuts.has(key)) {
                    removeUndercutAlert(key);
                }
            });
            if(!undercutState.monitoring || undercutState.runId!==runId)return;
            undercutState.activeKeys = currentUndercuts;
            if (newAlerts.length) {
                undercutState.alerts += newAlerts.length;
                document.getElementById('uc-alerts').textContent = undercutState.alerts;
                newAlerts.forEach(function(alert) {
                    var notifyText;
                    if (alert.source === 'Bazaar' && alert.undercutBy) {
                        notifyText = alert.name + '：你的 ' + formatMoney(alert.myPrice) + ' 被 '
                            + alert.undercutBy.playerName + '（ID ' + alert.undercutBy.playerId + '）'
                            + ' 压至 ' + formatMoney(alert.compareLow);
                    } else {
                        var lowLabel = alert.source === 'Bazaar' ? '巴扎最低' : '市场最低';
                        notifyText = alert.name + '：你的 ' + formatMoney(alert.myPrice) + ' 已被压至 '
                            + lowLabel + ' ' + formatMoney(alert.compareLow);
                    }
                    GM_notification({
                        title: 'Torn 压价提醒',
                        text: notifyText,
                        timeout: 15000,
                        onclick: function() { window.focus(); }
                    });
                });
            }
            info.textContent = currentUndercuts.size
                ? '发现 ' + currentUndercuts.size + ' 个货物被压价'
                : '所有货物均为对应渠道最低价';
        } catch (e) {
            document.getElementById('uc-error').textContent = '扫描失败：' + e.message;
            if(!e.cancelled)document.getElementById('uc-info').textContent = '';
        }
        } finally {undercutState.inFlight=false;}
    }

    function stopUndercutMonitor() {
        if (undercutState.timer) clearTimeout(undercutState.timer);
        undercutState.runId=(undercutState.runId || 0)+1;
        undercutState.timer = null;
        setUndercutUI(false);
        document.getElementById('uc-next').textContent = '--';
        document.getElementById('uc-info').textContent = '';
    }

    document.getElementById('uc-start').addEventListener('click', async function() {
        if(undercutState.inFlight){document.getElementById('uc-error').textContent='上一任务尚未结束，请稍后手动启动';return;}
        var apiKey = saveApiKey();
        var interval = parseInt(document.getElementById('uc-interval').value, 10) || 60;
        if (!apiKey) { document.getElementById('uc-error').textContent = '请填写 API Key'; return; }
        if (interval < 30) { document.getElementById('uc-error').textContent = '间隔不能小于 30 秒'; return; }
        if (!document.getElementById('uc-bazaar').checked && !document.getElementById('uc-itemmarket').checked) {
            document.getElementById('uc-error').textContent = '请至少选择一种监听范围';
            return;
        }
        setUndercutUI(true);
        undercutState.playerId = null;
        document.getElementById('uc-error').textContent = '';
        var runId=undercutState.runId=(undercutState.runId || 0)+1;
        await ucCheck();
        async function tick(){
            if(!undercutState.monitoring || undercutState.runId!==runId || undercutState.inFlight)return;
            await ucCheck();schedule();
        }
        function schedule(){if(undercutState.monitoring && undercutState.runId===runId){undercutState.timer=setTimeout(tick,interval*1000);document.getElementById('uc-next').innerHTML=timeHtml(Math.floor(Date.now()/1000)+interval);}}
        schedule();
    });

    document.getElementById('uc-stop').addEventListener('click', stopUndercutMonitor);

    // ─── Company monitor ───
    function setMonitoringUI(on) {
        companyState.monitoring = on;
        updateMonitorFab();
        document.getElementById('ttb-tab-company').classList.toggle('active-monitoring', on);
        document.getElementById('co-start').style.display = on ? 'none' : 'block';
        document.getElementById('co-stop').style.display = on ? 'block' : 'none';
        document.getElementById('co-interval').disabled = on;
        updateApiKeyInputLock();
        var statusEl = document.getElementById('co-status');
        statusEl.classList.toggle('show', on || companyState.checks > 0);
        statusEl.classList.toggle('stopped', !on && companyState.checks > 0);
        document.getElementById('co-status-text').textContent = on ? '● 监听中' : '已停止监听';
    }

    function renderCoApp(app, id) {
        var div = document.createElement('div');
        div.className = 'ttb-item company';
        div.innerHTML = '<h4>新申请 #' + id + '</h4>' +
            '<p>申请人：' + escapeHtml(app.name || '未知') + ' (ID ' + (app.userID || '未知') + ') · Lv ' + (app.level || '未知') + '</p>' +
            '<p>INT ' + (app.stats?.intelligence?.toLocaleString() || '?') + ' · END ' + (app.stats?.endurance?.toLocaleString() || '?') + ' · MAN ' + (app.stats?.manual_labor?.toLocaleString() || '?') + '</p>' +
            '<p>状态：' + escapeHtml(app.status || '未知') + '</p>' +
            '<p>过期：' + timeHtml(app.expires) + '</p>' +
            '<p>消息：' + escapeHtml(app.message || '无消息') + '</p>';
        document.getElementById('co-list').insertBefore(div, document.getElementById('co-list').firstChild);
    }

    async function coCheck() {
        var runId=companyState.runId;
        if(!companyState.monitoring || companyState.inFlight)return;
        companyState.inFlight=true;
        try {
        var apiKey = getApiKey();
        if (!apiKey) { stopCompanyMonitor(); document.getElementById('co-error').textContent = 'API Key 不能为空'; return; }
        try {
            document.getElementById('co-error').textContent = '';
            companyState.checks++;
            document.getElementById('co-checks').textContent = companyState.checks;
            var data = await fetchJsonWithRetry(
                'https://api.torn.com/company/?selections=applications&key=' + encodeURIComponent(apiKey),null,function(){return companyState.monitoring && companyState.runId===runId;}
            );
            if(!companyState.monitoring || companyState.runId!==runId)return;
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
        } catch (e) { if(!e.cancelled)document.getElementById('co-error').textContent = '检查失败：' + e.message; }
        } finally {companyState.inFlight=false;}
    }

    function stopCompanyMonitor() {
        if (companyState.timer) clearTimeout(companyState.timer);
        companyState.runId=(companyState.runId || 0)+1;
        companyState.timer = null;
        setMonitoringUI(false);
        document.getElementById('co-next').textContent = '--';
    }

    document.getElementById('co-start').addEventListener('click', async function() {
        if(companyState.inFlight){document.getElementById('co-error').textContent='上一任务尚未结束，请稍后手动启动';return;}
        var apiKey = saveApiKey();
        var interval = parseInt(document.getElementById('co-interval').value) || 30;
        if (!apiKey) { document.getElementById('co-error').textContent = '请填写 API Key'; return; }
        if (interval < 10) { document.getElementById('co-error').textContent = '间隔不能小于 10 秒'; return; }
        setMonitoringUI(true);
        document.getElementById('co-error').textContent = '';
        var runId=companyState.runId=(companyState.runId || 0)+1;
        await coCheck();
        async function tick(){
            if(!companyState.monitoring || companyState.runId!==runId || companyState.inFlight)return;
            await coCheck();schedule();
        }
        function schedule(){if(companyState.monitoring && companyState.runId===runId){companyState.timer=setTimeout(tick,interval*1000);document.getElementById('co-next').innerHTML=timeHtml(Math.floor(Date.now()/1000)+interval);}}
        schedule();
    });

    document.getElementById('co-stop').addEventListener('click', stopCompanyMonitor);
    window.addEventListener('beforeunload', function() {
        stopCompanyMonitor();
        stopUndercutMonitor();
    });

    // BEGIN TOOLBOX ITEM MODULES

// Quick Items adapter, based on the supplied NST 0.0.2 item UI and request shapes.
(function initQuickItems() {
'use strict';
const KEY = 'ttbQuickItems';
const ENABLED = 'ttbQuickItemsEnabled';
const categories = new Set(['Medical', 'Drug', 'Energy Drink', 'Alcohol', 'Candy', 'Booster', 'Supply Pack', 'Primary', 'Secondary', 'Melee', 'Temporary']);
const equipment = new Set(['Primary', 'Secondary', 'Melee', 'Temporary']);
const isWeapon = item => ['Primary','Secondary','Melee'].includes(item.category);
const list = document.getElementById('ttb-quick-list');
const response = document.getElementById('ttb-quick-response');
const enabled = document.getElementById('ttb-quick-enabled');
const availableList = document.getElementById('ttb-quick-available');
const search = document.getElementById('ttb-quick-search');
const searchCount = document.getElementById('ttb-quick-search-count');
let saved = GM_getValue(KEY, []);
let items = Array.isArray(saved) ? saved.filter(x => x && /^\d+$/.test(String(x.id)) && categories.has(x.category)).map(x => ({id: String(x.id), name: cleanName(String(x.name)), category: x.category})) : [];
let busy = false, timer, observer, pageBox, availableSignature = '', displaySignature = '';
const inventoryCache = new Map();
const fetchedInventory = new Map();
const equipmentState = new Map();
const equipmentRevision = new Map();
const queryDiagnostics = new Map();
function sourceDiagnostic(item) {
    const fields = node => Object.fromEntries(Array.from(node.attributes || []).filter(attr=>/^(?:class|data-(?:id|item|category|equipped|row-?key|source|inventory-source|faction.*|loan.*|armory.*))$/i.test(attr.name)).map(attr=>[attr.name,attr.value.slice(0,200)]));
    return JSON.stringify({version:'1.6.29',item:{id:item.id,name:item.name,category:item.category},rows:rows(item.id,item.category).slice(0,10).map(row=>({attributes:fields(row),instanceId:instanceOf(row),markers:Array.from(row.querySelectorAll('[data-id], [data-source], [data-faction-id], [data-factionid], [data-faction-item], [data-factionitem], [class*="loan"], [class*="armory"]')).slice(0,20).map(fields),loanLabels:Array.from(row.querySelectorAll('[title],[aria-label]')).map(el=>el.getAttribute('title') || el.getAttribute('aria-label')).filter(text=>/loan|borrow|faction|armory|借用|帮派|幫派/i.test(text)).map(text=>plainText(text).slice(0,200))})),query:queryDiagnostics.get(item.id) || '本次页面尚未手动查询',resolved:fetchedInventory.get(item.id)?.sources},null,2);
}
function showSourceDiagnostic(item) {
    message(item.name+' 的来源尚未识别，请复制下方诊断文字用于核对。');
    const field=document.createElement('textarea');field.readOnly=true;field.setAttribute('aria-label','物品来源诊断');field.style.cssText='width:100%;height:160px;box-sizing:border-box;font:12px/1.4 monospace;';field.textContent=sourceDiagnostic(item);
    response.append(field);syncPageResponse();
}
function showLoadoutDiagnostic() {
    const current=document.querySelector('.equipped-items-wrap');
    const inspect=(node,depth=0)=>{
        if(depth>12 || node.matches('script,style,input,select,textarea,option')) return null;
        const attributes=Object.fromEntries(Array.from(node.attributes).filter(attr=>/^(?:id|class|role|title|aria-label|alt|data-(?:item|category|type|slot|equip-position|weapon-type|id|armoryid))$/i.test(attr.name)).map(attr=>[attr.name,attr.value.slice(0,200)]));
        if(node.tagName==='IMG') { try { attributes.imagePath=new URL(node.getAttribute('src'),location.origin).pathname; } catch {} }
        return {tag:node.tagName.toLowerCase(),attributes,children:Array.from(node.children).slice(0,40).map(child=>inspect(child,depth+1)).filter(Boolean)};
    };
    message('装备栏诊断仅读取当前页面结构，请复制下方文字用于核对。');
    const field=document.createElement('textarea');field.readOnly=true;field.setAttribute('aria-label','装备栏结构诊断');field.style.cssText='width:100%;height:220px;box-sizing:border-box;font:12px/1.4 monospace;';field.textContent=JSON.stringify({version:'1.6.29',loadout:current ? inspect(current):null},null,2);response.append(field);syncPageResponse();
}
const INSTANCE_KEY = 'ttbQuickInstancesV1';
const instanceTTL = 7 * 24 * 60 * 60 * 1000;
const savedInstances = GM_getValue(INSTANCE_KEY, []);
if (Array.isArray(savedInstances)) for (const record of savedInstances.slice(-300)) {
    if (!record || !/^\d+$/.test(String(record.id)) || !equipment.has(record.category) || !Array.isArray(record.sources) || !Number.isFinite(record.savedAt) || Date.now()-record.savedAt>instanceTTL || record.savedAt>Date.now()) continue;
    const sources=record.sources.filter(entry=>entry && /^\d+$/.test(String(entry.instanceId)) && ['faction','own','unknown'].includes(entry.source)).map(entry=>({...entry,instanceId:String(entry.instanceId),equipped:false,equippedKnown:false}));
    if(sources.length) fetchedInventory.set(String(record.id),{...record,id:String(record.id),sources,restored:true});
}
const CACHE_KEY = 'ttbQuickInventorySnapshotV1';
let cacheSignature = '';
const localCache = new Map();
const storedCache = GM_getValue(CACHE_KEY, []);
if (Array.isArray(storedCache)) storedCache.slice(0, 300).forEach(item => {
    if (!item || !/^\d+$/.test(String(item.id)) || !categories.has(item.category) || !Array.isArray(item.sources)) return;
    localCache.set(String(item.id), {id:String(item.id), name:cleanName(String(item.name)), category:item.category, sources:item.sources.filter(entry => entry && ['faction','own','unknown'].includes(entry.source)).map(entry=>({source:entry.source, quantity:typeof entry.quantity==='number' && Number.isFinite(entry.quantity) && entry.quantity>=0 ? entry.quantity : null}))});
});
let loadingInventory = false;
enabled.checked = GM_getValue(ENABLED, true);

function rows(id, category) {
    return Array.from(document.querySelectorAll('li[data-item][data-category]')).filter(row => row.dataset.item === String(id) && (!category || row.dataset.category === category) && isInventoryRow(row));
}
function isInventoryRow(row) {
    return categories.has(row.dataset.category) && !Array.from(row.querySelectorAll('li[data-item][data-category]')).some(child=>child.dataset.item===row.dataset.item);
}
function instanceOf(row) {
    return row?.getAttribute('data-armoryid') || row?.getAttribute('data-armory-id') || row?.dataset.id || row?.querySelector('.left.equipped[data-id], .option-equip[data-id], .option-unequip[data-id], .equip[data-id], .unequip[data-id], .equip [data-id], .unequip [data-id]')?.dataset.id || (row?.getAttribute('data-rowkey') || '').match(/^u(\d+)$/)?.[1];
}
// Same row-key convention as both supplied versions of the booster assistant.
function sourceOf(row) {
    const match = (row?.getAttribute('data-rowkey') || row?.getAttribute('data-row-key') || '').match(/f(\d+)$/);
    if (match) return Number(match[1]) > 0 ? 'faction' : 'own';
    const explicit = (row?.dataset.source || row?.dataset.inventorySource || '').toLowerCase();
    if (['faction', 'armory', 'faction-armory'].includes(explicit)) return 'faction';
    if (['own', 'personal', 'inventory'].includes(explicit)) return 'own';
    const factionId = row?.getAttribute('data-faction-id') || row?.getAttribute('data-factionid');
    if (factionId !== null && factionId !== undefined && /^\d+$/.test(factionId)) return Number(factionId) > 0 ? 'faction' : 'own';
    const factionFlag = row?.getAttribute('data-faction-item') || row?.getAttribute('data-factionitem');
    if (['true', '1'].includes(factionFlag)) return 'faction';
    if (['false', '0'].includes(factionFlag)) return 'own';
    // A loan marker on this instance is stronger evidence than a previous cached source.
    if (row?.querySelector('.faction-loaned, .loaned, [data-source="faction"]')) return 'faction';
    const marked=row?.querySelector('[data-faction-id], [data-factionid], [data-faction-item], [data-factionitem]');
    if(marked) {
        const id=marked.getAttribute('data-faction-id') ?? marked.getAttribute('data-factionid');
        if(id!==null && /^\d+$/.test(id)) return Number(id)>0 ? 'faction':'own';
        const flag=marked.getAttribute('data-faction-item') ?? marked.getAttribute('data-factionitem');
        if(['true','1'].includes(flag)) return 'faction';
        if(['false','0'].includes(flag)) return 'own';
    }
    const labels = Array.from(row?.querySelectorAll('[title], [aria-label], img[alt]') || []).map(el => [el.getAttribute('title'), el.getAttribute('aria-label'), el.getAttribute('alt')].join(' ')).join(' ');
    const instance=instanceOf(row);
    const actionFor=selector=>Array.from(row?.querySelectorAll(selector) || []).some(action=>instance && action.dataset.id===instance);
    if(actionFor('.left.return[data-id]') || /return\b[^\n]*\bto faction/i.test(labels)) return 'faction';
    // Unique weapons use u<instance> for both sources. Personal send/dump actions,
    // rather than the row key or armory ID alone, distinguish an owned weapon.
    const ownAction=selector=>Array.from(row?.querySelectorAll(selector) || []).some(action=>action.dataset.id===instance || (row.dataset.category==='Temporary' && action.dataset.id===row.dataset.item));
    if(equipment.has(row?.dataset.category) && ownAction('.left.send[data-id]') && ownAction('.left.dump[data-id]')) return 'own';
    if (/loaned (?:from|by)|borrowed from|faction (?:armory|loan)|帮派借用|幫派借用/i.test(labels)) return 'faction';
    if (row?.closest('[data-inventory-source="personal"], .personal-items, #personal-items')) return 'own';
    const metadata = fetchedInventory.get(row?.dataset.item);
    if (metadata) {
        const rowKey = row?.getAttribute('data-rowkey') || row?.getAttribute('data-row-key');
        const instanceId = instanceOf(row);
        const exact = instanceId ? metadata.sources.find(entry => String(entry.instanceId) === instanceId) : metadata.sources.find(entry => rowKey && entry.rowKey === rowKey);
        if (exact) return exact.source;
    }
    return 'unknown';
}
function itemName(row, id) {
    const imageName = row.querySelector('img.torn-item[alt]')?.getAttribute('alt')?.trim();
    if (imageName) return imageName;
    const el = row.querySelector('.name')?.cloneNode(true);
    el?.querySelectorAll('.bonuses, .bonus, .weapon-bonuses, .stats, .damage, .accuracy, .quality, .price, .qty, .tt-item-price, .tt-ignore, .tt-item-id, .tt-item-stats, .tt-item-quality').forEach(node => node.remove());
    return (el?.textContent || 'Item ' + id).replace(/\s*\[\d+\][\s\S]*$/, '').replace(/\s+\d+(?:\.\d+)?\s*%?[\s\S]*$/, '').trim();
}
function quantityOf(row) {
    const raw = row.dataset.quantity || row.dataset.qty || row.querySelector('.qty, .quantity')?.textContent || '';
    const match = raw.replace(/,/g, '').match(/(?:x\s*)?(\d+)/i);
    return match ? Number(match[1]) : null;
}
function refreshInventoryCache() {
    if (!activePage()) return;
    const groups = new Map();
    document.querySelectorAll('li[data-item][data-category]').forEach(row => {
        if(!isInventoryRow(row)) return;
        const id = row.dataset.item, category = row.dataset.category;
        if (!/^\d+$/.test(id) || !categories.has(category)) return;
        if (!groups.has(id)) groups.set(id, {id, category, name: itemName(row, id), sources: []});
        groups.get(id).sources.push({source: sourceOf(row), quantity: quantityOf(row)});
    });
    const loaded = document.querySelector('#categoriesList .ui-tabs-active[data-type]')?.dataset.type;
    // A successfully loaded category replaces its previous snapshot. Other categories stay available for display.
    if (groups.size && loaded) for (const [id, item] of inventoryCache) if (item.category === loaded && !groups.has(id)) inventoryCache.delete(id);
    for (const [id, item] of groups) inventoryCache.set(id, item);
    for (const [id,item] of groups) {
        if(!equipment.has(item.category)) continue;
        const sources=rows(id,item.category).map(row=>({source:sourceOf(row),quantity:quantityOf(row),instanceId:instanceOf(row),rowKey:row.dataset.rowkey || row.getAttribute('data-row-key'),equipped:row.dataset.equipped==='true' || Boolean(row.querySelector('.option-unequip,.icon-h.unequip')),equippedKnown:true,canEquip:!row.querySelector('.option-equip[disabled], .option-equip[aria-disabled="true"]')})).filter(entry=>/^\d+$/.test(String(entry.instanceId)));
        if(sources.length) fetchedInventory.set(id,{...item,sources,savedAt:Date.now()});
    }
    persistInstances();
    persistInventory(groups);
}
function persistInstances() {
    const records=[...fetchedInventory.values()].filter(record=>record.savedAt && Date.now()-record.savedAt<=instanceTTL).slice(-300).map(record=>({...record,sources:record.sources.map(({source,quantity,instanceId,rowKey,canEquip})=>({source,quantity,instanceId,rowKey,canEquip}))}));
    const signature=JSON.stringify(records);
    if(signature!==persistInstances.signature) { persistInstances.signature=signature; GM_setValue(INSTANCE_KEY,records); }
}
function persistInventory(records) {
    for (const [id, item] of records) {
        let sources = item.sources.map(entry=>({source:entry.source, quantity:entry.quantity}));
        const previous = localCache.get(id);
        const sourceSet = entries=>[...new Set(entries.map(entry=>entry.source))].sort().join(',');
        // Rows without a quantity do not erase the last known count for the same sources.
        if (sources.length && sources.every(entry=>entry.quantity===null) && previous && sourceSet(sources)===sourceSet(previous.sources)) sources=previous.sources;
        localCache.set(id, {id, name:item.name, category:item.category, sources});
    }
    const snapshots = [...localCache.values()].slice(-300);
    const signature = JSON.stringify(snapshots);
    if (signature !== cacheSignature) { cacheSignature = signature; GM_setValue(CACHE_KEY, snapshots); }
}
function sourceName(source) { return {faction: '帮派', own: '个人', unknown: '来源未知'}[source]; }
function cleanName(value) {
    return value.replace(/\s*\[\d+\][\s\S]*$/, '').replace(/\s+\d+(?:\.\d+)?\s*%?[\s\S]*$/, '').trim();
}
function plainText(value) {
    const doc = new DOMParser().parseFromString(String(value || ''), 'text/html');
    doc.querySelectorAll('script,style').forEach(node => node.remove());
    return doc.body.textContent.replace(/\s+/g, ' ').trim();
}
function weaponEffects(item, itemRows=rows(item.id, item.category)) {
    if (!['Primary', 'Secondary', 'Melee'].includes(item.category)) return [];
    const effects = new Map();
    itemRows.forEach(row => {
        row.querySelectorAll('.bonuses, .bonus, .weapon-bonuses, [data-bonus], [data-bonus-name]').forEach(group => {
            const detailed = Array.from(group.querySelectorAll('[title], [aria-label], img[alt], [data-bonus], [data-bonus-name]'));
            const nodes = detailed.length ? detailed : [group];
            nodes.forEach(node => {
                const name = node.getAttribute('data-bonus-name');
                const value = node.getAttribute('data-bonus');
                const text = plainText(node.getAttribute('title') || node.getAttribute('aria-label') || (name ? name + (value ? ' ' + value : '') : value) || node.getAttribute('alt') || node.textContent);
                // Torn and other scripts also put damage/accuracy/price inside .bonuses.
                // A real effect has a word/name; numeric stats and currency alone are not RW effects.
                if (!text || !/[a-z]{3,}|[\u3400-\u9fff]/i.test(text) || /^(?:bonus|bonus icon|weapon bonus|rw|damage|accuracy|quality|value|price)\b[\s\d.%:$,]*$/i.test(text)) return;
                const source = sourceOf(row);
                effects.set(source + ':' + text, {source, text});
            });
        });
    });
    return [...effects.values()];
}
const BONUS_KEY='ttbWeaponBonusCacheV1';
const bonusCache=new Map();
const storedBonuses=GM_getValue(BONUS_KEY,[]);
if(Array.isArray(storedBonuses))for(const record of storedBonuses.slice(-300)){
    if(!record || !/^\d+$/.test(String(record.itemId)) || !/^\d+$/.test(String(record.instanceId)) || !Array.isArray(record.effects))continue;
    if(!['Primary','Secondary','Melee'].includes(record.category))continue;
    bonusCache.set(String(record.instanceId),{itemId:String(record.itemId),instanceId:String(record.instanceId),category:record.category,source:['own','faction','unknown'].includes(record.source)?record.source:'unknown',effects:record.effects.filter(text=>typeof text==='string').slice(0,12).map(text=>text.slice(0,500))});
}
function storeWeaponBonus(record){
    if(!/^\d+$/.test(String(record.instanceId)))return;
    const previous=bonusCache.get(record.instanceId);
    if(JSON.stringify(previous)===JSON.stringify(record))return;
    bonusCache.delete(record.instanceId);bonusCache.set(record.instanceId,record);
    while(bonusCache.size>300)bonusCache.delete(bonusCache.keys().next().value);
    GM_setValue(BONUS_KEY,Array.from(bonusCache.values()));
}
function cacheVisibleWeaponBonuses(){
    if(!activePage())return;
    document.querySelectorAll('li[data-item][data-category]').forEach(row=>{
        const item={id:row.dataset.item,category:row.dataset.category},instanceId=instanceOf(row);
        if(!isInventoryRow(row)||!isWeapon(item)||!instanceId)return;
        const effects=weaponEffects(item,[row]).map(effect=>effect.text).slice(0,12);
        // An unexpanded/unloaded row must not erase previous details.
        if(!effects.length && !row.querySelector('.bonuses [data-bonusid], .weapon-bonuses [data-bonus], [data-bonus-name]'))return;
        storeWeaponBonus({itemId:item.id,instanceId:String(instanceId),category:item.category,source:sourceOf(row),effects});
    });
}
function quickBonusTitle(item) {
    if(!isWeapon(item)||!activePage())return '';
    const loaded=rows(item.id,item.category),target=modTarget(item);
    const exact=target?.instanceId ? loaded.filter(row=>String(instanceOf(row))===String(target.instanceId)):[];
    const candidates=target?.instanceId ? exact:loaded;
    const sections=candidates.map(row=>{
        const effects=weaponEffects(item,[row]);
        if(!effects.length)return '';
        return sourceName(sourceOf(row))+(instanceOf(row)?' ['+instanceOf(row)+']':'')+'\n'+effects.map(effect=>effect.text).join('\n');
    }).filter(Boolean);
    const review=document.querySelector('.equipped-items-wrap [class*="itemReviewContainer___"]');
    const img=review?.querySelector('img[src*="/items/"]');
    if(!sections.length && img && new URL(img.src,location.origin).pathname.match(/\/items\/(\d+)\//)?.[1]===item.id){
        const effects=Array.from(review.querySelectorAll('[aria-label]')).map(node=>node.getAttribute('aria-label')).filter(text=>/bonus:/i.test(text));
        if(effects.length){
            sections.push(effects.join('\n'));
            if(target?.instanceId)storeWeaponBonus({itemId:item.id,instanceId:String(target.instanceId),category:item.category,source:target.source || bonusCache.get(String(target.instanceId))?.source || 'unknown',effects:effects.slice(0,12)});
        }
    }
    if(sections.length)return 'Bonus\n'+sections.join('\n\n');
    const cached=Array.from(bonusCache.values()).filter(record=>record.itemId===item.id && record.category===item.category && (!target?.instanceId || record.instanceId===String(target.instanceId)));
    return cached.length ? 'Bonus（上次页面缓存）\n'+cached.map(record=>sourceName(record.source)+' ['+record.instanceId+']\n'+(record.effects.length?record.effects.join('\n'):'无 Bonus')).join('\n\n'):'';
}
function equipButton(row) {
    return Array.from(row.querySelectorAll('button.option-equip, span.icon-h.equip button, [role="button"].equip')).find(btn => !btn.disabled && btn.getAttribute('aria-disabled') !== 'true');
}
function preferredRow(available) {
    return ['faction', 'own', 'unknown'].map(source => available.find(row => sourceOf(row) === source && equipButton(row))).find(Boolean);
}
function sourceStatus(item) {
    if (equipment.has(item.category) && equipmentState.has(item.category)) {
        const equipped = equipmentState.get(item.category);
        if (equipped?.id === item.id) return {text:'已装备（' + sourceName(equipped.source) + '） · 再次点击卸下', source:equipped.source};
    }
    const available = activePage() ? rows(item.id, item.category):[];
    if (!available.length) {
        const cached = fetchedInventory.get(item.id) || inventoryCache.get(item.id) || localCache.get(item.id);
        if (cached) {
            const prefix = fetchedInventory.has(item.id) ? (cached.restored ? '实例缓存：':isWeapon(item) ? '来源：':'查询库存：') : inventoryCache.has(item.id) ? '上次加载：' : '本地缓存：';
            const sources = new Set(cached.sources.map(entry=>entry.source));
            return {text:prefix + (cached.sources.length ? sourceInventory(cached.sources,item.category) : '无匹配物品') + (fetchedInventory.has(item.id) ? ' · 可点击切换' : isWeapon(item) ? ' · 点击刷新来源':' · 点击查询库存'), source:sources.size===1 ? cached.sources[0].source : 'unknown'};
        }
        return {text: (loadingInventory ? '正在查询 ' : '未加载 ') + item.category + (isWeapon(item) ? ' 来源，点击刷新':' 库存，点击查询'), source: 'unknown'};
    }
    const equipped = !equipmentState.has(item.category) && available.find(row => row.dataset.equipped === 'true');
    if (equipment.has(item.category) && equipped) return {text: '已装备（' + sourceName(sourceOf(equipped)) + '） · 再次点击卸下', source: sourceOf(equipped)};
    const liveEntries = available.map(row => ({source: sourceOf(row), quantity: quantityOf(row)}));
    const queried = fetchedInventory.get(item.id);
    const inventory = sourceInventory(liveEntries.every(entry => entry.quantity === null) && queried?.sources.length ? queried.sources : liveEntries,item.category);
    if (!equipment.has(item.category)) return {text: '库存：' + inventory + '；使用由 Torn 处理', source: 'unknown'};
    const preferred = preferredRow(available);
    return {text: (isWeapon(item) ? '来源：':'库存：') + inventory + (preferred ? ' · 优先' + sourceName(sourceOf(preferred)) : ' · 暂无可装备按钮'), source: preferred ? sourceOf(preferred) : 'unknown'};
}
function sourceInventory(entries, category) {
    return ['faction', 'own', 'unknown'].filter(source => entries.some(entry => entry.source === source)).map(source => {
        const matching = entries.filter(entry => entry.source === source);
        const qty = matching.every(entry => entry.quantity !== null) ? matching.reduce((sum, entry) => sum + entry.quantity, 0) : null;
        return sourceName(source) + (!['Primary','Secondary','Melee'].includes(category) && qty !== null ? ' ×' + qty : '');
    }).join(' / ');
}
function save() { GM_setValue(KEY, items); render(); renderAvailable(); renderPageQuickButtons(); }
function parseInventory(item, data, revision) {
    const safeEntry=entry=>({keys:Object.keys(entry),fields:Object.fromEntries(Object.entries(entry).filter(([key,value])=>/^(?:ID|itemID|Qty|rowKey|rowkey|faction.*|source|inventorySource|loan.*|armory.*)$/i.test(key) && ['string','number','boolean'].includes(typeof value)).map(([key,value])=>[key,typeof value==='string' ? value.slice(0,200):value]))});
    queryDiagnostics.set(item.id,{format:Array.isArray(data.list) ? 'list':typeof data.html==='string' ? 'html':'unrecognized',responseKeys:Object.keys(data),entries:Array.isArray(data.list) ? data.list.filter(entry=>String(entry.itemID)===item.id).slice(0,10).map(safeEntry):[]});
    let entries;
    if (Array.isArray(data.list)) entries=data.list.filter(entry=>String(entry.itemID)===item.id);
    else if (typeof data.html==='string') {
        const doc=new DOMParser().parseFromString(data.html,'text/html');
        entries=Array.from(doc.querySelectorAll('li[data-item]')).filter(row=>row.dataset.item===item.id && row.dataset.category===item.category && isInventoryRow(row)).map(row=>({
            itemID:row.dataset.item, ID:instanceOf(row),
            Qty:quantityOf(row), rowKey:row.dataset.rowkey || row.getAttribute('data-row-key'),
            factionID:row.getAttribute('data-faction-id') || row.getAttribute('data-factionid') || undefined,
            source:sourceOf(row), equiped:row.dataset.equipped==='true' || Boolean(row.querySelector('.option-unequip, .icon-h.unequip')),
            isEquippable:!row.querySelector('.option-equip[disabled], .option-equip[aria-disabled="true"]')
        }));
    } else throw new Error('服务器未返回可识别的库存信息');
    const previous=fetchedInventory.get(item.id);
    const record={id:item.id,category:item.category,name:item.name,savedAt:Date.now(),sources:entries.map(entry=>{
        const match=String(entry.rowKey || entry.rowkey || '').match(/f(\d+)$/);
        let source=match ? (Number(match[1])>0 ? 'faction':'own') : [true,1,'1','true'].includes(entry.factionItem) || Number(entry.factionID)>0 ? 'faction' : [false,0,'0','false'].includes(entry.factionItem) || (entry.factionID!==undefined && entry.factionID!==null && entry.factionID!=='' && Number(entry.factionID)===0) ? 'own' : entry.source || 'unknown';
        if(source==='unknown') source=previous?.sources.find(old=>String(old.instanceId)===String(entry.ID) && old.source!=='unknown')?.source || source;
        return {source,quantity:entry.Qty!==null && entry.Qty!==undefined && Number.isFinite(Number(entry.Qty)) ? Number(entry.Qty):null,instanceId:String(entry.ID || ''),rowKey:entry.rowKey || entry.rowkey,
            equipped:[true,1,'1','true'].includes(entry.equiped ?? entry.equipped),equippedKnown:entry.equiped!==undefined || entry.equipped!==undefined,canEquip:![false,0,'0','false'].includes(entry.isEquippable)};
    })};
    fetchedInventory.set(item.id,record);persistInventory(new Map([[item.id,record]]));
    persistInstances();
    const equipped=record.sources.find(entry=>entry.equipped);
    if(revision===(equipmentRevision.get(item.category)||0)) {
        if(equipped) equipmentState.set(item.category,{id:item.id,instanceId:equipped.instanceId,source:equipped.source});
        else if(equipmentState.get(item.category)?.id===item.id && record.sources.every(entry=>entry.equippedKnown)) equipmentState.set(item.category,null);
    }
    return record;
}
async function queryInventory(item, signal) {
    const revision=equipmentRevision.get(item.category)||0;
    const result=await fetch('/item.php',{method:'POST',credentials:'same-origin',signal,headers:{'x-requested-with':'XMLHttpRequest'},body:new URLSearchParams({step:'getSearchList',q:inventoryCache.get(item.id)?.name || item.name})});
    if(!result.ok) throw new Error('HTTP '+result.status);
    return parseInventory(item,await result.json(),revision);
}
function activePage() { return list.isConnected && location.pathname === '/item.php' && !document.hidden && document.hasFocus(); }
async function loadInventory(item) {
    if (busy || loadingInventory || !activePage()) return;
    loadingInventory = true; busy = true; render();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
        const record=await queryInventory(item, controller.signal);
        message(item.name + (isWeapon(item) ? ' 来源已查询':' 库存已查询') + '；点击物品即可装备或卸下。');
        if(record.sources.some(entry=>entry.source==='unknown')) {
            const diagnostic=button('查看来源诊断',()=>showSourceDiagnostic(item));diagnostic.dataset.item=item.id;diagnostic.classList.add('ttb-source-diagnostic');response.append(diagnostic);syncPageResponse();
        }
        availableSignature = ''; scan();
    } catch (error) { message('库存查询失败：' + (error.name === 'AbortError' ? '请求超时' : error.message)); }
    finally { clearTimeout(timeout); loadingInventory = false; busy = false; render(); renderAvailable(); }
}
function syncPageResponse() {
    const feedback = pageBox?.querySelector('.ttb-quick-feedback');
    if (!feedback) return;
    feedback.replaceChildren(...Array.from(response.childNodes, node => node.cloneNode(true)));
    feedback.hidden = !response.textContent.trim();
}
function message(text) { response.replaceChildren(); response.textContent = text; syncPageResponse(); }
function button(text, handler) {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'ttb-quick-button'; btn.textContent = text;
    btn.addEventListener('click', handler); return btn;
}
let sorting=false;
function render() {
    if(sorting)return;
    const statuses = items.map(sourceStatus);
    const names = items.map(item => inventoryCache.get(item.id)?.name || item.name);
    const bonusTitles=items.map(quickBonusTitle);
    const signature = JSON.stringify([items, names, statuses, bonusTitles, items.map(modChoices), items.map(ammoControl), busy, enabled.checked, Boolean(pageBox?.isConnected)]);
    if (signature === displaySignature) return;
    displaySignature = signature;
    [list, pageBox?.querySelector('.ttb-quick-grid')].filter(Boolean).forEach(container => {
        container.replaceChildren();
        if (!items.length) { container.textContent = '点击“添加物品”，在工具箱的物品列表中加入收藏。'; return; }
        items.forEach((item, index) => {
            const card = document.createElement('div'); card.className = 'ttb-quick-card';
            card.dataset.item = item.id;
            const grip=button('⠿',()=>{});grip.classList.add('ttb-drag-handle');grip.title='拖动排序';grip.setAttribute('aria-label','拖动排序 '+item.name);
            installSorting(grip,card,container);
            const use = button('', () => useItem(item));
            if(bonusTitles[index])use.title=bonusTitles[index];
            use.disabled = busy || !enabled.checked;
            const img = document.createElement('img'); img.src = '/images/items/' + item.id + '/medium.png'; img.alt = ''; img.width = 40; img.height = 40;
            const label = document.createElement('span'); label.className = 'ttb-quick-label';
            const name = document.createElement('span'); name.className = 'ttb-quick-name'; name.textContent = names[index];
            const status = document.createElement('small'); status.className = 'ttb-quick-source'; status.dataset.source = statuses[index].source; status.textContent = statuses[index].text;
            label.append(name, status); use.append(img, label); card.append(use);
            card.append(button('×', () => { if (!busy) { items = items.filter(x => x.id !== item.id); save(); } }));
            if (container === list) {
                card.append(button('↑', () => { if (!busy && index > 0) { [items[index-1], items[index]] = [items[index], items[index-1]]; save(); } }));
                card.append(button('↓', () => { if (!busy && index < items.length-1) { [items[index+1], items[index]] = [items[index], items[index+1]]; save(); } }));
            }
            if (equipment.has(item.category)) {
                card.classList.add('ttb-quick-with-query');
                const query = button('↻', () => loadInventory(item));
                query.setAttribute('aria-label', '刷新 ' + item.name + (isWeapon(item) ? ' 的来源':' 的库存'));
                query.title = (isWeapon(item) ? '刷新此武器的个人／帮派来源':'单独查询此物品的最新库存') + '；已有实例资料可直接点击物品切换';
                query.disabled = busy || !enabled.checked;
                query.classList.add('ttb-quick-query'); card.append(query);
            }
            const choices=modChoices(item);
            const ammo=ammoControl(item);
            if(choices.length || ammo) {
                const group=document.createElement('span');group.className='ttb-quick-mods';
                for(const [slot,choice] of choices.entries()) {
                    const btn=button('Mod'+(slot+1)+(choice.installed?' ✓':''),()=>toggleMod(item,choice.instanceId,choice.mod.id));
                    btn.dataset.mod=choice.mod.id;btn.title=choice.mod.title+' · '+(choice.installed?'点击卸下':'点击安装')+(choice.reason?' · '+choice.reason:'');
                    btn.setAttribute('aria-pressed',String(choice.installed));
                    btn.disabled=busy || !enabled.checked || Boolean(choice.reason);group.append(btn);
                }
                if(ammo){const btn=button(ammo.label,()=>openAmmo(item));btn.classList.add('ttb-ammo-button');btn.title=ammo.title;btn.setAttribute('aria-label',ammo.title);btn.disabled=busy||!enabled.checked;group.append(btn);}
                card.classList.add('ttb-quick-with-mods');card.append(group);
            }
            card.append(grip);container.append(card);
        });
    });
}
function ammoNodes(item) {
    if(!activePage() || !['Primary','Secondary'].includes(item.category))return {};
    const root=document.querySelector('.equipped-items-wrap');
    const review=root?.querySelector('[class*="itemReviewContainer___"]');
    const image=review?.querySelector('img[src*="/items/"]');
    const selected=image && new URL(image.src,location.origin).pathname.match(/\/items\/(\d+)\//)?.[1]===item.id;
    const ammo=selected ? review.querySelector('[role="button"][aria-label^="Ammo type"],button[aria-label^="Ammo type"]'):null;
    const select=Array.from(root?.querySelectorAll('[class*="itemWrapper___"] button')||[]).find(btn=>btn.querySelector('img[src*="/items/'+item.id+'/"]'));
    return {ammo,select};
}
function ammoControl(item) {
    const {ammo,select}=ammoNodes(item);
    if(ammo){
        const type=ammo.getAttribute('aria-label')?.match(/Ammo type is "([^"]+)"/)?.[1];
        const abbreviations={standard:'STD',hollowpoint:'HP',tracer:'TR',incendiary:'INC',piercing:'PI',armorpiercing:'PI',armourpiercing:'PI'};
        const key=type?.toLowerCase().replace(/[\s-]+/g,'');
        return {label:abbreviations[key] || type || '选择',title:(type || '未知类型')+' · 点击打开原生子弹菜单'};
    }
    if(select)return {label:'选择武器',title:'先选择此武器，再点击类型简称打开原生子弹菜单'};
    return null;
}
function openAmmo(item) {
    if(busy||!enabled.checked||!activePage())return;
    const {ammo,select}=ammoNodes(item),target=ammo||select;
    if(!target || target.disabled)return;
    target.click();
    message(ammo?'请在原生子弹菜单中手动选择类型。':'已选择武器；请再点击类型简称打开原生子弹菜单。');
}
function installSorting(grip,card,container) {
    grip.style.touchAction='none';
    let drag;
    grip.addEventListener('pointerdown',event=>{
        if(busy||event.button!==0)return;
        event.preventDefault();event.stopPropagation();
        drag={x:event.clientX,y:event.clientY,active:false};
        document.addEventListener('pointermove',move);document.addEventListener('pointerup',finish);document.addEventListener('pointercancel',finish);
    });
    const move=event=>{
        if(!drag)return;
        if(!drag.active && Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<6)return;
        drag.active=true;sorting=true;card.classList.add('ttb-dragging');
        const hit=document.elementFromPoint(event.clientX,event.clientY)?.closest('.ttb-quick-card');
        if(!hit||hit===card||hit.parentElement!==container)return;
        const children=Array.from(container.children);
        container.insertBefore(card,children.indexOf(card)<children.indexOf(hit)?hit.nextSibling:hit);
    };
    const finish=event=>{
        if(!drag)return;
        const changed=drag.active;drag=null;sorting=false;card.classList.remove('ttb-dragging');
        document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',finish);document.removeEventListener('pointercancel',finish);
        if(changed){const ids=Array.from(container.querySelectorAll(':scope > .ttb-quick-card')).map(node=>node.dataset.item);const map=new Map(items.map(item=>[item.id,item]));items=ids.map(id=>map.get(id)).filter(Boolean);save();}
    };
}
function openPicker() {
    openToolbox();
    document.querySelector('[data-tab="quick"]').click();
    scan();
    document.getElementById('ttb-quick-picker').open = true;
    availableList.scrollIntoView({block: 'nearest'});
}
function renderAvailable() {
    // Read inventory only. Never insert controls into Torn's React-owned rows/actions.
    const inventory = new Map();
    if (enabled.checked && activePage()) {
        document.querySelectorAll('li[data-item][data-category]').forEach(row => {
            const id = row.dataset.item, category = row.dataset.category;
            if (!/^\d+$/.test(id) || !categories.has(category) || inventory.has(id)) return;
            inventory.set(id, {id, category, name: itemName(row, id)});
        });
    }
    const statuses = new Map([...inventory.values()].map(item => [item.id, sourceStatus(item)]));
    const effects = new Map([...inventory.values()].map(item => [item.id, weaponEffects(item)]));
    const query = search.value.trim().toLocaleLowerCase();
    const visible = [...inventory.values()].filter(item => {
        const text = [item.name, item.id, item.category, statuses.get(item.id).text, ...effects.get(item.id).map(effect => sourceName(effect.source) + ' ' + effect.text), ...(effects.get(item.id).length ? ['RW'] : [])].join(' ').toLocaleLowerCase();
        return query.split(/\s+/).every(term => text.includes(term));
    });
    const signature = JSON.stringify([enabled.checked, [...inventory.values()], [...statuses], [...effects], items.map(item => item.id), query]);
    if (signature === availableSignature) return;
    availableSignature = signature;
    availableList.replaceChildren();
    searchCount.textContent = '显示 ' + visible.length + ' / ' + inventory.size + ' 种物品（仅已加载分类）';
    if (!inventory.size) {
        availableList.textContent = !enabled.checked ? '快捷物品已停用。' : '请打开物品页面并加载要收藏的分类，然后刷新列表。';
        return;
    }
    if (!visible.length) { availableList.textContent = '没有匹配的物品，请修改搜索词或加载其他分类。'; return; }
    visible.forEach(item => {
        const entry = document.createElement('div');
        entry.className = 'ttb-quick-available-item'; entry.dataset.item = item.id;
        const label = document.createElement('span'); label.textContent = item.name + ' · ' + item.category;
        const status = document.createElement('small'); status.className = 'ttb-quick-source'; status.dataset.source = statuses.get(item.id).source; status.textContent = statuses.get(item.id).text; label.append(status);
        if (effects.get(item.id).length) {
            const bonuses = document.createElement('span'); bonuses.className = 'ttb-quick-bonuses';
            effects.get(item.id).forEach(effect => {
                const badge = document.createElement('span'); badge.className = 'ttb-quick-bonus';
                badge.textContent = 'RW · ' + sourceName(effect.source) + '：' + effect.text;
                badge.title = effect.text; bonuses.append(badge);
            });
            label.append(bonuses);
        }
        const added = items.some(savedItem => savedItem.id === item.id);
        const add = button(added ? '已收藏' : '加入快捷物品', event => {
            event.preventDefault(); event.stopPropagation();
            if (!enabled.checked || items.some(savedItem => savedItem.id === item.id)) return;
            items.push(item); save();
        });
        add.className = 'ttb-quick-button ttb-add-quick'; add.disabled = added;
        entry.append(label, add); availableList.append(entry);
    });
}
function renderPageQuickButtons() {
    if (!activePage()) return;
    document.querySelectorAll('li[data-item][data-category]').forEach(row => {
        if (!isInventoryRow(row)) return;
        const id = row.dataset.item, category = row.dataset.category;
        if (!validId(id) || !categories.has(category)) return;
        const item = {id:String(id), category, name:itemName(row, id)};
            const native = row.querySelector('.option-equip, .option-unequip');
            const actions=row.querySelector('ul.actions-wrap');
            const nativeCell=native?.closest('li');
            if(!actions||!nativeCell||nativeCell.parentElement!==actions)return;
        let add = row.querySelector('[data-ttb-page-add]');
        if (!add) {
            add = button('+', () => {});
            add.dataset.ttbPageAdd = 'true';
            add.classList.add('ttb-page-add-quick');
            add.setAttribute('aria-label', '添加到快捷物品：' + item.name);
            add.title = '添加到快捷物品';
        }
            let cell=actions.querySelector(':scope > .ttb-page-add-cell');
            if(!cell){cell=document.createElement('li');cell.className='left ttb-page-add-cell';actions.insertBefore(cell,nativeCell);}
            if(add.parentElement!==cell)cell.append(add);
            actions.classList.add('ttb-compact-actions');
    });
    document.querySelectorAll('[data-ttb-page-add]').forEach(add => {
        const row = add.closest('li[data-item][data-category]');
        const added = row && items.some(item => item.id === row.dataset.item);
        add.disabled = !enabled.checked || added;
            const text=added ? '✓' : '+',title=added ? '已在快捷物品中' : '添加到快捷物品';
            if(add.textContent!==text)add.textContent=text;
            if(add.title!==title)add.title=title;
    });
}
function showServerText(html) {
    // Use text only: server error/confirmation markup must not run inside the toolbox.
    const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
    doc.querySelectorAll('script,style').forEach(el => el.remove());
    message(doc.body.textContent.trim() || '服务器未返回物品操作结果，请检查物品页面。');
}
function syncEquippedRows(item, unequipped, selected) {
    document.querySelectorAll('li[data-item][data-category]').forEach(row=>{
        if(row.dataset.category!==item.category || !isInventoryRow(row)) return;
        const same=instanceOf(row)===selected.instanceId || (selected.rowKey && (row.dataset.rowkey || row.getAttribute('data-row-key'))===selected.rowKey);
        if(unequipped) { if(row.dataset.item===item.id && same) row.dataset.equipped='false'; }
        else row.dataset.equipped=String(row.dataset.item===item.id && Boolean(same));
    });
}
function restoreNativeLoadout() {
    document.querySelectorAll('.ttb-loadout-slot').forEach(layer => {
        const native = layer.parentElement?.querySelector('button:not(.ttb-loadout-slot)');
        if (native) native.style.visibility = layer.dataset.nativeVisibility || '';
        layer.remove();
    });
    document.querySelectorAll('.ttb-loadout-review, .ttb-loadout-live').forEach(node => node.remove());
}
function refreshNativeLoadout() {
    if(!activePage()) return false;
    // Public API used by Torn's n_items.js EquipFunc after a successful action.
    // Torn requests itemsLoadouts/getEquippedItems and updates its own React store.
    const host = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
    const actions = host.loadouts?.actions;
    if (typeof actions?.getEquippedItemsRequestAction !== 'function') return false;
    actions.getEquippedItemsRequestAction();
    return true;
}
const MOD_KEY = 'ttbWeaponModsV1';
const modPresets = new Map();
const validId = value => /^\d+$/.test(String(value));
const storedMods = GM_getValue(MOD_KEY, []);
if (Array.isArray(storedMods)) for (const record of storedMods.slice(-300)) {
    if (!record || !validId(record.instanceId) || !validId(record.itemId) || !Array.isArray(record.mods)) continue;
    const mods = record.mods.slice(0,2).filter(mod => mod && validId(mod.id)).map(mod => ({id:String(mod.id),title:String(mod.title || mod.id)}));
    if (new Set(mods.map(mod=>mod.id)).size === mods.length) modPresets.set(String(record.instanceId),{itemId:String(record.itemId),instanceId:String(record.instanceId),mods});
}
// Retire the old setting even when a user previously enabled it.
GM_setValue('ttbRestoreWeaponMods',false);
let modAvailability=[], modLoadedAt=0;
const modEquipped=new Map();
const modControls=document.createElement('div');modControls.className='ttb-mod-controls';
const modHelp=document.createElement('span');modHelp.textContent='装备与每个 Mod 分别点击；不会自动恢复';
modControls.append(button('Mod资料',readModAvailability),button('同步详情',manualLoadoutSync),modHelp);response.before(modControls);
function persistMods() { const records=Array.from(modPresets.values()).slice(-300),signature=JSON.stringify(records);if(signature!==persistMods.signature){persistMods.signature=signature;GM_setValue(MOD_KEY,records);} }
const CONFIG_FORMAT = 'torn-toolbox-quick-items';
const CONFIG_LIMIT = 300;
function configItems(value) {
    if (!Array.isArray(value) || value.length > CONFIG_LIMIT) throw new Error('快捷物品配置的物品数量无效');
    const seen = new Set();
    return value.map(entry => {
        if (!entry || !validId(entry.id) || !categories.has(entry.category) || seen.has(String(entry.id))) throw new Error('快捷物品配置包含重复或无效物品');
        seen.add(String(entry.id));
        const name = cleanName(String(entry.name || '')).slice(0, 120);
        if (!name) throw new Error('快捷物品配置包含空名称');
        return {id:String(entry.id), name, category:entry.category};
    });
}
function configMods(value) {
    if (!Array.isArray(value) || value.length > CONFIG_LIMIT) throw new Error('Mod 配置数量无效');
    const seen = new Set();
    return value.map(record => {
        if (!record || !validId(record.itemId) || !validId(record.instanceId) || !Array.isArray(record.mods) || seen.has(String(record.instanceId))) throw new Error('Mod 配置包含重复或无效记录');
        const mods = record.mods.slice(0, 2).map(mod => {
            if (!mod || !validId(mod.id)) throw new Error('Mod 配置包含无效 Mod');
            return {id:String(mod.id), title:cleanName(String(mod.title || mod.id)).slice(0, 120)};
        });
        if (!mods.length || new Set(mods.map(mod => mod.id)).size !== mods.length) throw new Error('Mod 配置包含重复 Mod');
        seen.add(String(record.instanceId));
        return {itemId:String(record.itemId), instanceId:String(record.instanceId), mods};
    });
}
function exportQuickConfig() {
    const payload = {format:CONFIG_FORMAT, version:1, exportedAt:new Date().toISOString(), items:items.map(item => ({...item})), weaponMods:Array.from(modPresets.values()).slice(-CONFIG_LIMIT).map(record => ({itemId:record.itemId, instanceId:record.instanceId, mods:record.mods.map(mod => ({...mod}))})), folded:Boolean(pageBox?.querySelector('.ttb-quick-grid')?.hidden)};
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'torn-toolbox-quick-items.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    message('快捷物品配置已导出（不包含 API Key、库存缓存或实时装备状态）。');
}
function importQuickConfig(file) {
    if (!file) return;
    if (file.size > 1024 * 1024) { message('导入失败：配置文件不能超过 1 MB。'); return; }
    file.text().then(text => {
        let payload;
        try { payload = JSON.parse(text); } catch { throw new Error('文件不是有效 JSON'); }
        if (!payload || payload.format !== CONFIG_FORMAT || payload.version !== 1) throw new Error('配置文件版本不受支持');
        const nextItems = configItems(payload.items), nextMods = configMods(payload.weaponMods || []);
        items = nextItems;
        GM_setValue(KEY, items);
        modPresets.clear();
        nextMods.forEach(record => modPresets.set(record.instanceId, record));
        persistMods();
        if (typeof payload.folded === 'boolean') {
            const grid = pageBox?.querySelector('.ttb-quick-grid');
            if (grid) grid.hidden = payload.folded;
            GM_setValue('ttbQuickItemsFolded', payload.folded);
        }
        availableSignature = ''; displaySignature = ''; render(); renderAvailable();
        message('快捷物品配置已导入；不会自动装备武器或恢复 Mod。');
    }).catch(error => message('导入失败：' + error.message));
}
function openConfigImport() {
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json,.json'; input.hidden = true;
    input.addEventListener('change', () => { importQuickConfig(input.files?.[0]); input.remove(); });
    document.body.append(input); input.click();
}
function rememberPreset(record) {
    const previous=modPresets.get(record.instanceId);
    if(previous?.itemId===record.itemId && record.mods.every(mod=>previous.mods.some(old=>old.id===mod.id)))return;
    modPresets.set(record.instanceId,record);
}
function equippedWeapons(data) {
    if(!data || !data.currentItems || typeof data.currentItems!=='object') throw new Error('Torn 未返回装备资料');
    return Object.values(data.currentItems).filter(item=>item && ['Primary','Secondary'].includes(item.type2) && validId(item.itemID) && validId(item.armouryID ?? item.armoryID));
}
function rememberEquippedMods(data) {
    for(const item of equippedWeapons(data)) {
        const raw=item.currentUpgrades;
        if(raw===undefined) continue;
        if(raw!==null && raw!==undefined && !Array.isArray(raw) && typeof raw!=='object') continue;
        const mods=Object.values(raw || {}).filter(mod=>mod && validId(mod.upgradeID)).slice(0,2).map(mod=>({id:String(mod.upgradeID),title:String(mod.title || mod.upgradeID)}));
        if(mods.length) {
            const instanceId=String(item.armouryID ?? item.armoryID);
            rememberPreset({itemId:String(item.itemID),instanceId,mods});
        }
    }
    persistMods();
}
async function modRequest(url,signal) {
    if(!activePage()) throw new Error('页面已失焦，未发送请求');
    const host=typeof unsafeWindow==='undefined' ? window:unsafeWindow;
    // Same URL decoration and GET endpoints as Torn's native loadouts bundle.
    const target=typeof host.addRFC==='function' ? host.addRFC(url):url;
    const response=await fetch(target,{credentials:'same-origin',signal,headers:{'X-Requested-With':'XMLHttpRequest'}});
    if(!response.ok) throw new Error('HTTP '+response.status);
    if(!activePage()) throw new Error('页面已失焦；已提交的操作请手动核对，未重试');
    const data=await response.json();
    if(!data || data.error || data.redirect || data.bh_redirect) throw new Error(plainText(data?.error || data?.content || 'Torn 未确认 Mod 操作'));
    return data;
}
function cacheModEquipment(data) {
    modEquipped.clear();
    for(const weapon of equippedWeapons(data)){const id=String(weapon.itemID),instanceId=String(weapon.armouryID ?? weapon.armoryID);const row=rows(id,weapon.type2).find(r=>String(instanceOf(r))===instanceId);const source=row?sourceOf(row):fetchedInventory.get(id)?.sources.find(e=>e.instanceId===instanceId)?.source || 'unknown';modEquipped.set(weapon.type2,{id,instanceId,source});}
}
function modTarget(item) {
    const loaded=rows(item.id,item.category).find(row=>row.dataset.equipped==='true');
    if(loaded && validId(instanceOf(loaded))) return {id:item.id,instanceId:String(instanceOf(loaded))};
    // A known empty or different slot must take precedence over old snapshots.
    if(equipmentState.has(item.category)) {
        const tracked=equipmentState.get(item.category);
        return tracked?.id===item.id && validId(tracked.instanceId) ? tracked:null;
    }
    const known=modEquipped.get(item.category);
    return known?.id===item.id ? known:null;
}
async function readModAvailability() {
    if(busy || !enabled.checked || !activePage()) return;
    busy=true;render();
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
    try {
    const data=await modRequest('/page.php?sid=itemsModsData&step=getUserUpgrades',controller.signal);
    if(!Array.isArray(data)) throw new Error('Torn 未返回 Mod 列表');
    if(!activePage()) return;
    modAvailability=data;modLoadedAt=Date.now();rememberVisibleMods();message('Mod 资料已读取；安装或卸下仍需单独点击。');
    } catch(error) {message('Mod 资料读取失败：'+error.message);}
    finally {clearTimeout(timeout);busy=false;render();}
}
function manualLoadoutSync() {
    if(busy || !enabled.checked || !activePage()) return;
    try {message(refreshNativeLoadout() ? '已请求 Torn 同步原生详情。':'原生同步入口不可用，请手动核对 Torn 页面。');}
    catch(error) {message('同步未确认：'+error.message+'；未重试。');}
}
function markEquipmentChange(item,instanceId,unequipped) {
    for(const mod of modAvailability) if(String(mod.armouryID)===instanceId) {mod.attached='false';mod.armouryID=null;}
    const previous=modEquipped.get(item.category);
    if(previous) for(const mod of modAvailability) if(String(mod.armouryID)===previous.instanceId) {mod.attached='false';mod.armouryID=null;}
    if(unequipped) modEquipped.delete(item.category);
    else modEquipped.set(item.category,{id:item.id,instanceId});
    // Cached compatibility belonged to the previous loadout; do not silently query it.
    modLoadedAt=0;
}
function rememberVisibleMods() {
    if(!activePage()) return;
    const root=document.querySelector('#loadoutsRoot [class*="currentSlot___"] [class*="itemReviewContainer___"]');
    const image=root?.querySelector('img'),id=(image?.getAttribute('src') || '').match(/items\/(\d+)\//)?.[1];
    const item=items.find(i=>i.id===id && ['Primary','Secondary'].includes(i.category));
    if(!item) return;
    const target=modTarget(item);if(!target) return;
    const labels=Array.from(root.querySelectorAll('[class*="upgrade___"] > button[aria-label]')).map(b=>b.getAttribute('aria-label'));
    const mods=modAvailability.filter(m=>labels.some(label=>label.includes('"'+m.title+'" modification'))).slice(0,2).map(m=>({id:String(m.upgradeID),title:String(m.title)}));
    if(mods.length) {rememberPreset({itemId:item.id,instanceId:target.instanceId,mods});persistMods();}
}
function observeNativeResponses() {
    const host=typeof unsafeWindow==='undefined' ? window:unsafeWindow,key='__ttbItemResponseObserverV1';
    if(!host[key]) {
        const listeners=new Set(),requests=new WeakMap();let sequence=0;
        const watched=url=>{try{const u=new URL(typeof url==='string'?url:url.url,location.origin);return u.origin===location.origin && (u.searchParams.get('sid')==='itemsLoadouts' && ['getEquippedItems','changeLoadout'].includes(u.searchParams.get('step')) || u.searchParams.get('sid')==='itemsModsData');}catch{return false;}};
        const emit=(url,data,seq)=>{for(const listener of listeners) listener(url,data,seq);};
        const original=host.fetch;
        host.fetch=function(...args){const watch=watched(args[0]),seq=++sequence,visible=activePage();const pending=original.apply(this,args);if(watch && visible) pending.then(res=>{if(res.ok && activePage())res.clone().json().then(data=>{if(activePage())emit(String(args[0]?.url || args[0]),data,seq);}).catch(()=>{});}).catch(()=>{});return pending;};
        const proto=host.XMLHttpRequest?.prototype;
        if(proto){const open=proto.open,send=proto.send;proto.open=function(method,url,...args){requests.set(this,{url:String(url),watch:watched(String(url))});return open.call(this,method,url,...args);};proto.send=function(...args){const meta=requests.get(this);if(meta?.watch && activePage()){const seq=++sequence;this.addEventListener('load',()=>{if(!activePage() || this.status<200 || this.status>=300)return;try{emit(meta.url,this.responseType==='json'?this.response:JSON.parse(this.responseText),seq);}catch{}},{once:true});}return send.apply(this,args);};}
        host[key]={listeners};
    }
    const last={equipment:0,mods:0};
    host[key].listeners.add((url,data,seq)=>{
        if(!activePage() || !data || data.error) return;
        const u=new URL(url,location.origin);
        if(u.searchParams.get('sid')==='itemsLoadouts' && data.currentItems && seq>=last.equipment){
            last.equipment=seq;cacheModEquipment(data);rememberEquippedMods(data);
            for(const category of ['Primary','Secondary'])equipmentState.set(category,modEquipped.get(category) || null);
            for(const weapon of equippedWeapons(data)) for(const upgrade of Object.values(weapon.currentUpgrades || {})){
                const old=modAvailability.find(m=>String(m.upgradeID)===String(upgrade.upgradeID));
                if(old){old.attached='true';old.armouryID=String(weapon.armouryID ?? weapon.armoryID);}
            }
        }
        if(u.searchParams.get('sid')==='itemsModsData' && seq>=last.mods){const upgrades=Array.isArray(data)?data:data.result?.userUpgrades;if(Array.isArray(upgrades)){last.mods=seq;modAvailability=upgrades;modLoadedAt=Date.now();if(!busy)rememberVisibleMods();}}
        render();
    });
}
observeNativeResponses();
function equippedWeaponInstances() {
    const instances=new Set();
    for(const category of ['Primary','Secondary']) {
        // Confirmed slot changes override snapshots taken before the equipment action.
        const weapon=equipmentState.has(category) ? equipmentState.get(category):modEquipped.get(category);
        if(weapon && validId(weapon.instanceId)) instances.add(String(weapon.instanceId));
    }
    // Native Mod data also lists compatible currently equipped instances.
    for(const mod of modAvailability) for(const weapon of Array.isArray(mod.armoury)?mod.armoury:[])if(validId(weapon.armouryID))instances.add(String(weapon.armouryID));
    return instances;
}
function modChoices(item) {
    const target=modTarget(item),preset=target && modPresets.get(target.instanceId);
    if(!preset || preset.itemId!==item.id) return [];
    const equippedInstances=equippedWeaponInstances();
    const attached=modAvailability.filter(m=>String(m.attached)==='true' && String(m.armouryID)===target.instanceId);
    return preset.mods.map(mod=>{
        const entry=modAvailability.find(m=>String(m.upgradeID)===mod.id);
        const installed=entry && String(entry.attached)==='true' && String(entry.armouryID)===target.instanceId;
        const reason=!entry || Date.now()-modLoadedAt>60000 ? '单独点击 Mod资料 更新':installed ? '':String(entry.attached)==='true' && !validId(entry.armouryID) ? '占用资料不完整，请刷新':String(entry.attached)==='true' && equippedInstances.has(String(entry.armouryID)) ? '当前另一把装备武器正在使用':!Array.isArray(entry.armoury) || !entry.armoury.some(a=>String(a.armouryID)===target.instanceId) ? '不兼容':attached.some(a=>!preset.mods.some(m=>m.id===String(a.upgradeID))) || attached.length>=2 ? '目标已有其他 Mod 或槽位已满':'';
        return {mod,instanceId:target.instanceId,installed:Boolean(installed),reason};
    });
}
async function toggleMod(item,instanceId,modId) {
    if(busy || !enabled.checked || !activePage()) return;
    const choice=modChoices(item).find(c=>c.instanceId===instanceId && c.mod.id===modId);
    if(!choice || choice.reason) {message('Mod 资料已改变，请单独点击 Mod资料 后再操作。');render();return;}
    const removing=choice.installed,verb=removing?'卸下':'安装';
    busy=true;render();message('正在'+verb+' '+choice.mod.title+'…');
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
    try {
        const data=await modRequest('/page.php?sid=itemsModsData&step='+(removing?'detach':'reattach')+'&armouryID='+instanceId+'&upgradeID='+modId+(removing?'':'&replaceUpgradeID='),controller.signal);
        const updated=data.result?.userUpgrades;
        if(!Array.isArray(updated)) throw new Error('服务器未返回可核验的 Mod 结果，请查看 Torn；未重试');
        modAvailability=updated;modLoadedAt=Date.now();
        const result=updated.find(m=>String(m.upgradeID)===modId);
        const attached=result && String(result.attached)==='true' && String(result.armouryID)===instanceId;
        if(!result || Boolean(attached)===removing) throw new Error('服务器未确认'+verb+'成功');
        // Keep the remembered slot while detached so the same button can restore it.
        message('已'+verb+' '+choice.mod.title+'。');
        message('已'+verb+' '+choice.mod.title+'。原生详情如未更新，请单独点击同步详情。');
    } catch(error) {modLoadedAt=0;message('Mod 装卸未完成或结果未确认：'+error.message+'；未自动继续或重试。');}
    finally {clearTimeout(timeout);busy=false;render();}
}
async function useItem(item) {
    if (busy || !enabled.checked) return;
    if (location.pathname !== '/item.php') { message('请先打开物品页面，再使用快捷物品。'); return; }
    if (!activePage()) return;
    // Missing instance information is a separate user-initiated lookup, as in TornTools.
    // Never chain a lookup and an equipment action from the same click.
    const available = rows(item.id, item.category);
    const equippedRow = available.find(row => row.dataset.equipped === 'true');
    const nativeRow = equippedRow || preferredRow(available);
    const nativeButton = nativeRow?.querySelector(equippedRow ? '.option-unequip, .icon-h.unequip[role="button"], .icon-h.unequip' : 'button.option-equip, span.icon-h.equip button, [role="button"].equip');
    if (equipment.has(item.category) && !nativeButton && !fetchedInventory.has(item.id)) { await loadInventory(item); return; }
    busy = true; render(); message('正在处理 ' + item.name + '…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        if (equipment.has(item.category)) {
            rememberVisibleMods();
            if (nativeButton && !nativeButton.disabled && nativeButton.getAttribute('aria-disabled') !== 'true') {
                const wasEquipped = Boolean(equippedRow);
                const nativeInstanceId=instanceOf(nativeRow);
                nativeButton.click(); // Torn updates its own loadout; confirmation remains manual.
                const end = Date.now() + 10000;
                while (Date.now() < end && !controller.signal.aborted && activePage()) {
                    if (nativeRow.dataset.equipped === String(!wasEquipped)) {
                        equipmentState.set(item.category, wasEquipped ? null : {id:item.id, instanceId:nativeInstanceId, source:sourceOf(nativeRow)});
                        equipmentRevision.set(item.category,(equipmentRevision.get(item.category)||0)+1);
                        markEquipmentChange(item,nativeInstanceId,wasEquipped);
                        message((wasEquipped ? '已卸下 ' : '已装备 ') + item.name + '（' + sourceName(sourceOf(nativeRow)) + '）。');

                        return;
                    }
                    await new Promise(resolve => setTimeout(resolve,100));
                }
                message('已触发原生装备操作；如有确认框，请手动确认并查看 Torn 提示。'); return;
            }
            const current=fetchedInventory.get(item.id);
            const tracked=equipmentState.get(item.category);
            const equipped=current.sources.find(entry=>(entry.equipped || (!entry.equippedKnown && tracked?.id===item.id && tracked.instanceId===entry.instanceId)) && /^\d+$/.test(entry.instanceId));
            const selected=equipped || ['faction','own','unknown'].map(source=>current.sources.find(entry=>entry.source===source && entry.canEquip && entry.quantity!==0 && /^\d+$/.test(entry.instanceId))).find(Boolean);
            if(!selected) throw new Error('当前库存中没有可操作的 '+item.name+'，请点击查询库存');
            const action=await fetch('/item.php',{method:'POST',credentials:'same-origin',signal:controller.signal,headers:{'x-requested-with':'XMLHttpRequest','content-type':'application/x-www-form-urlencoded; charset=UTF-8'},body:new URLSearchParams({step:'actionForm',action:'equip',confirm:'1',type:'5',item_id:item.id,item:item.id,id:selected.instanceId})});
            if(!action.ok) throw new Error('HTTP '+action.status);
            if(!activePage()) throw new Error('页面已失焦；已提交的操作请手动核对，未重试');
            const actionHtml=await action.text();
            const result=plainText(actionHtml);
            if(/\b(?:cannot|can't|failed|error|unable|no longer own|under attack|wrong itemid)\b/i.test(result)) { if(/no longer own|wrong itemid/i.test(result)) { fetchedInventory.delete(item.id); persistInstances(); } message(result); return; }
            const unequipped=/\byou(?: have)? (?:successfully )?unequipped\b/i.test(result), equippedNow=/\byou(?: have)? (?:successfully )?equipped\b/i.test(result);
            if(!unequipped && !equippedNow) { message(result || '服务器未确认操作完成，请点击查询库存后检查'); return; }
            equipmentRevision.set(item.category,(equipmentRevision.get(item.category)||0)+1);
            equipmentState.set(item.category,unequipped ? null : {id:item.id,instanceId:selected.instanceId,source:selected.source});
            syncEquippedRows(item,unequipped,selected);
            for (const record of fetchedInventory.values()) if(record.category===item.category) for(const entry of record.sources) { entry.equipped=!unequipped && record.id===item.id && entry.instanceId===selected.instanceId; entry.equippedKnown=true; }
            persistInstances();
            const success=(unequipped ? '已卸下 ':'已装备 ')+item.name+'（'+sourceName(selected.source)+'）。';
            message(success);
            markEquipmentChange(item,selected.instanceId,unequipped);
            message(success+' 原生详情如未更新，请单独点击同步详情。');
            return;
        }
        const res = await fetch('/item.php', {
            method: 'POST', credentials: 'same-origin', signal: controller.signal,
            headers: {'x-requested-with': 'XMLHttpRequest'},
            body: new URLSearchParams({step: 'useItem', itemID: item.id, item: item.id})
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        showServerText(data.text || data.message || data.error || (data.success ? '物品操作完成。' : '物品操作失败。'));
        if (data.success && data.links) {
            Object.values(data.links).forEach(link => {
                if (!link || !link.url) return;
                const url = new URL(link.url, location.origin);
                if (url.origin !== location.origin || !['https:', 'http:'].includes(url.protocol)) return;
                const a = document.createElement('a'); a.href = url.href; a.textContent = link.title || '查看物品';
                a.className = 'ttb-quick-link'; response.append(a);
            });
            syncPageResponse();
        }
    } catch (err) { message('操作失败：' + (err.name === 'AbortError' ? '请求超时，请检查页面后再重试' : err.message)); }
    finally { clearTimeout(timeout); busy = false; render(); }
}
function scan() {
    if (!activePage()) return;
    if (location.pathname !== '/item.php') { renderAvailable(); return; }
    refreshInventoryCache();
    cacheVisibleWeaponBonuses();
    rememberVisibleMods();
    restoreNativeLoadout();
    const anchor = document.querySelector('div.equipped-items-wrap');
    if (anchor && (!pageBox || !pageBox.isConnected)) {
        pageBox = document.createElement('section'); pageBox.id = 'ttb-quick-page';
        const title = document.createElement('button'); title.type = 'button'; title.textContent = 'Quick Items · 快捷物品';
        const grid = document.createElement('div'); grid.className = 'ttb-quick-grid';
        grid.hidden = GM_getValue('ttbQuickItemsFolded', false);
        title.addEventListener('click', () => { grid.hidden = !grid.hidden; GM_setValue('ttbQuickItemsFolded', grid.hidden); });
        const add = button('添加物品', openPicker);
        const feedback = document.createElement('div'); feedback.className = 'ttb-quick-feedback'; feedback.setAttribute('role', 'status'); feedback.hidden = true;
        pageBox.append(title, add, button('导入配置',openConfigImport),button('导出配置',exportQuickConfig),button('Mod资料',readModAvailability),button('同步详情',manualLoadoutSync),grid, feedback); anchor.before(pageBox); render(); syncPageResponse();
    }
    if (pageBox) pageBox.hidden = !enabled.checked;
    renderAvailable();
    renderPageQuickButtons();
    render();
}
enabled.addEventListener('change', () => { GM_setValue(ENABLED, enabled.checked); scan(); render(); });
document.getElementById('ttb-quick-refresh').addEventListener('click', () => { scan(); render(); });
document.getElementById('ttb-quick-add').addEventListener('click', openPicker);
search.addEventListener('input', renderAvailable);
GM_addStyle(`
    .ttb-quick-mods { grid-column:2 / -1; grid-row:2; display:flex; flex-wrap:wrap; gap:6px; min-width:0; padding-top:2px; }
    .ttb-quick-mods > button { padding:4px 5px !important; font-size:11px !important; white-space:nowrap; }
    .ttb-mod-controls { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin:10px 0; }
    #ttb-root .ttb-tab { flex: 0 0 auto; min-width: 64px; }
    #ttb-quick-page { margin: 10px 0; padding: 10px; border: 1px solid #666; border-radius: 8px; background: #282c34; color: #fff; }
    #ttb-quick-page > button { background: transparent; color: #fff; border: 0; cursor: pointer; padding: 8px; }
    #ttb-quick-page .ttb-quick-grid:not([hidden]) { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 8px; width: 100%; align-items:start; }
    #ttb-quick-page .ttb-quick-card, #ttb-quick-list .ttb-quick-card { display: grid; grid-template-columns: minmax(0, 1fr) 30px; gap: 4px; align-items: center; margin: 6px 0; min-width: 0; width: 100%; box-sizing: border-box; }
    #ttb-quick-list .ttb-quick-card { grid-template-columns: minmax(0, 1fr) repeat(3, 30px); }
    #ttb-quick-page .ttb-quick-button, #ttb-quick-list .ttb-quick-button, #ttb-quick-available .ttb-quick-button { box-sizing: border-box; cursor: pointer; border: 1px solid #687182; border-radius: 6px; padding: 6px; background: #32373f; color: #fff; width: auto; min-width: 0; max-width: 100%; margin: 0; float: none; font: inherit; line-height: 1.4; height: auto; }
    #ttb-quick-page > button { display: inline-block; width: auto; margin: 0 10px 8px 0; float: none; }
    #ttb-quick-page .ttb-quick-card > button:first-child, #ttb-quick-list .ttb-quick-card > button:first-child { display: grid; grid-template-columns: 40px minmax(0, 1fr); align-items: center; gap: 8px; width: 100%; }
    #ttb-quick-page .ttb-quick-card > button:not(:first-child), #ttb-quick-list .ttb-quick-card > button:not(:first-child) { width: 30px; }
    #ttb-quick-page .ttb-quick-card.ttb-quick-with-query { grid-template-columns: 28px minmax(0, 1fr) 30px; }
    #ttb-root #ttb-quick-list .ttb-quick-card.ttb-quick-with-query { grid-template-columns: 28px minmax(0, 1fr) repeat(3, 30px); }
    #ttb-quick-page .ttb-quick-with-query > button:first-child, #ttb-root #ttb-quick-list .ttb-quick-with-query > button:first-child { grid-column: 2; grid-row: 1; }
    #ttb-quick-page .ttb-quick-card > button.ttb-quick-query:not(:first-child), #ttb-root #ttb-quick-list .ttb-quick-card > button.ttb-quick-query:not(:first-child) { grid-column: 1; grid-row: 1; justify-self: center; width: 28px !important; min-width: 28px; max-width: 28px; height: 28px; min-height: 0; white-space: nowrap !important; writing-mode: horizontal-tb; word-break: normal; font-size: 16px; padding: 0; }
    .ttb-quick-card img { width: 40px; height: 40px; object-fit: contain; }
    .ttb-quick-card button:disabled { opacity: .5; cursor: wait; }
    .ttb-quick-label { display: block; min-width: 0; width: 100%; overflow-wrap: break-word; word-break: normal; text-align: left; white-space: normal; }
    .ttb-quick-name { display: block; font-weight: 600; }
    .ttb-quick-source { display: block; margin-top: 3px; color: #b4bcc8; font-size: 11px; font-weight: normal; }
    .ttb-quick-source[data-source="faction"] { color: #4ade80; }
    .ttb-quick-source[data-source="own"] { color: #fbbf24; }
    #ttb-quick-available .ttb-quick-available-item { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
    #ttb-quick-available .ttb-quick-available-item > span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    #ttb-quick-available .ttb-add-quick { flex: 0 0 auto; width: auto; padding: 6px 8px; font-size: 11px; }
    #ttb-quick-picker .ttb-quick-search-field { margin-top: 10px; }
    #ttb-quick-search-count { display: block; margin: 6px 0; color: var(--ttb-muted); }
    #ttb-quick-available .ttb-quick-bonuses { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
    #ttb-quick-available .ttb-quick-bonus { display: inline-block; padding: 3px 6px; border: 1px solid #c49a43; border-radius: 5px; background: #49391e; color: #ffe08a; font-size: 11px; font-weight: 600; overflow-wrap: anywhere; }
        .actions-wrap.ttb-compact-actions { display:flex; flex-wrap:nowrap; align-items:center; }
        .actions-wrap.ttb-compact-actions > li:not(.clear):not(.ttb-page-add-cell) { flex:1 1 0; min-width:0; width:auto !important; float:none; }
        .actions-wrap.ttb-compact-actions > li.clear { display:none; }
        .actions-wrap.ttb-compact-actions > li > .icon-h { width:100%; box-sizing:border-box; }
        .actions-wrap.ttb-compact-actions > li > .icon-h > button { max-width:100%; }
        .actions-wrap.ttb-compact-actions > .ttb-page-add-cell { flex:0 0 20px; width:20px !important; min-width:20px; height:31px; float:none; display:flex !important; align-items:center; justify-content:center; }
        .ttb-page-add-cell > .ttb-page-add-quick { position:static !important; display:inline-flex !important; align-items:center; justify-content:center; box-sizing:border-box; width:18px !important; min-width:18px; height:18px !important; margin:0 !important; padding:0 !important; border:1px solid #687182; border-radius:50%; background:#32373f; color:#fff; cursor:pointer; font:700 12px/1 sans-serif; }
        .ttb-page-add-quick:disabled { opacity:.55; cursor:default; }
        .ttb-quick-card { position:relative; }
        .ttb-quick-card .ttb-drag-handle { position:absolute; right:4px; bottom:2px; width:24px !important; padding:0 !important; cursor:grab; opacity:.6; }
        .ttb-quick-card .ttb-quick-mods { padding-right:25px; }
        .ttb-quick-card.ttb-dragging { opacity:.55; outline:2px solid #87bfff; }
    #ttb-quick-response { white-space: pre-wrap; margin-top: 10px; }
    .ttb-quick-link { display: inline-block; margin: 8px; color: #6eb0ff; }
    #ttb-quick-page .ttb-quick-feedback:not([hidden]) { padding:10px 12px; margin-top:10px; border:1px solid #345372; border-radius:9px; background:#1b2b3e; color:#c7def7; white-space:pre-wrap; line-height:1.6; }
`);
render(); scan();
const loadoutDiagnosticButton=button('查看装备栏诊断',showLoadoutDiagnostic);
loadoutDiagnosticButton.classList.add('ttb-btn','ttb-secondary');response.before(loadoutDiagnosticButton);
document.addEventListener('click',event=>{
    const pageAdd = event.target.closest?.('[data-ttb-page-add]');
    if (pageAdd) {
        event.preventDefault(); event.stopImmediatePropagation();
        const row = pageAdd.closest('li[data-item][data-category]');
        if (!row || !enabled.checked || items.some(item => item.id === row.dataset.item)) return;
        items.push({id:String(row.dataset.item), category:row.dataset.category, name:itemName(row, row.dataset.item)}); save();
        return;
    }
    // Page feedback is a clone of the toolbox response; resolve the diagnostic button here.
    if(event.target.closest('#ttb-quick-page .ttb-source-diagnostic')) {
        const last=items.find(item=>item.id===event.target.closest('.ttb-source-diagnostic').dataset.item);
        if(last) showSourceDiagnostic(last);
    }
}, true);
window.addEventListener('blur',()=>{modLoadedAt=0;});
window.addEventListener('focus', () => { if(activePage()) scan(); });
document.addEventListener('visibilitychange', () => { if(activePage()) scan(); });
if (location.pathname === '/item.php') {
    observer = new MutationObserver(records => {
        if (records.every(r => {
            const target = r.target instanceof Element ? r.target : r.target.parentElement;
            return target && (target.closest('#ttb-root, #ttb-quick-page, .ttb-add-quick') || Array.from(r.addedNodes).every(n => n.nodeType === 1 && n.matches('.ttb-add-quick, #ttb-quick-page')) && r.addedNodes.length);
        })) return;
        clearTimeout(timer); timer = setTimeout(scan, 120);
    });
    observer.observe(document.body, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['data-equipped', 'data-rowkey', 'data-row-key', 'data-item', 'data-category', 'data-qty', 'data-quantity', 'data-source', 'data-factionid', 'data-faction-id', 'data-faction-item', 'disabled', 'aria-disabled', 'title', 'aria-label', 'alt', 'data-bonus', 'data-bonus-name', 'src', 'alt']});
    window.addEventListener('beforeunload', () => { observer.disconnect(); clearTimeout(timer); });
}
})();

// Shared visual system for every toolbox pane; scoped to toolbox-owned elements.

// Shared visual system for every toolbox pane; scoped to toolbox-owned elements.

// Shared visual system for every toolbox pane; scoped to toolbox-owned elements.
(function initToolboxTheme() {
    const root = document.getElementById('ttb-root');
    const intros = {
        buy: ['交易分析', '交易分析', '购买均价', '購買均價', '选择物品与交易来源，查看购买成本及 Mug 抵扣。', '選擇物品與交易來源，查看購買成本及 Mug 抵扣。'],
        sell: ['交易分析', '交易分析', '出售均价', '出售均價', '按来源与时间范围整理出售收入和均价。', '按來源與時間範圍整理出售收入和均價。'],
        attacks: ['战斗记录', '戰鬥紀錄', '攻击筛选', '攻擊篩選', '组合筛选条件，生成可复制的攻击记录清单。', '組合篩選條件，產生可複製的攻擊紀錄清單。'],
        undercut: ['市场监测', '市場監測', '压价助手', '壓價助手', '选择监听范围，及时查看低价竞争提醒。', '選擇監聽範圍，及時查看低價競爭提醒。'],
        company: ['公司管理', '公司管理', '公司监听', '公司監聽', '定期检查新申请，集中查看提醒和运行状态。', '定期檢查新申請，集中查看提醒和執行狀態。'],
        quick: ['物品管理', '物品管理', '快捷物品', '快捷物品', '收藏常用物品，查看库存来源并快速使用或装备。', '收藏常用物品，查看庫存來源並快速使用或裝備。']
    };
    const headers = [];
    Object.entries(intros).forEach(([key, content]) => {
        const pane = root.querySelector('[data-pane="' + key + '"]');
        const header = document.createElement('header'); header.className = 'ttb-pane-heading';
        const kicker = document.createElement('small'), title = document.createElement('h2'), description = document.createElement('p');
        header.append(kicker, title, description); pane.prepend(header);
        headers.push({content, kicker, title, description});
    });
    function syncLanguage() {
        const offset = ttbLanguage === 'zhHant' ? 1 : 0;
        headers.forEach(({content, kicker, title, description}) => {
            kicker.textContent = content[offset]; title.textContent = content[2 + offset]; description.textContent = content[4 + offset];
        });
    }
    const apiBar = root.querySelector('.ttb-api-bar');
    const apiInput = document.getElementById('ttb-api-key');
    const label = document.createElement('label'); label.htmlFor = apiInput.id; label.textContent = 'API KEY'; label.className = 'ttb-api-label';
    const apiControls = document.createElement('div'); apiControls.className = 'ttb-api-controls';
    const reveal = document.createElement('button'); reveal.type = 'button'; reveal.className = 'ttb-key-reveal'; reveal.textContent = '◉'; reveal.setAttribute('aria-label', '显示 API Key'); reveal.setAttribute('aria-pressed', 'false');
    apiInput.type = 'password';
    apiControls.append(apiInput, reveal); apiBar.replaceChildren(label, apiControls);
    reveal.addEventListener('click', () => {
        const show = apiInput.type === 'password'; apiInput.type = show ? 'text' : 'password';
        reveal.setAttribute('aria-pressed', String(show)); reveal.setAttribute('aria-label', show ? '隐藏 API Key' : '显示 API Key');
    });
    const quickPane = root.querySelector('[data-pane="quick"]');
    quickPane.querySelector('label').classList.add('ttb-feature-toggle');
    const quickActions = document.createElement('div'); quickActions.className = 'ttb-btn-row ttb-quick-actions';
    document.getElementById('ttb-quick-add').before(quickActions);
    quickActions.append(document.getElementById('ttb-quick-add'), document.getElementById('ttb-quick-refresh'));
    document.getElementById('ttb-quick-refresh').classList.add('ttb-secondary');
    function syncTab() {
        const active = root.querySelector('.ttb-tab.active');
        apiBar.hidden = active?.dataset.tab === 'quick';
        root.querySelectorAll('.ttb-tab').forEach(tab => { tab.setAttribute('aria-selected', String(tab === active)); tab.tabIndex = tab === active ? 0 : -1; });
        scrollBodyToTop();
    }
    root.querySelector('.ttb-tabs').setAttribute('role', 'tablist');
    const tabs = Array.from(root.querySelectorAll('.ttb-tab'));
    tabs.forEach((tab, index) => {
        tab.id ||= 'ttb-tab-' + tab.dataset.tab;
        tab.setAttribute('role', 'tab'); tab.addEventListener('click', syncTab);
        const pane = root.querySelector('[data-pane="' + tab.dataset.tab + '"]');
        pane.id ||= 'ttb-pane-' + tab.dataset.tab; pane.setAttribute('role', 'tabpanel'); pane.setAttribute('aria-labelledby', tab.id); tab.setAttribute('aria-controls', pane.id);
        tab.addEventListener('keydown', event => {
            const step = {ArrowRight:1, ArrowLeft:-1, ArrowDown:3, ArrowUp:-3}[event.key];
            let next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : step !== undefined ? (index + step + tabs.length) % tabs.length : null;
            if (next === null) return;
            event.preventDefault(); tabs[next].click(); tabs[next].focus();
        });
    });
    document.getElementById('ttb-lang-toggle').addEventListener('click', syncLanguage);
    syncLanguage(); syncTab();
    GM_addStyle(`
        #ttb-root {
            --ttb-bg:#121821; --ttb-surface:#1b2430; --ttb-surface2:#222e3c;
            --ttb-border:#344254; --ttb-text:#edf3fa; --ttb-muted:#a2b2c6;
            --ttb-accent:#87bfff; --ttb-accent-dk:#3979d6; --ttb-radius:18px;
            font-family: "Segoe UI", "Microsoft YaHei", system-ui, sans-serif; font-size:13px; line-height:1.5;
            color-scheme:dark;
        }
        #ttb-root.ttb-expanded { right:16px; }
        #ttb-root *, #ttb-root *::before, #ttb-root *::after { box-sizing:border-box; }
        #ttb-panel { width:min(560px, calc(100vw - 32px)); height:min(88vh, 900px); max-height:min(88vh, 900px); border-color:#415064; box-shadow:0 24px 80px #0009; }
        #ttb-root .ttb-header { padding:18px 20px; background:linear-gradient(120deg,#213248,#18212e); border-bottom-color:#344254; }
        #ttb-root .ttb-header h1 { font-size:18px; letter-spacing:.2px; }
        #ttb-root .ttb-header-btns { gap:7px; }
        #ttb-root .ttb-icon-btn { width:34px; height:34px; border:1px solid #ffffff12; border-radius:9px; background:#ffffff08; }
        #ttb-root #ttb-time-toggle { width:auto; min-width:48px; }
        #ttb-root .ttb-api-bar { padding:12px 20px; background:#151e2a; border:0; }
        #ttb-root .ttb-api-label { display:block; margin-bottom:5px; color:var(--ttb-muted); font-size:10px; font-weight:700; letter-spacing:1.4px; }
        #ttb-root .ttb-api-controls { display:flex; gap:8px; }
        #ttb-root .ttb-api-controls input { min-width:0; flex:1; height:38px; background:#1c2735; border-radius:9px; font-family:Consolas,monospace; }
        #ttb-root .ttb-key-reveal { flex:0 0 38px; border:1px solid var(--ttb-border); border-radius:9px; background:#1c2735; color:var(--ttb-muted); cursor:pointer; }
        #ttb-root .ttb-tabs { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:6px; padding:10px 16px 14px; overflow:visible; background:#151e2a; }
        #ttb-root .ttb-tab { min-width:0; padding:9px 4px; margin:0; border:1px solid transparent; border-radius:9px; font-size:12px; }
        #ttb-root .ttb-tab:hover { background:#ffffff08; }
        #ttb-root .ttb-tab.active { background:#284365; border-color:#4977aa; color:#dfeeff; }
        #ttb-root .ttb-tab.active-monitoring { color:var(--ttb-warn); }
        #ttb-root .ttb-tab.active-monitoring.active { border-color:#b48c38; }
        #ttb-root .ttb-body { padding:22px; scrollbar-width:thin; scrollbar-color:#41516a transparent; }
        #ttb-root .ttb-pane-heading { margin-bottom:22px; }
        #ttb-root .ttb-pane-heading > small { display:block; color:var(--ttb-accent); font-size:10px; font-weight:700; letter-spacing:1.5px; }
        #ttb-root .ttb-pane-heading h2 { font-size:23px; font-weight:650; line-height:1.3; margin:5px 0 7px; color:var(--ttb-text); }
        #ttb-root .ttb-pane-heading p { margin:0; color:var(--ttb-muted); font-size:12px; line-height:1.7; }
        #ttb-root .ttb-field { margin-bottom:18px; }
        #ttb-root .ttb-field > label { margin-bottom:7px; font-size:12px; letter-spacing:0; }
        #ttb-root .ttb-field input, #ttb-root .ttb-field select, #ttb-root .ttb-field textarea, #ttb-root .ttb-select-display { min-height:42px; padding:10px 12px; border-radius:10px; background:#1c2735; border-color:var(--ttb-border); line-height:1.4; }
        #ttb-root .ttb-field input:focus, #ttb-root .ttb-field select:focus, #ttb-root .ttb-field textarea:focus { border-color:var(--ttb-accent); box-shadow:0 0 0 3px #87bfff16; }
        #ttb-root .ttb-row { gap:12px; }
        #ttb-root .ttb-checks { padding:10px 12px; gap:8px; border:1px solid var(--ttb-border); border-radius:10px; background:#18222f; }
        #ttb-root .ttb-checks .ttb-check { display:flex; margin:0; min-height:28px; font-weight:400; color:var(--ttb-text); }
        #ttb-root .ttb-checks input, #ttb-root .ttb-feature-toggle input { width:16px; min-height:16px; height:16px; padding:0; flex:0 0 16px; accent-color:var(--ttb-accent); }
        #ttb-root .ttb-btn { min-height:42px; border-radius:10px; padding:10px 14px; background:#3979d6; box-shadow:0 3px 8px #0002; text-shadow:none; transition:background .15s; }
        #ttb-root .ttb-btn:hover { background:#498ce9; }
        #ttb-root .ttb-btn.green { background:#237f64; }
        #ttb-root .ttb-btn.green:hover { background:#299774; }
        #ttb-root .ttb-btn.red { background:#a74558; }
        #ttb-root .ttb-btn.red:hover { background:#bc5267; }
        #ttb-root .ttb-btn.ttb-secondary { border:1px solid var(--ttb-border); background:#222e3c; color:#cfdeef; }
        #ttb-root .ttb-msg-error:not(:empty), #ttb-root .ttb-msg-info:not(:empty), #ttb-root #ttb-quick-response:not(:empty) { padding:11px 12px; border:1px solid #75424c; border-radius:10px; background:#34212a; line-height:1.6; }
        #ttb-root .ttb-msg-info:not(:empty), #ttb-root #ttb-quick-response:not(:empty) { background:#1b2b3e; border-color:#345372; color:#c7def7; }
        #ttb-root .ttb-card, #ttb-root .ttb-status { padding:16px; border-radius:12px; background:#1b2634; }
        #ttb-root .ttb-stat-row { padding:9px 0; font-variant-numeric:tabular-nums; }
        #ttb-root .ttb-item { padding:14px; border-radius:11px; background:#18222f; margin-bottom:10px; }
        #ttb-root .ttb-item h4 { font-size:14px; margin-bottom:8px; }
        #ttb-root .ttb-item p { color:#b7c7da; }
        #ttb-root a { color:var(--ttb-accent); text-decoration:none; }
        #ttb-root a:hover { text-decoration:underline; }
        #ttb-root .ttb-select-drop { border-radius:10px; margin-top:5px; overflow:hidden; background:#202d3e; }
        #ttb-root .ttb-select-search { min-height:40px; padding:10px 12px; }
        #ttb-root .ttb-select-opt { padding:10px 12px; }
        #ttb-root .ttb-feature-toggle { display:flex; align-items:center; gap:9px; padding:12px; border:1px solid var(--ttb-border); background:#1b2634; border-radius:10px; }
        #ttb-root [data-pane="quick"] > p { color:var(--ttb-muted); font-size:12px; line-height:1.7; margin:12px 0; }
        #ttb-root .ttb-quick-actions { margin:16px 0; gap:10px; }
        #ttb-root #ttb-quick-picker { padding:12px; margin:14px 0; border:1px solid var(--ttb-border); border-radius:12px; background:#17212e; }
        #ttb-root #ttb-quick-picker summary { cursor:pointer; font-weight:600; color:#d0e1f4; }
        #ttb-root #ttb-quick-list .ttb-quick-card { background:#1a2533; border:1px solid var(--ttb-border); border-radius:11px; padding:8px; gap:5px; }
        #ttb-root #ttb-quick-list .ttb-quick-button { background:transparent; border-color:transparent; border-radius:7px; }
        #ttb-root #ttb-quick-list .ttb-quick-button:hover { background:#30435b; }
        #ttb-root #ttb-quick-available .ttb-quick-available-item { border-bottom:1px solid #ffffff0a; padding:10px 0; margin:0; }
        #ttb-root #ttb-quick-available .ttb-add-quick { border-color:#456994; background:#264468; color:#dfedff; }
        #ttb-root #ttb-quick-available .ttb-add-quick:disabled { opacity:.5; cursor:default; }
        #ttb-root button:focus-visible, #ttb-root summary:focus-visible, #ttb-root a:focus-visible { outline:2px solid var(--ttb-accent); outline-offset:3px; }
        #ttb-quick-page { background:#17212e; border-color:#3a4d65; border-radius:14px; padding:14px; font:13px/1.5 "Segoe UI", "Microsoft YaHei",sans-serif; }
        #ttb-quick-page .ttb-quick-card { background:#202d3e; border:1px solid #3a4d65; padding:7px; border-radius:10px; }
        #ttb-quick-page .ttb-quick-button { background:transparent; border-color:transparent; }
        #ttb-quick-page .ttb-quick-button:hover { background:#30435b; }
        @media(max-width:600px) {
            #ttb-root.ttb-expanded { right:8px; }
            #ttb-panel { width:calc(100vw - 16px); height:90dvh; max-height:90dvh; }
            #ttb-root .ttb-header { padding:14px; }
            #ttb-root .ttb-header h1 { font-size:16px; }
            #ttb-root .ttb-api-bar { padding:10px 14px; }
            #ttb-root .ttb-tabs { padding:8px 10px 12px; }
            #ttb-root .ttb-body { padding:16px; }
            #ttb-root .ttb-pane-heading h2 { font-size:21px; }
            #ttb-root .ttb-row { flex-direction:column; gap:0; }
            #ttb-root .ttb-icon-btn { width:32px; height:32px; }
        }
        @media(prefers-reduced-motion:reduce) { #ttb-root *, #ttb-quick-page * { animation:none !important; transition:none !important; } }
    `);
})();

    // END TOOLBOX ITEM MODULES
})();
