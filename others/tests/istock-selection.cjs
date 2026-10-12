const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../iStock-2.0.2.user.js'),'utf8');
function section(name,next){return source.slice(source.indexOf('    function '+name+'('),source.indexOf('    function '+next+'('));}
const data=new Map([['ISTOCK',JSON.stringify({a:{merge:1,exclude:0},b:{merge:0,exclude:1},is_significant_change:1,significant_change_percent:'0.3'})]]);
const handlers=new Map();let writes=0;
const empty={length:0,find(){return this},each(){return this},children(){return this},css(){return this},off(){return this},click(){return this},text(){return this},toArray(){return []},on(event,fn){handlers.set(event,fn);return this},val(){return this},hasClass(){return false}};
const localStorage={getItem:key=>data.get(key)??null,setItem(key,value){writes++;data.set(key,value)}};
const row={attr:()=> 'a',find:selector=>({is:()=>selector.includes('merge')?row.merge:row.exclude}),merge:true,exclude:false};
const ctx={window:{localStorage},console:{log(){}},userCash:{company:0,vault:0},$:value=>typeof value==='object'?{closest:()=>row}:empty,getSortedTransactions:()=>[],renderTable:()=>{},toThousands:String};
vm.createContext(ctx);
vm.runInContext(section('getLocalStorageRootNode','getLocalStorage')+section('getLocalStorage','updateLocalStorage')+section('updateLocalStorage','getAPIKey')+section('bindTableEvents','getSortedTransactions')+section('updatePrice','toThousands'),ctx);
const original=data.get('ISTOCK');ctx.updatePrice();ctx.updatePrice();assert.equal(writes,0);assert.equal(data.get('ISTOCK'),original,'empty desktop-view transition must not overwrite selections');
ctx.bindTableEvents();
handlers.get('change.istockSettings').call({id:'significant_change',type:'checkbox',checked:false});
assert.equal(JSON.parse(data.get('ISTOCK')).is_significant_change,0);assert.equal(JSON.parse(data.get('ISTOCK')).b.exclude,1);
handlers.get('change').call({});assert.equal(JSON.parse(data.get('ISTOCK')).a.merge,1);
row.merge=false;row.exclude=true;handlers.get('change').call({});ctx.updatePrice();
const saved=JSON.parse(data.get('ISTOCK'));assert.equal(saved.a.merge,0);assert.equal(saved.a.exclude,1);assert.equal(saved.b.exclude,1);assert.equal(saved.significant_change_percent,'0.3');
console.log('PASS: empty view/price refresh preserves stored flags; user changes save immediately without erasing other transactions or settings');
