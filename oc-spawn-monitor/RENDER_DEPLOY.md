# Render.com 部署指南（完全免费）

## 🎉 为什么选择 Render？

- ✅ **完全免费** - 免费套餐永久有效
- ✅ **无需信用卡** - 注册即可使用
- ✅ **自动部署** - Git push 自动更新
- ✅ **持续运行** - 24/7 运行（免费套餐会在 15 分钟无活动后休眠，但我们的脚本会持续运行）

---

## 📋 准备工作

1. **GitHub 账号** - 代码已推送 ✅
2. **Render 账号** - 访问 https://render.com 注册（可用 GitHub 登录）
3. **Torn API Key** - 已准备好 ✅
4. **Gmail 应用密码** - 已准备好 ✅

---

## 🚀 部署步骤

### 步骤 1：创建 Render 账号

1. 访问 https://render.com
2. 点击 **"Get Started"** 或 **"Sign Up"**
3. 选择 **"Sign up with GitHub"**（推荐）
4. 授权 Render 访问你的 GitHub

### 步骤 2：创建新服务

1. 登录后，点击 **"New +"** 按钮
2. 选择 **"Background Worker"**（后台服务）
3. 点击 **"Connect a repository"**
4. 找到并选择 `xiansakana-torn-scripts` 仓库
5. 点击 **"Connect"**

### 步骤 3：配置服务

#### 基本设置

| 字段 | 值 |
|------|-----|
| **Name** | `oc-spawn-monitor` |
| **Region** | `Oregon (US West)` 或任意 |
| **Branch** | `main` |
| **Root Directory** | `oc-spawn-monitor` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node oc-monitor-daemon.js` |

#### 选择套餐

- 选择 **"Free"** 套餐
- 点击 **"Create Background Worker"**

### 步骤 4：添加环境变量

#### 方法 1：手动添加（推荐）

在服务创建后，进入 **"Environment"** 标签：

点击 **"Add Environment Variable"**，逐个添加：

```
TORN_API_KEY = DfxcuzzjBzvuh0t0
EMAIL_ENABLED = true
EMAIL_SERVICE = gmail
EMAIL_USER = saltedfishcj@gmail.com
EMAIL_PASS = rybc xcsw aipj etql
EMAIL_TO = chengjie726@163.com
EMAIL_FROM = saltedfishcj@gmail.com
CHECK_INTERVAL = 60
FILTER_MIN_DIFFICULTY = simple
FILTER_MIN_SCOPE = 1
```

点击 **"Save Changes"**

#### 方法 2：使用 render.yaml（可选）

如果你在仓库中包含了 `render.yaml` 文件，Render 会自动读取配置。但注意：

- ⚠️ `render.yaml` 会被推送到 GitHub，不要包含真实信息
- ✅ 使用 `render.local.yaml`（已在 `.gitignore` 中）存储真实配置
- 📝 部署时手动上传或在 Render 界面配置环境变量

### 步骤 5：部署

1. Render 会自动开始部署
2. 查看 **"Logs"** 标签查看部署进度
3. 等待看到：
   ```
   🚀 Torn OC Spawn 监控守护进程已启动
   检查间隔：60 秒
   邮件通知：✓ 启用
   ```

---

## 📊 Render 免费套餐说明

### 免费套餐特点

| 特性 | 免费套餐 |
|------|---------|
| **价格** | $0/月 永久免费 |
| **运行时间** | 750 小时/月（足够 24/7 运行） |
| **内存** | 512 MB |
| **CPU** | 共享 |
| **休眠** | 15 分钟无活动后休眠 |
| **唤醒** | 收到请求时自动唤醒 |

### 关于休眠

**重要**：Background Worker 类型的服务**不会休眠**！

- ✅ Background Worker - 持续运行，不休眠
- ❌ Web Service - 15 分钟无活动后休眠

我们使用的是 Background Worker，所以会 24/7 持续运行！

---

## 🔧 环境变量详细说明

### 必需的环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `TORN_API_KEY` | Torn API Key | `DfxcuzzjBzvuh0t0` |
| `EMAIL_ENABLED` | 启用邮件通知 | `true` |
| `EMAIL_SERVICE` | 邮件服务商 | `gmail` |
| `EMAIL_USER` | 发件邮箱 | `your@gmail.com` |
| `EMAIL_PASS` | 邮箱密码/应用密码 | `abcd efgh ijkl mnop` |
| `EMAIL_TO` | 收件邮箱 | `notify@example.com` |

### 可选的环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `CHECK_INTERVAL` | 检查间隔（秒） | `60` |
| `EMAIL_FROM` | 发件人显示 | 同 EMAIL_USER |
| `FILTER_MIN_DIFFICULTY` | 最小难度 | `simple` |
| `FILTER_MIN_SCOPE` | 最小 Scope | `1` |
| `FILTER_PLAYERS` | 监控特定玩家 | 空（监控所有）|
| `WEBHOOK_ENABLED` | 启用 Webhook | `false` |
| `WEBHOOK_URL` | Webhook URL | 空 |

---

## 📧 Gmail 配置

### 获取应用专用密码

1. 访问 https://myaccount.google.com/security
2. 开启 **"两步验证"**
3. 访问 https://myaccount.google.com/apppasswords
4. 选择 **"应用"** → **"其他"**，输入 "Torn OC Monitor"
5. 点击 **"生成"**
6. 复制生成的 16 位密码
7. 在 Render 环境变量中设置 `EMAIL_PASS`

### 其他邮箱服务

支持的邮箱服务：
- `gmail` - Gmail
- `outlook` - Outlook/Hotmail
- `yahoo` - Yahoo Mail
- `qq` - QQ 邮箱
- `163` - 163 邮箱

---

## 📊 监控和调试

### 查看日志

1. 在 Render 控制台，进入你的服务
2. 点击 **"Logs"** 标签
3. 实时查看运行日志

### 正常运行的日志

```
🚀 Torn OC Spawn 监控守护进程已启动
============================================================
检查间隔：60 秒
邮件通知：✓ 启用
Webhook：✗ 禁用
过滤条件：难度 >= simple, Scope >= 1
============================================================

[2026/1/17 10:00:00] 第 1 次检查...
  ✓ 新 OC: Blast from the Past (advanced) - MiuPaS
🎯 发现 1 个新 OC！
✉️  邮件通知已发送到 your@example.com
```

### 重启服务

如果需要重启：
1. 点击右上角的 **"Manual Deploy"** 下拉菜单
2. 选择 **"Clear build cache & deploy"**

---

## 🔄 自动部署

### 更新代码

当你修改代码并推送到 GitHub：

```bash
git add .
git commit -m "Update OC monitor"
git push
```

Render 会自动检测到更改并重新部署！

### 禁用自动部署

如果不想自动部署：
1. 进入服务设置
2. 找到 **"Auto-Deploy"**
3. 设置为 **"No"**

---

## 🐛 故障排查

### 问题 1：部署失败

**检查：**
- 确认 Root Directory 设置为 `oc-spawn-monitor`
- 确认 Build Command 是 `npm install`
- 确认 Start Command 是 `node oc-monitor-daemon.js`
- 查看 Logs 中的错误信息

### 问题 2：邮件发送失败

**检查：**
- Gmail 是否开启两步验证
- 应用专用密码是否正确（16位，无空格）
- 环境变量 `EMAIL_USER` 和 `EMAIL_PASS` 是否正确
- 查看 Logs 中的具体错误信息

### 问题 3：没有收到通知

**检查：**
- 确认 `TORN_API_KEY` 正确且有 FULL 权限
- 查看 Logs 确认是否检测到新 OC
- 检查过滤器设置是否过于严格
- 检查垃圾邮件文件夹

### 问题 4：服务停止运行

**检查：**
- 查看 Logs 中的错误信息
- 确认免费套餐时长未用完（750小时/月）
- 尝试手动重启服务

---

## 💰 费用对比

| 平台 | 免费额度 | 需要信用卡 | 休眠 |
|------|---------|-----------|------|
| **Render** | 750小时/月 | ❌ 不需要 | ❌ Background Worker 不休眠 |
| Railway | $5/月 | ✅ 需要 | ❌ 不休眠 |
| Fly.io | 有限免费 | ✅ 需要 | ❌ 不休眠 |

**推荐 Render**：完全免费，无需信用卡，Background Worker 不休眠！

---

## 🔒 安全建议

1. **不要将环境变量提交到 Git**
   - 使用 Render 的环境变量功能
   
2. **定期更换密钥**
   - API Key
   - 邮箱密码

3. **限制 GitHub 仓库访问**
   - 可以设置为私有仓库
   - Render 支持私有仓库部署

---

## 📝 更新环境变量

如果需要修改配置：

1. 进入 Render 服务页面
2. 点击 **"Environment"** 标签
3. 修改环境变量
4. 点击 **"Save Changes"**
5. 服务会自动重启并应用新配置

---

## ✅ 部署检查清单

- [ ] Render 账号已创建
- [ ] GitHub 仓库已连接
- [ ] Background Worker 已创建
- [ ] Root Directory 设置为 `oc-spawn-monitor`
- [ ] 所有环境变量已配置
- [ ] Gmail 应用专用密码已生成
- [ ] 部署成功（查看 Logs）
- [ ] 日志显示正常运行
- [ ] 收到测试邮件通知

---

## 🎯 测试部署

部署成功后，你应该：

1. 在 Render Logs 中看到启动信息
2. 每分钟看到检查日志
3. 当有新 OC 时收到邮件通知

---

## 📞 获取帮助

- Render 文档: https://render.com/docs
- Render 社区: https://community.render.com
- 项目 Issues: 在 GitHub 仓库提交 Issue

---

## 🎉 完成

恭喜！你的 OC 监控系统现在会 24/7 运行在 Render 上，完全免费，随时通过邮件通知你新的 OC spawn！

**预计每月费用：$0** 🎊
