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
        .ttb-mobile-count, #ttb-quick-page > .ttb-mobile-more { display:none !important; }
        @media(max-width:600px) {
            #ttb-quick-page { padding:8px; border-radius:10px; margin:6px 0; }
            #ttb-quick-page > button { padding:4px 5px; margin:0 3px 5px 0; font-size:11px; }
            #ttb-quick-page > .ttb-mobile-more { display:inline-block !important; font-size:20px; min-width:30px; }
            #ttb-quick-page:not(.ttb-mobile-manage) > .ttb-page-tool { display:none !important; }
            #ttb-quick-page .ttb-quick-grid:not([hidden]) { display:flex; flex-wrap:wrap; align-items:flex-start; gap:6px; }
            #ttb-quick-page .ttb-quick-card { display:flex !important; flex-wrap:wrap; align-items:center; gap:3px; width:auto !important; max-width:100%; min-width:0; margin:0; padding:3px 5px 3px 3px; border-radius:22px; background:#34404d; }
            #ttb-quick-page .ttb-quick-card > button:first-child { display:flex !important; gap:5px; width:auto !important; min-width:0; max-width:100%; padding:0 3px 0 0; min-height:30px; }
            #ttb-quick-page .ttb-quick-card > button:first-child > img,
            #ttb-quick-page .ttb-quick-source { display:none; }
            #ttb-quick-page .ttb-mobile-count { display:inline-flex !important; flex:0 0 auto; justify-content:center; align-items:center; min-width:28px; height:28px; padding:0 3px; box-sizing:border-box; border-radius:50%; background:#111820; color:#9ddeac; font-size:12px; font-weight:700; }
            #ttb-quick-page .ttb-mobile-count[data-source="faction"] { color:#4ade80; }
            #ttb-quick-page .ttb-quick-label { width:auto; max-width:132px; }
            #ttb-quick-page .ttb-quick-name { font-size:12px; line-height:1.2; overflow-wrap:break-word; }
            #ttb-quick-page:not(.ttb-mobile-manage) .ttb-quick-card > button:not(:first-child) { display:none !important; }
            #ttb-quick-page.ttb-mobile-manage .ttb-quick-card > button:not(:first-child) { width:24px !important; height:24px; padding:0 !important; }
            #ttb-quick-page .ttb-quick-card .ttb-quick-mods { display:flex; gap:3px; padding:0; }
            #ttb-quick-page .ttb-quick-mods > button { font-size:10px !important; padding:3px 4px !important; }
            #ttb-quick-page .ttb-quick-card .ttb-drag-handle { position:static; }
            #ttb-quick-page .ttb-quick-feedback:not([hidden]) { padding:6px 8px; margin-top:6px; font-size:11px; }
        }
        @media(prefers-reduced-motion:reduce) { #ttb-root *, #ttb-quick-page * { animation:none !important; transition:none !important; } }
    `);
})();
