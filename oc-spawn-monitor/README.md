# Torn OC Spawn 监控系统

提供两种监控方式：
1. **浏览器油猴脚本** - 需要保持浏览器打开
2. **独立守护进程** - 可在服务器或本地持续运行，支持邮件和 Webhook 通知

---

## 方案一：浏览器油猴脚本

### 安装
1. 安装 Tampermonkey 浏览器扩展
2. 安装 `oc-spawn-monitor_1.0.0.user.js`
3. 访问 torn.com，点击右侧紫色 "OC" 按钮

### 特点
- ✓ 桌面通知
- ✓ 实时显示
- ✗ 需要保持浏览器打开
- ✗ 只有桌面通知

---

## 方案二：独立守护进程（推荐）

### 快速部署到 Railway（推荐）⭐

**3 分钟完成部署，24/7 运行，邮件通知！**

1. 推送代码到 GitHub
2. 在 Railway.app 创建项目并连接仓库
3. 配置环境变量（API Key、邮箱等）
4. 完成！

👉 **详细步骤：[QUICK_START.md](./QUICK_START.md)**
👉 **完整指南：[RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md)**

### 本地运行

#### 1. 安装 Node.js
确保已安装 Node.js (v14 或更高版本)
```bash
node --version
```

#### 2. 安装依赖
```bash
cd oc-spawn-monitor
npm install
```

#### 3. 配置

首次运行会自动创建 `config.json`：
```bash
node oc-monitor-daemon.js
```

编辑 `config.json`：

```json
{
  "tornApiKey": "你的API_KEY",
  "checkInterval": 60,
  "email": {
    "enabled": true,
    "service": "gmail",
    "auth": {
      "user": "your-email@gmail.com",
      "pass": "your-app-password"
    },
    "to": "recipient@example.com",
    "from": "your-email@gmail.com"
  },
  "webhook": {
    "enabled": false,
    "url": "https://discord.com/api/webhooks/..."
  },
  "filters": {
    "minDifficulty": "simple",
    "minScope": 1,
    "players": []
  }
}
```

#### 4. 运行
```bash
node oc-monitor-daemon.js
```

或使用 npm：
```bash
npm start
```

---

## 邮件配置指南

### Gmail
1. 开启两步验证
2. 生成应用专用密码：https://myaccount.google.com/apppasswords
3. 配置：
```json
{
  "service": "gmail",
  "auth": {
    "user": "your-email@gmail.com",
    "pass": "生成的16位应用密码"
  }
}
```

### QQ 邮箱
1. 开启 SMTP 服务，获取授权码
2. 配置：
```json
{
  "service": "qq",
  "auth": {
    "user": "your-qq@qq.com",
    "pass": "授权码"
  }
}
```

### Outlook/Hotmail
```json
{
  "service": "outlook",
  "auth": {
    "user": "your-email@outlook.com",
    "pass": "your-password"
  }
}
```

### 163 邮箱
```json
{
  "service": "163",
  "auth": {
    "user": "your-email@163.com",
    "pass": "授权码"
  }
}
```

---

## Webhook 配置

### Discord
1. 在 Discord 频道设置中创建 Webhook
2. 复制 Webhook URL
3. 配置：
```json
{
  "webhook": {
    "enabled": true,
    "url": "https://discord.com/api/webhooks/..."
  }
}
```

### Slack
类似 Discord，在 Slack 中创建 Incoming Webhook

---

## 过滤器配置

```json
{
  "filters": {
    "minDifficulty": "advanced",  // 只通知 advanced 难度
    "minScope": 4,                // 只通知 4 scope 的 OC
    "players": ["MiuPaS", "CHaurora"]  // 只通知特定玩家
  }
}
```

- `minDifficulty`: `"simple"`, `"intermediate"`, `"advanced"`
- `minScope`: 1-4
- `players`: 留空 `[]` 则监控所有玩家

---

## 部署方式

### 1. 本地运行
直接在电脑上运行，需要保持电脑开机

### 2. 服务器部署（推荐）
在 VPS 或云服务器上持续运行

#### 使用 PM2 管理进程
```bash
# 安装 PM2
npm install -g pm2

# 启动监控
pm2 start oc-monitor-daemon.js --name oc-monitor

# 查看状态
pm2 status

# 查看日志
pm2 logs oc-monitor

# 停止
pm2 stop oc-monitor

# 开机自启
pm2 startup
pm2 save
```

#### 使用 systemd (Linux)
创建 `/etc/systemd/system/oc-monitor.service`：
```ini
[Unit]
Description=Torn OC Spawn Monitor
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/oc-spawn-monitor
ExecStart=/usr/bin/node oc-monitor-daemon.js
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl enable oc-monitor
sudo systemctl start oc-monitor
sudo systemctl status oc-monitor
```

### 3. Docker 部署
创建 `Dockerfile`：
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "oc-monitor-daemon.js"]
```

运行：
```bash
docker build -t oc-monitor .
docker run -d --name oc-monitor --restart always oc-monitor
```

### 4. 免费云平台
- **Render.com** - 免费套餐支持后台服务
- **Railway.app** - 每月 $5 免费额度
- **Fly.io** - 免费套餐

---

## 功能特点

### 守护进程优势
- ✓ 24/7 持续运行
- ✓ 邮件通知（随时随地接收）
- ✓ Webhook 通知（Discord/Slack）
- ✓ 灵活的过滤器
- ✓ 状态持久化（重启不丢失）
- ✓ 低资源占用

### 通知内容
- OC 名称
- 难度等级（颜色标识）
- Scope 数量
- 发起人
- 时间戳

---

## 故障排查

### 邮件发送失败
1. 检查邮箱服务商是否需要开启 SMTP
2. 确认使用应用专用密码而非账号密码
3. 检查防火墙是否阻止 SMTP 端口（587/465）

### API 错误
1. 确认 API Key 正确且有效
2. 检查 API Key 权限（需要 FULL 权限）
3. 注意 API 请求频率限制

### 进程意外退出
1. 使用 PM2 或 systemd 自动重启
2. 检查日志文件
3. 确保有足够的内存和磁盘空间

---

## 文件说明

- `oc-monitor-daemon.js` - 主程序
- `config.json` - 配置文件（首次运行自动创建）
- `oc-monitor-state.json` - 状态文件（自动生成）
- `package.json` - 依赖配置

---

## 安全建议

1. 不要将 `config.json` 提交到 Git
2. 使用应用专用密码而非主密码
3. 定期更换 API Key
4. 限制服务器访问权限

---

## 更新日志

### v1.0.0 (2026-01-17)
- 初始版本
- 支持邮件通知
- 支持 Webhook 通知
- 支持过滤器
- 状态持久化

---

## 作者

xiansakana[2754627]

## 许可

MIT License
