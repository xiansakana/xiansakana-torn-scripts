# 🚀 Render 快速部署（3分钟，完全免费）

## 为什么选择 Render？

- ✅ **完全免费** - 无需信用卡
- ✅ **不会休眠** - Background Worker 24/7 运行
- ✅ **自动部署** - Git push 自动更新

---

## 3 步完成部署

### 1️⃣ 创建 Render 账号

1. 访问 https://render.com
2. 点击 **"Sign up with GitHub"**
3. 授权 Render 访问你的 GitHub

### 2️⃣ 创建 Background Worker

1. 点击 **"New +"** → **"Background Worker"**
2. 选择仓库：`xiansakana-torn-scripts`
3. 配置：
   - **Name**: `oc-spawn-monitor`
   - **Root Directory**: `oc-spawn-monitor`
   - **Build Command**: `npm install`
   - **Start Command**: `node oc-monitor-daemon.js`
   - **Plan**: **Free**

### 3️⃣ 添加环境变量

在 **Environment** 标签添加：

```
TORN_API_KEY = DfxcuzzjBzvuh0t0
EMAIL_ENABLED = true
EMAIL_SERVICE = gmail
EMAIL_USER = saltedfishcj@gmail.com
EMAIL_PASS = rybc xcsw aipj etql
EMAIL_TO = chengjie726@163.com
EMAIL_FROM = saltedfishcj@gmail.com
```

点击 **"Save Changes"**

---

## ✅ 完成！

查看 **Logs** 标签，应该看到：

```
🚀 Torn OC Spawn 监控守护进程已启动
检查间隔：60 秒
邮件通知：✓ 启用
```

等待几分钟，当有新 OC spawn 时，你会收到邮件通知！

---

## 🔧 可选配置

### 只监控 advanced 难度

添加环境变量：
```
FILTER_MIN_DIFFICULTY = advanced
```

### 只监控 4 scope

添加环境变量：
```
FILTER_MIN_SCOPE = 4
```

### 只监控特定玩家

添加环境变量：
```
FILTER_PLAYERS = MiuPaS,CHaurora
```

---

## 💰 费用

**完全免费！** 无需信用卡，750 小时/月免费额度（足够 24/7 运行）

---

## 📖 详细文档

查看 [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) 了解完整部署指南
