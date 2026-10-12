# 切针助手、NST 与工具箱 1.6.16 源码对照

2026-10-09，仅本地静态检查。对象：用户提供的桌面切针助手 5.5.3、PDA 版（内部版本 5.5.399）、本地 NST 0.0.2 与工具箱 1.6.16。没有运行真实账号操作，未修改参考源码。

## 切针助手的“自动读取配装”

两份助手的 scanEq（桌面 116 行、PDA 119 行）扫描当前页面的 Temporary 物品行，检查 data-equipped；refreshCache（174／177 行）将扫描结果写入本地装备状态。还会读取 GM 保存的状态和其他标签页广播。

本次未在这两份源码发现 fetch、XHR、GM_xmlhttpRequest 或 getEquippedItems/itemsLoadouts 等配装请求。所谓自动检测装备状态是读取已有 DOM／本地状态，不是工具箱自动保存前的额外 HTTP 查询。setInterval 和 MutationObserver 存在，但需根据回调实际行为判断，不能仅凭定时器认定为自动请求。

桌面版 handleEquip 在用户点击或快捷键触发后寻找原生按钮，461 行调用一次 equipBtn.click()，waitMsg 轮询页面消息；成功时 setEq 更新本地状态。原生游戏处理程序可能自行请求最新配装，这不等于助手额外手动调用配装接口。

PDA 版不同：518 行先触发 Equip，随后轮询 Yes／Confirm，556 行自动触发确认按钮。还通过 React 私有属性寻找回调并构造事件。这是条件性的一次输入触发两次按钮操作风险，不能把 PDA 版无条件当作合规范例。

两份助手的跨标签广播和部分 DOM 定时回调没有统一焦点检查；本次仅对比实现，不出具其完整合规结论。

## NST 0.0.2 的相同与不同

items.js 721—731 行：用户点击 Quick Items 装备时直接 POST /item.php，携带 step=actionForm、action=equip、type=5、实例 id 和 confirm=1。工具箱缓存路径沿用了这一请求形式。confirm=1 不足以单独证明多个游戏动作。

items.js 758—766 行：消耗品直接 POST useItem，与工具箱一致。物品实例 strangeID 从已有物品行中取得并保存。

在本地 NST 目录中未找到 getEquippedItems、itemsLoadouts、getUserUpgrades、reattach 或 detach 调用。因此没有证据表明 NST Quick Items 实现了工具箱现在这套“操作前读配装、操作后查 Mod、再主动刷新配装”流程。

injectFetch.js 包装原 fetch，并对已有响应 clone/解析后派发 nstFetch；这是观察已经发生的请求，不是再 fetch 一次。injectXHR.js 的可选 equipNoConfirm 则会改写现有 equip 请求的 confirm 参数，属于另一项需要独立确认的功能。

此结论只针对提供的 NST 0.0.2 副本，不代表其他 NST 版本或 TornTools 当前版本。

## 工具箱新增的风险点

- 主副武器操作前的 loadEquippedMods：额外请求配装以记住 Mod。
- 装备后的 updateModAvailability：额外请求 Mod 可用列表。
- 缓存装备及 Mod 装卸后的 refreshNativeLoadout：主动调用公开页面函数引出额外配装 GET，异常分支同样调用。
- 页面失焦后的后续请求、失效 API Key 不停监听：不是因为参考脚本采用同一 POST 形式就可以忽略。

应参考桌面切针助手的“读取当前 DOM／合规已有响应、自动保存本地状态、手动触发一个原生操作”结构，不能混用 PDA 自动确认逻辑。这个建议不等于对所有页面响应监听或后台 DOM 广播的全面许可。

官方依据：[Torn Rules](https://www.torn.com/rules.php)、[Velthir 2025-11-05 关于一次输入一次操作的说明](https://www.torn.com/forums.php?a=0&b=0&f=67&p=threads&t=16514459)。自动读取已经可见页面的数据与自主发起非 API 请求必须区分，参考脚本的存在也不构成官方审批。
