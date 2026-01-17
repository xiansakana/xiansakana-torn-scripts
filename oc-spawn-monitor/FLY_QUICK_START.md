# 🚀 Fly.io 快速部署（5分钟，完全免费）

## 为什么选择 Fly.io？

- ✅ **完全免费** - 3个免费 VM，256MB RAM
- ✅ **不会休眠** - 24/7 持续运行
- ✅ **简单部署** - 一条命令完成

---

## 5 步完成部署

### 1️⃣ 安装 flyctl

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**macOS/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

重启终端后验证：
```bash
flyctl version
```

### 2️⃣ 登录 Fly.io

```bash
flyctl auth login
```

用 GitHub 账号登录即可

### 3️⃣ 创建应用

```bash
cd oc-spawn-monitor
flyctl launch
```

回答问题：
- App Name: 按回车（使用默认）
- Region: 选择 `sjc` 或离你最近的
- Database: 都选 **No**
- Deploy now: 选 **No**

### 4️⃣ 配置环境变量

```bash
flyctl secrets set TORN_API_KEY=DfxcuzzjBzvuh0t0
flyctl secrets set EMAIL_ENABLED=true
flyctl secrets set EMAIL_SERVICE=gmail
flyctl secrets set EMAIL_USER=saltedfishcj@gmail.com
flyctl secrets set EMAIL_PASS="rybc xcsw aipj etql"
flyctl secrets set EMAIL_TO=chengjie726@163.com
flyctl secrets set EMAIL_FROM=saltedfishcj@gmail.com
```

### 5️⃣ 部署

```bash
flyctl deploy
```

---

## ✅ 完成！

查看日志：
```bash
flyctl logs
```

应该看到：
```
🚀 Torn OC Spawn 监控守护进程已启动
检查间隔：60 秒
邮件通知：✓ 启用
```

等待几分钟，当有新 OC spawn 时，你会收到邮件通知！

---

## 🔧 常用命令

```bash
# 查看日志
flyctl logs

# 查看状态
flyctl status

# 重启应用
flyctl apps restart

# 更新环境变量
flyctl secrets set KEY=VALUE
```

---

## 💰 费用

**完全免费！** 免费额度包括：
- 3 个 VM (256MB RAM)
- 160GB 流量/月
- 足够 24/7 运行

---

## 📖 详细文档

查看 [FLY_DEPLOY.md](./FLY_DEPLOY.md) 了解完整部署指南和故障排查
