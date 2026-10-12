# 1.6.12 原生 loadout 实测记录

2026-10-09，使用 Tabbit 稳定 CLI，固定用户正在运行的 Tabbit Browser 实例，连接原有登录的 item.php 页面。没有打开其他浏览器。

## 机制依据

页面实际加载的 n_items.js 中，EquipFunc 调用公开的 window.loadouts.actions.getEquippedItemsRequestAction()。loadouts app 将该 action 绑定到 Redux dispatch，其 saga 请求 /page.php?sid=itemsLoadouts&step=getEquippedItems，解析装备、弹药、特效与配装资料，更新原生 React。没有读取或修改 React 私有字段。

实际原生 Cobra Derringer 装备请求为 actionForm/equip，随后有一条 getEquippedItems 请求。详情显示 66.86 伤害、57.15 准确率、Piercing 弹药及 55% Assassinate。随后恢复原 MP5k 实例。

## 新模块实测方式与结果

临时在原页面加载与 1.6.12 安装包一致的 Quick Items 模块。使用独立内存设置，测试缓存来自刚才 Torn 原生装备栏响应；不写入用户收藏或持久缓存。旧控件暂时隔离，新模块通过真实原生按钮或真实装备接口操作，没有模拟原生 React 或服务器响应。

- 当前分类为 Secondary，没有 Primary 库存行。快捷点击 AK-47 走缓存路径，真实卸下；再次点击恢复同一实例。每次只记录一条装备 POST 和一条原生装备栏 GET，没有库存查询、重试、分类切换或整页读取。原生详情恢复 74.06 伤害、61.53 准确率、Tracer 30/30 (2) 弹药和 17% Expose。
- 快捷点击 MP5k 走真实原生按钮路径，卸下后再次点击恢复。每次由 Torn 请求一次装备栏，没有工具箱重复刷新。原生详情恢复 51.87 伤害、57.27 准确率、Standard 15/15 (2) 弹药和 16% Revitalize。
- 实测过程中 .ttb-loadout-slot、.ttb-loadout-review、.ttb-loadout-live 数量均为零。原生选中按钮、详情及特效仍有响应。工具箱保持关闭。
- 完成后将全部装备的物品 ID、实例 ID、槽位与基线比对，一致。没有使用消耗品或执行战斗。

截图已打开检查：

- [缓存卸下](1.6.12-cache-unequipped.png)：Primary 为 Torn 原生空槽。
- [缓存恢复](1.6.12-cache-restored.png)：AK-47 原生选中与属性、弹药、RW 图标。
- [原生恢复](1.6.12-native-restored.png)：MP5k 原生选中与属性、弹药、RW 图标。

截图上方可见临时隔离的旧控件；下方三张收藏卡片是新模块的测试入口。这些截图证明已登录页面中的真实装备更新，不表示持久安装完成。

## 自动验证与限制

node build.mjs、安装脚本与模块语法检查、items-integration.cjs、toolbox-ui.cjs 均通过。模拟测试中的公开更新入口为测试替身，只验证调用契约；真实 React 行为由以上登录页实测证明。

缓存操作期间现有 TornTools 扩展产生三个 TypeError，堆栈均位于 chrome-extension 的 extension.js，包括 json、includes 与 event.detail 解析。装备结果与原生详情正确更新，未修改扩展。完整安装包在脚本管理器中的持久安装、PDA 和真实 Temporary 操作尚未验证。

结束时清理测试入口、恢复用户原控件，释放 Tabbit 标签所有权并保留页面。用户仍需安装 1.6.12 文件以持久使用修复。
