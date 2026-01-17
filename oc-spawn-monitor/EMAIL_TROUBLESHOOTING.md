# 邮件通知故障排除指南

## 问题现象
- 脚本显示"邮件通知已发送"但实际未收到邮件
- 连接错误: "Connection closed" 或 "Client network socket disconnected"
- Gmail SMTP 连接失败

## 原因分析
Gmail 的 SMTP 服务对连接有严格限制，特别是：
- 从云服务器（如 Fly.io）连接
- 从中国大陆连接
- 新账号或不常用的账号

## 解决方案

### 方案 1：修复 Gmail 配置（推荐先尝试）

1. **确认两步验证已开启**
   - 访问：https://myaccount.google.com/security
   - 找到"两步验证"，确保已开启

2. **重新生成应用专用密码**
   - 访问：https://myaccount.google.com/apppasswords
   - 选择"邮件"和"其他设备"
   - 生成新密码（16位，无空格）
   - 复制密码并更新 `.env` 文件中的 `EMAIL_PASS`

3. **检查账号安全设置**
   - 访问：https://myaccount.google.com/lesssecureapps
   - 确保"不够安全的应用的访问权限"已关闭（使用应用专用密码时应该关闭）

4. **允许新设备登录**
   - 如果 Gmail 检测到异常登录，会发送邮件通知
   - 检查邮箱，点击"是我本人"确认

5. **测试连接**
   ```bash
   cd oc-spawn-monitor
   node test-email.js
   ```

### 方案 2：使用 163 邮箱（强烈推荐，国内稳定）

163 邮箱在中国大陆和云服务器上连接更稳定。

1. **开启 SMTP 服务**
   - 登录 163 邮箱：https://mail.163.com
   - 设置 → POP3/SMTP/IMAP
   - 开启"SMTP服务"
   - 会要求设置"授权密码"（不是登录密码）

2. **更新配置**
   编辑 `.env` 文件：
   ```env
   EMAIL_SERVICE=163
   EMAIL_USER=你的163邮箱@163.com
   EMAIL_PASS=授权密码（不是登录密码）
   EMAIL_TO=chengjie726@163.com
   EMAIL_FROM=你的163邮箱@163.com
   ```

3. **更新 Fly.io 环境变量**
   ```bash
   flyctl secrets set EMAIL_SERVICE=163
   flyctl secrets set EMAIL_USER=你的163邮箱@163.com
   flyctl secrets set EMAIL_PASS=授权密码
   flyctl secrets set EMAIL_FROM=你的163邮箱@163.com
   ```

4. **测试**
   ```bash
   node test-email.js
   ```

### 方案 3：使用 QQ 邮箱

1. **开启 SMTP 服务**
   - 登录 QQ 邮箱：https://mail.qq.com
   - 设置 → 账户
   - 开启"POP3/SMTP服务"
   - 生成授权码

2. **更新配置**
   编辑 `.env` 文件：
   ```env
   EMAIL_SERVICE=qq
   EMAIL_USER=你的QQ号@qq.com
   EMAIL_PASS=授权码（不是QQ密码）
   EMAIL_TO=chengjie726@163.com
   EMAIL_FROM=你的QQ号@qq.com
   ```

3. **更新 Fly.io 环境变量**
   ```bash
   flyctl secrets set EMAIL_SERVICE=qq
   flyctl secrets set EMAIL_USER=你的QQ号@qq.com
   flyctl secrets set EMAIL_PASS=授权码
   flyctl secrets set EMAIL_FROM=你的QQ号@qq.com
   ```

## 测试步骤

### 本地测试
```bash
cd oc-spawn-monitor
node test-email.js
```

如果看到 "✅ 成功！" 说明配置正确。

### 部署到 Fly.io
```bash
# 推送代码
git add .
git commit -m "Fix email configuration"
git push

# 部署
flyctl deploy

# 查看日志
flyctl logs
```

## 常见错误

### "Connection closed"
- 网络连接被阻断
- 尝试使用 163 或 QQ 邮箱

### "Invalid login"
- 密码错误
- 确保使用的是"应用专用密码"或"授权码"，不是登录密码

### "Connection timeout"
- 防火墙阻止
- SMTP 端口被封
- 尝试不同的邮箱服务

## 推荐配置

**最稳定的配置（国内）：**
- 使用 163 邮箱作为发件人
- SMTP 端口 465（SSL）
- 使用授权密码

**为什么 163 更好：**
- 国内服务器，连接稳定
- 对云服务器友好
- 配置简单
- 发送速度快

## 需要帮助？

如果以上方案都不行，可以：
1. 检查 Fly.io 日志：`flyctl logs`
2. 运行测试脚本：`node test-email.js`
3. 尝试使用其他邮箱服务
