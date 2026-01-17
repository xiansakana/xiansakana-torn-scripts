# go-cqhttp QQ群通知配置指南

## 什么是 go-cqhttp？

go-cqhttp 是一个开源的 QQ 机器人框架，可以让你的程序发送消息到QQ群。

**优点：**
- ✅ 支持传统QQ群
- ✅ 功能强大
- ✅ 开源免费
- ✅ 可以本地或云端部署

---

## 方式一：本地部署（推荐新手）

### 第一步：下载 go-cqhttp

1. **访问 GitHub Releases**
   
   👉 https://github.com/Mrs4s/go-cqhttp/releases

2. **下载对应系统的版本**
   
   - Windows: `go-cqhttp_windows_amd64.exe`
   - Mac: `go-cqhttp_darwin_amd64`
   - Linux: `go-cqhttp_linux_amd64`

3. **创建文件夹**
   
   ```bash
   mkdir go-cqhttp
   cd go-cqhttp
   ```

4. **将下载的文件放到文件夹中**

### 第二步：首次运行

1. **运行 go-cqhttp**
   
   Windows:
   ```cmd
   go-cqhttp_windows_amd64.exe
   ```
   
   Mac/Linux:
   ```bash
   chmod +x go-cqhttp_*
   ./go-cqhttp_*
   ```

2. **选择通信方式**
   
   选择 `0` (HTTP通信)

3. **会生成 `config.yml` 文件**

### 第三步：配置 config.yml

编辑 `config.yml` 文件：

```yaml
account:
  uin: 你的QQ号  # 用于登录的QQ号（建议用小号）
  password: ''   # 留空，使用扫码登录
  encrypt: false
  status: 0
  relogin:
    delay: 3
    interval: 3
    max-times: 0

heartbeat:
  interval: 5

message:
  post-format: string
  ignore-invalid-cqcode: false
  force-fragment: false
  fix-url: false
  proxy-rewrite: ''
  report-self-message: false
  remove-reply-at: false
  extra-reply-data: false
  skip-mime-scan: false

output:
  log-level: warn
  log-aging: 15
  log-force-new: true
  log-colorful: true
  debug: false

default-middlewares: &default
  access-token: ''
  filter: ''
  rate-limit:
    enabled: false
    frequency: 1
    bucket: 1

database:
  leveldb:
    enable: true

servers:
  - http:
      host: 127.0.0.1
      port: 5700
      timeout: 5
      long-polling:
        enabled: false
        max-queue-size: 2000
      middlewares:
        <<: *default
      post:
        - url: ''
          secret: ''
```

**重要配置说明：**
- `uin`: 填入你的QQ号（建议用小号，不要用主号）
- `password`: 留空，使用扫码登录
- `port: 5700`: HTTP API 端口，不要改

### 第四步：登录QQ

1. **再次运行 go-cqhttp**
   
   ```bash
   ./go-cqhttp_*
   ```

2. **扫码登录**
   
   - 会显示二维码
   - 用手机QQ扫码登录
   - 如果提示需要验证，按提示操作

3. **登录成功**
   
   看到 `登录成功` 的提示

4. **保持运行**
   
   不要关闭这个窗口，让它一直运行

### 第五步：获取QQ群号

1. **打开QQ群**
2. **查看群资料**
3. **复制群号**（例如：`123456789`）

### 第六步：配置环境变量

编辑 `.env` 文件：

**OC Monitor:**
```env
# oc-spawn-monitor/.env
GOCQ_ENABLED=true
GOCQ_API_URL=http://localhost:5700
GOCQ_GROUP_ID=你的QQ群号
```

**Company Monitor:**
```env
# company-monitor/.env
GOCQ_ENABLED=true
GOCQ_API_URL=http://localhost:5700
GOCQ_GROUP_ID=你的QQ群号
```

### 第七步：测试

1. **确保 go-cqhttp 在运行**

2. **运行监控程序**
   
   ```bash
   # 测试 OC Monitor
   cd oc-spawn-monitor
   node oc-monitor-daemon.js
   
   # 测试 Company Monitor
   cd company-monitor
   node company-monitor-daemon.js
   ```

3. **查看QQ群**
   
   应该能收到测试消息！

---

## 方式二：Docker 部署

### 使用 Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3'
services:
  go-cqhttp:
    image: silicer/go-cqhttp:latest
    container_name: go-cqhttp
    restart: always
    ports:
      - "5700:5700"
    volumes:
      - ./go-cqhttp/data:/data
    environment:
      - TZ=Asia/Shanghai
```

运行：

```bash
docker-compose up -d
```

首次运行需要配置，进入容器：

```bash
docker exec -it go-cqhttp bash
```

编辑配置文件并重启。

---

## 方式三：云端部署（Fly.io）

如果你想让 go-cqhttp 也 24/7 运行在云端：

### 1. 创建 Dockerfile

```dockerfile
FROM silicer/go-cqhttp:latest

COPY config.yml /data/config.yml

CMD ["/app/go-cqhttp"]
```

### 2. 准备 config.yml

将你本地配置好的 `config.yml` 复制到项目目录。

### 3. 部署到 Fly.io

```bash
flyctl launch --name go-cqhttp-bot
flyctl deploy
```

**注意：** 云端部署需要处理登录验证问题，建议先本地登录成功后再迁移。

---

## 消息格式示例

### OC Spawn 通知

```
🎯 发现 2 个新 OC Spawn！

━━━━━━━━━━━━━━━━
📋 Blast from the Past
🎚️ 难度：advanced
📊 Scope：4
👤 发起人：MiuPaS
🕐 时间：2026/1/17 19:30:00
━━━━━━━━━━━━━━━━
📋 Clinical Precision
🎚️ 难度：advanced
📊 Scope：4
👤 发起人：SoftRabbit
🕐 时间：2026/1/17 19:31:00
━━━━━━━━━━━━━━━━
检查时间：2026/1/17 19:31:30
```

### 公司申请通知

```
🏢 发现 1 个新的公司申请！

━━━━━━━━━━━━━━━━
🏢 公司：muyui
👤 申请人：TestUser (ID: 123456)
📊 等级：50
🧠 智力：1,000,000
💪 耐力：800,000
🔧 体力劳动：500,000
📝 状态：Active
⏰ 过期：2026/1/18 19:30:00
━━━━━━━━━━━━━━━━
检查时间：2026/1/17 19:30:00
```

---

## 常见问题

### Q: 登录时提示需要验证？

A: 按照提示操作：
1. 短信验证：发送短信
2. 设备锁验证：在手机QQ上确认
3. 滑块验证：访问提示的网址完成验证

### Q: 登录后一段时间掉线？

A: 这是正常的，go-cqhttp 会自动重连。如果频繁掉线：
1. 检查网络连接
2. 尝试更换登录设备类型
3. 降低请求频率

### Q: 收不到QQ群消息？

A: 检查：
1. go-cqhttp 是否在运行
2. QQ群号是否正确
3. 机器人QQ是否在群里
4. 查看 go-cqhttp 日志是否有错误

### Q: 可以发送到多个群吗？

A: 可以！修改代码，在发送消息时循环多个群号。

### Q: 会被封号吗？

A: 风险很低，但建议：
1. 使用小号，不要用主号
2. 不要频繁发送消息
3. 不要发送广告或违规内容
4. 定期检查QQ是否正常

### Q: 如何关闭QQ群通知？

A: 设置环境变量：
```env
GOCQ_ENABLED=false
```

### Q: go-cqhttp 需要一直运行吗？

A: 是的，需要保持运行才能发送消息。可以：
1. 本地运行：开机自启动
2. 云端运行：部署到服务器
3. Docker运行：设置 restart: always

---

## 部署到 Fly.io（可选）

如果你想让监控程序和 go-cqhttp 都在云端运行：

### 方案A：监控程序在 Fly.io，go-cqhttp 在本地

- 监控程序：Fly.io（已部署）
- go-cqhttp：本地运行
- 配置：`GOCQ_API_URL=http://你的公网IP:5700`

**需要：**
1. 本地电脑有公网IP
2. 或使用内网穿透（如 frp、ngrok）

### 方案B：都在 Fly.io

- 监控程序：Fly.io
- go-cqhttp：Fly.io
- 配置：`GOCQ_API_URL=http://go-cqhttp-bot.internal:5700`

**需要：**
1. 部署 go-cqhttp 到 Fly.io
2. 处理登录验证问题

---

## 推荐配置

**最简单的配置：**
1. go-cqhttp 本地运行
2. 监控程序 Fly.io 运行
3. 使用内网穿透连接

**最稳定的配置：**
1. go-cqhttp 本地运行（开机自启）
2. 监控程序 Fly.io 运行
3. 使用 DDNS + 端口映射

---

## 下一步

配置完成后，你会同时收到：
- ✉️ 邮件通知（chengjie_726@163.com）
- 💬 QQ群消息

两种通知方式互不影响，可以单独开启或关闭！

---

## 需要帮助？

如果遇到问题，请提供：
1. go-cqhttp 日志
2. 监控程序日志
3. 配置信息（隐藏敏感信息）
4. 问题描述
