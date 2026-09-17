# Torn 工具箱 v1.3.3 工作日誌與接手說明

更新日期：2026-09-17  
接手對象：後續 Codex 任務  
目前最新版插件：`G:\我的雲端硬碟\@Codex\@Torn City插件\Torn 工具箱-v1.3.3.user.js`  
最新版說明檔：`G:\我的雲端硬碟\@Codex\@Torn City插件\Torn 工具箱說明-v1.3.3.txt`

## 1. 專案位置與交付規則

Torn City 插件專案的權威工作區與交付資料夾是：

`G:\我的雲端硬碟\@Codex\@Torn City插件`

目前 Codex shell 可能在：

`C:\Users\Username\Documents\@Torn City插件`

但 Torn City 插件的正式修改、版本輸出、說明檔保留都要以 G-drive 資料夾為準。除非使用者明確改規則，不要把本機 Documents 資料夾當最終交付位置。

既有 release 規則：

- 插件版本用 `v1.1`、`v1.2`、`v1.3.3` 這類方式往上加。
- 插件檔只保留最新版。
- 每版說明檔都保留。
- 說明檔必須包含兩部分：
  1. 目前插件功能與和上一版差異。
  2. 完整插件碼。

目前 `Torn 工具箱` 狀態符合這個規則：資料夾內只有最新版插件 `Torn 工具箱-v1.3.3.user.js`，並保留 `v1.2.7` 到 `v1.3.3` 的說明檔。

## 2. 最新版本概況

插件名稱：`Torn 工具箱`  
Tampermonkey metadata 版本：`1.3.3`  
作用頁面：`https://www.torn.com/*`  
主要外部服務：

- `https://api.torn.com`：Torn 官方 API，使用使用者輸入的 API Key。
- `https://weav3r.dev/api/marketplace/`：壓價助手查 Bazaar 最低價，用 `GM_xmlhttpRequest` 呼叫。

Tampermonkey grants：

- `GM_addStyle`
- `GM_getValue`
- `GM_setValue`
- `GM_notification`
- `GM_xmlhttpRequest`

目前語法檢查結果：

```powershell
node --check 'G:\我的雲端硬碟\@Codex\@Torn City插件\Torn 工具箱-v1.3.3.user.js'
```

已通過，無語法錯誤。

## 3. UI 結構

插件在 Torn City 頁面右側插入浮動工具箱：

- 右側齒輪浮動按鈕：開啟 / 收起面板。
- Header：
  - 標題：`Torn 工具箱`
  - 時間模式按鈕：`Torn` / `北京`
  - 語言切換按鈕：`繁` / `简`
  - 收起按鈕
- API Key 輸入框：`API Key (FULL)`
- Tabs：
  - 購買均價
  - 出售均價
  - 攻擊篩選
  - 壓價助手
  - 公司監聽

主要 DOM 是用 `root.innerHTML = ...` 建立。動態內容多數用 `innerHTML` 注入，後續如要做安全加固，應優先把玩家輸入內容或 API 回傳文字改成 `textContent` 或 escape 後再插入。

## 4. API Key 與本地保存

相關函式：

- `getApiKey()`
- `saveApiKey()`

行為：

- 從 `#ttb-api-key` 讀取 API Key。
- 使用功能時呼叫 `saveApiKey()`，會寫入 `GM_setValue('tornApiKey', key)`。
- 初始會先讀 `localStorage.getItem('APIKey')`，讀不到才讀 `GM_getValue('tornApiKey', '')`。
- 監聽功能啟動時，API Key 輸入框會被鎖定，避免運行中換 key。

注意：

- UI placeholder 寫 `API Key (FULL)`。實際所需權限要依 Torn API endpoints 判斷；目前插件功能涵蓋 log、basic、bazaar、itemmarket、company applications、attacks 等資料。
- 目前未看到插件把 API Key 傳給 Weav3r。Weav3r 呼叫只帶 item id。

## 5. 共同 API 與分頁抓取原理

相關函式：

- `fetchJsonWithRetry(url, onWait)`
- `fetchLogsPage(apiKey, logTypes, from, to, onWait)`
- `fetchAllLogs(apiKey, logTypes, from, to, onProgress)`
- `gmFetchJson(url, errorPrefix)`
- `isRateLimitError(data)`
- `apiErrorMessage(data)`

原理：

- Torn 普通 API 呼叫多用 `fetch()`。
- Weav3r Marketplace 用 `GM_xmlhttpRequest()`，因為 metadata 有 `@connect weav3r.dev`。
- `fetchJsonWithRetry()` 會處理 Torn rate limit：
  - 如果 error code 是 `5` 或錯誤文字包含 `too many`，就等待 `5000 * attempt` ms。
  - 最多重試 `RATE_LIMIT_RETRIES = 5` 次。
- Log 查詢使用舊版 Torn log endpoint：
  - `https://api.torn.com/user/?selections=log&key=...&log=...&from=...&to=...`
- `fetchAllLogs()` 用 timestamp 反向分頁：
  - 每頁抓 logs。
  - 若結果數量達 100，取本頁最小 timestamp，下一輪 `to = minTs - 1`。
  - 最多 1000 頁，避免無限迴圈。

## 6. 時間模式：Torn / 北京

相關常數與函式：

- `TTB_TIME_MODE_KEY = 'ttbTimeMode'`
- `TTB_TIME_MODES`
- `parseTtbDateTime(s, mode)`
- `toTimestamp(s)`
- `formatTime(ts, mode)`
- `timeHtml(ts, mode)`
- `refreshRenderedTimes(rootEl)`
- `setTtbTimeMode(mode)`

模式：

- `torn`：offset `0`，等同 UTC / Torn time。
- `beijing`：offset `8`，北京時間 UTC+8。

重要原理：

- 時間切換不只是改顯示，也會影響查詢輸入的解讀。
- 同一段輸入數字，在 `Torn` 與 `北京` 模式下會轉成不同 timestamp。
- 例：輸入 `2026-09-10T12:00`
  - Torn 模式：實際查 `2026-09-10 12:00 UTC`
  - 北京模式：實際查 `2026-09-10 04:00 UTC`

作用範圍：

- 購買均價：開始/結束日期與時間。
- 出售均價：開始/結束日期與時間。
- 攻擊篩選：`datetime-local` 開始/結束。
- 結果顯示：已經渲染的 `data-ttb-time` 會在切換模式後即時刷新。
- 壓價/公司監聽的下次掃描/檢查時間也用 `timeHtml()` 顯示。

## 7. 語言切換：簡體 / 繁體

相關常數與函式：

- `TTB_LANG_KEY = 'ttbLang'`
- `TTB_HANT_PHRASES`
- `ttbToHant(text)`
- `ttbText(text, lang)`
- `applyTtbLanguage(target)`
- `setTtbLanguage(lang)`
- `startTtbLanguageObserver(rootEl)`

原理：

- 插件不引入大型繁簡轉換庫，只用內建片語表做 UI 文字替換。
- 每個文字節點第一次轉換時會把原始簡體文字存到 `__ttbSourceText`。
- 切回簡體時用原始文字還原，不從繁體反轉，避免反覆轉換造成文字漂移。
- `MutationObserver` 監看插件 root，動態生成的查詢訊息、錯誤訊息、結果明細也會套用目前語言。

注意：

- 這是 UI 字串層級的輕量轉換，不應拿來轉換 Torn API 回傳的玩家名、物品名、派系名或使用者訊息。

## 8. 購買均價功能

UI：

- 物品選擇：用 Torn items API 載入所有物品。
- 購買來源 checkbox：
  - Bazaar（1225）
  - Item Market（1112）
  - Trade（4440 / 4446）
- 開始日期 / 時間
- 結束日期 / 時間
- 查詢按鈕：`查询购买记录（含 Mug 抵扣）`

相關函式：

- `getBuyLogIds()`
- `isBuyTradeChecked()`
- `processPurchaseLogs(logs, targetId)`
- `processTradeLogs(logs, targetId, skipped)`
- `processMugLogs(logs)`
- `applyMugOffsets(purchases, mugs)`
- `renderBuyResults(purchases, name)`

資料來源：

- Bazaar / Item Market 購買：
  - `1112`：Item Market purchase
  - `1225`：Bazaar purchase
- Trade 購買：
  - `4440`：Trade money paid
  - `4446`：Trade items received
- Mug 抵扣：
  - `8155`：Mug logs

計算流程：

1. 依 checkbox 取得要查的購買 log id。
2. 若勾 Trade，另抓 `4430,4440,4446`，但購買 Trade 實際使用 `4440 / 4446`。
3. `processPurchaseLogs()` 把 Bazaar / Item Market log 轉成統一 purchase row：
   - `type`
   - `typeName`
   - `timestamp`
   - `qty`
   - `costEach`
   - `costTotal`
   - `sellerId`
4. `processTradeLogs()` 用 `parsed_trade_id` 合併 Trade：
   - `4440` 讀 money。
   - `4446` 讀 items。
   - 只計算單一商品 Trade。
   - 如果同一 Trade 內含多種商品，呼叫 `registerMixedTradeSkip()`，不納入均價。
5. `processMugLogs()` 讀 mug 金額與目標 ID。
6. `applyMugOffsets()` 把購買後 5 分鐘內、同一賣家的 mug 金額分攤到 purchase：
   - `MUG_WINDOW_SECONDS = 5 * 60`
   - 同一賣家多筆購買時，按時間從舊到新分攤。
7. `renderBuyResults()` 顯示：
   - 數量
   - 原始花費
   - Mug 抵扣
   - 實際成本
   - 實際均價
   - Mug 紀錄 / 匹配
   - Bazaar / Item Market / Trade 件數
   - 混合 Trade 已排除筆數與件數

重要規則：

- 混合 Trade 不估算，不納入均價，只提示。
- 若只找到混合 Trade，會提示無法準確分攤，所以未計入購買均價。

## 9. 出售均價功能

UI：

- 物品選擇
- 出售來源 checkbox：
  - Bazaar（1221 / 1226）
  - Item Market（1113 / 1104）
  - Trade（4431 / 4445）
- 開始日期 / 時間
- 結束日期 / 時間
- 查詢按鈕：`查询出售记录`

相關函式：

- `getSellLogIds()`
- `calcSellAmounts(log, item, cat)`
- `sellLogName(id)`
- `sellCategory(id)`
- `readTradeMoney(data)`
- `processSellTradeLogs(logs, targetId, skipped)`

資料來源：

- Bazaar sell：
  - `1221`
  - `1226`
- Item Market sell：
  - `1113`
  - `1104`
- Trade sell：
  - `4431`：Trade money received
  - `4445`：Trade items outgoing

v1.3.3 的關鍵修正：

- 出售 Trade 金額來源已從舊的 `4430 / 4445` 修正為 `4431 / 4445`。
- `readTradeMoney()` 不只讀 `data.money`，也會嘗試：
  - `amount`
  - `cash`
  - `value`
  - `cost`
  - `price`
  - `total`
  - `cost_total`
  - `total_cost`
- 如果找不到金額欄位，會保持 `null`，不會因 `toNumber(undefined)` 變成 `$0`。

出售稅費規則：

- Item Market：使用 log 的 `fee` / `cost_total` 計算稅後收入。
- Bazaar：不扣 5%，收入用 `cost_each * qty`。
- Trade：不扣 5%，收入用 Trade money。
- 統計中的 `Market 税费` 只累計 Item Market fee。

混合 Trade 規則：

- 與購買一致。
- 單一商品 Trade 納入均價。
- 同一 Trade 內含多種商品時排除，額外提示筆數與件數。

## 10. 攻擊篩選功能

UI：

- 方向：
  - `outgoing`
  - `incoming`
- Defender Faction ID
- Warlord Bonus
- 攻擊結果
- 開始 / 結束 `datetime-local`
- 編號分母
- 起始分子
- 查詢按鈕
- 簡單連結清單 textarea
- 複製全部按鈕
- 詳細結果列表

相關函式：

- `fetchAllAttacks(apiKey, filters, from, to, onProgress)`
- `renderAttackItem(a)`
- `buildAttackCopyList(attacks, denominator, startNumber)`

資料來源：

- `https://api.torn.com/v2/user/attacks`

查詢邏輯：

- 每頁 `limit=100`
- `sort=DESC`
- 如果一頁滿 100，下一頁把 `to` 改為最後一筆 attack 的 `started - 1`。
- 最後用 attack id 去重。

篩選條件：

- Defender Faction ID：比對 `a.defender?.faction?.id`
- Warlord Bonus：比對 `a.modifiers?.warlord`
- Result：比對 `a.result`
- 時間：用 `a.ended` 落在使用者選的時間範圍內

輸出：

- 詳細結果卡片保留完整攻擊資料。
- 簡單連結清單格式：

```text
1/100 https://www.torn.com/page.php?sid=attackLog&ID=<attack.code>
2/100 https://www.torn.com/page.php?sid=attackLog&ID=<attack.code>
```

注意：

- 簡單連結使用 `attack.code`，不是 attack id。
- 編號分母與起始分子只影響簡單連結清單，不影響詳細卡片。

## 11. 壓價助手

UI：

- 指定物品，多選；可留空表示監聽全部在售貨物。
- 監聽範圍：
  - Bazaar 貨物
  - Item Market 掛單
- 掃描間隔：30 到 600 秒。
- 開始 / 停止。
- 狀態區：下次掃描、已掃描次數、壓價提醒數。

相關函式：

- `fetchUserBazaar(apiKey)`
- `fetchUserItemMarket(apiKey)`
- `fetchMyPlayerId(apiKey)`
- `fetchWeav3rBazaarLowest(itemId, myPlayerId, cache)`
- `fetchMarketLowestPrice(apiKey, itemId, cache)`
- `ucCheck()`
- `renderUndercutAlert(alert)`
- `stopUndercutMonitor()`

原理：

- Bazaar：
  - 先抓自己的 Bazaar。
  - 用 Weav3r marketplace API 查同 item 的 Bazaar listing。
  - 排除自己的 player id。
  - 找最低價，比自己的價格低就提示。
- Item Market：
  - 抓自己的 Item Market 掛單。
  - 用 Torn v2 market itemmarket 查最低價。
  - 低於自己的價格就提示。

狀態管理：

- `undercutState.activeKeys` 記錄目前被壓價的項目，避免同一項目每次掃描都重複算新提醒。
- 新提醒使用 `GM_notification()`。
- API Key 在監聽期間鎖定。

注意：

- 如果使用者掛單很多，掃描會逐品項等待 `API_DELAY_MS`，避免過快打 API。
- 目前 `setInterval(async function(){ await ucCheck(); ... })` 在極慢網路或大量品項時仍有理論上的重疊執行風險；如要加固，可加 `isChecking` 鎖。

## 12. 公司監聽

UI：

- 檢查間隔：10 到 300 秒。
- 開始 / 停止。
- 狀態區：下次檢查、已檢查次數、申請數。

相關函式：

- `coCheck()`
- `renderCoApp(app, id)`
- `stopCompanyMonitor()`

資料來源：

- `https://api.torn.com/company/?selections=applications&key=...`

原理：

- 每次查 company applications。
- 用 `companyState.seen` 記住看過的 application id。
- 新 id 會插入清單頂部並觸發 `GM_notification()`。

## 13. 版本演進摘要

近期 Torn 工具箱版本：

- `v1.2.7`
  - 購買 Trade 改為單一商品才納入均價。
  - 混合 Trade 不再估算，改為排除提示。
  - 出售均價新增 Trade 來源。
- `v1.2.8`
  - **新增簡體 / 繁體切換與偏好保存。**
- `v1.2.9`
  - **新增 Torn / 北京時間切換。**
  - 購買均價新增 Bazaar / Item Market / Trade 來源勾選。
- `v1.3.0`
  - **攻擊篩選新增編號分母與起始分子。**
- `v1.3.1`
  - **攻擊詳細結果恢復原樣。**
  - **新增簡單連結清單與複製全部。**
- `v1.3.2`
  - 修正出售稅費規則。
  - 只有 Item Market 扣 Market fee；Bazaar / Trade 不扣 5%。
- `v1.3.3`
  - 修正出售 Trade 金額抓不到導致 $0。
  - 出售 Trade 改用 `4431 / 4445`。
  - 新增 `readTradeMoney()` 支援多種可能金額欄位。

## 14. 本地測試與目前結果

本地測試檔位於：

`C:\Users\Username\Documents\@Torn City插件`

目前可用測試：

```powershell
$env:PLUGIN_FILE='G:\我的雲端硬碟\@Codex\@Torn City插件\Torn 工具箱-v1.3.3.user.js'; node 'C:\Users\Username\Documents\@Torn City插件\torn-toolbox-i18n.test.js'
$env:PLUGIN_FILE='G:\我的雲端硬碟\@Codex\@Torn City插件\Torn 工具箱-v1.3.3.user.js'; node 'C:\Users\Username\Documents\@Torn City插件\torn-toolbox-timezone.test.js'
$env:PLUGIN_FILE='G:\我的雲端硬碟\@Codex\@Torn City插件\Torn 工具箱-v1.3.3.user.js'; node 'C:\Users\Username\Documents\@Torn City插件\torn-toolbox-buy-sources.test.js'
```

這三個在 `v1.3.3` 已確認通過：

- `i18n tests passed`
- `timezone tests passed`
- `buy source tests passed`

另有：

```powershell
$env:PLUGIN_FILE='G:\我的雲端硬碟\@Codex\@Torn City插件\Torn 工具箱-v1.3.3.user.js'; node 'C:\Users\Username\Documents\@Torn City插件\torn-toolbox-trade.test.js'
```

目前會失敗。失敗原因不是已確認的插件語法錯誤，而是測試仍使用舊出售 Trade log `4430` 當 money received。`v1.3.3` 已改為 `4431 / 4445`，所以接手者如果要繼續使用此測試，應先更新測試資料，把出售 Trade money log 從 `4430` 改成 `4431`，並補測 `readTradeMoney()` 多欄位金額解析。

語法檢查：

```powershell
node --check 'G:\我的雲端硬碟\@Codex\@Torn City插件\Torn 工具箱-v1.3.3.user.js'
```

已確認通過。

## 15. 接手時優先注意事項

1. 最新插件是 `v1.3.3`，不是 `v1.2.9`。資料夾內較早說明檔只是歷史保留。
2. 正式修改時，先從 `G:\我的雲端硬碟\@Codex\@Torn City插件\Torn 工具箱-v1.3.3.user.js` 複製或直接修改，再升版。
3. 發版時只保留最新版 `Torn 工具箱-vX.Y.Z.user.js`，但不要刪舊版說明檔。
4. 每次新版本說明檔都要包含完整插件碼。
5. 出售 Trade 的正確 log 是 `4431 / 4445`，不要退回 `4430 / 4445`。
6. 購買 Trade 仍使用 `4440 / 4446`，查詢時目前仍抓 `4430,4440,4446`，但解析只用 `4440 / 4446`。
7. 混合 Trade 一律排除，不估算。
8. 時間模式會影響查詢 timestamp，不只是顯示。
9. 繁簡切換只適合 UI 文字，不建議自動轉換 API 回傳的玩家名、物品名、派系名或訊息。
10. 若要強化安全性，優先處理 `innerHTML` 注入 API 回傳文字的點。

## 16. 建議下一步改善

- 更新 `torn-toolbox-trade.test.js`，讓出售 Trade 測試符合 `v1.3.3` 的 `4431 / 4445` 規則。
- 為 `readTradeMoney()` 增加專門測試：
  - `money`
  - `amount`
  - `cash`
  - `value`
  - `cost`
  - `price`
  - `total`
  - `cost_total`
  - `total_cost`
  - 缺失欄位應回傳 `null`
- 為出售稅費規則補測：
  - Bazaar fee 必為 0。
  - Trade fee 必為 0。
  - Item Market 才使用 fee / cost_total。
- 壓價與公司監聽可加 async lock，避免 `setInterval` 在慢查詢時重疊執行。
- 逐步把渲染 API 回傳文字的 `innerHTML` 改為 DOM node + `textContent`，降低 XSS 風險。

