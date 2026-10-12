
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
    return JSON.stringify({version:'1.6.32',item:{id:item.id,name:item.name,category:item.category},rows:rows(item.id,item.category).slice(0,10).map(row=>({attributes:fields(row),instanceId:instanceOf(row),markers:Array.from(row.querySelectorAll('[data-id], [data-source], [data-faction-id], [data-factionid], [data-faction-item], [data-factionitem], [class*="loan"], [class*="armory"]')).slice(0,20).map(fields),loanLabels:Array.from(row.querySelectorAll('[title],[aria-label]')).map(el=>el.getAttribute('title') || el.getAttribute('aria-label')).filter(text=>/loan|borrow|faction|armory|借用|帮派|幫派/i.test(text)).map(text=>plainText(text).slice(0,200))})),query:queryDiagnostics.get(item.id) || '本次页面尚未手动查询',resolved:fetchedInventory.get(item.id)?.sources},null,2);
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
    const field=document.createElement('textarea');field.readOnly=true;field.setAttribute('aria-label','装备栏结构诊断');field.style.cssText='width:100%;height:220px;box-sizing:border-box;font:12px/1.4 monospace;';field.textContent=JSON.stringify({version:'1.6.32',loadout:current ? inspect(current):null},null,2);response.append(field);syncPageResponse();
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
function setQuickFolded(folded,persist=false){
    const grid=pageBox?.querySelector('.ttb-quick-grid'),toggle=pageBox?.querySelector('.ttb-quick-fold-toggle');
    if(grid)grid.hidden=Boolean(folded);
    if(toggle){toggle.textContent=(folded?'▸':'▾')+' Quick Items · 快捷物品 · '+(folded?'展开':'收起');toggle.setAttribute('aria-expanded',String(!folded));toggle.title=folded?'展开快捷物品卡片':'收起快捷物品卡片';}
    if(persist)GM_setValue('ttbQuickItemsFolded',Boolean(folded));
}
function button(text, handler) {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'ttb-quick-button'; btn.textContent = text;
    btn.addEventListener('click', handler); return btn;
}
let sorting=false;
function quickBadge(item,status){
    if(isWeapon(item))return status.text.startsWith('已装备')?'✓':'·';
    const live=activePage()?rows(item.id,item.category):[];
    const quantities=live.length?live.map(quantityOf):(fetchedInventory.get(item.id)||inventoryCache.get(item.id)||localCache.get(item.id))?.sources.map(entry=>entry.quantity);
    if(!quantities?.length||quantities.some(value=>value===null||value===undefined))return '?';
    const count=quantities.reduce((sum,value)=>sum+value,0);
    return count>=1000?(count/1000).toFixed(count%1000===0?0:1)+'K':String(count);
}
function render() {
    if(sorting)return;
    const statuses = items.map(sourceStatus);
    const names = items.map(item => inventoryCache.get(item.id)?.name || item.name);
    const bonusTitles=items.map(quickBonusTitle);
    const badges=items.map((item,index)=>quickBadge(item,statuses[index]));
    const signature = JSON.stringify([items, names, statuses, badges, bonusTitles, items.map(modChoices), items.map(ammoControl), busy, enabled.checked, Boolean(pageBox?.isConnected)]);
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
            use.title=[bonusTitles[index],statuses[index].text].filter(Boolean).join('\n');
            use.disabled = busy || !enabled.checked;
            const img = document.createElement('img'); img.src = '/images/items/' + item.id + '/medium.png'; img.alt = ''; img.width = 40; img.height = 40;
            const label = document.createElement('span'); label.className = 'ttb-quick-label';
            const name = document.createElement('span'); name.className = 'ttb-quick-name'; name.textContent = names[index];
            const status = document.createElement('small'); status.className = 'ttb-quick-source'; status.dataset.source = statuses[index].source; status.textContent = statuses[index].text;
            const badge=document.createElement('span');badge.className='ttb-mobile-count';badge.textContent=badges[index];badge.dataset.source=statuses[index].source;
            label.append(name, status); use.append(badge,img, label); card.append(use);
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
    if (!enabled.checked || !activePage()) return;
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
                setQuickFolded(payload.folded,true);
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
function syncQuickVisibility(){
    if(pageBox)pageBox.hidden=!enabled.checked;
    if(!enabled.checked){
        document.querySelectorAll('.ttb-page-add-cell, [data-ttb-page-add]').forEach(node=>node.remove());
        document.querySelectorAll('.ttb-compact-actions').forEach(node=>node.classList.remove('ttb-compact-actions'));
    }
}
function scan() {
    syncQuickVisibility();
    if(!enabled.checked){renderAvailable();render();return;}
    if (!activePage()) return;
    if (location.pathname !== '/item.php') { renderAvailable(); return; }
    refreshInventoryCache();
    cacheVisibleWeaponBonuses();
    rememberVisibleMods();
    restoreNativeLoadout();
    const anchor = document.querySelector('div.equipped-items-wrap');
    if (anchor && (!pageBox || !pageBox.isConnected)) {
        pageBox = document.createElement('section'); pageBox.id = 'ttb-quick-page';
        const title = document.createElement('button'); title.type = 'button'; title.className='ttb-quick-fold-toggle';title.setAttribute('aria-controls','ttb-quick-page-grid');
        const grid = document.createElement('div'); grid.className = 'ttb-quick-grid';
        grid.id='ttb-quick-page-grid';
        title.addEventListener('click', () => setQuickFolded(!grid.hidden,true));
        const add = button('添加物品', openPicker);
        const feedback = document.createElement('div'); feedback.className = 'ttb-quick-feedback'; feedback.setAttribute('role', 'status'); feedback.hidden = true;
        const tools=[button('导入配置',openConfigImport),button('导出配置',exportQuickConfig),button('Mod资料',readModAvailability),button('同步详情',manualLoadoutSync)];tools.forEach(btn=>btn.classList.add('ttb-page-tool'));
        const more=button('⋯',()=>{const expanded=pageBox.classList.toggle('ttb-mobile-manage');more.setAttribute('aria-expanded',String(expanded));});more.classList.add('ttb-mobile-more');more.title='管理与更多操作';more.setAttribute('aria-label','管理与更多操作');more.setAttribute('aria-expanded','false');
        pageBox.append(title, add, ...tools,more,grid, feedback);setQuickFolded(GM_getValue('ttbQuickItemsFolded',false));anchor.before(pageBox); render(); syncPageResponse();
    }
    if (pageBox) pageBox.hidden = !enabled.checked;
    renderAvailable();
    renderPageQuickButtons();
    render();
}
enabled.addEventListener('change', () => { GM_setValue(ENABLED, enabled.checked); syncQuickVisibility(); scan(); render(); });
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
    #ttb-quick-page[hidden] { display:none !important; }
    #ttb-quick-page .ttb-quick-grid:not([hidden]) { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 8px; width: 100%; align-items:start; }
    #ttb-quick-page .ttb-quick-grid[hidden] { display:none !important; }
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
