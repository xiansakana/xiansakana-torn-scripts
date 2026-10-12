# 1.6.24 快捷控件

2026-10-10：Tabbit 只读检查用户当前有焦点的物品页，没有点击、导航、刷新或发送游戏请求。

原生 DOM：`.actions.right > ul.actions-wrap > li.left > span.icon-h > button.option-equip / .option-unequip`。操作区宽度 138px，原生格宽度 34px。参考本地 NST items.js 在操作列表第一个格前插入独立格的做法，并扩展操作区和列表宽度 34px，避免把两个按钮放在同一个定位容器中。

拖动参考 TornTools 的快速物品实现：在拖动时重排显示节点，结束时保存顺序。使用独立手柄及 Pointer Events 支持鼠标和触摸；页面栏与工具箱共享保存顺序，拖动不转发装备点击。

参考源：https://github.com/Mephiles/torntools_extension/blob/master/src/common/features/quick-items/shared/quick-items-common.ts （读取时使用 GitHub 返回的默认分支）。

子弹入口只匹配装备栏当前显示的物品 ID。当前显示该武器时，一次点击转发原生 `[role="button"][aria-label^="Ammo type"]`，子弹类型在原生菜单手动选择；显示另一把武器时，一次点击只选择武器，再次点击才打开子弹菜单。不自行发子弹接口请求、不自动更换子弹、不自动查询或重试。没有可用原生入口时不显示。

请求边界：添加收藏、排序和本地保存零业务请求；子弹入口每次只转发一个当前原生控件；菜单选项由用户另一次人工点击。装备、Mod1、Mod2 保留独立点击方式。

本地 quick-controls.cjs 全网络拦截，验证固定列宽布局在 1000/390/320px 不重叠、子弹入口只转发一次、拖动排序持久保存并同步工具箱且没有误触装备。不代表真实账号操作验证或官方审批。
