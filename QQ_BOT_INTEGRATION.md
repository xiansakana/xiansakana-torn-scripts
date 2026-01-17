# QQ群机器人集成指南

将 OC Monitor 和 Company Monitor 的通知发送到QQ群。

## 方案对比

| 方案 | 难度 | 稳定性 | 推荐度 | 说明 |
|------|------|--------|--------|------|
| QQ频道机器人 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 官方支持，最稳定 |
| go-cqhttp | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 功能强大，但需要自己部署 |
| Webhook转发 | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 简单但需要中转服务 |

---

## 方案一：QQ频道机器人（推荐）

QQ官方提供的机器人服务，最稳定可靠。

### 优点
- ✅ 官方支持，稳定可靠
- ✅ 免费使用
- ✅ 支持Webhook
- ✅ 可以发送到QQ群（通过频道）

### 缺点
- ⚠️ 需要创建QQ频道（类似Discord）
- ⚠️ 不能直接发到传统QQ群

### 步骤

#### 1. 创建QQ频道机器人

1. 访问 [QQ开放平台](https://q.qq.com/)
2. 登录QQ账号
3. 创建机器人应用
4. 获取 `Bot Token` 和 `Bot Secret`

#### 2. 创建QQ频道

1. 打开QQ，创建一个频道
2. 在频道中添加你的机器人
3. 创建一个子频道用于接收通知（如"OC通知"）
4. 获取频道ID和子频道ID

#### 3. 修改代码支持QQ频道

在 `.env` 文件中添加：

```env
# QQ频道机器人配置
QQ_BOT_ENABLED=true
QQ_BOT_TOKEN=你的Bot Token
QQ_BOT_SECRET=你的Bot Secret
QQ_CHANNEL_ID=频道ID
QQ_SUB_CHANNEL_ID=子频道ID
```

#### 4. 安装依赖

```bash
npm install qq-guild-bot
```

#### 5. 代码示例

```javascript
const { createOpenAPI, createWebsocket } = require('qq-guild-bot');

// 初始化QQ机器人
const client = createOpenAPI({
    appID: process.env.QQ_BOT_APP_ID,
    token: process.env.QQ_BOT_TOKEN,
    sandbox: false
});

// 发送消息到QQ频道
async function sendQQMessage(content) {
    try {
        await client.messageApi.postMessage(
            process.env.QQ_CHANNEL_ID,
            {
                content: content,
                msg_id: Date.now().toString()
            }
        );
        console.log('✓ QQ频道消息已发送');
    } catch (err) {
        console.error('❌ QQ频道消息发送失败：', err.message);
    }
}
```

---

## 方案二：go-cqhttp（功能最强）

可以直接发送到传统QQ群，功能强大。

### 优点
- ✅ 支持传统QQ群
- ✅ 功能丰富（图片、表情等）
- ✅ 开源免费

### 缺点
- ⚠️ 需要自己部署
- ⚠️ 可能被腾讯风控
- ⚠️ 需要额外的服务器

### 步骤

#### 1. 部署 go-cqhttp

**方式A：本地部署**

1. 下载 [go-cqhttp](https://github.com/Mrs4s/go-cqhttp/releases)
2. 解压并运行
3. 扫码登录QQ
4. 配置HTTP API

**方式B：Docker部署**

```bash
docker run -d --name go-cqhttp \
  -p 5700:5700 \
  -v $(pwd)/data:/data \
  silicer/go-cqhttp:latest
```

#### 2. 配置 go-cqhttp

编辑 `config.yml`：

```yaml
account:
  uin: 你的QQ号
  password: ""  # 留空，使用扫码登录

servers:
  - http:
      host: 0.0.0.0
      port: 5700
      post:
        - url: ''  # 不需要上报
```

#### 3. 修改代码

在 `.env` 文件中添加：

```env
# go-cqhttp 配置
GOCQ_ENABLED=true
GOCQ_API_URL=http://localhost:5700
GOCQ_GROUP_ID=你的QQ群号
```

#### 4. 代码示例

```javascript
const fetch = require('node-fetch');

async function sendQQGroupMessage(message) {
    if (!process.env.GOCQ_ENABLED) return;
    
    try {
        const response = await fetch(`${process.env.GOCQ_API_URL}/send_group_msg`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                group_id: parseInt(process.env.GOCQ_GROUP_ID),
                message: message
            })
        });
        
        const result = await response.json();
        if (result.status === 'ok') {
            console.log('✓ QQ群消息已发送');
        } else {
            console.error('❌ QQ群消息发送失败：', result.msg);
        }
    } catch (err) {
        console.error('❌ QQ群消息发送失败：', err.message);
    }
}
```

---

## 方案三：Webhook转发服务（最简单）

使用第三方服务将Webhook转发到QQ。

### 推荐服务

1. **Qmsg酱** - https://qmsg.zendee.cn/
   - 免费
   - 支持QQ群
   - 简单易用

2. **Server酱** - https://sct.ftqq.com/
   - 支持多种通知方式
   - 包括QQ

### 使用 Qmsg酱

#### 1. 注册并获取Key

1. 访问 https://qmsg.zendee.cn/
2. 登录QQ
3. 获取 Qmsg Key
4. 添加机器人到QQ群

#### 2. 配置

在 `.env` 文件中添加：

```env
# Qmsg酱配置
QMSG_ENABLED=true
QMSG_KEY=你的Qmsg Key
QMSG_QQ_GROUP=你的QQ群号
```

#### 3. 代码示例

```javascript
async function sendQmsgNotification(title, content) {
    if (!process.env.QMSG_ENABLED) return;
    
    try {
        const url = `https://qmsg.zendee.cn/send/${process.env.QMSG_KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                msg: `【${title}】\n${content}`,
                qq: process.env.QMSG_QQ_GROUP  // 可以是QQ号或群号
            })
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('✓ Qmsg消息已发送');
        } else {
            console.error('❌ Qmsg消息发送失败：', result.reason);
        }
    } catch (err) {
        console.error('❌ Qmsg消息发送失败：', err.message);
    }
}
```

---

## 推荐方案

### 如果你想要最简单：
👉 **使用 Qmsg酱**
- 5分钟配置完成
- 无需部署服务
- 免费使用

### 如果你想要最稳定：
👉 **使用 QQ频道机器人**
- 官方支持
- 长期稳定
- 功能完善

### 如果你想要最强大：
👉 **使用 go-cqhttp**
- 功能最丰富
- 支持传统QQ群
- 需要技术能力

---

## 我来帮你实现

告诉我你想用哪个方案，我会：

1. 修改 `oc-monitor-daemon.js` 和 `company-monitor-daemon.js`
2. 添加QQ通知功能
3. 更新配置文件
4. 提供测试脚本
5. 部署到 Fly.io

**推荐：先用 Qmsg酱 试试，最简单！**

只需要：
1. 访问 https://qmsg.zendee.cn/
2. 登录QQ获取Key
3. 把机器人拉到群里
4. 告诉我你的 Qmsg Key 和 QQ群号

我就可以帮你配置好！
