// ==UserScript==
// @name         Torn 切针小助手
// @namespace    http://tampermonkey.net/
// @version      5.5.3
// @description  快速切针/切雷（帮派优先），兼容手机，自动检测当前状态，防脱针，窗口开关/拖拽/倍率缩放、自定义按钮顺序、快捷键（长按1秒进入排序模式），攻击页面、切针面板显示针buff倒计时。
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/page.php?sid=attack*
// @author       2687001&DeepSeek
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==
/* eslint-disable no-return-assign */

(function() {
    'use strict';

    const CFG = {
        PANEL_WIDTH: 180,
        BTN_HEIGHT: 44,
        MIN_SCALE: 0.5,
        MAX_SCALE: 2.0,
        D_SCALE: 1.0, M_SCALE: 1.0,
        MONITOR: 500, EQUIP_TIMEOUT: 5000, MSG_INTERVAL: 100,
        LONG_PRESS: 1000, CLICK_MAX_DUR: 1000, CLICK_MAX_MOVE: 8,
        SHORTCUT_COOLDOWN: 50, INIT_SCAN: 100, DOM_WAIT: 100, DOM_MONITOR: 200,
        CLICK_DELAY: 50, FADE: 1000, OOS_PAUSE: 300, PROMPT_LOCK: 500, NOTIFY_DUR: 5000,
        BUFF_DEBOUNCE: 100,
        TIMERS_KEY: 'torn_booster_timers', TIMERS_SYNC_KEY: 'torn_booster_timers_broadcast',
        OVERLAY_ALPHA: 0.3
    };

    const BOOSTERS = [
        { id:464, name:'Melatonin', dsp:'速度', full:'速度针', color:'#dfdf00', cat:'booster', eff:'hastened' },
        { id:463, name:'Epinephrine', dsp:'力量', full:'力量针', color:'#ae3a00', cat:'booster', eff:'strengthened' },
        { id:814, name:'Tyrosine', dsp:'敏捷', full:'敏捷针', color:'#a700ff', cat:'booster', eff:'sharpened' },
        { id:465, name:'Serotonin', dsp:'防御', full:'防御针', color:'#00ddeb', cat:'booster', eff:'hardened' }
    ];
    const GRENADES = [
        { id:226, name:'Smoke Grenade', dsp:'烟雾', full:'烟雾弹', color:'#9b59b6', cat:'grenade' },
        { id:222, name:'Flash Grenade', dsp:'闪光', full:'闪光弹', color:'#9b59b6', cat:'grenade' },
        { id:256, name:'Tear Gas', dsp:'催泪', full:'催泪瓦斯', color:'#9b59b6', cat:'grenade' },
        { id:392, name:'Pepper Spray', dsp:'胡椒', full:'胡椒喷雾', color:'#9b59b6', cat:'grenade' },
        { id:242, name:'HEG', dsp:'高爆', full:'高爆弹', color:'#9b59b6', cat:'grenade' }
    ];
    const GC = {}; GRENADES.forEach(g => GC[g.id]=g);
    const BC = {}; BOOSTERS.forEach(b => BC[b.id]=b);
    const ALL = [...BOOSTERS, ...GRENADES];
    const EIM = {}; BOOSTERS.forEach(b => EIM[b.eff]=b.id);

    const SK = {
        BO:'torn_booster_order', GO:'torn_grenade_order', SH:'torn_shortcuts_v2',
        BR:'torn_equipped_broadcast', ES:'torn_equipped_state',
        TI:CFG.TIMERS_KEY, TS:CFG.TIMERS_SYNC_KEY
    };

    let panel, titleBar, titleStat, titleSrc, titlePref, titleOrigHTML;
    let sep, boosterGrid, grenadeGrid;

    let mi, dmi, tabObs, brListener;
    let mainOn=false, grenOn=false;
    let cmdMain, cmdGren, cmdClear, cmdScale;
    let sortMode=false, shortcuts={}, bb={}, gb={};
    let bOrder=[], gOrder=[];
    let scale=1, desktop=false, userScale=null, applyingScale=false;
    let dragging=false, dx, dy, pl, pt, dragStarted=false;
    const DRAG_THR=5;
    let equipLock=false, monRunning=false, active=false;
    let waitDOM=false, waitTimer, longPressTimer, lastKey={};
    let promptLock=false, domPaused=false, domResumeTimer;
    let eqState={item:null, src:null, ts:0, by:null};
    let initTimer, eqInit=false;
    let abo=null, abst=null, timers={}, cdTimeout=null, tsyncListener=null;
    let pageActive = true;

    const origBg=new WeakMap(), origCol=new WeakMap(), origFil=new WeakMap(), oosHandlers=new WeakMap();
    let normalStates=new WeakMap();

    const evCtrl=new AbortController(), sig=evCtrl.signal;
    const KEYS=new Set('0123456789abcdefghijklmnopqrstuvwxyz`-=[]\\;\',./'.split(''));

    // ==================== 辅助函数 ====================
    function isFac(it) {
        if(!it?.getAttribute) return false;
        let r=it.getAttribute('data-rowkey');
        if(!r) return false;
        let m=r.match(/f(\d+)$/);
        return m && parseInt(m[1])>0;
    }
    function isPers(it) {
        if(!it?.getAttribute) return false;
        let r=it.getAttribute('data-rowkey');
        if(!r) return false;
        let m=r.match(/f(\d+)$/);
        return m && parseInt(m[1])===0;
    }
    function typeFromItem(it) {
        if(!it) return null;
        let id=it.getAttribute('data-item');
        if(id && BC[id]) return BC[id];
        if(id && GC[id]) return GC[id];
        let img=it.querySelector('img.torn-item');
        if(img && img.alt) for(let c of ALL) if(img.alt===c.name) return c;
        let ns=it.querySelector('.name');
        if(ns){let n=ns.textContent.trim(); for(let c of ALL) if(n===c.name) return c;}
        return null;
    }
    function isEq(it) { return it?.getAttribute('data-equipped')==='true'; }

    // ==================== 装备状态 ====================
    function scanEq() {
        let all=[...Object.keys(BC),...Object.keys(GC)];
        for(let id of all){
            let el=document.querySelector(`li[data-category="Temporary"][data-item="${id}"]`);
            if(el && isEq(el)){
                let ic=typeFromItem(el); if(!ic) continue;
                let src='unknown'; if(isFac(el)) src='faction'; else if(isPers(el)) src='own';
                return {item:ic, src};
            }
        }
        return null;
    }
    function broadcastEq(ic,src,act){
        let d={itemId:ic?.id||null, src, ts:Date.now(), action:act||(ic?'equip':'unequip')};
        GM_setValue(SK.BR,d);
        setTimeout(()=>{let c=GM_getValue(SK.BR,null); if(c&&c.ts===d.ts) setTimeout(()=>GM_deleteValue(SK.BR),5000);},100);
    }
    function initBrListener(){
        if(brListener) return;
        brListener=GM_addValueChangeListener(SK.BR,(n,o,nv)=>{
            if(!nv||!mainOn||!active) return;
            if(Date.now()-nv.ts>10000) return;
            if(nv.itemId===null) { if(eqState.item) clearEq('broadcast'); notif('其他页面已卸下装备',false,true,1500); }
            else { let ic=BC[nv.itemId]||GC[nv.itemId]; if(ic&&eqState.item?.id!==ic.id){setEq(ic,nv.src,'broadcast'); notif(`其他页面切换为：${ic.full}`,false,false,1500);} }
        });
    }
    function syncLastBr(){
        let last=GM_getValue(SK.BR,null);
        if(last&&Date.now()-last.ts<10000){
            if(last.itemId===null){if(eqState.item)clearEq('broadcast');}
            else{let ic=BC[last.itemId]||GC[last.itemId]; if(ic&&eqState.item?.id!==ic.id)setEq(ic,last.src,'broadcast');}
        }
    }
    function persistEq(ic,src){GM_setValue(SK.ES,{itemId:ic.id,itemName:ic.full,src,ts:Date.now(),cat:ic.cat});}
    function loadPersistedEq(){
        let p=GM_getValue(SK.ES,null);
        if(p&&p.itemId){
            let ic=BC[p.itemId]||GC[p.itemId];
            if(ic){eqState={item:ic,src:p.src,ts:p.ts,by:'persisted'}; return true;}
            else GM_deleteValue(SK.ES);
        }
        return false;
    }
    function setEq(ic,src,by){
        if(!mainOn&&by!=='dom') return;
        eqState={item:ic,src,ts:Date.now(),by};
        persistEq(ic,src);
        if(mainOn&&active&&!sortMode) updateTitle();
        if(by==='message') broadcastEq(ic,src,'equip');
    }
    function clearEq(by='message'){
        if(!mainOn&&by!=='dom') return;
        eqState={item:null,src:null,ts:Date.now(),by};
        GM_deleteValue(SK.ES);
        if(mainOn&&active&&!sortMode) updateTitle();
        if(by==='message') broadcastEq(null,null,'unequip');
    }
    function getEqId(){return eqState.item?.id||null;}
    function refreshCache(){if(!mainOn)return null;let e=scanEq();if(e){setEq(e.item,e.src,'dom');return e;}else{clearEq('dom');return null;}}

    // ==================== Buff 时间管理（endtime） ====================
    function loadTimers(){
        try{timers=GM_getValue(SK.TI,{});}catch(e){timers={};}
        const now=Date.now();
        for(let k in timers){
            let e=timers[k];
            if(e.sec!==undefined){timers[k]={endtime:e.scan+e.sec*1000};}
            else if(e.endtime!==undefined){if(e.endtime<now-60000) delete timers[k];}
        }
        GM_setValue(SK.TI,timers);
    }
    function saveTimer(id,endtime){
        timers[id]={endtime};
        GM_setValue(SK.TI,timers);
        GM_setValue(SK.TS,{itemId:id,endtime,ts:Date.now()});
        setTimeout(()=>GM_deleteValue(SK.TS),1000);
    }
    function removeTimer(id){
        if(timers[id]){delete timers[id]; GM_setValue(SK.TI,timers); GM_setValue(SK.TS,{itemId:id,endtime:null,ts:Date.now()}); setTimeout(()=>GM_deleteValue(SK.TS),1000);}
    }
    function initTSync(){
        if(tsyncListener) return;
        tsyncListener=GM_addValueChangeListener(SK.TS,(n,o,nv)=>{
            if(!nv) return;
            let {itemId,endtime}=nv;
            if(endtime===null) delete timers[itemId];
            else timers[itemId]={endtime};
            if(mainOn&&active) updateCDs();
            updateAttackDsp();
        });
    }

    // ==================== 攻击页面监控（通配符选择器） ====================
    function startABM(){
        if(!location.href.includes('page.php?sid=attack')||abo) return;
        let c=document.querySelector('div[class*="scrollIconsWrap"][class*="right"] div[class*="iconsWrap"]');
        if(!c){let w=setInterval(()=>{if(document.querySelector('div[class*="scrollIconsWrap"][class*="right"] div[class*="iconsWrap"]')){clearInterval(w);startABM();}},500);return;}
        let dt;
        let scan=()=>{
            if(!pageActive) return;
            let items=c.querySelectorAll('div[class*="iconWrap"]'), found=new Set(), now=Date.now();
            items.forEach(w=>{
                let img=w.querySelector('img[class*="iconImg"]'), te=w.querySelector('div[class*="timeLeft"]');
                if(!img||!te) return;
                let alt=img.getAttribute('alt')||'', m=alt.match(/effect icon (\w+)/);
                if(!m) return; let id=EIM[m[1]]; if(!id) return;
                let sec=parseInt(te.textContent.trim(),10);
                if(isNaN(sec)||sec<=0) return;
                let endtime=now+sec*1000;
                saveTimer(id,endtime);
                found.add(id);
            });
            for(let k in timers){let id=parseInt(k); if(!found.has(id)&&Object.keys(EIM).some(kk=>EIM[kk]===id)) removeTimer(id);}
            updateAttackDsp();
            if(mainOn&&active) updateCDs();
        };
        abo=new MutationObserver(()=>{clearTimeout(dt); dt=setTimeout(scan,CFG.BUFF_DEBOUNCE);});
        abo.observe(c,{childList:true,subtree:true,characterData:true});
        scan();
        if(abst)clearInterval(abst);
        abst=setInterval(scan,10000);
    }
    function stopABM(){if(abo){abo.disconnect();abo=null;}if(abst){clearInterval(abst);abst=null;}}

    // ==================== 攻击页面显示（直接修改h4，不依赖外部span） ====================
    function updateAttackDsp(){
        let h4=document.querySelector('div[class*="titleContainer"]>h4[class*="title"]');
        if(!h4) return;
        let c=document.querySelector('div[class*="scrollIconsWrap"][class*="right"] div[class*="iconsWrap"]');
        let items=c ? c.querySelectorAll('div[class*="iconWrap"]') : [];
        if(!items.length){
            if(h4.textContent!=='Attacking') h4.textContent='Attacking';
            return;
        }
        let narrow=window.innerWidth<800||h4.scrollWidth>h4.offsetWidth;
        let parts=[];
        items.forEach(w=>{
            let img=w.querySelector('img[class*="iconImg"]'), te=w.querySelector('div[class*="timeLeft"]');
            if(!img||!te) return;
            let alt=img.getAttribute('alt')||'', m=alt.match(/effect icon (\w+)/);
            if(!m) return; let id=EIM[m[1]]; if(!id) return;
            let name=BC[id]?.dsp; if(!name) return;
            let sec=parseInt(te.textContent.trim(),10); if(isNaN(sec)) return;
            let col=sec>60?'#2ecc71':sec>=30?'#f1c40f':'#e74c3c';
            if(narrow){
                let abbr=name.charAt(0);
                parts.push(`<span style="display:inline-block;background:rgba(0,0,0,0.65);color:white;border-radius:3px;padding:0 4px;margin:0 2px;font-size:13px;">${abbr}<span style="color:${col};font-weight:bold;">${sec}</span></span>`);
            } else {
                parts.push(`<span style="display:inline-block;background:rgba(0,0,0,0.65);color:white;border-radius:4px;padding:1px 6px;margin:0 3px;font-size:14px;">${name}<span style="color:${col};font-weight:bold;"> ${sec}</span></span>`);
            }
        });
        let text=parts.join('');
        if(narrow){
            h4.innerHTML=text;
        } else {
            h4.innerHTML='Attacking  '+text;
        }
    }

    // ==================== 倒计时标签 ====================
    function createCD(btn){
        let lbl=document.createElement('span');
        lbl.className='torn-cd-label';
        lbl.style.cssText='position:absolute;bottom:2px;right:4px;font-size:11px;font-weight:bold;color:#e74c3c;background:rgba(0,0,0,0.6);border-radius:3px;padding:0 4px;line-height:1.4;pointer-events:none;display:none;z-index:5;';
        btn.style.position='relative';
        btn.appendChild(lbl);
        return lbl;
    }
    function updateCDs(){
        if(!mainOn||!active||sortMode) return;
        const now=Date.now();
        for(let idStr in bb){
            let id=parseInt(idStr), btn=bb[id];
            if(!btn?.isConnected) continue;
            if(!BC[id]) continue;
            let lbl=btn.querySelector('.torn-cd-label');
            if(!lbl) lbl=createCD(btn);
            let entry=timers[id];
            let sec=0;
            if(entry&&entry.endtime){
                sec=Math.max(0, Math.ceil((entry.endtime-now)/1000));
            }
            if(sec>0){
                let col=sec>60?'#2ecc71':sec>=30?'#f1c40f':'#e74c3c';
                lbl.textContent=sec; lbl.style.color=col;
                btn.style.position='relative'; lbl.style.display='block';
            }else{
                lbl.style.display='none';
            }
        }
    }

    // ==================== 缺货效果 ====================
    function addCross(btn){
        if(!btn||btn.querySelector('.oos-cross')) return;
        let c=document.createElement('div'); c.className='oos-cross';
        c.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
        c.innerHTML='<svg style="width:100%;height:100%;"><line x1="0" y1="0" x2="100%" y2="100%" stroke="#e74c3c" stroke-width="3"/><line x1="100%" y1="0" x2="0" y2="100%" stroke="#e74c3c" stroke-width="3"/></svg>';
        btn.appendChild(c);
    }
    function rmCross(btn){let c=btn?.querySelector('.oos-cross');if(c)c.remove();}
    function addOOS(btn){
        if(!btn||btn.querySelector('.oos-text')) return;
        let t=document.createElement('div'); t.className='oos-text'; t.textContent='已用完';
        t.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:bold;color:rgba(255,192,203,0.8);pointer-events:none;z-index:2;';
        btn.appendChild(t);
    }
    function rmOOS(btn){let t=btn?.querySelector('.oos-text');if(t)t.remove();}
    function applyOOS(btn, ic) {
        if (!btn) return;
        if (!origBg.has(btn)) {
            origBg.set(btn, btn.style.backgroundColor);
            origCol.set(btn, btn.style.color);
            origFil.set(btn, btn.style.filter);
        }
        btn.style.position = 'relative';
        btn.style.backgroundColor = '#555';
        btn.style.color = '#aaa';
        btn.style.filter = 'none';
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
        btn.style.cursor = 'not-allowed';
        addCross(btn);
        addOOS(btn);
        if (oosHandlers.has(btn)) {
            let prev = oosHandlers.get(btn);
            if (prev.handler) btn.removeEventListener('click', prev.handler);
        }
    }
    function restoreOOS(btn,ic){
        if(!btn) return;
        let ov=btn.querySelector('.equipped-overlay'); if(ov)ov.remove();
        let bg=origBg.get(btn),co=origCol.get(btn),fi=origFil.get(btn);
        if(ic&&(!bg||bg==='')) btn.style.backgroundColor=ic.color;
        else if(bg&&bg!=='') btn.style.backgroundColor=bg;
        else if(ic) btn.style.backgroundColor=ic.color;
        btn.style.color=co||'white'; btn.style.filter=fi||''; btn.style.position='relative';
        rmCross(btn);rmOOS(btn);
        let s=oosHandlers.get(btn); if(s?.handler) btn.removeEventListener('click',s.handler);
        btn.disabled=false; btn.style.pointerEvents=''; btn.style.cursor='';
    }
    function handleOOS(ic){notif(`${ic.full} 已用完，请补充`,true,false,3000);let el=document.querySelector(`li[data-category="Temporary"][data-item="${ic.id}"]`);if(el)setTimeout(()=>{if(el.parentNode)el.remove();},CFG.FADE);pauseDOM();updateStates();}
    function updateStates(){if(!domPaused)updateBtns();}

    // ==================== 装备按钮查找（带兜底） ====================
    function findBtn(id){
        let sel=`li[data-category="Temporary"][data-item="${id}"]`, items=document.querySelectorAll(sel);
        if(!items.length) return null;
        function f(it){
            let b=it.querySelector('button.option-equip'); if(b) return {btn:b, type:'equip'};
            let u=it.querySelector('span.icon-h.unequip[role="button"]'); if(u) return {btn:u, type:'unequip'};
            let i=it.querySelector('i.option-unequip'); if(i&&i.parentElement?.classList.contains('icon-h')) return {btn:i.parentElement, type:'unequip'};
            b=it.querySelector('button.option-unequip'); if(b) return {btn:b, type:'unequip'};
            let es=it.querySelector('span.icon-h.equip'); if(es){let cb=es.querySelector('button'); if(cb) return {btn:cb, type:'equip'};}
            let all=it.querySelectorAll('button,[role="button"]');
            for(let e of all){let t=e.textContent?.trim()||''; if(t.includes('Equip')) return {btn:e, type:'equip'}; if(t.includes('Unequip')) return {btn:e, type:'unequip'};}
            return null;
        }
        for(let it of items){let r=f(it); if(r&&isFac(it)) return {equipBtn:r.btn, src:'faction', item:it};}
        for(let it of items){let r=f(it); if(r&&isPers(it)) return {equipBtn:r.btn, src:'own', item:it};}
        for(let it of items){let r=f(it); if(r&&r.type==='equip') return {equipBtn:r.btn, src:'unknown', item:it};}
        for(let it of items){let r=f(it); if(r) return {equipBtn:r.btn, src:'unknown', item:it};}
        return null;
    }

    // ==================== 消息等待 ====================
    async function waitMsg(ic,el){
        if(!el||!document.contains(el)) return {success:false,isUnequip:false,isOOS:false,error:'物品元素已消失'};
        let end=Date.now()+CFG.EQUIP_TIMEOUT;
        let n=ic.name, eqText=`You equipped your ${n}.`, uneqText=`You unequipped your ${n}.`, oosText='You no longer own this item.';
        let observedOOS=false;
        while(Date.now()<end){
            let msgs=Array.from(el.querySelectorAll('.action-wrap')).filter(e=>window.getComputedStyle(e).display!=='none');
            for(let m of msgs){
                let t=m.textContent.trim();
                if(t===eqText) return {success:true,isUnequip:false,isOOS:false,error:null};
                if(t===uneqText) return {success:false,isUnequip:true,isOOS:false,error:'脱针'};
                if(t===oosText){observedOOS=true;}
                if(t.includes('You cannot equip this item because you are under attack')) return {success:false,isUnequip:false,isOOS:false,error:'正在被攻击'};
            }
            await new Promise(r=>setTimeout(r,CFG.MSG_INTERVAL));
        }
        if(observedOOS){handleOOS(ic); return {success:false,isUnequip:false,isOOS:true,error:`${ic.full} 已用完`};}
        return {success:false,isUnequip:false,isOOS:false,error:'超时'};
    }

    async function handleEquip(ic, skipCheck = false) {
        if (equipLock) return false;
        if (!mainOn || !active) { if (skipCheck) notif('脚本总开关已关闭', false, true, 3000); return false; }
        if (!skipCheck && sortMode) return false;
        if (ic.cat === 'booster' && !mainOn) { if (skipCheck) notif('脚本总开关已关闭', false, true, 3000); return false; }
        if (ic.cat === 'grenade' && (!mainOn || !grenOn)) { if (skipCheck) notif('手雷切换未开启', false, true, 3000); return false; }
        equipLock = true;
        try {
            let res = null;
            if (skipCheck) {
                res = findBtn(ic.id);
                if (!res) {
                    let itemRow = document.querySelector(`li[data-category="Temporary"][data-item="${ic.id}"]`);
                    if (itemRow) {
                        let equipBtn = itemRow.querySelector('button.option-equip') ||
                            itemRow.querySelector('span.icon-h.equip button') ||
                            itemRow.querySelector('[role="button"][class*="equip"]');
                        if (equipBtn) {
                            let src = 'unknown';
                            if (isFac(itemRow)) src = 'faction';
                            else if (isPers(itemRow)) src = 'own';
                            res = { equipBtn, src, item: itemRow };
                        }
                    }
                    if (!res) {
                        notif(`${ic.full} 已用完，请补充`, true, false, 3000);
                        return false;
                    }
                }
            } else {
                for (let attempt = 0; attempt < 10; attempt++) {
                    res = findBtn(ic.id);
                    if (res) break;
                    await new Promise(r => setTimeout(r, 100));
                }
                if (!res) {
                    let itemRow = document.querySelector(`li[data-category="Temporary"][data-item="${ic.id}"]`);
                    if (itemRow) {
                        let equipBtn = itemRow.querySelector('button.option-equip') ||
                            itemRow.querySelector('span.icon-h.equip button') ||
                            itemRow.querySelector('[role="button"][class*="equip"]');
                        if (equipBtn) {
                            let src = 'unknown';
                            if (isFac(itemRow)) src = 'faction';
                            else if (isPers(itemRow)) src = 'own';
                            res = { equipBtn, src, item: itemRow };
                        }
                    }
                    if (!res) return false;
                }
            }
            if (getEqId() === ic.id) {
                if (skipCheck) notif(`已经装备了${ic.full}`, false, true, 2000);
                return false;
            }
            let { equipBtn, src, item } = res;
            if (equipBtn) {
                let sy = window.pageYOffset || document.documentElement.scrollTop;
                await new Promise(r => setTimeout(r, CFG.CLICK_DELAY));
                equipBtn.click();
                let wr = await waitMsg(ic, item);
                if (wr.success) {
                    setEq(ic, src, 'message');
                    let st = src === 'faction' ? '帮派' : '个人';
                    notif(`切换${ic.full}成功 ${st}`, false, false, 2000, src === 'own', src === 'faction');
                    requestAnimationFrame(() => { if (equipLock) { window.scrollTo({ top: sy, behavior: 'instant' }); equipLock = false; } });
                    return true;
                } else if (wr.isUnequip) { handleUneq(ic); return false;
                                         } else if (wr.isOOS) { return false;
                                                              } else { notif(wr.error || '切换失败', true, false, 5000); setTimeout(() => window.scrollTo({ top: sy, behavior: 'instant' }), 200); return false; }
            }
            if (skipCheck) notif(`${ic.full} 无法点击`, true, false, 5000);
            return false;
        } catch (e) { console.error(e); if (skipCheck) notif('装备操作异常，请刷新重试', true, false, 5000); return false; }
        finally { if (equipLock) equipLock = false; }
    }
    function handleUneq(ic){clearEq('message');notif(`⚠️ 检测到脱针，请重新装备 ${ic.full}`,false,true,4000);}

    // ==================== 刷新物品行引用 ====================
    function refreshItemRefs(){
        for(let idStr in bb){
            let id=parseInt(idStr), btn=bb[id];
            if(!btn?.isConnected) continue;
            let row=document.querySelector(`li[data-category="Temporary"][data-item="${id}"]`);
            btn._itemRow=row||null;
        }
    }

    // ==================== 核心按钮状态更新 ====================
    function updateBtns(){
        if(sortMode) return;
        refreshItemRefs();
        let eid=getEqId();
        let exist=new Set();
        document.querySelectorAll('li[data-category="Temporary"]').forEach(el=>{let id=el.getAttribute('data-item');if(id)exist.add(parseInt(id));});
        for(let btn of Object.values(bb)){if(btn?.isConnected){let ov=btn.querySelector('.equipped-overlay');if(ov)ov.remove();}}
        for(let btn of Object.values(gb)){if(btn?.isConnected){let ov=btn.querySelector('.equipped-overlay');if(ov)ov.remove();}}
        for(let [idStr,btn] of Object.entries(bb)){
            if(!btn?.isConnected) continue;
            let id=parseInt(idStr), eq=id===eid, oos=!exist.has(id), ic=BC[id];
            let lbl=btn.querySelector('.torn-cd-label');
            let hasCD=lbl&&lbl.style.display!=='none'&&lbl.textContent!=='';
            btn.style.position='relative';
            if(hasCD){
                btn.style.filter=''; btn.style.webkitFilter=''; btn.style.opacity='';
                if(oos){
                    btn.style.backgroundColor='#555'; btn.style.color='#aaa';
                    btn.disabled=true; btn.style.pointerEvents='none'; btn.style.cursor='not-allowed';
                    if(!btn.querySelector('.oos-cross')) addCross(btn); if(!btn.querySelector('.oos-text')) addOOS(btn);
                }else if(eq){
                    btn.style.backgroundColor='#555'; btn.style.color='#ccc';
                    btn.disabled=true; btn.style.pointerEvents='none'; btn.style.cursor='not-allowed';
                    rmCross(btn); rmOOS(btn);
                    if(!btn.querySelector('.equipped-overlay')){
                        let ov=document.createElement('div'); ov.className='equipped-overlay';
                        ov.style.cssText=`position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,${CFG.OVERLAY_ALPHA});pointer-events:none;z-index:3;`;
                        btn.appendChild(ov);
                    }
                }else{
                    btn.style.backgroundColor=ic.color; btn.style.color='white';
                    btn.disabled=false; btn.style.pointerEvents=''; btn.style.cursor='pointer';
                    rmCross(btn); rmOOS(btn);
                }
                continue;
            }
            if(oos){applyOOS(btn,ic);}
            else if(eq&&!sortMode){
                btn.style.backgroundColor='#555'; btn.style.color='#ccc';
                btn.disabled=true; btn.style.pointerEvents='none'; btn.style.cursor='not-allowed';
                btn.style.filter=''; btn.style.webkitFilter=''; btn.style.opacity='';
                rmCross(btn); rmOOS(btn);
                if(!btn.querySelector('.equipped-overlay')){
                    let ov=document.createElement('div'); ov.className='equipped-overlay';
                    ov.style.cssText=`position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,${CFG.OVERLAY_ALPHA});pointer-events:none;z-index:3;`;
                    btn.appendChild(ov);
                }
            }else{
                restoreOOS(btn,ic);
                btn.disabled=false; btn.style.pointerEvents=''; btn.style.cursor='pointer';
                btn.style.filter=''; btn.style.webkitFilter=''; btn.style.opacity='';
                if(btn.style.backgroundColor==='#555555'||!btn.style.backgroundColor) btn.style.backgroundColor=ic.color;
                btn.style.color='white';
            }
        }
        for(let [idStr,btn] of Object.entries(gb)){
            if(!btn?.isConnected) continue;
            let id=parseInt(idStr), eq=id===eid, oos=!exist.has(id), ic=GC[id];
            btn.style.position='relative';
            if(oos){applyOOS(btn,ic);}
            else if(eq&&!sortMode){
                btn.style.backgroundColor='#555'; btn.style.color='#ccc';
                btn.disabled=true; btn.style.pointerEvents='none'; btn.style.cursor='not-allowed';
                btn.style.filter=''; btn.style.webkitFilter=''; btn.style.opacity='';
                rmCross(btn); rmOOS(btn);
                if(!btn.querySelector('.equipped-overlay')){
                    let ov=document.createElement('div'); ov.className='equipped-overlay';
                    ov.style.cssText=`position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,${CFG.OVERLAY_ALPHA});pointer-events:none;z-index:3;`;
                    btn.appendChild(ov);
                }
            }else{
                restoreOOS(btn,ic);
                btn.disabled=false; btn.style.pointerEvents=''; btn.style.cursor='pointer';
                btn.style.filter=''; btn.style.webkitFilter=''; btn.style.opacity='';
                if(btn.style.backgroundColor==='#555555'||!btn.style.backgroundColor) btn.style.backgroundColor=ic.color;
                btn.style.color='white';
            }
        }
    }

    // ==================== 快捷键、焦点、排序、拖拽等 ====================
    function keyPress(e){
        let a=document.activeElement;
        if(a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'||a.isContentEditable||a.getAttribute('contenteditable')==='true'||a.getAttribute('role')==='textbox')) return;
        if(!mainOn||!active||sortMode||!isTempTab()||equipLock) return;
        let k=e.key.toLowerCase(); if(!KEYS.has(k)) return;
        let now=Date.now(); if(lastKey[k]&&now-lastKey[k]<CFG.SHORTCUT_COOLDOWN) return;
        for(let [id,sk] of Object.entries(shortcuts)){if(sk===k){e.preventDefault();e.stopPropagation();let ic=BC[id]||GC[id];if(ic){lastKey[k]=now;handleEquip(ic,true);}break;}}
    }
    function onFocus(){
        if(!mainOn||!active) return;
        if(loadPersistedEq()) updateTitle();
        else if(eqState.item){persistEq(eqState.item,eqState.src);updateTitle();}
        else updateTitle();
        updateCDs();
    }

    // 排序模式
    function saveNormalStates(){
        let all=[...Object.values(bb),...Object.values(gb)];
        normalStates=new WeakMap();
        all.forEach(b=>{if(!b?.isConnected)return;normalStates.set(b,{disabled:b.disabled,bg:b.style.backgroundColor,col:b.style.color,fil:b.style.filter,wf:b.style.webkitFilter,op:b.style.opacity,cur:b.style.cursor,pe:b.style.pointerEvents,pos:b.style.position,hasX:!!b.querySelector('.oos-cross'),hasT:!!b.querySelector('.oos-text')});});
    }
    function restoreNormalStates(){
        for(let [b,s] of normalStates){if(!b?.isConnected)continue;b.disabled=s.disabled;b.style.backgroundColor=s.bg;b.style.color=s.col;b.style.filter=s.fil;b.style.webkitFilter=s.wf;b.style.opacity=s.op;b.style.cursor=s.cur;b.style.pointerEvents=s.pe;b.style.position='relative';b.style.removeProperty('box-shadow');b.style.removeProperty('transition');b.style.removeProperty('transform');}
        normalStates=new WeakMap();
    }
    function applySort(){
        let all=[...Object.values(bb),...Object.values(gb)];saveNormalStates();
        all.forEach(b=>{
            if(!b?.isConnected)return;let m=b.id.match(/(booster|grenade)-btn-(\d+)/);if(!m)return;let ic=BC[parseInt(m[2])]||GC[parseInt(m[2])];if(!ic)return;
            restoreOOS(b,ic);b.disabled=false;b.style.pointerEvents='';b.style.cursor='grab';b.style.filter='';b.style.webkitFilter='';b.style.opacity='';
            b.style.backgroundColor=ic.color;b.style.color='white';b.style.boxShadow='0 0 0 2px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.2)';b.style.transition='all 0.2s';b.style.position='relative';
        });
        if(boosterGrid)boosterGrid.style.gap=(6*scale)+'px';if(grenadeGrid)grenadeGrid.style.gap=(6*scale)+'px';
    }
    function restoreSort(){restoreNormalStates();updateBtns();if(boosterGrid)boosterGrid.style.gap=(8*scale)+'px';if(grenadeGrid)grenadeGrid.style.gap=(8*scale)+'px';}
    function updateTitleSort(){if(!titleBar)return;if(sortMode){titleBar.style.flexDirection='column';titleBar.style.gap='4px';titleBar.style.whiteSpace='normal';titleBar.style.textAlign='center';titleBar.style.paddingBottom='4px';titleBar.innerHTML=`<div style="font-size:${11*scale}px;">🔧 拖拽排序</div><div style="font-size:${10*scale}px;">📌 点击设置快捷键</div>`;}}
    function restoreTitleNormal(){if(!titleBar)return;titleBar.style.flexDirection='';titleBar.style.gap='';titleBar.style.whiteSpace='';titleBar.style.textAlign='';titleBar.style.paddingBottom='';if(titleOrigHTML)titleBar.innerHTML=titleOrigHTML;let sp=titleBar.querySelectorAll('span');if(sp.length>=3){titlePref=sp[0];titleStat=sp[1];titleSrc=sp[2];}updateTitle();}
    function enterSort(){if(sortMode)return;if(!mainOn||!active){notif('请先开启脚本总开关',false,true,2000);return;}sortMode=true;updateTitleSort();applySort();notif('已进入排序模式',false,false,2000);}
    function exitSort(){if(!sortMode)return;sortMode=false;restoreTitleNormal();restoreSort();notif('已退出排序模式',false,false,1000);}
    function promptShortcut(id,ic){if(promptLock)return;promptLock=true;let cur=getShortcut(id);let inp=prompt(`为「${ic.full}」设置快捷键\n当前: ${cur?cur.toUpperCase():'无'}`,cur?cur.toUpperCase():'');setTimeout(()=>promptLock=false,CFG.PROMPT_LOCK);if(inp===null)return;let t=inp.trim();if(t===''){setShortcut(id,null);notif(`已清除「${ic.full}」快捷键`,false,false,1500);}else{let nk=t.toLowerCase();if(KEYS.has(nk)){setShortcut(id,nk);notif(`快捷键已设为 [${nk.toUpperCase()}]`,false,false,1500);}else notif('无效按键',true,false,3000);}}
    const RESET_EV='booster-reset-drag';
    function initDrag(c){if(!c)return;let ds={active:false,di:null,clone:null,si:-1,sx:0,sy:0,idg:false};let gB=()=>Array.from(c.children).filter(x=>x.classList?.contains('item-btn'));let clC=()=>{if(ds.clone?.parentNode)ds.clone.remove();ds.clone=null;if(ds.di){ds.di.style.opacity='';ds.di.style.transition='';}};let rDS=()=>{clC();if(ds.di){ds.di.style.opacity='';ds.di.style.transition='';}ds.active=false;ds.di=null;ds.idg=false;ds.si=-1;};let crC=(orig,cx,cy)=>{clC();let r=orig.getBoundingClientRect();let cl=orig.cloneNode(true);cl.style.cssText=`position:fixed;left:${cx-r.width/2}px;top:${cy-r.height/2}px;width:${r.width}px;opacity:0.85;z-index:10001;pointer-events:none;transform:scale(1.05);transition:none;box-shadow:0 4px 12px rgba(0,0,0,0.4);`;document.body.appendChild(cl);return cl;};let mv=(from,to,pos)=>{if(from===to)return;let p=from.parentNode;if(pos==='before')p.insertBefore(from,to);else p.insertBefore(from,to.nextSibling);};let sD=(cx,cy,btn)=>{if(!sortMode||ds.active)return false;ds.active=true;ds.di=btn;ds.si=gB().indexOf(btn);ds.sx=cx;ds.sy=cy;ds.idg=false;ds.di.style.opacity='0.4';ds.di.style.transition='none';return true;};let dD=(cx,cy)=>{if(!ds.active||!ds.di)return;let dx=Math.abs(cx-ds.sx),dy=Math.abs(cy-ds.sy);if(!ds.idg&&(dx>CFG.CLICK_MAX_MOVE||dy>CFG.CLICK_MAX_MOVE)){ds.idg=true;ds.clone=crC(ds.di,cx,cy);}if(ds.idg&&ds.clone){ds.clone.style.left=(cx-ds.clone.offsetWidth/2)+'px';ds.clone.style.top=(cy-ds.clone.offsetHeight/2)+'px';let els=document.elementsFromPoint(cx,cy);for(let el of els){let t=el.closest('.item-btn');if(t&&t!==ds.di&&t.parentNode===c){let bt=gB(),ci=bt.indexOf(ds.di),ti=bt.indexOf(t);if(ti!==-1&&ti!==ci&&ci!==-1){if(ti>ci)mv(ds.di,t,'after');else mv(ds.di,t,'before');saveOrder(c,c===boosterGrid);let nb=gB(),ni=nb.indexOf(ds.di);ds.di=nb[ni];if(ds.di)ds.di.style.opacity='0.4';}break;}}}};let eD=()=>{clC();if(ds.di){ds.di.style.opacity='';ds.di.style.transition='';}if(ds.idg)saveOrder(c,c===boosterGrid);ds.active=false;ds.di=null;ds.idg=false;ds.si=-1;};c.addEventListener(RESET_EV,()=>{if(longPressTimer)clearTimeout(longPressTimer);rDS();});let st,sx,sy,tgt,idg,ss;c.addEventListener('mousedown',e=>{if(!sortMode)return;let btn=e.target.closest('.item-btn');if(!btn)return;e.preventDefault();e.stopPropagation();st=Date.now();sx=e.clientX;sy=e.clientY;tgt=btn;idg=false;ss=false;let mm=me=>{let dx=Math.abs(me.clientX-sx),dy=Math.abs(me.clientY-sy);if(!idg&&(dx>CFG.CLICK_MAX_MOVE||dy>CFG.CLICK_MAX_MOVE)){idg=true;if(sD(me.clientX,me.clientY,tgt))ss=true;}if(ss)dD(me.clientX,me.clientY);};let mu=()=>{let dur=Date.now()-st;if(ss)eD();else if(dur<=CFG.CLICK_MAX_DUR&&Math.abs(event.clientX-sx)<=CFG.CLICK_MAX_MOVE&&Math.abs(event.clientY-sy)<=CFG.CLICK_MAX_MOVE&&sortMode){let id=parseInt(tgt.id.split('-').pop());let ic=BC[id]||GC[id];if(ic)promptShortcut(id,ic);}rDS();document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);};document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);});c.addEventListener('touchstart',e=>{if(!sortMode)return;let btn=e.target.closest('.item-btn');if(!btn)return;e.preventDefault();e.stopPropagation();let t=e.touches[0];st=Date.now();sx=t.clientX;sy=t.clientY;tgt=btn;idg=false;ss=false;if(longPressTimer)clearTimeout(longPressTimer);let mm=me=>{let tm=me.touches[0],dx=Math.abs(tm.clientX-sx),dy=Math.abs(tm.clientY-sy);if(!idg&&(dx>CFG.CLICK_MAX_MOVE||dy>CFG.CLICK_MAX_MOVE)){if(longPressTimer)clearTimeout(longPressTimer);idg=true;if(sD(tm.clientX,tm.clientY,tgt))ss=true;}if(ss)dD(tm.clientX,tm.clientY);};let mu=()=>{let dur=Date.now()-st;if(ss)eD();else if(dur<=CFG.CLICK_MAX_DUR&&!idg&&sortMode){let id=parseInt(tgt.id.split('-').pop());let ic=BC[id]||GC[id];if(ic)promptShortcut(id,ic);}rDS();document.removeEventListener('touchmove',mm);document.removeEventListener('touchend',mu);};document.addEventListener('touchmove',mm,{passive:false});document.addEventListener('touchend',mu);});}
    function resetDrags(){if(boosterGrid)boosterGrid.dispatchEvent(new Event(RESET_EV));if(grenadeGrid)grenadeGrid.dispatchEvent(new Event(RESET_EV));}
    function initLongPress(){let pt,tr,sx,sy,ip;let cL=()=>{if(pt){clearTimeout(pt);pt=null;}tr=false;ip=false;};let sT=(cx,cy,tgt)=>{if(sortMode)return;let btn=tgt.closest('.item-btn');if(!btn||btn.disabled)return;sx=cx;sy=cy;tr=false;ip=true;pt=setTimeout(()=>{if(!tr&&!sortMode&&ip){tr=true;enterSort();}pt=null;ip=false;},CFG.LONG_PRESS);};let cM=(cx,cy)=>{if(pt&&!tr&&(Math.abs(cx-sx)>10||Math.abs(cy-sy)>10))cL();};if(boosterGrid){boosterGrid.addEventListener('mousedown',e=>{if(!sortMode){e.stopPropagation();sT(e.clientX,e.clientY,e.target);let mm=me=>cM(me.clientX,me.clientY);let mu=()=>{cL();document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);};document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);}});boosterGrid.addEventListener('touchstart',e=>{if(!sortMode){e.stopPropagation();let t=e.touches[0];sT(t.clientX,t.clientY,e.target);let mm=me=>{if(ip)cM(me.touches[0].clientX,me.touches[0].clientY);};let mu=()=>{cL();document.removeEventListener('touchmove',mm);document.removeEventListener('touchend',mu);};document.addEventListener('touchmove',mm);document.addEventListener('touchend',mu);}});}if(grenadeGrid){grenadeGrid.addEventListener('mousedown',e=>{if(!sortMode){e.stopPropagation();sT(e.clientX,e.clientY,e.target);let mm=me=>cM(me.clientX,me.clientY);let mu=()=>{cL();document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);};document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);}});grenadeGrid.addEventListener('touchstart',e=>{if(!sortMode){e.stopPropagation();let t=e.touches[0];sT(t.clientX,t.clientY,e.target);let mm=me=>{if(ip)cM(me.touches[0].clientX,me.touches[0].clientY);};let mu=()=>{cL();document.removeEventListener('touchmove',mm);document.removeEventListener('touchend',mu);};document.addEventListener('touchmove',mm);document.addEventListener('touchend',mu);}});}}
    function setupExit(){document.addEventListener('click',e=>{if(sortMode&&panel&&!panel.contains(e.target))exitSort();});document.addEventListener('keydown',e=>{if(sortMode&&e.key==='Escape')exitSort();});}
    function loadShortcuts(){shortcuts=GM_getValue(SK.SH,{})||{};}
    function saveShortcuts(){GM_setValue(SK.SH,shortcuts);}
    function clearAllShortcuts(){shortcuts={};saveShortcuts();updateAllShortcutDsp();updateBtns();notif('已清除所有快捷键',false,false,1500);}
    function setShortcut(id,key){if(!key||key.trim()==='')delete shortcuts[id];else{let nk=key.trim().toLowerCase();for(let [i,ek] of Object.entries(shortcuts))if(ek.toLowerCase()===nk&&parseInt(i)!==id){delete shortcuts[parseInt(i)];updateSingleShortcut(parseInt(i),null);}shortcuts[id]=nk;}saveShortcuts();updateSingleShortcut(id,shortcuts[id]);updateBtns();}
    function getShortcut(id){return shortcuts[id]||null;}
    function updateSingleShortcut(id,sk){let btn=bb[id]||gb[id];if(!btn)return;let ic=BC[id]||GC[id];if(!ic)return;let dk=sk||getShortcut(id);btn.textContent=dk?`${ic.dsp} [${dk.toUpperCase()}]`:ic.dsp;}
    function updateAllShortcutDsp(){for(let id of Object.keys(bb))updateSingleShortcut(parseInt(id),null);for(let id of Object.keys(gb))updateSingleShortcut(parseInt(id),null);}
    function loadOrder(){bOrder=GM_getValue(SK.BO,null);if(!bOrder||bOrder.length!==BOOSTERS.length)bOrder=BOOSTERS.map(b=>b.id);gOrder=GM_getValue(SK.GO,null);if(!gOrder||gOrder.length!==GRENADES.length)gOrder=GRENADES.map(g=>g.id);}
    function saveBoosterOrder(list){bOrder=list;GM_setValue(SK.BO,list);}
    function saveGrenadeOrder(list){gOrder=list;GM_setValue(SK.GO,list);}
    function getSortedBoosters(){let m={};BOOSTERS.forEach(b=>m[b.id]=b);return bOrder.map(id=>m[id]).filter(b=>b);}
    function getSortedGrenades(){let m={};GRENADES.forEach(g=>m[g.id]=g);return gOrder.map(id=>m[id]).filter(g=>g);}
    function getContainerOrder(c){return Array.from(c.children).filter(x=>x.classList?.contains('item-btn')).map(b=>parseInt(b.id.split('-').pop()));}
    function saveOrder(c,isB){let o=getContainerOrder(c);if(isB)saveBoosterOrder(o);else saveGrenadeOrder(o);}

    // ==================== 标题 ====================
    function saveTitleHTML(){if(!titleBar)return;titleOrigHTML=titleBar.innerHTML;let sp=titleBar.querySelectorAll('span');if(sp.length>=3){titlePref=sp[0];titleStat=sp[1];titleSrc=sp[2];}}
    function adjustTitle(){if(!titleBar)return;let bfs=13*scale,ws=titleBar.style.whiteSpace;titleBar.style.whiteSpace='nowrap';if(titleBar.scrollWidth>titleBar.clientWidth){let lo=bfs*0.5,hi=bfs;for(let i=0;i<10;i++){let t=(lo+hi)/2;titleBar.style.fontSize=t+'px';if(titleBar.scrollWidth<=titleBar.clientWidth)lo=t;else hi=t;}titleBar.style.fontSize=lo+'px';}else titleBar.style.fontSize=bfs+'px';titleBar.style.whiteSpace=ws;}
    function updateTitle(){if(!titleStat||!titleSrc||!titleStat.isConnected||!titleSrc.isConnected)return;if(sortMode)return;if(eqState.item){let fn=eqState.item.full,st=eqState.src==='faction'?'（帮派）':(eqState.src==='own'?'（个人）':'');let fs=16*scale;if(fn.length>=6)fs=13*scale;else if(fn.length>=5)fs=14*scale;else if(fn.length>=4)fs=15*scale;titleStat.innerHTML=fn;titleStat.style.fontSize=fs+'px';titleStat.style.color='#e74c3c';titleStat.style.fontWeight='bold';if(eqState.src==='faction'){titleSrc.innerHTML='（帮派）';titleSrc.style.color='#2ecc71';titleSrc.style.fontSize=fs+'px';}else if(eqState.src==='own'){titleSrc.innerHTML='（个人）';titleSrc.style.color='#f39c12';titleSrc.style.fontSize=fs+'px';}else titleSrc.innerHTML='';if((fn+st).length<=4)titleStat.style.letterSpacing=(1.5*scale)+'px';else titleStat.style.letterSpacing='normal';}else{titleStat.innerHTML='无装备';titleStat.style.fontSize=(16*scale)+'px';titleStat.style.color='#888';titleStat.style.fontWeight='normal';titleStat.style.letterSpacing='normal';titleSrc.innerHTML='';}updateBtns();adjustTitle();}

    // ==================== 通知 ====================
    let notifEl=null,notifTimer=null;
    function clearNotifTimer(){if(notifTimer){clearTimeout(notifTimer);notifTimer=null;}}
    function notif(msg,isErr,isWarn,dur=CFG.NOTIFY_DUR,isPersonal,isFaction){
        if(!notifEl){notifEl=document.createElement('div');notifEl.id='torn-notif';notifEl.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10002;color:white;padding:12px 24px;border-radius:8px;font-size:16px;font-weight:bold;text-align:center;box-shadow:0 4px 15px rgba(0,0,0,0.3);transition:opacity 0.3s;opacity:0;pointer-events:none;max-width:90%;word-break:break-word;';document.body.appendChild(notifEl);}
        clearNotifTimer();
        if(isPersonal&&!isErr&&!isWarn)notifEl.style.backgroundColor='#2980b9';
        else if(isFaction&&!isErr&&!isWarn)notifEl.style.backgroundColor='#2e7d32';
        else if(isWarn)notifEl.style.backgroundColor='#f39c12';
        else if(isErr)notifEl.style.backgroundColor='#c62828';
        else notifEl.style.backgroundColor='#2e7d32';
        notifEl.textContent=msg; notifEl.style.opacity='1';
        notifTimer=setTimeout(()=>{if(notifEl)notifEl.style.opacity='0';notifTimer=null;},dur);
    }

    // ==================== 渲染按钮 ====================
    function renderBoosters(){
        if(!boosterGrid) return;
        boosterGrid.innerHTML=''; bb={};
        getSortedBoosters().forEach(b=>{
            let btn=document.createElement('button');
            let sk=getShortcut(b.id); btn.textContent=sk?`${b.dsp} [${sk.toUpperCase()}]`:b.dsp;
            btn.className='item-btn booster-btn'; btn.id=`booster-btn-${b.id}`;
            let h=CFG.BTN_HEIGHT*scale;
            btn.style.cssText=`padding:8px 12px;border:none;border-radius:8px;background-color:${b.color};color:white;font-size:14px;font-weight:bold;cursor:pointer;transition:all 0.2s;box-shadow:0 2px 6px rgba(0,0,0,0.2);white-space:nowrap;display:flex;align-items:center;justify-content:center;height:${h}px;line-height:${h}px;opacity:1;position:relative;`;
            btn.title=`装备 ${b.full}${sk?` [快捷键: ${sk.toUpperCase()}]`:''}`;
            btn.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();if(btn.disabled||equipLock||sortMode)return;await handleEquip(b);});
            btn.addEventListener('mouseenter',()=>{if(!btn.disabled&&!equipLock&&!sortMode){btn.style.transform='scale(1.02)';btn.style.boxShadow='0 4px 10px rgba(0,0,0,0.3)';}else if(sortMode&&!btn.disabled)btn.style.boxShadow='0 0 0 2px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.2)';});
            btn.addEventListener('mouseleave',()=>{if(!sortMode){btn.style.transform='scale(1)';btn.style.boxShadow='0 2px 6px rgba(0,0,0,0.2)';}else if(sortMode&&!btn.disabled)btn.style.boxShadow='0 0 0 2px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.2)';});
            boosterGrid.appendChild(btn); bb[b.id]=btn;
            createCD(btn);
        });
        initDrag(boosterGrid);
    }
    function renderGrenades(){
        if(!grenadeGrid) return;
        grenadeGrid.innerHTML=''; gb={};
        getSortedGrenades().forEach(g=>{
            let btn=document.createElement('button');
            let sk=getShortcut(g.id); btn.textContent=sk?`${g.dsp} [${sk.toUpperCase()}]`:g.dsp;
            btn.className='item-btn grenade-btn'; btn.id=`grenade-btn-${g.id}`;
            let h=CFG.BTN_HEIGHT*scale;
            btn.style.cssText=`padding:8px 12px;border:none;border-radius:8px;background-color:${g.color};color:white;font-size:14px;font-weight:bold;cursor:pointer;transition:all 0.2s;box-shadow:0 2px 6px rgba(0,0,0,0.2);white-space:nowrap;display:flex;align-items:center;justify-content:center;height:${h}px;line-height:${h}px;opacity:1;position:relative;`;
            btn.title=`装备 ${g.full}${sk?` [快捷键: ${sk.toUpperCase()}]`:''}`;
            btn.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();if(btn.disabled||equipLock||sortMode)return;await handleEquip(g);});
            btn.addEventListener('mouseenter',()=>{if(!btn.disabled&&!equipLock&&!sortMode){btn.style.transform='scale(1.02)';btn.style.boxShadow='0 4px 10px rgba(0,0,0,0.3)';}else if(sortMode&&!btn.disabled)btn.style.boxShadow='0 0 0 2px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.2)';});
            btn.addEventListener('mouseleave',()=>{if(!sortMode){btn.style.transform='scale(1)';btn.style.boxShadow='0 2px 6px rgba(0,0,0,0.2)';}else if(sortMode&&!btn.disabled)btn.style.boxShadow='0 0 0 2px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.2)';});
            grenadeGrid.appendChild(btn); gb[g.id]=btn;
        });
        initDrag(grenadeGrid);
    }

    // ==================== 缩放 ====================
    function getDefScale(){desktop=!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);return desktop?CFG.D_SCALE:CFG.M_SCALE;}
    function loadScale(){let s=GM_getValue('torn_booster_scale',null);if(s!==null&&typeof s==='number'){userScale=s;scale=Math.min(CFG.MAX_SCALE,Math.max(CFG.MIN_SCALE,s));}else{userScale=null;scale=getDefScale();}return scale;}
    function saveScale(s){userScale=s;GM_setValue('torn_booster_scale',s);scale=s;}
    function clampScale(v){return Math.min(CFG.MAX_SCALE,Math.max(CFG.MIN_SCALE,v));}
    function promptScale(){let inp=prompt(`缩放倍率 (${CFG.MIN_SCALE}~${CFG.MAX_SCALE})`,scale.toFixed(1));if(inp===null)return;let ns=parseFloat(inp);if(isNaN(ns)){notif('请输入数字',true,false,2000);return;}ns=Math.round(ns*10)/10;ns=clampScale(ns);saveScale(ns);applyScale();refreshMenu();notif(`缩放 ${scale.toFixed(1)}x`,false,false,1200);}
    function refreshMenu(){if(cmdMain!==null)GM_unregisterMenuCommand(cmdMain);if(cmdGren!==null)GM_unregisterMenuCommand(cmdGren);if(cmdClear!==null)GM_unregisterMenuCommand(cmdClear);if(cmdScale!==null)GM_unregisterMenuCommand(cmdScale);let ms=GM_getValue('torn_booster_switch',true);cmdMain=GM_registerMenuCommand(ms?'[ON] 关闭总开关':'[OFF] 开启总开关',toggleMain);let gs=GM_getValue('torn_grenade_switch',false);cmdGren=GM_registerMenuCommand(gs?'[ON] 关闭手雷':'[OFF] 开启手雷',toggleGren);cmdClear=GM_registerMenuCommand('🗑️ 清除快捷键',clearAllShortcuts);cmdScale=GM_registerMenuCommand(`缩放: ${scale.toFixed(1)}x(修改)`,promptScale);}
    function applyScale(){if(!panel||applyingScale)return;applyingScale=true;try{let r=panel.getBoundingClientRect(),ox=r.left+r.width/2,oy=r.top+r.height/2;let pw=CFG.PANEL_WIDTH*scale,vw=pw*scale,vh=pw*scale;panel.style.width=pw+'px';panel.style.minWidth=pw+'px';panel.style.maxWidth=pw+'px';panel.style.padding=(10*scale)+'px';if(titleBar){titleBar.style.marginBottom=(10*scale)+'px';titleBar.style.paddingBottom=(6*scale)+'px';titleBar.style.fontSize=(13*scale)+'px';titleBar.style.minHeight=(28*scale)+'px';if(titlePref)titlePref.style.fontSize=(13*scale)+'px';if(titleStat)titleStat.style.marginLeft=(4*scale)+'px';if(titleStat)titleStat.style.maxWidth=(120*scale)+'px';}if(sep)sep.style.margin=(8*scale)+'px 0';panel.style.transform=`scale(${scale})`;panel.style.transformOrigin='top left';panel.style.left=(ox-vw/2)+'px';panel.style.top=(oy-vh/2)+'px';clampPanel();applyIntScale();}finally{applyingScale=false;}}
    function clampPanel(){if(!panel)return;let r=panel.getBoundingClientRect(),l=parseFloat(panel.style.left)||0,t=parseFloat(panel.style.top)||0;if(l<0)l=0;if(l+r.width>window.innerWidth)l=window.innerWidth-r.width;if(t<0)t=0;if(t+r.height>window.innerHeight)t=window.innerHeight-r.height;panel.style.left=l+'px';panel.style.top=t+'px';savePos(l,t);}
    function applyIntScale(){if(!panel)return;let btns=panel.querySelectorAll('.item-btn'),fs=14*scale,pad=(8*scale)+'px '+(12*scale)+'px',h=CFG.BTN_HEIGHT*scale;btns.forEach(b=>{if(!sortMode){b.style.fontSize=fs+'px';b.style.padding=pad;b.style.height=h+'px';b.style.lineHeight=h+'px';}});if(titleBar&&!sortMode)titleBar.style.fontSize=(13*scale)+'px';if(boosterGrid&&!sortMode)boosterGrid.style.gap=(8*scale)+'px';if(grenadeGrid&&!sortMode)grenadeGrid.style.gap=(8*scale)+'px';if(sep)sep.style.margin=(8*scale)+'px 0';adjustTitle();}
    function onResize(){if(panel?.style.display!=='none')clampPanel();}

    // ==================== 监控 ====================
    function startMon(){if(mi)clearInterval(mi);mi=setInterval(()=>{if(monRunning||!mainOn||!isTempTab())return;monRunning=true;try{if(active&&!sortMode)updateTitle();}finally{monRunning=false;}},CFG.MONITOR);}
    function startDOM(){if(dmi)clearInterval(dmi);dmi=setInterval(()=>{if(!mainOn||!isTempTab()||domPaused)return;updateStates();},CFG.DOM_MONITOR);}
    function stopDOM(){if(dmi){clearInterval(dmi);dmi=null;}}
    function ensureButtons(){if(boosterGrid?.children.length===0){renderBoosters();renderGrenades();updateStates();}}
    function showPanel(){if(!mainOn)return;ensureButtons();if(!eqState.item)refreshCache();syncLastBr();if(!active){active=true;startMon();startDOM();}updatePanelVis();updateGrenVis();}
    function waitDOMFunc(){if(waitDOM)return;waitDOM=true;let check=()=>{if(!isTempTab()){waitDOM=false;if(waitTimer)clearTimeout(waitTimer);waitTimer=null;return;}if(isDOMPrep()){waitDOM=false;if(waitTimer)clearTimeout(waitTimer);waitTimer=null;showPanel();}else waitTimer=setTimeout(check,CFG.DOM_WAIT);};check();}
    function updatePanelVis(){if(!panel)return;let show=mainOn&&isTempTab();if(show){ensureButtons();panel.style.display='block';setTimeout(()=>{if(!sortMode)updateTitle();clampPanel();},100);}else{panel.style.display='none';if(sortMode)exitSort();}}
    function updateGrenVis(){if(!grenadeGrid||!sep)return;let any=false;for(let g of GRENADES)if(document.querySelector(`li[data-category="Temporary"][data-item="${g.id}"]`)){any=true;break;}let show=grenOn&&mainOn&&any&&isTempTab();sep.style.display=show?'block':'none';grenadeGrid.style.display=show?'grid':'none';}
    function startTabWatch(){let tl=document.querySelector('#categoriesList');if(!tl){setTimeout(startTabWatch,1000);return;}if(tabObs)tabObs.disconnect();tabObs=new MutationObserver(()=>{if(isTempTab()){if(panel&&panel.style.display==='none'){if(!isDOMPrep())waitDOMFunc();else showPanel();}else if(!isDOMPrep())waitDOMFunc();else showPanel();}else{if(panel)panel.style.display='none';if(sortMode)exitSort();active=false;waitDOM=false;if(waitTimer)clearTimeout(waitTimer);stopDOM();}});tabObs.observe(tl,{attributes:true,attributeFilter:['class'],subtree:true});if(isTempTab()){if(!isDOMPrep())waitDOMFunc();else showPanel();}}

    // ==================== 开关 ====================
    function loadSavedData(){mainOn=GM_getValue('torn_booster_switch',true);grenOn=GM_getValue('torn_grenade_switch',false);loadScale();loadOrder();loadShortcuts();return GM_getValue('torn_booster_panel_pos',null);}
    function enableScript(){if(!active){if(isDOMPrep())showPanel();else waitDOMFunc();}}
    function disableScript(){if(!active)return;active=false;waitDOM=false;if(waitTimer)clearTimeout(waitTimer);stopDOM();if(panel)panel.style.display='none';clearEq('disable');if(sortMode)exitSort();if(notifEl){notifEl.remove();notifEl=null;}}
    function setMainState(en){mainOn=en;GM_setValue('torn_booster_switch',en);if(en){if(isTempTab())enableScript();}else disableScript();updateGrenVis();refreshMenu();notif(en?'总开关已开启':'总开关已关闭',false,true,2000);}
    function setGrenState(en){grenOn=en;GM_setValue('torn_grenade_switch',en);updateGrenVis();refreshMenu();if(mainOn&&active&&grenOn&&isTempTab())setTimeout(()=>{if(!sortMode)updateTitle();clampPanel();},100);notif(en?'手雷已开启':'手雷已关闭',false,true,2000);}
    function savePos(l,t){if(!isNaN(l)&&!isNaN(t))GM_setValue('torn_booster_panel_pos',JSON.stringify({left:l,top:t}));}
    function toggleMain(){setMainState(!GM_getValue('torn_booster_switch',true));}
    function toggleGren(){setGrenState(!GM_getValue('torn_grenade_switch',false));}

    // ==================== 面板拖拽 ====================
    function startDrag(e){if(!titleBar?.contains(e.target)||equipLock||sortMode)return;e.preventDefault();if(e.touches)e.stopPropagation();dragging=true;dragStarted=false;let c=e.touches?{x:e.touches[0].clientX,y:e.touches[0].clientY}:{x:e.clientX,y:e.clientY};let r=panel.getBoundingClientRect();dx=c.x-r.left;dy=c.y-r.top;pl=r.left;pt=r.top;panel.style.cursor='grabbing';panel.style.transition='none';if(e.touches){document.body.style.overflow='hidden';document.body.style.userSelect='none';}}
    function onDrag(e){if(!dragging)return;e.preventDefault();if(e.touches)e.stopPropagation();let c=e.touches?{x:e.touches[0].clientX,y:e.touches[0].clientY}:{x:e.clientX,y:e.clientY};if(!dragStarted){let ddx=Math.abs(c.x-dx-pl),ddy=Math.abs(c.y-dy-pt);if(ddx>DRAG_THR||ddy>DRAG_THR)dragStarted=true}if(!dragStarted)return;let nl=c.x-dx,nt=c.y-dy,ml=window.innerWidth-panel.offsetWidth,mt=window.innerHeight-panel.offsetHeight;nl=Math.max(0,Math.min(ml,nl));nt=Math.max(0,Math.min(mt,nt));panel.style.left=nl+'px';panel.style.top=nt+'px';panel.style.right='auto';panel.style.bottom='auto';savePos(nl,nt)}
    function endDrag(e){if(!dragging)return;dragging=false;dragStarted=false;panel.style.cursor='default';panel.style.transition='';document.body.style.overflow='';document.body.style.userSelect='';savePos(parseFloat(panel.style.left),parseFloat(panel.style.top))}
    function addTouchReset(){let reset=()=>{if(dragging){dragging=false;dragStarted=false;if(panel){panel.style.cursor='default';panel.style.transition='';}document.body.style.overflow='';document.body.style.userSelect='';}resetDrags();};document.addEventListener('touchend',e=>{if(panel&&!panel.contains(e.target))reset();});document.addEventListener('touchcancel',reset);}

    // ==================== 创建面板 ====================
    function createPanel(){
        if(panel) return;
        let savedPos=loadSavedData();
        panel=document.createElement('div'); panel.id='torn-panel';
        let pw=CFG.PANEL_WIDTH*scale;
        panel.style.cssText=`position:fixed;z-index:10000;display:none;background:rgba(30,30,35,0.95);backdrop-filter:blur(10px);border-radius:12px;padding:${10*scale}px;width:${pw}px;min-width:${pw}px;max-width:${pw}px;box-shadow:0 8px 20px rgba(0,0,0,0.3);font-family:Arial,sans-serif;transform-origin:top left;`;
        titleBar=document.createElement('div');
        titleBar.style.cssText=`display:flex;align-items:center;justify-content:flex-start;margin-bottom:${10*scale}px;padding-bottom:${6*scale}px;border-bottom:1px solid rgba(255,255,255,0.2);cursor:grab;user-select:none;font-size:${13*scale}px;color:#ddd;min-height:${28*scale}px;gap:${2*scale}px;flex-wrap:nowrap;`;
        titleBar.addEventListener('mousedown',startDrag); titleBar.addEventListener('touchstart',startDrag,{passive:false});
        titlePref=document.createElement('span'); titlePref.textContent='当前装备：'; titlePref.style.cssText=`color:#ddd;flex-shrink:0;font-size:${13*scale}px;`;
        titleStat=document.createElement('span'); titleStat.style.cssText=`margin-left:${4*scale}px;display:inline-block;white-space:nowrap;`;
        titleSrc=document.createElement('span'); titleSrc.style.cssText=`flex-shrink:0;`;
        titleBar.appendChild(titlePref); titleBar.appendChild(titleStat); titleBar.appendChild(titleSrc);
        panel.appendChild(titleBar);
        let content=document.createElement('div'); content.style.cssText='display:block;';
        boosterGrid=document.createElement('div'); boosterGrid.className='booster-grid'; boosterGrid.style.cssText=`display:grid;grid-template-columns:repeat(2,1fr);gap:${8*scale}px;`;
        content.appendChild(boosterGrid);
        sep=document.createElement('div'); sep.style.cssText=`margin:${8*scale}px 0;height:1px;background:linear-gradient(to right,transparent,rgba(255,255,255,0.3),transparent);display:none;`;
        content.appendChild(sep);
        grenadeGrid=document.createElement('div'); grenadeGrid.className='grenade-grid'; grenadeGrid.style.cssText=`display:grid;grid-template-columns:repeat(2,1fr);gap:${8*scale}px;display:none;`;
        content.appendChild(grenadeGrid);
        panel.appendChild(content);
        renderBoosters(); renderGrenades();
        window.addEventListener('mousemove',onDrag,{signal:sig}); window.addEventListener('mouseup',endDrag,{signal:sig}); window.addEventListener('touchmove',onDrag,{signal:sig,passive:false}); window.addEventListener('touchend',endDrag,{signal:sig}); window.addEventListener('touchcancel',endDrag,{signal:sig}); window.addEventListener('resize',onResize,{signal:sig}); window.addEventListener('keydown',keyPress,{signal:sig}); window.addEventListener('focus',onFocus,{signal:sig}); document.addEventListener('visibilitychange',()=>{if(!document.hidden&&mainOn){updateCDs();updateAttackDsp();}},{signal:sig});document.addEventListener('visibilitychange',()=>{pageActive = !document.hidden;},{signal:sig});window.addEventListener('blur',()=>{ pageActive = false; },{signal:sig});window.addEventListener('focus',()=>{ pageActive = true; },{signal:sig});
        document.body.appendChild(panel);
        if(savedPos){try{let p=JSON.parse(savedPos);panel.style.left=p.left+'px';panel.style.top=p.top+'px';panel.style.right='auto';panel.style.bottom='auto';}catch(e){setInitPos(panel);}}else setInitPos(panel);
        panel.style.transform=`scale(${scale})`;
        applyIntScale(); updateBtns(); updateGrenVis(); saveTitleHTML();
        initBrListener(); startTabWatch(); startInitPoll(); setupExit(); initLongPress(); addTouchReset();
        loadTimers(); initTSync(); startABM();
        // 倒计时使用 setTimeout 递归链，50ms 更新
        function cdLoop(){
            if(mainOn&&active&&!document.hidden){updateCDs();updateAttackDsp();}
            cdTimeout=setTimeout(cdLoop,50);
        }
        if(!cdTimeout){cdTimeout=null; cdLoop();}
        let hasCached=loadPersistedEq(); if(hasCached) updateTitle();
        if(mainOn&&isTempTab()){if(!isDOMPrep())waitDOMFunc();else showPanel();}
    }
    function setInitPos(p){p.style.left='auto';p.style.right='20px';p.style.top='100px';p.style.bottom='auto';setTimeout(()=>{let r=p.getBoundingClientRect();savePos(r.left,r.top);},100);}
    function isTempTab(){let at=document.querySelector('#categoriesList .ui-tabs-active.ui-state-active');if(!at)return false;return at.getAttribute('data-type')==='Temporary';}
    function isDOMPrep(){return isTempTab()&&document.querySelector('li[data-category="Temporary"]')!==null;}
    function startInitPoll(){if(eqInit||!mainOn)return;let poll=()=>{if(!isDOMPrep()){initTimer=setTimeout(poll,CFG.INIT_SCAN);return;}refreshCache();eqInit=true;initTimer=null;syncLastBr();if(!eqState.item)notif('未检测到装备',false,true,2000);};poll();}
    function pauseDOM(){if(domPaused)return;domPaused=true;if(dmi){clearInterval(dmi);dmi=null;}if(domResumeTimer)clearTimeout(domResumeTimer);domResumeTimer=setTimeout(()=>{domPaused=false;startDOM();},CFG.OOS_PAUSE);}

    function cleanup(){
        if(mi)clearInterval(mi);if(dmi)clearInterval(dmi);if(initTimer)clearTimeout(initTimer);if(waitTimer)clearTimeout(waitTimer);if(domResumeTimer)clearTimeout(domResumeTimer);if(longPressTimer)clearTimeout(longPressTimer);if(notifTimer)clearTimeout(notifTimer);if(abst)clearInterval(abst);if(cdTimeout){clearTimeout(cdTimeout);cdTimeout=null;}
        if(tabObs)tabObs.disconnect();if(abo)abo.disconnect();brListener=null;tsyncListener=null;
        try{evCtrl.abort();}catch(e){}
        if(notifEl){notifEl.remove();notifEl=null;}if(panel){panel.remove();panel=null;}
        titleBar=null;titleStat=null;titleSrc=null;titlePref=null;sep=null;boosterGrid=null;grenadeGrid=null;
        bb={};gb={};shortcuts={};timers={};
        active=false;sortMode=false;mainOn=false;grenOn=false;eqInit=false;
        eqState={item:null,src:null,ts:0,by:null};equipLock=false;
        if(cmdMain!==null)GM_unregisterMenuCommand(cmdMain);if(cmdGren!==null)GM_unregisterMenuCommand(cmdGren);if(cmdClear!==null)GM_unregisterMenuCommand(cmdClear);if(cmdScale!==null)GM_unregisterMenuCommand(cmdScale);
    }
    let started=false;
    function init(){if(started)return;started=true;loadSavedData();loadPersistedEq();refreshMenu();createPanel();window.addEventListener('beforeunload',cleanup,{signal:sig});}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();