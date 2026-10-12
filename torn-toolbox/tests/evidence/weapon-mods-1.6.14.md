# 1.6.14 手动 Mod 验证（2026-10-09）

在用户已有 Tabbit 登录物品页临时加载安装包对应 Quick Items 模块，使用隔离的内存设置，不持久写入收藏。原安装版本为 1.6.13，已关闭其自动恢复开关；最终仍需安装 1.6.14。

实测 Cobra Derringer 实例 9343397352：

1. 卸下前自动保存 Thermal Sight（4）与 Large Suppressor（11）。卸下仅记录一条装备 POST，没有 Mod 装配。
2. 再次装备仅一条装备 POST，没有 Mod 装配。快捷武器右侧立即出现可用的 Mod1、Mod2。
3. 单独点击 Mod1，仅一条 reattach 请求，upgradeID=4。按钮变为 Mod1 ✓，Torn 原生详情显示 Thermal Sight。
4. 单独点击 Mod2，仅一条 reattach 请求，upgradeID=11。按钮变为 Mod2 ✓，Torn 原生详情显示 Large Suppressor。

按钮安装结果由响应中 userUpgrades 的 attached 与 armouryID 核验；原生详情通过 Torn 公开 loadout action 更新。没有独立 Mod 面板或菜单步骤。装备期间读取配装及可用 Mod 数据；没有后台请求、串联库存查询或重试。

截图：manual-mods-1.6.14.png。截图已检查，按钮位于武器右侧，原生详情包含两项 Mod。

测试后逐项通过 Torn 原生按钮拆下测试 Mod，核对完整基线：Primary 484/20455265794 保留 Mod 8、35；Secondary 177/9343397352 空 Mod；Melee 395/8558017415、Temporary 465/21324961423、Clothing 606/8999086075、624/8278020155 均恢复。原生详情选回 AK74U，删除临时预览、恢复原收藏栏与快捷开关，工具箱关闭。未使用消耗品。

自动测试：mods-integration.cjs、items-integration.cjs、toolbox-ui.cjs 均通过；build.mjs 与 node --check 通过。真实验证覆盖原生按钮路径；缓存路径及占用、不兼容、实例隔离、失败不重试由模拟测试覆盖。完整持久安装和 PDA 尚未验证。已有 TornTools 扩展仍出现 TypeError，未修改该扩展。

规则参考：https://www.torn.com/rules.php 和 https://www.torn.com/forums.php?a=0&b=0&f=67&p=threads&t=16514459 。改动按一次点击对应一项游戏操作设计，不表示官方审批。
