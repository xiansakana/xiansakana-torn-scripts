const {chromium}=require('playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const page=await browser.newPage();const requests=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const row=id=>`<li data-item="${id}" data-category="Secondary" data-armoryid="${id}808"><span class="name">Weapon ${id}</span><div class="actions"><ul class="actions-wrap"><li class="left"><span class="icon-h"><button class="option-equip">Equip</button></span></li><li class="left">Send</li><li class="left">Sell</li><li class="left">Trash</li><li class="clear"></li></ul></div></li>`;
 await page.route('**/*',route=>{requests.push(route.request().url());return route.fulfill({contentType:'text/html',body:`<style>body{margin:0} .inventory>li{height:40px;position:relative;list-style:none}.inventory .name{float:left;width:calc(100% - 138px)}.actions{float:right;width:138px}.actions-wrap{width:138px;margin:0;padding:0}.actions-wrap>li.left{float:left;position:relative;width:34px;height:31px;list-style:none}.clear{clear:both;list-style:none}.icon-h button{width:24px;height:24px}.inventory{padding:0}</style><div class="equipped-items-wrap"><div class="itemReviewContainer___test"><img src="/images/items/177/large.png"><div role="button" aria-label='Ammo type is "Tracer".'>Ammo</div></div><div class="itemWrapper___test"><button><img src="/images/items/177/medium.png"></button></div></div><ul class="inventory">${row('177')}${row('18')}</ul>`});});
 await page.goto('https://www.torn.com/item.php');
 await page.evaluate(()=>{
 window.values={ttbQuickItems:[{id:'177',name:'Weapon 177',category:'Secondary'},{id:'18',name:'Weapon 18',category:'Secondary'}]};
 window.GM_getValue=(k,v)=>values[k]??v;window.GM_setValue=(k,v)=>values[k]=v;window.GM_addStyle=css=>{const s=document.createElement('style');s.textContent=css;document.head.append(s)};window.GM_notification=()=>{};window.GM_xmlhttpRequest=()=>{throw Error('unexpected API')};window.nativeClicks=0;window.ammoClicks=0;
 document.querySelectorAll('.option-equip').forEach(b=>b.addEventListener('click',()=>nativeClicks++));document.querySelector('[aria-label^="Ammo type"]').addEventListener('click',()=>ammoClicks++);
 });
 await page.evaluate(()=>{
 const row=document.querySelector('.inventory > li');const bonus=document.createElement('div');bonus.className='bonuses';bonus.innerHTML='<i class="bonus-attachment-expose" data-bonusid="123" title="&lt;b&gt;Expose&lt;/b&gt;&lt;br&gt;17% increased critical hit rate"></i><i class="bonus-attachment-laser" title="100mW Laser +5% critical hit rate"></i><span>74.06</span>';row.append(bonus);
 });
 await page.addScriptTag({content:fs.readFileSync('Torn 工具箱-v1.6.32.user.js','utf8')});
 const quick=page.locator('#ttb-quick-page [data-item="177"] > button').first();
 assert.ok((await quick.getAttribute('title')).includes('Expose'));
 assert.ok(!(await quick.getAttribute('title')).includes('74.06'));
 assert.ok(!(await quick.textContent()).includes('Expose'),'Bonus only appears on hover');
 await page.evaluate(()=>document.querySelector('.inventory .bonuses i').title='Expose 19% increased critical hit rate');
 await page.waitForFunction(()=>document.querySelector('#ttb-quick-page [data-item="177"] > button')?.title.includes('19%'));
 for(const [name,short] of [['Standard','STD'],['Hollow Point','HP'],['Tracer','TR'],['Incendiary','INC'],['Piercing','PI']]){
 await page.evaluate(name=>document.querySelector('[aria-label^="Ammo type"]').setAttribute('aria-label','Ammo type is "'+name+'".'),name);
 await page.waitForFunction(short=>document.querySelector('#ttb-quick-page .ttb-ammo-button')?.textContent===short,short);
 assert.ok((await page.locator('#ttb-quick-page .ttb-ammo-button').getAttribute('title')).includes(name));
 }
 for(const width of [1000,784,600,390,320]){
 await page.setViewportSize({width,height:1000});
 const rects=await page.locator('.inventory > li').evaluateAll(rows=>rows.map(row=>{const a=row.querySelector('.ttb-page-add-quick').getBoundingClientRect(),b=row.querySelector('.option-equip').getBoundingClientRect(),host=row.querySelector('.actions').getBoundingClientRect(),name=row.querySelector('.name').getBoundingClientRect();return {ar:a.right,bl:b.left,ay:a.y+a.height/2,by:b.y+b.height/2,aw:a.width,hw:host.width,hy:host.y,ny:name.y};}));
 for(const r of rects){assert.ok(r.ar<=r.bl);assert.ok(Math.abs(r.ay-r.by)<5);assert.equal(r.aw,18);assert.equal(r.hw,138);assert.equal(r.hy,r.ny,'actions must stay on the same line as the name');}
 if(width<=600){
 assert.equal(await page.locator('#ttb-quick-page .ttb-quick-source').first().isVisible(),false);
 assert.equal(await page.locator('#ttb-quick-page > .ttb-page-tool').first().isVisible(),false);
 const pills=await page.locator('#ttb-quick-page .ttb-quick-card').evaluateAll(cards=>cards.map(card=>({y:card.getBoundingClientRect().y,h:card.getBoundingClientRect().height,w:card.getBoundingClientRect().width})));
 assert.equal(pills[0].y,pills[1].y,'two mobile pills share one line');assert.ok(pills.every(pill=>pill.h<60));
 await page.locator('#ttb-quick-page > .ttb-mobile-more').click();assert.equal(await page.locator('#ttb-quick-page > .ttb-page-tool').first().isVisible(),true);await page.locator('#ttb-quick-page > .ttb-mobile-more').click();
 }
 }
 const before=requests.length;
 await page.locator('#ttb-quick-page .ttb-ammo-button').click();assert.equal(await page.evaluate(()=>ammoClicks),1);assert.equal(await page.evaluate(()=>nativeClicks),0);assert.equal(requests.length,before);
 await page.setViewportSize({width:1000,height:1000});
 const grip=page.locator('#ttb-quick-page [data-item="177"] .ttb-drag-handle');
 const a=await grip.boundingBox(),b=await page.locator('#ttb-quick-page [data-item="18"]').boundingBox();
 await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.up();
 assert.deepEqual(await page.evaluate(()=>values.ttbQuickItems.map(i=>i.id)),['18','177']);assert.equal(await page.evaluate(()=>nativeClicks),0);assert.equal(await page.locator('#ttb-quick-list > .ttb-quick-card').first().getAttribute('data-item'),'18');
 await page.evaluate(()=>document.querySelector('.inventory').replaceChildren());
 await page.waitForFunction(()=>document.querySelector('#ttb-quick-page [data-item="177"] > button')?.title.includes('上次页面缓存'));
 assert.ok((await quick.getAttribute('title')).includes('19%'));
 await page.locator('#ttb-quick-page .ttb-quick-fold-toggle').click();
 assert.equal(await page.locator('#ttb-quick-page-grid').isVisible(),false);
 assert.equal(await page.evaluate(()=>values.ttbQuickItemsFolded),true);
 await page.evaluate(()=>document.querySelector('#ttb-quick-page').remove());
 await page.waitForSelector('#ttb-quick-page .ttb-quick-fold-toggle');
 assert.equal(await page.locator('#ttb-quick-page .ttb-quick-fold-toggle').getAttribute('aria-expanded'),'false');
 const saved=await page.evaluate(()=>values);
 assert.ok(saved.ttbWeaponBonusCacheV1.some(record=>record.instanceId==='177808' && record.effects.some(text=>text.includes('19%'))));
 await page.addInitScript(saved=>{window.values=saved;window.GM_getValue=(k,v)=>values[k]??v;window.GM_setValue=(k,v)=>values[k]=v;window.GM_addStyle=css=>{const s=document.createElement('style');s.textContent=css;document.head.append(s)};window.GM_notification=()=>{};window.GM_xmlhttpRequest=()=>{throw Error('unexpected API')};},saved);
 await page.reload(); // All navigation and resources stay intercepted by the local fixture.
 await page.addScriptTag({content:fs.readFileSync('Torn 工具箱-v1.6.32.user.js','utf8')});
 assert.equal(await page.locator('#ttb-quick-page-grid').isVisible(),false);
 await page.locator('#ttb-quick-page .ttb-quick-fold-toggle').click();
 assert.equal(await page.locator('#ttb-quick-page-grid').isVisible(),true);
 assert.equal(await page.evaluate(()=>values.ttbQuickItemsFolded),false);
 assert.ok((await page.locator('#ttb-quick-page [data-item="177"] > button').first().getAttribute('title')).includes('19%'));
 await page.locator('#ttb-quick-page .ttb-quick-fold-toggle').click();
 await page.locator('#ttb-fab').click();await page.locator('[data-tab="quick"]').click();
 await page.locator('#ttb-quick-enabled').uncheck();
 assert.equal(await page.locator('#ttb-quick-page').isVisible(),false);
 assert.equal(await page.locator('[data-ttb-page-add]').count(),0);
 assert.equal(await page.locator('.ttb-compact-actions').count(),0);
 const disabled=await page.evaluate(()=>values);assert.equal(disabled.ttbQuickItemsEnabled,false);
 await page.addInitScript(disabled=>{window.values=disabled;},disabled);
 await page.reload();await page.addScriptTag({content:fs.readFileSync('Torn 工具箱-v1.6.32.user.js','utf8')});
 assert.equal(await page.locator('#ttb-quick-page').count(),0);
 assert.equal(await page.locator('[data-ttb-page-add]').count(),0);
 await page.locator('#ttb-fab').click();await page.locator('[data-tab="quick"]').click();await page.locator('#ttb-quick-enabled').check();
 assert.equal(await page.locator('#ttb-quick-page').isVisible(),true);
 assert.equal(await page.locator('#ttb-quick-page-grid').isVisible(),false,'enable preserves previous folded preference');
 assert.equal(await page.locator('[data-ttb-page-add]').count(),2);
 const mobileSeed=await page.evaluate(()=>values);
 mobileSeed.ttbQuickItemsFolded=false;
 mobileSeed.ttbQuickItems=[{id:'177',name:'Cobra Derringer',category:'Secondary'},...['Melatonin','Epinephrine','Serotonin','Smoke Grenade','Tear Gas','Pepper Spray','HEG','Metal Nunchaku'].map((name,index)=>({id:String(464+index),name,category:index===7?'Melee':'Temporary'}))];
 mobileSeed.ttbQuickInventorySnapshotV1=mobileSeed.ttbQuickItems.slice(1).map((item,index)=>({...item,sources:[{source:'own',quantity:[81,41,27,195,624,1000,354,1][index]}]}));
 await page.addInitScript(seed=>{window.values=seed;},mobileSeed);
 await page.reload();await page.addScriptTag({content:fs.readFileSync('Torn 工具箱-v1.6.32.user.js','utf8')});await page.setViewportSize({width:390,height:900});
 assert.equal(await page.locator('#ttb-quick-page [data-item="464"] .ttb-mobile-count').textContent(),'81');
 assert.equal(await page.locator('#ttb-quick-page').evaluate(node=>node.scrollWidth<=node.clientWidth),true);
 await page.locator('#ttb-quick-page').screenshot({path:'tests/evidence/mobile-quick-1.6.32.png'});
 assert.deepEqual(errors,[]);console.log('PASS: native button layout, ammo labels, pointer sorting, and per-instance Bonus cache survives unloaded rows and reload');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
