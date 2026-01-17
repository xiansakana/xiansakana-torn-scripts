# 🚀 快速开始 - Railway 部署

## 3 分钟部署到 Railway

### 1️⃣ 推送到 GitHub

```bash
git add .
git commit -m "Add OC monitor"
git push
```

### 2️⃣ 在 Railway 部署

1. 访问 https://railway.app
2. 点击 **New Project** → **Deploy from GitHub repo**
3. 选择你的仓库
4. 设置 **Root Directory** 为 `oc-spawn-monitor`（如果脚本在子目录）

### 3️⃣ 配置环境变量

在 Railway 项目的 **Variables** 标签添加：

```
TORN_API_KEY=你的API密钥
EMAIL_ENABLED=true
EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASS=你的Gmail应用密码
EMAIL_TO=接收通知的邮箱
```

### 4️⃣ 获取 Gmail 应用密码

1. 访问 https://myaccount.google.com/apppasswords
2. 生成新密码（需要先开启两步验证）
3. 复制 16 位密码到 `EMAIL_PASS`

### 5️⃣ 完成！

查看 Railway 的 **Logs** 标签，应该看到：

```
🚀 Torn OC Spawn 监控守护进程已启动
检查间隔：60 秒
邮件通知：✓ 启用
```

---

## 📧 测试邮件

等待几分钟，当有新 OC spawn 时，你会收到邮件通知！

---

## 🔧 可选配置

### 只监控 advanced 难度

```
FILTER_MIN_DIFFICULTY=advanced
```

### 只监控 4 scope

```
FILTER_MIN_SCOPE=4
```

### 只监控特定玩家

```
FILTER_PLAYERS=MiuPaS,CHaurora
```

---

## 💰 费用

Railway 每月 $5 免费额度，这个脚本预计每月费用 **$0-1**

---

## 📖 详细文档

查看 [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) 了解完整部署指南
