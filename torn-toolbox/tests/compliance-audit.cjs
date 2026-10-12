// Entirely local mocks: no account, real API key, or real Torn request.
const {chromium}=require('playwright');const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const fixtureModule={exports:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'mods-integration.cjs'),'utf8').split('\n(async()=>{')[0]+'\nmodule.exports={setup};',{require,module:fixtureModule,__dirname,console,URL,URLSearchParams});
const script=fs.readFileSync(path.join(__dirname,'..','Torn 工具箱-v1.6.24.user.js'),'utf8');
const business=t=>Array.from(t.requests.filter(r=>r.method==='POST'||r.url.includes('itemsModsData')||r.url.includes('itemsLoadouts')),r=>({method:r.method,step:new URL(r.url).searchParams.get('step') || new URLSearchParams(r.body).get('step')}));
async function apiFixture(browser,invalid){
 const page=await browser.newPage(),requests=[];let active=0,max=0;
 await page.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.hostname==='api.torn.com'){
   requests.push({path:u.pathname,time:Date.now()});active++;max=Math.max(max,active);
   if(u.pathname.includes('/company/'))await new Promise(r=>setTimeout(r,100));
   const data=u.pathname.includes('/torn/items')?{items:[]}:invalid?{error:{code:2,error:'Incorrect Key'}}:u.pathname.includes('/company/')?{applications:{}}:u.pathname.includes('/basic')?{player_id:123}:u.pathname.includes('/bazaar')?{bazaar:[]}:{itemmarket:[]};
   active--;return route.fulfill({json:data});
  }
  if(u.hostname==='www.torn.com')return route.fulfill({contentType:'text/html',body:'<main>Local audit fixture</main>'});return route.abort();
 });
 await page.goto('https://www.torn.com/index.php');
 await page.evaluate(()=>{
  window.values={tornApiKey:'local-audit-key',ttbQuickItemsEnabled:false};window.GM_getValue=(k,f)=>values[k]??f;window.GM_setValue=(k,v)=>values[k]=v;window.GM_addStyle=css=>{const style=document.createElement('style');style.textContent=css;document.head.append(style);};window.GM_notification=()=>{};window.GM_xmlhttpRequest=()=>{throw Error('Unexpected third-party request');};
  window.auditTimers=[];const original=window.setTimeout;window.setTimeout=(cb,delay,...args)=>{if(cb.name==='tick'){auditTimers.push({cb,delay,cancelled:false});return 100000+auditTimers.length;}return original(cb,delay,...args);};const clear=window.clearTimeout;window.clearTimeout=id=>{if(id>100000&&auditTimers[id-100001])auditTimers[id-100001].cancelled=true;else clear(id);};
 });
 await page.addScriptTag({content:script});await page.locator('#ttb-fab').click();return {page,requests,max:()=>max};
}
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});const evidence={version:'1.6.24',scope:'local mocks only',checks:{}};
 try{
  const t=await fixtureModule.exports.setup(browser,{native:false});assert.equal(t.startupRequests,0);
  const start=t.requests.length;await t.action();await t.action();evidence.checks.equipment=business({...t,requests:t.requests.slice(start)});assert.deepEqual(evidence.checks.equipment.map(r=>r.step),['actionForm','actionForm']);
  const readStart=t.requests.length;await t.page.locator('#ttb-quick-page').getByRole('button',{name:'Mod资料',exact:true}).click();await t.page.waitForFunction(()=>!document.querySelector('#ttb-quick-page .ttb-quick-card button').disabled);assert.deepEqual(business({...t,requests:t.requests.slice(readStart)}).map(r=>r.step),['getUserUpgrades']);
  const modStart=t.requests.length;await t.page.locator('#ttb-quick-page [data-mod="4"]').click();await t.page.waitForFunction(()=>document.querySelector('#ttb-quick-page [data-mod="4"]').textContent.includes('✓')&&!document.querySelector('#ttb-quick-page [data-mod="4"]').disabled);evidence.checks.modInstall=business({...t,requests:t.requests.slice(modStart)});assert.deepEqual(evidence.checks.modInstall.map(r=>r.step),['reattach']);
  const detachStart=t.requests.length;await t.page.locator('#ttb-quick-page [data-mod="4"]').click();await t.page.waitForFunction(()=>!document.querySelector('#ttb-quick-page [data-mod="4"]').textContent.includes('✓')&&!document.querySelector('#ttb-quick-page [data-mod="4"]').disabled);assert.deepEqual(business({...t,requests:t.requests.slice(detachStart)}).map(r=>r.step),['detach']);
  await t.page.evaluate(()=>{document.hasFocus=()=>false;});const unfocused=t.requests.length;await t.page.locator('#ttb-quick-page').getByRole('button',{name:'Mod资料',exact:true}).click();await t.page.locator('#ttb-quick-page').getByRole('button',{name:'同步详情',exact:true}).click();await t.action();assert.equal(t.requests.length,unfocused);
  await t.page.evaluate(()=>{document.hasFocus=()=>true;const original=window.fetch;window.fetch=async(url,options)=>{const res=await original(url,options);if(String(url)==='/item.php'&&options?.method==='POST')document.hasFocus=()=>false;return res;};});const lostStart=t.requests.length;await t.action();evidence.checks.focusLoss=business({...t,requests:t.requests.slice(lostStart)});assert.deepEqual(evidence.checks.focusLoss.map(r=>r.step),['actionForm']);await t.page.close();
  // Existing XHR response is observed exactly once without issuing another request.
  const xhr=await fixtureModule.exports.setup(browser,{observeInitial:false});const xhrStart=xhr.requests.length;
  await xhr.page.evaluate(()=>new Promise((resolve,reject)=>{const request=new XMLHttpRequest();request.open('GET','/page.php?sid=itemsLoadouts&step=getEquippedItems');request.onload=resolve;request.onerror=reject;request.send();}));await xhr.page.waitForFunction(()=>values.ttbWeaponModsV1?.some(p=>p.instanceId==='808'));assert.deepEqual(business({...xhr,requests:xhr.requests.slice(xhrStart)}).map(r=>r.step),['getEquippedItems']);evidence.checks.passiveXHR=true;await xhr.page.close();
  for(const pane of ['company','undercut']){
   const f=await apiFixture(browser,true),prefix=pane==='company'?'co':'uc';await f.page.locator('[data-tab="'+pane+'"]').click();await f.page.locator('#'+prefix+'-start').click();await f.page.waitForFunction(prefix=>document.getElementById(prefix+'-error').textContent.includes('Incorrect Key'),prefix);
   assert.equal(await f.page.locator('#'+prefix+'-stop').isVisible(),false);assert.equal(await f.page.evaluate(()=>auditTimers.length),0,'fatal initial check must not schedule a timer');const count=f.requests.length;
   await f.page.locator('#'+prefix+'-start').click();await f.page.waitForFunction(prefix=>document.getElementById(prefix+'-error').textContent.includes('失效'),prefix);assert.equal(f.requests.length,count,'blocked key is not sent again');evidence.checks[pane+'InvalidKeyStopped']=true;await f.page.close();
  }
  const f=await apiFixture(browser,false);await f.page.locator('[data-tab="company"]').click();await f.page.locator('#co-start').click();await f.page.waitForFunction(()=>auditTimers.length===1);const before=f.requests.filter(r=>r.path.includes('/company/')).length;
  await f.page.evaluate(async()=>{await Promise.all([auditTimers[0].cb(),auditTimers[0].cb()]);});assert.equal(f.requests.filter(r=>r.path.includes('/company/')).length,before+1);assert.equal(f.max(),1);assert.equal(await f.page.evaluate(()=>auditTimers.length),2,'one next timer for the single completed check');
  evidence.checks.sharedSpacing=f.requests.every((r,i)=>!i||r.time-f.requests[i-1].time>=1000);assert.equal(evidence.checks.sharedSpacing,true);
  const timerCount=await f.page.evaluate(()=>auditTimers.length);await f.page.locator('#co-stop').click();const count=f.requests.length;await f.page.evaluate(async()=>{await auditTimers.at(-1).cb();});assert.equal(f.requests.length,count);assert.equal(await f.page.evaluate(()=>auditTimers.length),timerCount);evidence.checks.noOverlapOrRestart=true;await f.page.close();
  const pending=await apiFixture(browser,false);await pending.page.locator('[data-tab="company"]').click();await pending.page.locator('#co-start').click();await pending.page.locator('#co-stop').click();
  await pending.page.waitForFunction(()=>document.getElementById('co-start').style.display!=='none');
  await pending.page.waitForFunction(()=>document.getElementById('co-error').textContent.includes('任务已停止') || !document.getElementById('co-stop').offsetParent).catch(()=>{});
  // The initial task was stopped before the queued company request; it must not install a timer.
  await pending.page.waitForTimeout(1300);assert.equal(await pending.page.evaluate(()=>auditTimers.length),0);assert.equal(await pending.page.locator('#co-stop').isVisible(),false);evidence.checks.stoppedInitialTask=true;await pending.page.close();
  fs.writeFileSync(path.join(__dirname,'evidence','compliance-audit-1.6.24.json'),JSON.stringify(evidence,null,2));console.log('PASS: no chained non-API reads, passive fetch/XHR save, independent manual reads, focus guards, fatal keys stop, shared throttling and no overlapping/restarted monitor.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

