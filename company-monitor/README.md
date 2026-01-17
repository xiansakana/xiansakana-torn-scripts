# Torn 公司申请监控工具

实时监控 Torn 公司申请，支持多个 API Key 和邮件通知。

## 功能特性

- ✅ 支持多个 API Key 同时监控
- ✅ 邮件通知（支持 QQ、163、Gmail 等）
- ✅ Webhook 通知（Discord 等）
- ✅ 24/7 云端运行
- ✅ 自动保存状态，重启不丢失
- ✅ 浏览器油猴脚本版本

## 使用方式

### 1. 浏览器油猴脚本（推荐新手）

安装 `company-monitor_1.0.0.user.js` 到 Tampermonkey，在 Torn 网站上使用。

**特点：**
- 简单易用，无需配置服务器
- 需要保持浏览器打开
- 桌面通知

### 2. 本地运行守护进程

```bash
cd company-monitor
npm install
cp .env.example .env
# 编辑 .env 文件，填入你的配置
node company-monitor-daemon.js
```

**特点：**
- 可以在本地电脑后台运行
- 邮件通知
- 需要保持电脑开机

### 3. 云端部署（推荐）

部署到 Fly.io、Railway 等云平台，实现 24/7 监控。

详见：[FLY_DEPLOY.md](FLY_DEPLOY.md)

**特点：**
- 24/7 不间断运行
- 无需保持电脑开机
- 邮件通知

## 配置说明

### 环境变量配置（推荐）

编辑 `.env` 文件：

```env
# 多个 API Key 用逗号分隔
TORN_API_KEYS=key1,key2,key3

# 检查间隔（秒）
CHECK_INTERVAL=60

# 邮件配置
EMAIL_ENABLED=true
EMAIL_SERVICE=qq
EMAIL_USER=your-email@qq.com
EMAIL_PASS=your-auth-code
EMAIL_TO=recipient@163.com
EMAIL_FROM=your-email@qq.com
```

### 配置文件（可选）

复制 `config.example.json` 为 `config.json` 并编辑。

## 多 API Key 说明

为什么需要多个 API Key？

1. **避免 API 限制**：Torn API 有请求频率限制
2. **监控多个公司**：不同的 API Key 可以监控不同的公司
3. **提高可靠性**：一个 Key 失效不影响其他 Key

**配置示例：**

```env
TORN_API_KEYS=key1,key2,key3
```

或在 `config.json` 中：

```json
{
  "tornApiKeys": ["key1", "key2", "key3"]
}
```

## 邮件服务配置

### QQ 邮箱（推荐）

1. 登录 https://mail.qq.com
2. 设置 → 账户 → POP3/SMTP 服务
3. 开启服务并生成授权码

```env
EMAIL_SERVICE=qq
EMAIL_USER=your-qq@qq.com
EMAIL_PASS=授权码（16位）
```

### 163 邮箱

1. 登录 https://mail.163.com
2. 设置 → POP3/SMTP/IMAP
3. 开启 SMTP 服务并设置授权密码

```env
EMAIL_SERVICE=163
EMAIL_USER=your-email@163.com
EMAIL_PASS=授权密码
```

### Gmail

1. 开启两步验证
2. 生成应用专用密码：https://myaccount.google.com/apppasswords

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=应用专用密码（16位）
```

## 测试

测试邮件发送：

```bash
npm test
# 或
node test-email.js
```

## 常见问题

### 1. 邮件发送失败

- 检查邮箱服务是否开启 SMTP
- 确认使用的是授权码/应用专用密码，不是登录密码
- 尝试其他邮箱服务（QQ 邮箱在国内最稳定）

### 2. API 请求失败

- 检查 API Key 是否正确
- 确认 API Key 有 `company` 权限
- 检查网络连接

### 3. 收不到通知

- 检查垃圾邮件箱
- 确认收件邮箱地址正确
- 运行 `npm test` 测试邮件功能

## 文件说明

- `company-monitor_1.0.0.user.js` - 浏览器油猴脚本
- `company-monitor-daemon.js` - Node.js 守护进程
- `company-monitor.html` - 独立网页版本
- `.env` - 环境变量配置（不提交到 git）
- `config.json` - JSON 配置文件（不提交到 git）
- `company-monitor-state.json` - 状态文件（自动生成）

## 许可证

MIT License
