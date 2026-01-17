# Railway.app 部署指南

## 📋 准备工作

1. **GitHub 账号** - 用于托管代码
2. **Railway 账号** - 访问 https://railway.app 注册（可用 GitHub 登录）
3. **Torn API Key** - 从 Torn 网站获取（需要 FULL 权限）
4. **邮箱配置** - Gmail 应用专用密码或其他邮箱服务

---

## 🚀 部署步骤

### 步骤 1：推送代码到 GitHub

```bash
# 1. 初始化 Git 仓库（如果还没有）
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Add OC spawn monitor"

# 4. 创建 GitHub 仓库并推送
# 在 GitHub 上创建新仓库，然后：
git remote add origin https://github.com/你的用户名/torn-scripts.git
git branch -M main
git push -u origin main
```

### 步骤 2：在 Railway 创建项目

1. 访问 https://railway.app
2. 点击 **"New Project"**
3. 选择 **"Deploy from GitHub repo"**
4. 授权 Railway 访问你的 GitHub
5. 选择你的仓库（torn-scripts）
6. Railway 会自动检测到 Node.js 项目

### 步骤 3：配置环境变量

在 Railway 项目页面：

1. 点击项目
2. 进入 **"Variables"** 标签
3. 添加以下环境变量：

#### 必需的环境变量

```
TORN_API_KEY=你的API密钥
EMAIL_ENABLED=true
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=你的应用专用密码
EMAIL_TO=接收通知的邮箱
```

#### 可选的环境变量

```
CHECK_INTERVAL=60
EMAIL_FROM=your-email@gmail.com
FILTER_MIN_DIFFICULTY=simple
FILTER_MIN_SCOPE=1
FILTER_PLAYERS=MiuPaS,CHaurora
WEBHOOK_ENABLED=false
WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### 步骤 4：配置根目录

如果你的脚本在子目录 `oc-spawn-monitor` 中：

1. 在 Railway 项目设置中
2. 找到 **"Settings"** → **"Root Directory"**
3. 设置为 `oc-spawn-monitor`

### 步骤 5：部署

1. Railway 会自动开始部署
2. 查看 **"Deployments"** 标签查看部署状态
3. 查看 **"Logs"** 标签查看运行日志

---

## 📧 Gmail 配置详细步骤

### 方法 1：使用应用专用密码（推荐）

1. 访问 https://myaccount.google.com/security
2. 开启 **"两步验证"**
3. 访问 https://myaccount.google.com/apppasswords
4. 选择 **"应用"** → **"其他"**，输入 "Torn OC Monitor"
5. 点击 **"生成"**
6. 复制生成的 16 位密码
7. 在 Railway 环境变量中设置：
   ```
   EMAIL_PASS=生成的16位密码（不含空格）
   ```

### 方法 2：使用 OAuth2（更安全但配置复杂）

参考 nodemailer OAuth2 文档

---

## 🔧 环境变量说明

### 基础配置

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `TORN_API_KEY` | ✓ | Torn API Key | `DfxcuzzjBzvuh0t0` |
| `CHECK_INTERVAL` | ✗ | 检查间隔（秒） | `60` |

### 邮件配置

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `EMAIL_ENABLED` | ✓ | 启用邮件通知 | `true` |
| `EMAIL_SERVICE` | ✓ | 邮件服务商 | `gmail`, `qq`, `outlook` |
| `EMAIL_USER` | ✓ | 发件邮箱 | `your@gmail.com` |
| `EMAIL_PASS` | ✓ | 邮箱密码/应用密码 | `abcd efgh ijkl mnop` |
| `EMAIL_TO` | ✓ | 收件邮箱 | `notify@example.com` |
| `EMAIL_FROM` | ✗ | 发件人显示 | 默认同 EMAIL_USER |

### Webhook 配置

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `WEBHOOK_ENABLED` | ✗ | 启用 Webhook | `true` |
| `WEBHOOK_URL` | ✗ | Webhook URL | Discord/Slack URL |

### 过滤器配置

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `FILTER_MIN_DIFFICULTY` | ✗ | 最小难度 | `simple`, `intermediate`, `advanced` |
| `FILTER_MIN_SCOPE` | ✗ | 最小 Scope | `1`, `2`, `3`, `4` |
| `FILTER_PLAYERS` | ✗ | 监控特定玩家 | `MiuPaS,CHaurora` （逗号分隔）|

---

## 📊 监控和调试

### 查看日志

在 Railway 项目页面：
1. 点击 **"Logs"** 标签
2. 实时查看运行日志
3. 检查是否有错误信息

### 常见日志输出

```
🚀 Torn OC Spawn 监控守护进程已启动
检查间隔：60 秒
邮件通知：✓ 启用
Webhook：✗ 禁用

[2026/1/17 10:00:00] 第 1 次检查...
  ✓ 新 OC: Blast from the Past (advanced) - MiuPaS
🎯 发现 1 个新 OC！
✉️  邮件通知已发送到 your@example.com
```

### 重启服务

如果需要重启：
1. 在 Railway 项目页面
2. 点击 **"Settings"**
3. 点击 **"Restart"**

---

## 💰 费用说明

### Railway 免费额度

- **每月 $5 免费额度**
- **500 小时免费运行时间**
- 对于这个轻量级监控脚本，免费额度完全够用

### 预估使用

- CPU: 极低（每分钟只运行几秒）
- 内存: ~50MB
- 网络: 极少（每分钟一次 API 请求）
- **预计每月费用: $0-1**

---

## 🔒 安全建议

1. **不要将敏感信息提交到 Git**
   - `config.json` 已在 `.gitignore` 中
   - 使用环境变量存储密钥

2. **定期更换密钥**
   - API Key
   - 邮箱密码

3. **限制 GitHub 仓库访问**
   - 可以设置为私有仓库
   - Railway 支持私有仓库部署

---

## 🐛 故障排查

### 问题 1：部署失败

**检查：**
- 确认 `package.json` 存在
- 确认 Root Directory 设置正确
- 查看部署日志中的错误信息

### 问题 2：邮件发送失败

**检查：**
- Gmail 是否开启两步验证
- 应用专用密码是否正确（16位，无空格）
- EMAIL_USER 和 EMAIL_PASS 是否正确设置
- 查看日志中的具体错误信息

### 问题 3：没有收到通知

**检查：**
- 确认 TORN_API_KEY 正确
- 确认 API Key 有 FULL 权限
- 查看日志确认是否检测到新 OC
- 检查过滤器设置是否过于严格
- 检查垃圾邮件文件夹

### 问题 4：服务停止运行

**检查：**
- Railway 免费额度是否用完
- 查看 Logs 中的错误信息
- 尝试重启服务

---

## 📝 更新部署

当你修改代码后：

```bash
# 1. 提交更改
git add .
git commit -m "Update OC monitor"

# 2. 推送到 GitHub
git push

# 3. Railway 会自动重新部署
```

---

## 🎯 测试部署

部署成功后，你应该：

1. 在 Railway Logs 中看到启动信息
2. 每分钟看到检查日志
3. 当有新 OC 时收到邮件通知

---

## 📞 获取帮助

- Railway 文档: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- 项目 Issues: 在 GitHub 仓库提交 Issue

---

## ✅ 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] Railway 项目已创建
- [ ] Root Directory 已设置（如果需要）
- [ ] 所有必需的环境变量已配置
- [ ] Gmail 应用专用密码已生成
- [ ] 部署成功（查看 Deployments）
- [ ] 日志显示正常运行（查看 Logs）
- [ ] 收到测试邮件通知

完成以上步骤后，你的 OC 监控系统就会 24/7 运行，随时通过邮件通知你新的 OC spawn！
