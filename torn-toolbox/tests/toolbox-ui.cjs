const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const script = fs.readFileSync(path.join(__dirname,'..','Torn 工具箱-v1.6.32.user.js'),'utf8');
(async()=>{
    const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL ? {channel:process.env.PLAYWRIGHT_CHANNEL} : {})});
    try{
        const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
        await page.route('https://www.torn.com/**',route=>{
            if(route.request().method()==='POST') return route.fulfill({json:{list:[{itemID:464,ID:99,Qty:12,factionItem:true,factionID:123}]}});
            if(route.request().url().includes('/images/items/')) return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect x="6" y="17" width="28" height="6" rx="3" fill="#b6c4d9"/><path d="M3 20h5m25 0h5" stroke="#87bfff" stroke-width="2"/></svg>'});
            return route.fulfill({contentType:'text/html',body:'<style>body{margin:0;background:#111720;color:#c5d1e0;font:14px sans-serif}main{padding:30px}</style><main>Torn · 模拟页面</main>'});
        });
        await page.goto('https://www.torn.com/item.php');
        await page.evaluate(()=>{
            const values={ttbQuickItems:[{id:'464',name:'Melatonin',category:'Temporary'}]};
            window.GM_getValue=(key,fallback)=>values[key]??fallback;window.GM_setValue=(key,value)=>values[key]=value;
            window.GM_addStyle=css=>{const el=document.createElement('style');el.textContent=css;document.head.append(el);};
            window.GM_notification=()=>{};
            window.GM_xmlhttpRequest=()=>{throw Error('UI test must not request real APIs');};
        });
        await page.addScriptTag({content:script});
        await page.locator('#ttb-fab').click();
        for(const width of [1440,390,320]){
            await page.setViewportSize({width,height:900});
            for(const name of ['buy','sell','attacks','undercut','company','quick']){
                await page.locator('[data-tab="'+name+'"]').click();
                assert.equal(await page.locator('.ttb-pane.active').count(),1);
                assert.equal(await page.locator('[data-tab="'+name+'"]').getAttribute('aria-selected'),'true');
                assert.equal(await page.locator('.ttb-pane.active .ttb-pane-heading h2').count(),1);
                assert.equal(await page.locator('.ttb-api-bar').isVisible(),name!=='quick');
                const bounds=await page.locator('#ttb-panel').boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width+1);
                assert.equal(await page.locator('.ttb-pane.active').evaluate(el=>el.scrollWidth>el.clientWidth+1),false,name+' horizontal overflow at '+width);
                assert.equal(await page.locator('.ttb-tabs').evaluate(el=>el.scrollWidth>el.clientWidth+1),false,'all tabs must fit');
            }
        }
        await page.locator('[data-tab="buy"]').click();
        await page.locator('[data-tab="buy"]').focus();await page.keyboard.press('ArrowRight');
        assert.equal(await page.locator('[data-tab="sell"]').getAttribute('aria-selected'),'true');
        await page.keyboard.press('Home');assert.equal(await page.locator('[data-tab="buy"]').getAttribute('aria-selected'),'true');
        assert.equal(await page.locator('#ttb-api-key').getAttribute('type'),'password');
        await page.locator('.ttb-key-reveal').click();assert.equal(await page.locator('#ttb-api-key').getAttribute('type'),'text');
        await page.locator('.ttb-key-reveal').click();assert.equal(await page.locator('#ttb-api-key').getAttribute('type'),'password');
        await page.locator('#buy-query').click();assert.notEqual(await page.locator('#buy-error').textContent(),'');
        await page.locator('#ttb-lang-toggle').click();assert.equal(await page.locator('.ttb-pane.active h2').textContent(),'購買均價');
        await page.locator('#ttb-lang-toggle').click();
        await page.evaluate(()=>{
            document.getElementById('buy-error').textContent='';
            document.getElementById('buy-result').classList.add('show');
            document.getElementById('buy-summary').innerHTML='<h3>购买统计 · 示例数据</h3><div class="ttb-stat-row"><span class="k">购买数量</span><span class="v">120 件</span></div><div class="ttb-stat-row"><span class="k">实际均价</span><span class="v emphasis">$815,000</span></div>';
            document.getElementById('buy-list').innerHTML='<div class="ttb-item bazaar"><h4>Bazaar · Xanax</h4><p>数量 10 · 单价 $820,000</p><p class="ttb-note">示例交易记录</p></div>';
        });
        const out=path.join(__dirname,'..','preview');fs.mkdirSync(out,{recursive:true});
        await page.locator('.ttb-body').evaluate(el=>el.scrollTop=0);
        await page.setViewportSize({width:1440,height:1000});
        await page.locator('#ttb-panel').screenshot({path:path.join(out,'desktop-buy.png')});
        await page.setViewportSize({width:390,height:900});
        await page.locator('#ttb-panel').screenshot({path:path.join(out,'mobile-buy.png')});
        await page.locator('[data-tab="quick"]').click();
        await page.locator('#ttb-quick-list .ttb-quick-query').click();
        await page.waitForFunction(()=>document.querySelector('#ttb-quick-list .ttb-quick-source').textContent.includes('帮派 ×12'));
        await page.setViewportSize({width:1440,height:1000});
        await page.locator('#ttb-panel').screenshot({path:path.join(out,'desktop-quick.png')});
        assert.deepEqual(errors,[]);console.log('PASS: six panes at desktop/390px/320px, tab layout, API visibility, key reveal, error feedback, language and result cards.');
    }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
