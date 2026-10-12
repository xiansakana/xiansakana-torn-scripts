const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const script=fs.readFileSync(path.join(__dirname,'..','Torn 工具箱-v1.6.24.user.js'),'utf8');
const item={id:'177',name:'Cobra Derringer',category:'Secondary'};
const preset=(instanceId='808',mods=['4','8'])=>({itemId:'177',instanceId,mods:mods.map(id=>({id,title:id==='4'?'Thermal Sight':'100mW Laser'}))});
async function setup(browser,options={}) {
    const page=await browser.newPage(),requests=[],errors=[];
    const state={equipped:options.equipped??true,mods:options.mods??['4','8'],occupiedOwner:999,otherEquipped:Boolean(options.otherEquipped)};
    const snapshot=()=>({currentItems:{...(state.equipped?{'2':{itemID:177,armouryID:808,type2:'Secondary',currentUpgrades:state.mods.map(id=>({upgradeID:Number(id),title:id==='4'?'Thermal Sight':'100mW Laser'}))}}:{}),...(state.otherEquipped?{'1':{itemID:484,armouryID:999,type2:'Primary',currentUpgrades:options.occupied&&state.occupiedOwner===999?[{upgradeID:Number(options.occupied),title:'Thermal Sight'}]:[]}}:{})}});
    const upgrades=()=>['4','8'].map(id=>({upgradeID:Number(id),title:id==='4'?'Thermal Sight':'100mW Laser',attached:options.occupied===id&&state.occupiedOwner===999?'true':state.mods.includes(id)&&state.equipped?'true':'false',armouryID:options.occupied===id&&state.occupiedOwner===999?999:state.equipped&&state.mods.includes(id)?808:null,armoury:options.incompatible===id?[]:state.equipped?[{armouryID:808},...(options.otherListed?[{armouryID:999}]:[])]:[]}));
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('https://www.torn.com/**',async route=>{
        const r=route.request(),url=new URL(r.url());requests.push({url:r.url(),method:r.method(),body:r.postData()});
        if(url.searchParams.get('sid')==='itemsLoadouts') return route.fulfill({json:snapshot()});
        if(url.searchParams.get('sid')==='itemsModsData') {
            assert.equal(r.headers()['x-requested-with'],'XMLHttpRequest','Mod endpoint requires native AJAX header');
            if(url.searchParams.get('step')==='getUserUpgrades') return route.fulfill({json:upgrades()});
            const step=url.searchParams.get('step');assert.ok(['reattach','detach'].includes(step));assert.equal(url.searchParams.get('armouryID'),'808');assert.equal(url.searchParams.get('replaceUpgradeID'),step==='reattach'?'':null);
            const id=url.searchParams.get('upgradeID');
            if(options.failure===id || options.detachFailure===id&&step==='detach') return route.fulfill({json:{error:'Server refused mod'}});
            assert.ok(state.equipped);
            if(step==='detach'){assert.ok(state.mods.includes(id));state.mods=state.mods.filter(m=>m!==id);}
            else{assert.ok(!state.mods.includes(id));state.mods.push(id);if(options.occupied===id)state.occupiedOwner=808;}
            return route.fulfill({json:{result:{userUpgrades:upgrades()}}});
        }
        if(r.method()==='POST') {
            const params=new URLSearchParams(r.postData());assert.equal(params.get('step'),'actionForm');assert.equal(params.get('id'),'808');
            if(options.equipFailure) return route.fulfill({contentType:'text/html',body:'You cannot equip this item.'});
            state.equipped=!state.equipped;state.mods=[];
            return route.fulfill({contentType:'text/html',body:'You '+(state.equipped?'equipped':'unequipped')+' your item.'});
        }
        if(url.pathname==='/item.php') return route.fulfill({contentType:'text/html',body:'<div class="equipped-items-wrap"><div id="loadoutsRoot"><section class="currentSlot___test"><div class="itemReviewContainer___test"><img src="/images/items/177/large.png"><div class="upgrade___test"><button aria-label="Attach modification">+</button></div><div id="native-review">Native</div></div><div class="itemsContainer___test"><div class="itemWrapper___test"><button><img src="/images/items/0/medium.png"></button></div><div class="itemWrapper___test"><button id="native-select"><img src="/images/items/177/medium.png"></button></div></div></section></div></div>'+(options.native?'<ul><li data-item="177" data-category="Secondary" data-armoryid="808" data-source="own" data-equipped="'+state.equipped+'"><span class="name">Cobra Derringer</span><button class="option-equip" data-id="808">Equip</button></li></ul>':'')});
        return route.fulfill({body:''});
    });
    await page.goto('https://www.torn.com/item.php');
    await page.evaluate(({item,options})=>{
        window.values={ttbQuickItems:options.quickItems || [item],ttbQuickInstancesV1:[{...item,savedAt:Date.now(),sources:[{source:'own',instanceId:'808',canEquip:true,quantity:1}]}],ttbRestoreWeaponMods:options.enabled??true,ttbWeaponModsV1:options.presets??[]};
        window.GM_getValue=(key,fallback)=>values[key]??fallback;window.GM_setValue=(key,value)=>values[key]=value;
        window.GM_addStyle=css=>{const style=document.createElement('style');style.textContent=css;document.head.append(style);};
        window.GM_notification=()=>{};window.GM_xmlhttpRequest=()=>{throw Error('Unexpected API request');};
        window.refreshes=0;window.modSubscribers=[];
        window.loadouts={subscribe:{onModsChanged:callback=>modSubscribers.push(callback)},actions:{getEquippedItemsRequestAction(){refreshes++;fetch('/page.php?sid=itemsLoadouts&step=getEquippedItems').then(r=>r.json()).then(data=>document.getElementById('native-review').textContent=JSON.stringify(data));}}};
        const button=document.querySelector('button.option-equip');
        if(button){button.className=button.closest('li').dataset.equipped==='true'?'option-unequip':'option-equip';button.addEventListener('click',async()=>{
            const row=button.closest('li');await fetch('/item.php',{method:'POST',body:new URLSearchParams({step:'actionForm',action:'equip',confirm:'1',id:'808'})});
            row.dataset.equipped=String(row.dataset.equipped!=='true');button.className=row.dataset.equipped==='true'?'option-unequip':'option-equip';loadouts.actions.getEquippedItemsRequestAction();
        });}
    },{item,options});
    await page.evaluate(({options})=>{
        document.getElementById('native-select').addEventListener('click',()=>window.selections=(window.selections||0)+1);
        document.querySelector('[class*="upgrade___"] > button').addEventListener('click',async()=>{
            const holder=document.querySelector('[class*="upgrade___"]');
            if(holder.querySelector('[class*="upgradePanel___"]')) return;
            const data=await fetch('/page.php?sid=itemsModsData&step=getUserUpgrades',{headers:{'X-Requested-With':'XMLHttpRequest'}}).then(r=>r.json());
            const panel=document.createElement('div');panel.className='upgradePanel___test';
            for(const entry of data) {
                const button=document.createElement('button');
                const occupied=entry.attached==='true'&&String(entry.armouryID)!=='808';
                const mine=entry.attached==='true'&&String(entry.armouryID)==='808';
                const compatible=entry.armoury.some(a=>String(a.armouryID)==='808');
                const title=entry.title;
                button.setAttribute('aria-label',(mine?'Detach':occupied?'Reattach':compatible?'Attach':'Disabled')+' "'+title+' bonus" modification');
                button.disabled=!compatible;
                button.addEventListener('click',async()=>{
                    if(occupied||mine||!compatible) throw Error('Must only forward an available install');
                    window.nativeModClicks=(window.nativeModClicks||0)+1;
                    const result=await fetch('/page.php?sid=itemsModsData&step=reattach&armouryID=808&upgradeID='+entry.upgradeID+'&replaceUpgradeID=',{headers:{'X-Requested-With':'XMLHttpRequest'}}).then(r=>r.json());
                    if(result.error){document.getElementById('native-review').textContent=result.error;return;}
                    const installed=result.result.userUpgrades.filter(u=>u.attached==='true'&&String(u.armouryID)==='808');
                    for(const mod of installed){
                        if(!holder.querySelector('[data-installed="'+mod.upgradeID+'"]')) {
                            const summary=document.createElement('button');summary.dataset.installed=mod.upgradeID;
                            summary.setAttribute('aria-label','"'+mod.title+'" modification: bonus. Attach additional modification');holder.append(summary);
                        }
                    }
                    modSubscribers.forEach(cb=>cb({type:'Secondary',itemID:177,armoryId:808},installed.map(u=>({id:u.upgradeID,title:u.title}))));
                });panel.append(button);
            }
            holder.append(panel);
        });
    },{options});
    await page.addScriptTag({content:script});
    const startupRequests=requests.filter(r=>r.method==='POST'||r.url.includes('itemsModsData')||r.url.includes('itemsLoadouts')).length;
    if(options.observeInitial!==false){
        await page.evaluate(async()=>{await fetch('/page.php?sid=itemsLoadouts&step=getEquippedItems',{headers:{'X-Requested-With':'XMLHttpRequest'}}).then(r=>r.json());});
        if(state.equipped&&state.mods.length)await page.waitForFunction(()=>values.ttbWeaponModsV1?.some(p=>p.instanceId==='808'));
    }
    const action=async()=>{await page.locator('#ttb-quick-page .ttb-quick-card button').first().click();await page.waitForFunction(()=>!document.querySelector('#ttb-quick-page .ttb-quick-card button').disabled);};
    return {page,state,requests,errors,action,startupRequests};
}
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});
 const writes=t=>t.requests.filter(r=>r.url.includes('step=reattach'));
 const mod=(t,id)=>t.page.locator('#ttb-quick-page .ttb-quick-mods [data-mod="'+id+'"]');
 const refresh=async t=>{await t.page.locator('#ttb-quick-page').getByRole('button',{name:'Mod资料',exact:true}).click();await t.page.waitForFunction(()=>!document.querySelector('#ttb-quick-page .ttb-quick-card button').disabled);};
 try {
   for(const native of [false,true]) {
     const t=await setup(browser,{native,quickItems:[item,{id:'484',name:'AK74U',category:'Primary'},{id:'465',name:'Serotonin',category:'Temporary'}]});
     assert.equal(await t.page.evaluate(()=>values.ttbRestoreWeaponMods),false);
     assert.equal(await t.page.locator('.ttb-mod-save').count(),0,'no manual save button');
     assert.equal(t.startupRequests,0,'script startup does not query');
     await t.action();await t.action();await refresh(t);assert.equal(writes(t).length,0);assert.deepEqual(t.state.mods,[]);
     assert.deepEqual((await t.page.evaluate(()=>values.ttbWeaponModsV1))[0].mods.map(m=>m.id),['4','8'],'automatic save before removing weapon');
     assert.equal(await mod(t,'4').isEnabled(),true);assert.equal(await mod(t,'8').isEnabled(),true);
     const reads=t.requests.filter(r=>r.url.includes('step=getUserUpgrades')).length;
     await mod(t,'4').click();await t.page.waitForFunction(()=>document.querySelector('#ttb-quick-page [data-mod="4"]').textContent.includes('✓'));
     assert.deepEqual(t.state.mods,['4']);assert.equal(writes(t).length,1);assert.equal(await mod(t,'4').isEnabled(),true,'installed Mod remains clickable to detach');
     await t.page.waitForFunction(()=>!document.querySelector('#ttb-quick-page [data-mod="8"]').disabled);
     await mod(t,'8').click();await t.page.waitForFunction(()=>document.querySelector('#ttb-quick-page [data-mod="8"]').textContent.includes('✓'));
     assert.deepEqual(t.state.mods,['4','8']);assert.equal(writes(t).length,2);
     assert.equal(t.requests.filter(r=>r.url.includes('step=getUserUpgrades')).length,reads,'no query before each Mod click');
     const beforeSync=t.requests.filter(r=>r.url.includes('itemsLoadouts')).length;await t.page.locator('#ttb-quick-page').getByRole('button',{name:'同步详情',exact:true}).click();
     await t.page.waitForFunction(()=>document.getElementById('native-review').textContent.includes('upgradeID'));assert.equal(t.requests.filter(r=>r.url.includes('itemsLoadouts')).length,beforeSync+1);
     assert.equal(await t.page.locator('.ttb-mod-page-panel').count(),0);
     for(const width of [1000,390,320]) {
       await t.page.setViewportSize({width,height:900});
       const geometry=await t.page.locator('#ttb-quick-page .ttb-quick-card').first().evaluate(card=>{
         const equip=card.querySelector('button').getBoundingClientRect(),mods=card.querySelector('.ttb-quick-mods').getBoundingClientRect(),name=card.querySelector('.ttb-quick-name').getBoundingClientRect(),bounds=card.getBoundingClientRect();
         return {below:mods.top>=equip.bottom-1,nameWidth:name.width,height:bounds.height,overflow:card.scrollWidth>card.clientWidth+1};
       });assert.equal(geometry.below,true);assert.ok(geometry.nameWidth>=80,JSON.stringify({width,geometry}));assert.ok(geometry.height<180);assert.equal(geometry.overflow,false);
     }
     if(!native){await t.page.setViewportSize({width:1000,height:700});await t.page.screenshot({path:path.join(__dirname,'evidence','mod-toggle-layout-1.6.24.png')});}
     await mod(t,'4').click();await t.page.waitForFunction(()=>!document.querySelector('#ttb-quick-page [data-mod="4"]').textContent.includes('✓')&&!document.querySelector('#ttb-quick-page [data-mod="4"]').disabled);
     assert.deepEqual(t.state.mods,['8']);assert.equal(t.requests.filter(r=>r.url.includes('step=detach')).length,1);
     await mod(t,'8').click();await t.page.waitForFunction(()=>!document.querySelector('#ttb-quick-page [data-mod="8"]').textContent.includes('✓')&&!document.querySelector('#ttb-quick-page [data-mod="8"]').disabled);
     assert.deepEqual(t.state.mods,[]);assert.equal(t.requests.filter(r=>r.url.includes('step=detach')).length,2);
     assert.deepEqual((await t.page.evaluate(()=>values.ttbWeaponModsV1))[0].mods.map(m=>m.id),['4','8'],'detaching preserves remembered buttons');
     await mod(t,'4').click();await t.page.waitForFunction(()=>document.querySelector('#ttb-quick-page [data-mod="4"]').textContent.includes('✓')&&!document.querySelector('#ttb-quick-page [data-mod="4"]').disabled);
     assert.deepEqual(t.state.mods,['4']);assert.equal(writes(t).length,3,'same button reinstalls after detach');
     assert.equal(t.requests.filter(r=>r.url.includes('step=getUserUpgrades')).length,reads);
     assert.deepEqual(t.errors,[]);await t.page.close();
   }
   for(const options of [{occupied:'4',otherEquipped:true},{occupied:'4',otherListed:true},{incompatible:'4'}]) {
     const t=await setup(browser,{native:true,mods:[],presets:[preset()],...options});await t.action();await t.action();
     assert.equal(await mod(t,'4').isDisabled(),true);assert.equal(writes(t).length,0);await t.page.close();
   }
   for(const native of [false,true]) {
     const moved=await setup(browser,{native,mods:[],presets:[preset()],occupied:'4'});
     await moved.action();await moved.action();await refresh(moved);assert.equal(await mod(moved,'4').isEnabled(),true,'unequipped owner permits manual reattach');
     await mod(moved,'4').click();await moved.page.waitForFunction(()=>document.querySelector('#ttb-quick-page [data-mod="4"]').textContent.includes('✓'));
     assert.equal(writes(moved).length,1,'one reattach, no separate detach request');assert.equal(moved.state.occupiedOwner,808);await moved.page.close();
   }
   const cleared=await setup(browser,{mods:[],presets:[preset()],occupied:'4',otherEquipped:true});
   await cleared.action();await cleared.action();await refresh(cleared);assert.equal(await mod(cleared,'4').isDisabled(),true);
   cleared.state.otherEquipped=false;await cleared.page.locator('#ttb-quick-page').getByRole('button',{name:'同步详情',exact:true}).click();await cleared.page.waitForFunction(()=>{try{return !JSON.parse(document.getElementById('native-review').textContent).currentItems['1'];}catch{return false;}});await cleared.action();await cleared.action();await refresh(cleared);assert.equal(await mod(cleared,'4').isEnabled(),true,'fresh loadout clears obsolete primary conflict');await cleared.page.close();
   const detachFailed=await setup(browser,{presets:[preset()],detachFailure:'4'});await detachFailed.action();await detachFailed.action();await refresh(detachFailed);await mod(detachFailed,'4').click();await detachFailed.page.waitForFunction(()=>document.querySelector('#ttb-quick-page [data-mod="4"]').textContent.includes('✓')&&!document.querySelector('#ttb-quick-page [data-mod="4"]').disabled);
   await mod(detachFailed,'4').click();await detachFailed.page.waitForFunction(()=>document.querySelector('#ttb-quick-page .ttb-quick-feedback').textContent.includes('Server refused'));
   assert.deepEqual(detachFailed.state.mods,['4']);assert.equal(detachFailed.requests.filter(r=>r.url.includes('step=detach')).length,1);await detachFailed.page.close();
   const different=await setup(browser,{mods:[],presets:[preset('999')]});await different.action();await different.action();
   assert.equal(await different.page.locator('#ttb-quick-page [data-mod]').count(),0);await different.page.close();
   const failed=await setup(browser,{mods:[],presets:[preset()],failure:'4'});await failed.action();await failed.action();await refresh(failed);
   await mod(failed,'4').click();await failed.page.waitForFunction(()=>document.querySelector('#ttb-quick-page .ttb-quick-feedback').textContent.includes('Server refused'));
   assert.equal(writes(failed).length,1);assert.deepEqual(failed.state.mods,[]);assert.equal(await mod(failed,'8').isDisabled(),true);await failed.page.close();
   console.log('PASS: automatic per-instance save, no automatic Mod action, separate Mod1/Mod2 install-detach toggles, three-column/390px/320px layout, real native refresh, equipped-only conflicts, unequipped reattach, incompatible guards, failure without retry.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});


