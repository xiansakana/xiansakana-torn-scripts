# Torn City 监控系统部署总结

## 🎉 部署完成

两个监控系统已成功部署到 Fly.io 并推送到 GitHub。

## 📦 部署的服务

### 1. Company Monitor（公司申请监控）
- **URL**: https://torn-company-monitor.fly.dev/
- **功能**: 监控 Torn City 公司的求职申请
- **特性**:
  - 用户独立配置系统
  - 支持添加/删除监控的公司
  - 实时查看申请列表
  - 邮件通知功能
  - 持久化存储

### 2. OC Spawn Monitor（OC 刷新监控）
- **URL**: https://oc-spawn-monitor.fly.dev/
- **功能**: 监控 Torn City 的 Organized Crime 刷新
- **特性**:
  - 用户独立配置系统
  - 难度和 Scope 过滤
  - 实时查看 OC 列表
  - 邮件通知功能
  - 持久化存储

## 🔑 核心功能

### 用户独立配置
- 每个用户使用自己的 Torn API Key 登录
- 配置完全独立，互不影响
- 支持多用户同时使用

### Web 管理面板
- 现代化的 Web 界面
- 实时数据展示
- 在线配置管理
- 自动刷新（编辑时暂停）

### 持久化存储
- 使用 Fly.io 存储卷
- 配置数据永久保存
- 重启不丢失数据

### 安全性
- API Key 加密存储
- 密码形式显示
- 用户数据隔离

## 📊 技术架构

### 后端
- **运行环境**: Node.js 18
- **框架**: 原生 HTTP 服务器
- **存储**: 文件系统 + 持久化卷
- **部署平台**: Fly.io

### 前端
- **技术**: 原生 HTML/CSS/JavaScript
- **特性**: 响应式设计、实时更新
- **样式**: 渐变色主题、现代化 UI

### 基础设施
- **单实例运行**: 避免配置冲突
- **持久化卷**: 1GB 加密存储
- **健康检查**: 30 秒间隔
- **自动重启**: 故障自动恢复

## 🚀 使用指南

### 快速开始

1. **访问监控面板**
   - Company Monitor: https://torn-company-monitor.fly.dev/
   - OC Spawn Monitor: https://oc-spawn-monitor.fly.dev/

2. **登录**
   - 使用你的 Torn API Key 登录
   - 任何有效的 API Key 都可以

3. **配置**
   - Company Monitor: 添加要监控的公司
   - OC Spawn Monitor: 设置过滤条件
   - 配置邮件通知（可选）

4. **查看结果**
   - 实时查看监控数据
   - 接收邮件通知

### Company Monitor 特色功能

#### 添加公司
1. 点击"➕ 添加公司"
2. 输入公司名称
3. 输入公司的 API Key
4. 保存配置

#### 管理公司
- 修改公司信息
- 删除不需要的公司
- 查看所有公司的申请

### OC Spawn Monitor 特色功能

#### 过滤设置
- 最低难度：simple/intermediate/advanced
- 最低 Scope：1-10
- 只显示符合条件的 OC

## 📝 配置说明

### 环境变量（管理员配置）

#### Company Monitor
```env
# 邮件服务配置
EMAIL_SERVICE=qq
EMAIL_USER=your-email@qq.com
EMAIL_PASS=your-auth-code
EMAIL_FROM=your-email@qq.com

# 检查间隔（秒）
CHECK_INTERVAL=60
```

#### OC Spawn Monitor
```env
# 邮件服务配置
EMAIL_SERVICE=qq
EMAIL_USER=your-email@qq.com
EMAIL_PASS=your-auth-code
EMAIL_FROM=your-email@qq.com

# 检查间隔（秒）
CHECK_INTERVAL=60

# 默认过滤条件
FILTER_MIN_DIFFICULTY=simple
FILTER_MIN_SCOPE=1
```

### 用户配置（Web 界面）

每个用户可以配置：
- 检查间隔
- 邮件通知开关
- 收件邮箱
- 监控的公司（Company Monitor）
- 过滤条件（OC Spawn Monitor）

## 🔧 维护指南

### 查看日志
```bash
# Company Monitor
fly logs --app torn-company-monitor

# OC Spawn Monitor
fly logs --app oc-spawn-monitor
```

### 查看状态
```bash
# Company Monitor
fly status --app torn-company-monitor

# OC Spawn Monitor
fly status --app oc-spawn-monitor
```

### 重启服务
```bash
# Company Monitor
fly apps restart torn-company-monitor

# OC Spawn Monitor
fly apps restart oc-spawn-monitor
```

### 更新部署
```bash
# Company Monitor
cd company-monitor
fly deploy

# OC Spawn Monitor
cd oc-spawn-monitor
fly deploy
```

## 📦 存储卷管理

### 查看存储卷
```bash
# Company Monitor
fly volumes list --app torn-company-monitor

# OC Spawn Monitor
fly volumes list --app oc-spawn-monitor
```

### 存储卷信息
- **Company Monitor**: `company_monitor_data` (1GB)
- **OC Spawn Monitor**: `oc_monitor_data` (1GB)
- **挂载点**: `/data`
- **加密**: 是
- **快照**: 自动（保留 5 个）

## 🔐 安全特性

### API Key 保护
- SHA-256 哈希存储
- 文件名使用哈希值
- 前端密码形式显示

### 数据隔离
- 每个用户独立配置文件
- 配置文件加密存储
- 无法访问其他用户数据

### 网络安全
- HTTPS 强制启用
- CORS 配置
- 健康检查保护

## 📈 性能优化

### 资源配置
- **内存**: 256MB
- **CPU**: 1 核心
- **存储**: 1GB 持久化卷

### 优化措施
- 单实例运行
- 编辑时暂停刷新
- 高效的文件存储
- 最小化 API 调用

## 🐛 故障排查

### 常见问题

#### 1. 配置不保存
- 检查存储卷是否正常挂载
- 查看日志确认是否使用持久化存储

#### 2. 邮件发送失败
- 检查邮件服务配置
- 确认授权码正确
- 查看日志获取详细错误

#### 3. 登录失败
- 确认 API Key 有效
- 检查网络连接
- 查看浏览器控制台错误

#### 4. 数据不一致
- 确认只有一个实例运行
- 检查存储卷状态
- 重启服务

## 📚 相关文档

### Company Monitor
- [公司管理功能](company-monitor/COMPANY_SELECTION.md)
- [快速使用指南](company-monitor/QUICK_GUIDE.md)

### 通用文档
- [用户配置指南](USER_CONFIG_GUIDE.md)
- [Web 面板指南](WEB_DASHBOARD_GUIDE.md)
- [开放登录系统](OPEN_LOGIN_SYSTEM.md)
- [简单配置系统](SIMPLE_CONFIG_SYSTEM.md)

## 🎯 未来改进

### 计划功能
- [ ] 支持 Discord Webhook 通知
- [ ] 数据统计和分析
- [ ] 导出配置功能
- [ ] 批量操作支持
- [ ] 移动端优化
- [ ] 多语言支持

### 性能优化
- [ ] Redis 缓存
- [ ] 数据库存储
- [ ] 多实例负载均衡
- [ ] CDN 加速

## 📞 支持

### GitHub
- **仓库**: https://github.com/xiansakana/xiansakana-torn-scripts
- **Issues**: 报告问题和建议
- **Pull Requests**: 欢迎贡献代码

### 联系方式
- 通过 GitHub Issues 联系
- 查看代码获取更多信息

## 📄 许可证

本项目使用 MIT 许可证。

---

**最后更新**: 2026-01-17
**版本**: 2.0.0
**状态**: ✅ 生产环境运行中
