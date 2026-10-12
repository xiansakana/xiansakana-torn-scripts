// Run with NODE_PATH pointing at a Playwright installation.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const script = fs.readFileSync(path.join(__dirname, '..', 'Torn 工具箱-v1.6.24.user.js'), 'utf8');
const row = (id, name, category, key = 'f0') => `<li data-item="${id}" data-category="${category}" data-rowkey="${key}" data-equipped="false"><span class="name-wrap"><span class="name">${name}</span></span><ul class="actions-wrap"><li><button class="option-equip" data-id="123">Equip</button></li></ul></li>`;
const inventory = `<div id="categoriesList"><div class="ui-tabs-active ui-state-active" data-type="Temporary"></div></div><div class="equipped-items-wrap"></div><div class="items-wrap"><ul>${row(464,'Melatonin','Temporary','f9')}${row(464,'Melatonin','Temporary')}${row(206,'Xanax','Drug')}${row(463,'Epinephrine','Temporary','f9')}${row(226,'Smoke Grenade','Temporary','f9')}</ul></div>`;
async function setup(browser, url, html, seed = {}, searchResults = {}, dynamicLoadout = false) {
    const page = await browser.newPage();
    let postCalls = 0, nativeResult = null;
    const instances=new Map();
    const requests=[];
    for(const result of Object.values(searchResults)) for(const entry of result.list || []) instances.set(String(entry.ID),entry);
    const errors = []; page.on('pageerror', err => errors.push(err.message));
    await page.route('https://www.torn.com/**', async route => {
        requests.push({method:route.request().method(),url:route.request().url(),body:route.request().postData()});
        if (route.request().url().includes('sid=itemsLoadouts')) return route.fulfill({json:{currentItems:{},...(nativeResult || {})}});
        if (route.request().url().includes('sid=itemsModsData')) return route.fulfill({json:[]});
        if (route.request().method() === 'POST') {
            const params = new URLSearchParams(route.request().postData());
            if (params.get('step') === 'getSearchList') {
                const result=searchResults[params.get('q')] || {list:await page.evaluate(q=>Array.from(document.querySelectorAll('li[data-item][data-category]')).map((el,index)=>({el,index})).filter(({el})=>el.querySelector('.name')?.textContent.toLowerCase().startsWith(q.toLowerCase())).map(({el,index})=>({itemID:el.dataset.item,ID:index+1000,Qty:el.dataset.qty || 1,rowKey:el.dataset.rowkey,equiped:el.dataset.equipped==='true',isEquippable:!el.querySelector('.option-equip[disabled]'),source:'unknown',mockIndex:index})),params.get('q'))};
                if(result.delay) await new Promise(resolve=>setTimeout(resolve,result.delay));
                (result.list || []).forEach(entry=>instances.set(String(entry.ID),entry));
                return route.fulfill({json:result});
            }
            if(params.get('step')==='actionForm') {
                assert.equal(params.get('action'),'equip');assert.equal(params.get('confirm'),'1');
                const entry=instances.get(params.get('id'));
                if(!entry) return route.fulfill({contentType:'text/html',body:'You no longer own this item.'});
                if(entry.mockError) return route.fulfill({contentType:'text/html',body:entry.mockError});
                const off=Boolean(entry.equiped);entry.equiped=!off;
                const item=(seed.ttbQuickItems || []).find(i=>String(i.id)===String(entry.itemID));
                nativeResult={id:String(entry.itemID),name:item?.name || 'Item',category:item?.category,off};
                await page.evaluate(({entry,off})=>{
                    const rows=Array.from(document.querySelectorAll('li[data-item][data-category]'));
                    if(entry.mockIndex!==undefined) {
                        const row=rows[entry.mockIndex];rows.filter(el=>el.dataset.category===row.dataset.category).forEach(el=>el.dataset.equipped='false');row.dataset.equipped=String(!off);
                    }
                    nativeClicks.push({id:String(entry.itemID),key:entry.rowKey || String(entry.ID)});
                },{entry,off});
                const fragment=dynamicLoadout ? '<div class="equipped-items-wrap"><div id="loadout-slot" data-slot="temporary"><span class="loadout-name">'+(off ? 'Empty':'Melatonin')+'</span></div><button id="native-loadout-button">Loadout</button><input id="native-loadout-name" value="Server default"></div>' : '';
                return route.fulfill({contentType:'text/html',body:'You '+(off?'unequipped':'equipped')+' your item.'+fragment});
            }
            postCalls++;
            return route.fulfill({json: postCalls === 1 ? {success: false, text: 'You cannot use this item yet.'} : {success: true, text: '<p>Item used</p><script>window.injected=true</script>', links: {good: {url: '/item.php', title: 'Items'}, bad: {url: 'javascript:window.injected=true',title:'Unsafe'}}}});
        }
        if(dynamicLoadout && route.request().url().endsWith('/item.php')) {
            const eq=[...instances.values()].find(entry=>entry.equiped);
            return route.fulfill({contentType:'text/html',body:'<div class="equipped-items-wrap"><div id="loadout-slot" data-slot="temporary"><span class="loadout-name">'+(eq ? 'Melatonin':'Empty')+'</span></div><button id="native-loadout-button">Loadout</button><input id="native-loadout-name" value="Server default"></div>'});
        }
        return route.fulfill({contentType: 'text/html', body: html});
    });
    await page.goto(url);
    await page.addStyleTag({content:'li[data-item][data-category]{display:flow-root} ul.actions-wrap{display:flow-root;padding:0} ul.actions-wrap > li{float:left;list-style:none;min-width:34px;min-height:32px}'});
    await page.evaluate(seed => {
        window.nativeRefreshCalls=0;
        window.loadouts={actions:{getEquippedItemsRequestAction() {
            nativeRefreshCalls++;
            fetch('/page.php?sid=itemsLoadouts&step=getEquippedItems').then(r=>r.json()).then(item=>{
                document.querySelectorAll('.loadout-name').forEach(el=>el.textContent=item.off ? 'Empty':item.name);
                const index=['Primary','Secondary','Melee','Temporary'].indexOf(item.category);
                const img=document.querySelectorAll('#loadoutsRoot [class*="itemsContainer___"] img')[index];
                if(img) { img.alt=item.off ? 'Empty':item.name;img.src=item.off ? '/images/items/silhouettes/primary.svg':'/images/items/'+item.id+'/medium.png'; }
            });
        }}};
        window.values = {ttbRestoreWeaponMods:false,...seed}; window.nativeClicks = []; window.inventoryRowClicks = 0;
        window.nativeActionHTML = Array.from(document.querySelectorAll('ul.actions-wrap')).map(el => el.innerHTML);
        document.querySelectorAll('li[data-item]').forEach(el => el.addEventListener('click', () => { inventoryRowClicks++; }, true));
        window.GM_getValue = (key, fallback) => Object.hasOwn(values, key) ? values[key] : fallback;
        window.GM_setValue = (key, value) => { values[key] = value; };
        window.GM_addStyle = css => { const el=document.createElement('style');el.textContent=css;document.head.append(el); };
        window.GM_notification = () => {}; window.GM_xmlhttpRequest = () => { throw Error('Unexpected API request'); };
        document.querySelectorAll('button.option-equip').forEach(btn => {
            if(btn.closest('li[data-item][data-category]').dataset.equipped==='true' && !btn.matches('.left.equipped')) btn.className='option-unequip';
            btn.addEventListener('click', () => {
            const row=btn.closest('li[data-item][data-category]');nativeClicks.push({id:row.dataset.item,key:row.dataset.rowkey});
            const off=row.dataset.equipped==='true';
            document.querySelectorAll('[data-equipped]').forEach(el=>{el.dataset.equipped='false';});row.dataset.equipped=String(!off);
            if(!btn.matches('.left.equipped')) btn.className=off ? 'option-equip':'option-unequip';
            document.querySelectorAll('.action-wrap').forEach(el=>el.remove());
            const msg=document.createElement('div');msg.className='action-wrap';msg.textContent=row.querySelector('.name').textContent+' equipped';document.body.append(msg);
        }); });
    }, seed);
    await page.addScriptTag({content: script});
    return {page, errors, requests};
}
(async () => {
    const browser = await chromium.launch({headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? {channel: process.env.PLAYWRIGHT_CHANNEL} : {})});
    try {
        const {page, errors} = await setup(browser, 'https://www.torn.com/item.php', inventory);
        await page.locator('#ttb-quick-page').evaluate(el=>el.style.maxWidth='640px');
        assert.equal(await page.locator('li[data-item][data-category] > .ttb-page-add-quick, li[data-item][data-category] .actions-wrap .ttb-page-add-quick').count(), await page.locator('li[data-item][data-category]').count(), 'loaded item rows get one page add button');
        await page.locator('li[data-item="463"] .ttb-page-add-quick').click();
        assert.equal(await page.locator('li[data-item="463"] .ttb-page-add-quick').textContent(), '✓');
        assert.equal((await page.evaluate(() => values.ttbQuickItems)).length, 1, 'page plus only saves a favorite');
        assert.deepEqual(await page.evaluate(() => nativeClicks), [], 'page plus must not equip');
        await page.locator('#ttb-quick-page > button').nth(1).click();
        await page.locator('#ttb-quick-list [data-item="463"] button').nth(1).click();
        assert.equal((await page.evaluate(() => values.ttbQuickItems)).length, 0, 'page plus favorite can be removed normally');
        await page.waitForSelector('.ttb-add-quick');
        assert.equal(await page.locator('.ttb-add-quick').count(), 4);
        assert.match(await page.locator('.ttb-quick-available-item[data-item="464"] .ttb-quick-source').textContent(), /帮派 \/ 个人.*优先帮派/);
        assert.equal(await page.locator('ul.actions-wrap .ttb-add-quick').count(), 0, 'Torn action lists must not contain toolbox controls');
        assert.deepEqual(await page.evaluate(() => Array.from(document.querySelectorAll('ul.actions-wrap')).map(el => {const copy=el.cloneNode(true);copy.querySelectorAll('[data-ttb-page-add-host], .ttb-page-add-cell, [data-ttb-page-add]').forEach(node=>node.remove());return copy.innerHTML;})), await page.evaluate(() => nativeActionHTML));
        await page.locator('.ttb-quick-available-item[data-item="206"] .ttb-add-quick').click();
        assert.equal(await page.evaluate(() => inventoryRowClicks), 0, 'adding favorites must never reach Torn row click handlers');
        assert.deepEqual(await page.evaluate(() => nativeClicks), [], 'adding favorites must never equip an item');
        await page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await page.waitForFunction(() => document.querySelector('#ttb-quick-response').textContent.includes('cannot use'));
        assert.equal((await page.evaluate(() => values.ttbQuickItems)).length, 1);
        await page.locator('#ttb-quick-list .ttb-quick-card button').first().click();
        await page.waitForFunction(() => document.querySelector('#ttb-quick-response').textContent.includes('Item used'));
        assert.equal(await page.locator('#ttb-quick-response a').count(), 1, 'safe same-origin links only');
        assert.equal(await page.evaluate(() => window.injected), undefined, 'response scripts must not execute');
        await page.locator('.ttb-quick-available-item[data-item="464"] .ttb-add-quick').first().click();
        assert.equal(await page.locator('.ttb-quick-available-item[data-item="464"] .ttb-add-quick').isDisabled(), true);
        assert.equal((await page.evaluate(() => values.ttbQuickItems)).length, 2, 'duplicate favorites');
        await page.locator('#ttb-quick-list .ttb-quick-card').last().locator('button').first().click();
        await page.waitForTimeout(1100);
        assert.deepEqual(await page.evaluate(() => nativeClicks), [{id:'464',key:'f9'}], 'faction first');
        assert.match(await page.locator('#ttb-quick-response').textContent(), /已装备 Melatonin（帮派）/);
        assert.match(await page.locator('#ttb-quick-list [data-item="464"] .ttb-quick-source').textContent(), /已装备（帮派）/);
        await page.locator('#ttb-quick-list .ttb-quick-card').last().locator('button').first().click();
        await page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('已卸下'));
        assert.equal((await page.evaluate(() => nativeClicks)).length, 2, 'second click unequips');
        await page.locator('[data-tab="buy"]').click();
        await page.locator('#ttb-quick-page [data-item="464"] button').first().click();
        await page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('已装备'));
        assert.equal(await page.locator('[data-tab="buy"]').getAttribute('aria-selected'),'true','using page favorites must not change the selected pane');
        await page.locator('#ttb-minimize').click();
        await page.locator('#ttb-quick-page [data-item="464"] button').first().click();
        await page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('已卸下'));
        assert.equal(await page.locator('#ttb-panel').isVisible(),false,'page favorites must not open toolbox');
        assert.match(await page.locator('#ttb-quick-page .ttb-quick-feedback').textContent(), /已卸下.*帮派/);
        await page.locator('#ttb-quick-page [data-item="206"] button').first().click();
        await page.waitForFunction(()=>document.querySelector('#ttb-quick-page .ttb-quick-feedback').textContent.includes('Item used'));
        assert.equal(await page.locator('#ttb-panel').isVisible(),false,'consumables must not open toolbox');
        assert.equal(await page.locator('#ttb-quick-page .ttb-quick-feedback a').count(),1,'response links remain available on page');
        await page.locator('#ttb-quick-page > button').nth(1).click();
        await page.locator('#ttb-quick-list .ttb-quick-card').last().locator('button').nth(2).click();
        assert.equal(await page.evaluate(() => values.ttbQuickItems[0].id), '464');
        await page.locator('#ttb-quick-enabled').uncheck();
        await page.waitForTimeout(200);
        assert.equal(await page.locator('.ttb-add-quick').count(), 0);
        await page.locator('#ttb-quick-enabled').check();
        await page.waitForTimeout(300);
        assert.equal(await page.locator('.ttb-add-quick').count(), 4, 'observer must not duplicate buttons');
        await page.locator('.ttb-quick-available-item[data-item="463"] .ttb-add-quick').click();
        await page.locator('#ttb-quick-list .ttb-quick-card').last().locator('button').first().click();
        await page.waitForTimeout(1100);
        await page.locator('.ttb-quick-available-item[data-item="226"] .ttb-add-quick').click();
        await page.locator('#ttb-quick-list .ttb-quick-card').last().locator('button').first().click();
        await page.waitForTimeout(1100);
        assert.deepEqual(await page.evaluate(() => nativeClicks.slice(-2)), [{id:'463',key:'f9'},{id:'226',key:'f9'}], 'needles and grenades use the same Quick Items entry');
        assert.equal(await page.locator('[data-tab="booster"], [data-pane="booster"], #torn-panel').count(), 0, 'only Quick Items should be exposed');
        await page.setViewportSize({width:390,height:844});
        await page.locator('#ttb-quick-add').click();
        const overlaps = await page.locator('.ttb-quick-available-item').evaluateAll(entries => entries.some(entry => {
            const label=entry.querySelector('span').getBoundingClientRect(), button=entry.querySelector('button').getBoundingClientRect();
            return label.right > button.left || button.right > entry.getBoundingClientRect().right + 1;
        }));
        assert.equal(overlaps, false, 'mobile picker labels and buttons must not overlap');
        assert.deepEqual(await page.evaluate(() => Array.from(document.querySelectorAll('ul.actions-wrap')).map(el => {const copy=el.cloneNode(true);copy.querySelectorAll('[data-ttb-page-add-host], .ttb-page-add-cell, [data-ttb-page-add]').forEach(node=>node.remove());return copy.innerHTML.replaceAll('option-unequip','option-equip');})), await page.evaluate(() => nativeActionHTML), 'native action controls remain unchanged');
        assert.deepEqual(errors, []);
        await page.close();

        const home = await setup(browser, 'https://www.torn.com/index.php', '<main>Home</main>', {ttbQuickItems:[{id:'464',name:'Melatonin',category:'Temporary'}]});
        await home.page.locator('#ttb-fab').click(); await home.page.locator('[data-tab="quick"]').click();
        await home.page.locator('#ttb-quick-list .ttb-quick-card button').first().click();
        assert.match(await home.page.locator('#ttb-quick-response').textContent(), /物品页面/);
        assert.equal(await home.page.locator('#torn-panel, [data-tab="booster"]').count(), 0);
        assert.deepEqual(home.errors, []); await home.page.close();

        const combat = await setup(browser, 'https://www.torn.com/page.php?foo=1&sid=attack', '<h4>Attacking</h4>');
        assert.equal(await combat.page.locator('#torn-panel, [data-tab="booster"]').count(), 0);
        assert.equal(await combat.page.locator('h4').textContent(), 'Attacking');
        assert.deepEqual(combat.errors, []); await combat.page.close();

        async function sourceCase(html, expectedKey, expectedSource) {
            const fixture = await setup(browser, 'https://www.torn.com/item.php', '<div class="equipped-items-wrap"></div><ul>' + html + '</ul>', {ttbQuickItems:[{id:'464',name:'Melatonin',category:'Temporary'}]});
            await fixture.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
            await fixture.page.waitForTimeout(1150);
            assert.deepEqual(await fixture.page.evaluate(() => nativeClicks), [{id:'464',key:expectedKey}]);
            assert.match(await fixture.page.locator('#ttb-quick-response').textContent(), new RegExp('已装备 Melatonin（' + expectedSource + '）'));
            assert.deepEqual(fixture.errors, []);
            assert.equal(fixture.requests.filter(r=>r.method==='POST').length,0,'loaded native equipment needs no extra script request');
            await fixture.page.close();
        }
        await sourceCase(row(464,'Melatonin','Temporary') + row(464,'Melatonin','Temporary','f0009'), 'f0009', '帮派');
        await sourceCase(row(464,'Melatonin','Temporary','unrecognized') + row(464,'Melatonin','Temporary','f0') + row(464,'Melatonin','Temporary','f9').replace('class="option-equip"', 'disabled class="option-equip"'), 'f0', '个人');
        await sourceCase(row(464,'Melatonin','Temporary','unrecognized'), 'unrecognized', '来源未知');
        const equippedOwn = await setup(browser, 'https://www.torn.com/item.php', '<div class="equipped-items-wrap"></div><ul>' + row(464,'Melatonin','Temporary','f9') + row(464,'Melatonin','Temporary','f0').replace('data-equipped="false"','data-equipped="true"') + '</ul>', {ttbQuickItems:[{id:'464',name:'Melatonin',category:'Temporary'}]});
        await equippedOwn.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await equippedOwn.page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('已卸下'));
        assert.match(await equippedOwn.page.locator('#ttb-quick-response').textContent(), /已卸下 Melatonin（个人）/);
        assert.deepEqual(await equippedOwn.page.evaluate(() => nativeClicks), [{id:'464',key:'f0'}]);
        await equippedOwn.page.evaluate(() => {
            const own=document.querySelector('[data-rowkey="f0"]');own.dataset.rowkey='missing';
        });
        assert.doesNotMatch(await equippedOwn.page.locator('#ttb-quick-list .ttb-quick-source').textContent(),/已装备/,'unequip result must override stale DOM equipped flags');
        assert.deepEqual(equippedOwn.errors, []); await equippedOwn.page.close();

        const rwFaction = row(1,'AK-47','Primary','f9').replace('<span class="name-wrap">','<span class="bonuses"><i title="&lt;b&gt;Deadeye&lt;/b&gt; 25%"></i></span><span class="name-wrap">');
        const rwOwn = row(1,'AK-47','Primary','f0').replace('<span class="name-wrap">','<span class="bonuses"><span data-bonus-name="Eviscerate" data-bonus="15%"></span></span><span class="name-wrap">');
        const weapons = await setup(browser, 'https://www.torn.com/item.php', '<div class="equipped-items-wrap"></div><ul>' + rwFaction + rwOwn + row(2,'Combat Shotgun','Primary') + '</ul>');
        await weapons.page.locator('#ttb-quick-page > button').nth(1).click();
        assert.equal(await weapons.page.locator('.ttb-quick-available-item').count(), 2);
        assert.equal(await weapons.page.locator('.ttb-quick-bonus').count(), 2);
        assert.match(await weapons.page.locator('.ttb-quick-bonus').first().textContent(), /RW.*帮派.*Deadeye.*25%/);
        assert.match(await weapons.page.locator('.ttb-quick-bonus').last().textContent(), /个人.*Eviscerate.*15%/);
        assert.equal(await weapons.page.locator('.ttb-quick-bonus b').count(), 0, 'tooltip HTML renders as plain text');
        await weapons.page.locator('#ttb-quick-search').fill('deadeye');
        assert.equal(await weapons.page.locator('.ttb-quick-available-item').count(), 1);
        await weapons.page.locator('#ttb-quick-search').fill('个人 EVISCERATE');
        assert.equal(await weapons.page.locator('.ttb-quick-available-item').count(), 1);
        await weapons.page.locator('#ttb-quick-search').fill('2');
        assert.equal(await weapons.page.locator('.ttb-quick-available-item[data-item="2"]').count(), 1);
        await weapons.page.locator('#ttb-quick-search').fill('no match');
        assert.equal(await weapons.page.locator('.ttb-quick-available-item').count(), 0);
        assert.match(await weapons.page.locator('#ttb-quick-available').textContent(), /没有匹配/);
        await weapons.page.locator('#ttb-quick-search').fill('ak-47');
        await weapons.page.locator('.ttb-add-quick').click();
        assert.equal(await weapons.page.evaluate(() => values.ttbQuickItems[0].id), '1');
        await weapons.page.locator('#ttb-quick-search').fill('');
        await weapons.page.evaluate(() => document.querySelector('.bonuses i').setAttribute('title', 'Deadeye 30%'));
        await weapons.page.waitForFunction(() => document.querySelector('.ttb-quick-bonus').textContent.includes('30%'));
        await weapons.page.setViewportSize({width:390,height:844});
        assert.equal(await weapons.page.locator('.ttb-quick-available-item').evaluateAll(entries => entries.some(entry => entry.querySelector('span').getBoundingClientRect().right > entry.querySelector('button').getBoundingClientRect().left)), false);
        assert.deepEqual(weapons.errors, []); await weapons.page.close();
        const screenshotSeed = {ttbQuickItems:[{id:'464',name:'Melatonin',category:'Temporary'},{id:'463',name:'Epinephrine',category:'Temporary'},{id:'814',name:'Tyrosine',category:'Temporary'},{id:'465',name:'Serotonin',category:'Temporary'},{id:'226',name:'Smoke Grenade',category:'Temporary'}]};
        const plainWeapon = row(27,'Plastic Sword [14541578718] 5.09 33.31 Q:44.00%','Melee','no-source').replace('<span class="name-wrap">','<img class="torn-item" alt="Plastic Sword"><span class="bonuses">5.09 33.31 <span class="tt-item-price">$27</span></span><span class="name-wrap">');
        const toxinWeapon = row(28,'Poison Umbrella [7986032700] Toxin 36%','Melee','no-source').replace('<span class="name-wrap">','<img class="torn-item" alt="Poison Umbrella"><span class="bonuses"><i title="&lt;b&gt;Toxin&lt;/b&gt;&lt;br/&gt;36% chance to apply a random debuff to the opponent"></i></span><span class="name-wrap">');
        const fixture = await setup(browser, 'https://www.torn.com/item.php', '<div id="categoriesList"><li class="ui-tabs-active" data-type="Melee"></li></div><div class="equipped-items-wrap"></div><ul id="fixture-inventory">' + plainWeapon + toxinWeapon + '</ul>', screenshotSeed, {
            Melatonin:{list:[{itemID:464,ID:99,Qty:12,factionItem:true,factionID:123}]},
            Epinephrine:{list:[{itemID:463,ID:98,Qty:3,factionItem:false,factionID:0}]},
            'Plastic Sword':{list:[{itemID:27,ID:123,Qty:1,factionItem:false,factionID:0}]},
            'Poison Umbrella':{list:[{itemID:28,ID:123,Qty:1,factionItem:true,factionID:123}]}
        });
        await fixture.page.setViewportSize({width:1658,height:1132});
        assert.equal(fixture.requests.filter(r=>r.method==='POST').length,0,'opening a page must not query inventory');
        await fixture.page.locator('#ttb-quick-page [data-item="464"] .ttb-quick-query').click();
        await fixture.page.waitForFunction(() => document.querySelector('#ttb-quick-page [data-item="464"] .ttb-quick-source').textContent.includes('帮派 ×12'));
        await fixture.page.locator('#ttb-quick-page > button').nth(1).click();
        await fixture.page.locator('#ttb-quick-refresh').click();
        assert.equal(fixture.requests.filter(r=>r.method==='POST').length,1,'refresh reads DOM only');
        assert.equal(await fixture.page.locator('.ttb-quick-available-item[data-item="27"] .ttb-quick-bonus').count(), 0, 'numeric weapon stats and TornTools prices are not RW effects');
        assert.equal(await fixture.page.locator('.ttb-quick-available-item[data-item="28"] .ttb-quick-bonus').count(), 1);
        assert.match(await fixture.page.locator('.ttb-quick-available-item[data-item="28"] .ttb-quick-bonus').textContent(), /Toxin.*36%/);
        assert.match(await fixture.page.locator('.ttb-quick-available-item[data-item="27"] > span').textContent(), /^Plastic Sword · Melee/);
        assert.doesNotMatch(await fixture.page.locator('.ttb-quick-available-item[data-item="27"] > span').textContent(), /145415|5\.09|Q:/);
        for (const width of [1658,390]) {
            await fixture.page.setViewportSize({width,height:1132});
            assert.equal(await fixture.page.locator('.ttb-quick-card').evaluateAll(cards=>cards.some(card=>card.querySelector('.ttb-quick-label').getBoundingClientRect().width<90)), false, 'favorite names must not collapse to vertical letters');
            assert.equal(await fixture.page.locator('.ttb-quick-card').evaluateAll(cards=>cards.some(card=>card.scrollWidth>card.clientWidth+1)), false, 'cards must not overflow');
        }
        await fixture.page.evaluate(() => {
            const ul=document.querySelector('#fixture-inventory');ul.replaceChildren();
            document.querySelector('#categoriesList [data-type]').dataset.type='Temporary';
        });
        // The server snapshot remains available even after the current DOM category changes.
        assert.match(await fixture.page.locator('#ttb-quick-page [data-item="464"] .ttb-quick-source').textContent(), /帮派 ×12/);
        assert.deepEqual(fixture.errors, []); await fixture.page.close();
        const cached = await setup(browser,'https://www.torn.com/item.php','<div id="categoriesList"><button data-type="Temporary">Temporary</button></div><div class="equipped-items-wrap"></div><ul id="lazy-items"></ul>', {
            ttbQuickItems:[{id:'464',name:'Melatonin',category:'Temporary'}],
            ttbQuickInventorySnapshotV1:[{id:'464',name:'Melatonin',category:'Temporary',sources:[{source:'faction',quantity:12,instanceId:'old-id'}]}]
        },{Melatonin:{delay:1200,list:[{itemID:464,ID:88,Qty:12,factionItem:true,factionID:123}]}});
        assert.match(await cached.page.locator('#ttb-quick-page .ttb-quick-source').textContent(),/本地缓存.*帮派 ×12/);
        await cached.page.evaluate(html=>{
            document.querySelector('#categoriesList button').addEventListener('click',()=>{
                document.querySelector('#lazy-items').innerHTML=html;
                const button=document.querySelector('#lazy-items .option-equip');
                button.addEventListener('click',()=>{
                    nativeClicks.push({id:'464',key:'new-live-id'});
                    button.closest('li').dataset.equipped='true';
                });
            });
        },row(464,'Melatonin','Temporary','f9').replace('data-id="123"','data-id="new-live-id"'));
        await cached.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await cached.page.locator('#ttb-quick-page .ttb-quick-card button').first().dispatchEvent('click');
        await cached.page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('库存已查询'));
        assert.equal(await cached.page.evaluate(()=>nativeClicks.length),0,'lookup click must not also equip');
        await cached.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await cached.page.waitForFunction(()=>nativeClicks.length===1);
        assert.deepEqual(await cached.page.evaluate(()=>nativeClicks),[{id:'464',key:'88'}],'equip must use fresh server id, never cached instance id');
        assert.equal(await cached.page.locator('#lazy-items li').count(),0,'equip must not need a category tab or native DOM row');
        await cached.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await cached.page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('已卸下'));
        assert.equal((await cached.page.evaluate(()=>nativeClicks)).length,2,'second click toggles a server-only instance off');
        assert.equal(await cached.page.locator('#ttb-panel').isVisible(),false);
        const persisted = await cached.page.evaluate(()=>values.ttbQuickInventorySnapshotV1);
        assert.ok(persisted.some(item=>item.id==='464'));
        assert.equal(persisted.find(item=>item.id==='464').sources[0].quantity,12,'missing DOM quantity must preserve the last known cached count');
        assert.equal(persisted.some(item=>item.sources.some(entry=>Object.hasOwn(entry,'instanceId'))),false,'cache only display data');
        assert.equal(await cached.page.evaluate(()=>values.ttbQuickInstancesV1.find(item=>item.id==='464').sources[0].instanceId),'88','manual query must persist usable instance separately');
        assert.deepEqual(cached.errors,[]);await cached.page.close();
        const failed=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"></div>',{ttbQuickItems:[{id:'464',name:'Melatonin',category:'Temporary'}]}, {Melatonin:{list:[{itemID:464,ID:71,Qty:1,factionItem:false,factionID:0,equiped:false,mockError:'You no longer own this item.'}]}});
        await failed.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await failed.page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('库存已查询'));
        await failed.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await failed.page.waitForFunction(()=>document.querySelector('.ttb-quick-feedback').textContent.includes('no longer own'));
        assert.doesNotMatch(await failed.page.locator('.ttb-quick-source').first().textContent(),/已装备/,'failed request must not mark equipped');
        assert.equal(await failed.page.locator('#ttb-panel').isVisible(),false);
        assert.deepEqual(failed.errors,[]);await failed.page.close();
        const loadout=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"><div id="loadout-slot" data-slot="temporary"><span class="loadout-name">Empty</span></div><button id="native-loadout-button">Loadout</button><input id="native-loadout-name" value="My loadout"></div>',{ttbQuickItems:[{id:'464',name:'Melatonin',category:'Temporary'}]},{Melatonin:{list:[{itemID:464,ID:808,Qty:1,factionItem:true,factionID:123,equiped:false}]}},true);
        await loadout.page.evaluate(()=>{
            window.nativeLoadoutClicks=0;window.nativeLoadoutNode=document.getElementById('native-loadout-button');
            nativeLoadoutNode.addEventListener('click',()=>nativeLoadoutClicks++);
            document.getElementById('native-loadout-name').value='My custom choice';
            document.getElementById('loadout-slot').classList.add('tt-enhanced');
        });
        await loadout.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await loadout.page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('库存已查询'));
        await loadout.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await loadout.page.locator('#ttb-quick-page').getByRole('button',{name:'同步详情',exact:true}).click();
        await loadout.page.waitForFunction(()=>document.querySelector('.loadout-name').textContent==='Melatonin');
        assert.equal(await loadout.page.locator('#ttb-panel').isVisible(),false);
        assert.equal(await loadout.page.locator('#native-loadout-name').inputValue(),'My custom choice');
        assert.equal(await loadout.page.evaluate(()=>nativeLoadoutNode===document.getElementById('native-loadout-button')),true);
        await loadout.page.locator('#native-loadout-button').click();assert.equal(await loadout.page.evaluate(()=>nativeLoadoutClicks),1);
        assert.equal(await loadout.page.locator('#loadout-slot').getAttribute('class'),'tt-enhanced');
        await loadout.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await loadout.page.locator('#ttb-quick-page').getByRole('button',{name:'同步详情',exact:true}).click();
        await loadout.page.waitForFunction(()=>document.querySelector('.loadout-name').textContent==='Empty');
        assert.deepEqual(loadout.errors,[]);await loadout.page.close();
        assert.equal(loadout.requests.filter(r=>r.method==='GET' && r.url.endsWith('/item.php')).length,1,'no post-equip page fetch');
        assert.equal(loadout.requests.filter(r=>r.method==='POST' && new URLSearchParams(r.body).get('step')==='getSearchList').length,1,'cached switching must not requery');
        const instanceSeed={ttbQuickItems:[{id:'464',name:'Melatonin',category:'Temporary'}],ttbQuickInstancesV1:[{id:'464',name:'Melatonin',category:'Temporary',savedAt:Date.now(),sources:[{source:'faction',quantity:12,instanceId:'909',canEquip:true}]}]};
        const live=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"><div data-slot="temporary"><span class="loadout-name">Empty</span><img src="/images/items/0/medium.png"></div><input value="My loadout"></div>',instanceSeed,{Melatonin:{list:[{itemID:464,ID:909,Qty:12,factionItem:true,factionID:123,equiped:false}]}});
        await live.page.addStyleTag({content:'#ttb-quick-page .ttb-quick-card > button:not(:first-child) {width:30px;}'});
        const query=live.page.locator('#ttb-quick-page .ttb-quick-query');
        assert.equal(Math.round((await query.boundingBox()).width),28,'query must be a compact icon under competing styles');
        const itemIcon=await live.page.locator('#ttb-quick-page .ttb-quick-card button:first-child img').boundingBox();
        const queryBounds=await query.boundingBox();
        assert.ok(queryBounds.x+queryBounds.width<=itemIcon.x,'refresh icon must be left of the item icon');
        assert.ok(Math.abs(queryBounds.y+queryBounds.height/2-itemIcon.y-itemIcon.height/2)<2,'refresh icon must share the item row');
        assert.ok((await query.boundingBox()).height<=30,'query must be compact');
        await live.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await live.page.locator('#ttb-quick-page').getByRole('button',{name:'同步详情',exact:true}).click();
        await live.page.waitForFunction(()=>document.querySelector('.loadout-name').textContent==='Melatonin');
        assert.equal(await live.page.locator('.ttb-loadout-live').count(),0);
        assert.doesNotMatch(await live.page.locator('#ttb-quick-response').textContent(),/请刷新/);
        assert.equal(await live.page.locator('.equipped-items-wrap input').inputValue(),'My loadout');
        await live.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await live.page.locator('#ttb-quick-page').getByRole('button',{name:'同步详情',exact:true}).click();
        await live.page.waitForFunction(()=>document.querySelector('.loadout-name').textContent==='Empty');
        assert.equal(await live.page.evaluate(()=>nativeRefreshCalls),2);
        assert.equal(live.requests.filter(r=>r.method==='POST' && new URLSearchParams(r.body).get('step')==='getSearchList').length,0,'restored instance allows first-click equip without lookup');
        assert.equal(live.requests.filter(r=>r.method==='GET' && r.url.endsWith('/item.php')).length,1,'local display update must not fetch page');
        assert.deepEqual(live.errors,[]);await live.page.close();
        const expired=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"></div>',instanceSeed);
        await expired.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await expired.page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('no longer own'));
        assert.equal((await expired.page.evaluate(()=>values.ttbQuickInstancesV1)).length,0,'invalid instance must be evicted');
        assert.equal(expired.requests.filter(r=>r.method==='POST').length,1,'invalid instances must not automatically retry or lookup');
        await expired.page.close();
        const weaponSeed={ttbQuickItems:[{id:'1',name:'AK-47',category:'Primary'}],ttbQuickInstancesV1:[{id:'1',name:'AK-47',category:'Primary',savedAt:Date.now(),sources:[{source:'faction',quantity:1,instanceId:'111',canEquip:true},{source:'own',quantity:1,instanceId:'222',canEquip:true}]}]};
        const borrowed=row(1,'AK-47','Primary','unknown-a').replace('data-id="123"','data-id="111"').replace('data-equipped="false"','data-equipped="true"').replace('<button class="option-equip" data-id="111">Equip</button>','<span class="icon-h unequip" role="button"><i class="option-unequip" data-id="111"></i></span>');
        const personal=row(1,'AK-47','Primary','unknown-b').replace('data-id="123"','data-id="222"');
        const unknownWeapon=row(1,'AK-47','Primary','unknown-c').replace('data-id="123"','data-id="333"');
        const weaponSources=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"></div><ul>'+borrowed+personal+unknownWeapon+'</ul>',weaponSeed);
        assert.match(await weaponSources.page.locator('#ttb-quick-page .ttb-quick-source').textContent(),/已装备（帮派）/,'unequip icon instance must match the faction weapon');
        const sourceEntries=await weaponSources.page.evaluate(()=>values.ttbQuickInstancesV1.find(item=>item.id==='1').sources);
        assert.equal(sourceEntries.find(entry=>entry.instanceId==='222').source,'own');
        assert.equal(sourceEntries.find(entry=>entry.instanceId==='333').source,'unknown','same-model weapon must never inherit another instance source');
        assert.equal(weaponSources.requests.filter(r=>r.method==='POST').length,0);
        assert.deepEqual(weaponSources.errors,[]);await weaponSources.page.close();
        const markedWeapons=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"></div><ul>'+personal.replace('<span class="name-wrap">','<span data-faction-id="0"></span><span class="name-wrap">')+unknownWeapon.replace('<span class="name-wrap">','<span class="faction-loaned"></span><span class="name-wrap">')+'</ul>',weaponSeed);
        const markedEntries=await markedWeapons.page.evaluate(()=>values.ttbQuickInstancesV1.find(item=>item.id==='1').sources);
        assert.equal(markedEntries.find(entry=>entry.instanceId==='222').source,'own','child faction ID zero means personal');
        assert.equal(markedEntries.find(entry=>entry.instanceId==='333').source,'faction','loan marker identifies the specific weapon');
        assert.doesNotMatch(await markedWeapons.page.locator('#ttb-quick-page .ttb-quick-source').textContent(),/库存|×\d/,'weapons show ownership without inventory counts');
        assert.match(await markedWeapons.page.locator('#ttb-quick-page .ttb-quick-query').getAttribute('aria-label'),/来源/);
        await markedWeapons.page.close();
        const diagnosticWeapon=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"></div>',{ttbQuickItems:[{id:'28',name:'Poison Umbrella',category:'Melee'}]},{'Poison Umbrella':{list:[{itemID:28,ID:888,Qty:1,privateSecret:'must-not-export'}]}});
        await diagnosticWeapon.page.locator('#ttb-quick-page .ttb-quick-query').click();
        await diagnosticWeapon.page.locator('#ttb-quick-page .ttb-source-diagnostic').click();
        const diagnostic=await diagnosticWeapon.page.locator('#ttb-quick-page textarea').inputValue();
        assert.equal(JSON.parse(diagnostic).query.entries[0].fields.ID,888);
        assert.ok(!diagnostic.includes('must-not-export'),'diagnostic exports only source fields');
        assert.equal(diagnosticWeapon.requests.filter(r=>r.method==='POST').length,1,'viewing diagnostics must not send another request');
        await diagnosticWeapon.page.close();
        const uniqueWeapon=(id,name,xid,borrowed)=>'<li data-item="'+id+'" data-category="Melee" data-armoryid="'+xid+'" data-rowkey="u'+xid+'" data-equipped="false"><span class="name">'+name+'</span><ul><li class="left equipped" data-item="'+id+'" data-id="'+xid+'"></li>'+(borrowed ? '<li class="left return" data-id="'+xid+'" title="Return '+name+' to Faction"></li>' : '<li class="left send" data-id="'+xid+'"></li><li class="left dump" data-item="'+id+'" data-id="'+xid+'"></li>')+'</ul></li>';
        const ownNunchaku=uniqueWeapon(395,'Metal Nunchaku','8558017415',false);
        const factionUmbrella=uniqueWeapon(1055,'Poison Umbrella','7986032700',true);
        const realWeapons=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"></div><ul>'+ownNunchaku+factionUmbrella+'</ul>',{ttbQuickItems:[{id:'395',name:'Metal Nunchaku',category:'Melee'},{id:'1055',name:'Poison Umbrella',category:'Melee'}]});
        assert.match(await realWeapons.page.locator('#ttb-quick-page [data-item="395"] .ttb-quick-source').textContent(),/来源：个人/);
        assert.match(await realWeapons.page.locator('#ttb-quick-page [data-item="1055"] .ttb-quick-source').textContent(),/来源：帮派/);
        assert.equal(await realWeapons.page.evaluate(()=>values.ttbQuickInstancesV1.find(item=>item.id==='395').sources[0].instanceId),'8558017415');
        assert.equal(realWeapons.requests.filter(r=>r.method==='POST').length,0,'real weapon rows should populate instances without lookup');
        await realWeapons.page.close();
        const htmlWeapons=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"></div>',{ttbQuickItems:[{id:'1055',name:'Poison Umbrella',category:'Melee'}]},{'Poison Umbrella':{html:'<ul><li data-item="1055" data-category="Melee" data-rowkey="g1055">group<ul>'+factionUmbrella+'</ul></li></ul>'}});
        await htmlWeapons.page.locator('#ttb-quick-page .ttb-quick-query').click();
        await htmlWeapons.page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('来源已查询'));
        const htmlInstances=await htmlWeapons.page.evaluate(()=>values.ttbQuickInstancesV1.find(item=>item.id==='1055').sources);
        assert.equal(htmlInstances.length,1,'HTML group and nested action rows must not become weapon instances');
        assert.equal(htmlInstances[0].instanceId,'7986032700');assert.equal(htmlInstances[0].source,'faction');
        await htmlWeapons.page.close();
        const melatoninHTML='<li data-item="464" data-category="Temporary" data-rowkey="g464" data-qty="81" data-equipped="true"><span class="name">Melatonin</span><ul><li class="left equipped" data-item="464" data-id="21324778061"></li><li class="left send" data-id="464"></li><li class="left dump" data-item="464" data-id="464"></li></ul></li>';
        const smokeHTML='<li data-item="226" data-category="Temporary" data-rowkey="g226f16335" data-qty="41" data-equipped="true"><span class="name">Smoke Grenade</span><ul><li class="left equipped t-overflow" data-item="226" data-id="13326343285"></li><li class="left return" data-id="13326343285" title="Return Smoke Grenade to Faction"></li></ul></li>';
        const tempHTML=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"></div>',{ttbQuickItems:[{id:'464',name:'Melatonin',category:'Temporary'},{id:'226',name:'Smoke Grenade',category:'Temporary'}]},{Melatonin:{html:melatoninHTML},'Smoke Grenade':{html:smokeHTML}});
        await tempHTML.page.locator('#ttb-quick-page [data-item="464"] .ttb-quick-query').click();
        await tempHTML.page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('库存已查询'));
        let tempRecords=await tempHTML.page.evaluate(()=>values.ttbQuickInstancesV1);
        assert.equal(tempRecords.find(item=>item.id==='464').sources.length,1);
        assert.deepEqual(tempRecords.find(item=>item.id==='464').sources[0],{source:'own',quantity:81,instanceId:'21324778061',rowKey:'g464',canEquip:true});
        await tempHTML.page.locator('#ttb-quick-page [data-item="226"] .ttb-quick-query').click();
        await tempHTML.page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.startsWith('Smoke Grenade 库存已查询'));
        tempRecords=await tempHTML.page.evaluate(()=>values.ttbQuickInstancesV1);
        assert.deepEqual(tempRecords.find(item=>item.id==='226').sources[0],{source:'faction',quantity:41,instanceId:'13326343285',rowKey:'g226f16335',canEquip:true});
        assert.match(await tempHTML.page.locator('#ttb-quick-page [data-item="464"] .ttb-quick-source').textContent(),/个人 ×81/);
        await tempHTML.page.close();
        for(const category of ['Primary','Secondary','Melee']) {
            const html='<div class="equipped-items-wrap"><div class="native-loadout-weapon">Empty</div></div><ul>'+uniqueWeapon(1055,'Poison Umbrella','7986032700',true).replace('data-category="Melee"','data-category="'+category+'"').replace('data-id="7986032700"></li>','data-id="7986032700"><button class="option-equip" data-id="7986032700">Equip</button></li>')+'</ul>';
            const nativeWeapon=await setup(browser,'https://www.torn.com/item.php',html,{ttbQuickItems:[{id:'1055',name:'Poison Umbrella',category}]});
            await nativeWeapon.page.evaluate(()=>document.querySelector('.left.equipped').addEventListener('click',()=>document.querySelector('.native-loadout-weapon').textContent=document.querySelector('li[data-category]').dataset.equipped==='true' ? 'Poison Umbrella':'Empty'));
            await nativeWeapon.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
            await nativeWeapon.page.waitForFunction(()=>document.querySelector('.native-loadout-weapon').textContent==='Poison Umbrella');
            await nativeWeapon.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
            await nativeWeapon.page.waitForFunction(()=>document.querySelector('.native-loadout-weapon').textContent==='Empty');
            assert.equal(nativeWeapon.requests.filter(r=>r.method==='POST').length,0,'loaded weapon must use Torn native handler');
            assert.equal(await nativeWeapon.page.evaluate(()=>nativeRefreshCalls),0,'native path must not duplicate Torn refresh');
            assert.deepEqual(nativeWeapon.errors,[]);await nativeWeapon.page.close();
        }
        const directWeapon=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"><div data-slot="melee"><span class="loadout-name">Empty</span></div></div><ul><li data-item="1055" data-category="Melee" data-armoryid="808" data-rowkey="u808" data-equipped="false"><span class="name">Poison Umbrella</span><span title="Return to Faction"></span></li></ul>',{ttbQuickItems:[{id:'1055',name:'Poison Umbrella',category:'Melee'}]},{'Poison Umbrella':{list:[{itemID:1055,ID:808,Qty:1,factionItem:true,equiped:false}]}});
        await directWeapon.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await directWeapon.page.locator('#ttb-quick-page').getByRole('button',{name:'同步详情',exact:true}).click();
        await directWeapon.page.waitForFunction(()=>document.querySelector('.loadout-name').textContent==='Poison Umbrella');
        assert.equal(await directWeapon.page.locator('li[data-category="Melee"]').getAttribute('data-equipped'),'true','plain-text success must still sync native inventory flags');
        await directWeapon.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await directWeapon.page.locator('#ttb-quick-page').getByRole('button',{name:'同步详情',exact:true}).click();
        await directWeapon.page.waitForFunction(()=>document.querySelector('.loadout-name').textContent==='Empty');
        assert.equal(await directWeapon.page.locator('li[data-category="Melee"]').getAttribute('data-equipped'),'false');
        assert.equal(directWeapon.requests.filter(r=>r.method==='POST' && new URLSearchParams(r.body).get('step')==='getSearchList').length,0);
        assert.deepEqual(directWeapon.errors,[]);await directWeapon.page.close();
        const containerWeapon=await setup(browser,'https://www.torn.com/item.php','<div class="equipped-items-wrap"><div class="actual-loadout-class"><img src="/images/items/1055/medium.png"></div><input value="private-loadout-choice"></div><ul>'+factionUmbrella+'</ul>',{ttbQuickItems:[{id:'1055',name:'Poison Umbrella',category:'Melee'}]},{'Poison Umbrella':{list:[{itemID:1055,ID:7986032700,factionItem:true,equiped:false}]}});
        await containerWeapon.page.evaluate(()=>{window.containerClicks=0;document.querySelector('.left.equipped').addEventListener('click',()=>containerClicks++);});
        await containerWeapon.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await containerWeapon.page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('已装备'));
        assert.equal(await containerWeapon.page.evaluate(()=>containerClicks),0,'container alone is not a native equipment button');
        assert.equal(containerWeapon.requests.filter(r=>r.method==='POST').length,1,'cached instance uses one explicit action request');
        await containerWeapon.page.locator('#ttb-fab').click();
        await containerWeapon.page.locator('[data-tab="quick"]').click();
        await containerWeapon.page.locator('button', {hasText:'查看装备栏诊断'}).click();
        const structure=await containerWeapon.page.locator('#ttb-quick-response textarea').inputValue();
        assert.match(structure,/actual-loadout-class/);assert.doesNotMatch(structure,/private-loadout-choice/);
        assert.equal(containerWeapon.requests.filter(r=>r.method==='POST').length,1,'loadout diagnostic reads DOM only');
        assert.deepEqual(containerWeapon.errors,[]);await containerWeapon.page.close();
        const realTree=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/native-loadout.json'),'utf8'));
        function treeHTML(node) {
            const attrs=Object.entries(node.attributes || {}).filter(([key])=>key!=='imagePath').map(([key,value])=>key+'="'+String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;')+'"').join(' ');
            const src=node.attributes?.imagePath ? ' src="'+node.attributes.imagePath+'"' : '';
            return '<'+node.tag+' '+attrs+src+'>'+ (node.children || []).map(treeHTML).join('') + '</'+node.tag+'>';
        }
        for(const [index,category] of ['Primary','Secondary','Melee','Temporary'].entries()) {
            const seed={ttbQuickItems:[{id:'1055',name:'Poison Umbrella',category},{id:'226',name:'Smoke Grenade',category}],ttbQuickInstancesV1:[
                {id:'1055',name:'Poison Umbrella',category,savedAt:Date.now(),sources:[{source:'faction',instanceId:'808',quantity:1,canEquip:true}]},
                {id:'226',name:'Smoke Grenade',category,savedAt:Date.now(),sources:[{source:'own',instanceId:'909',quantity:1,canEquip:true}]}]};
            const actual=await setup(browser,'https://www.torn.com/item.php',treeHTML(realTree),seed,{'Poison Umbrella':{list:[{itemID:1055,ID:808,equiped:false}]},'Smoke Grenade':{list:[{itemID:226,ID:909,equiped:false}]}});
            await actual.page.evaluate(()=>{window.savedNative=document.querySelectorAll('#loadoutsRoot [class*="itemsContainer___"] [class*="itemWrapper___"] button');window.nativeSelections=0;savedNative.forEach(el=>el.addEventListener('click',()=>nativeSelections++));});
            const originalImages=await actual.page.locator('#loadoutsRoot [class*="itemsContainer___"] img').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('src')));
            // Existing class is a shared quick button; select the action explicitly.
            const action=async id=>{const btn=actual.page.locator('#ttb-quick-page .ttb-quick-card[data-item="'+id+'"] button').first();await btn.click();await actual.page.waitForFunction(()=>!document.querySelector('#ttb-quick-page .ttb-quick-card button').disabled);await actual.page.locator('#ttb-quick-page').getByRole('button',{name:'同步详情',exact:true}).click();};
            await action('1055');
            await actual.page.waitForFunction(index=>document.querySelectorAll('#loadoutsRoot [class*="itemsContainer___"] img')[index]?.alt==='Poison Umbrella',index);
            await actual.page.evaluate(index=>savedNative[index].click(),index);
            assert.equal(await actual.page.evaluate(()=>nativeSelections),1,'original selection handler stays active');
            await action('226');
            await actual.page.waitForFunction(index=>document.querySelectorAll('#loadoutsRoot [class*="itemsContainer___"] img')[index]?.alt==='Smoke Grenade',index);
            await action('226');
            await actual.page.waitForFunction(index=>document.querySelectorAll('#loadoutsRoot [class*="itemsContainer___"] img')[index]?.alt==='Empty',index);
            assert.equal(await actual.page.locator('.ttb-loadout-slot,.ttb-loadout-review,.ttb-loadout-live').count(),0);
            assert.ok(await actual.page.evaluate(()=>Array.from(savedNative).every(el=>el.isConnected)));
            const images=await actual.page.locator('#loadoutsRoot [class*="itemsContainer___"] img').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('src')));
            assert.deepEqual(images.filter((_,i)=>i!==index),originalImages.filter((_,i)=>i!==index),'other slots stay native');
            assert.equal(await actual.page.evaluate(()=>nativeRefreshCalls),3,'one public refresh per confirmed direct action');
            assert.equal(actual.requests.filter(r=>r.url.includes('sid=itemsLoadouts')).length,3,'three separate manual sync clicks; no weapon-click snapshots');
            assert.equal(actual.requests.filter(r=>r.method==='POST').length,3);
            assert.equal(actual.requests.filter(r=>r.method==='POST' && new URLSearchParams(r.body).get('step')==='getSearchList').length,0);
            assert.equal(actual.requests.filter(r=>r.method==='GET' && r.url.endsWith('/item.php')).length,1);
            assert.deepEqual(actual.errors,[]);await actual.page.close();
        }
        const noApi=await setup(browser,'https://www.torn.com/item.php',treeHTML(realTree),instanceSeed,{Melatonin:{list:[{itemID:464,ID:909,equiped:false}]}});
        await noApi.page.evaluate(()=>delete window.loadouts);
        const before=await noApi.page.locator('#loadoutsRoot').innerHTML();
        await noApi.page.locator('#ttb-quick-page .ttb-quick-card button').first().click();
        await noApi.page.locator('#ttb-quick-page').getByRole('button',{name:'同步详情',exact:true}).click();
        await noApi.page.waitForFunction(()=>document.querySelector('#ttb-quick-response').textContent.includes('同步入口不可用'));
        assert.equal(await noApi.page.locator('#loadoutsRoot').innerHTML(),before);
        assert.equal(noApi.requests.filter(r=>r.method==='POST').length,1);
        assert.equal(noApi.requests.filter(r=>r.url.includes('sid=itemsLoadouts')).length,0);
        await noApi.page.close();
        console.log('PASS: Quick Items, source queries/counts, TornTools names/stats, RW-only highlighting, desktop/mobile card layout and category snapshots.');
    } finally { await browser.close(); }
})().catch(err => { console.error(err); process.exitCode = 1; });
