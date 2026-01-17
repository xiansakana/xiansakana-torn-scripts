# Fly.io 部署指南

## 前提条件

- 已安装 flyctl CLI
- 已登录 Fly.io 账号
- 已配置好邮箱服务

## 快速部署

### 1. 安装 flyctl（如果还没安装）

**Windows:**
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### 2. 登录 Fly.io

```bash
flyctl auth login
```

### 3. 创建应用

```bash
cd company-monitor
flyctl launch
```

**配置选项：**
- App name: `company-monitor`（或其他名字）
- Region: 选择 `San Jose (sjc)` 或离你最近的区域
- 不要部署 PostgreSQL 数据库
- 不要立即部署（选择 No）

### 4. 设置环境变量

**必需的环境变量：**

```bash
# API Keys（多个用逗号分隔，不要有空格）
flyctl secrets set TORN_API_KEYS=key1,key2,key3

# 邮件配置
flyctl secrets set EMAIL_ENABLED=true
flyctl secrets set EMAIL_SERVICE=qq
flyctl secrets set EMAIL_USER=2461298052@qq.com
flyctl secrets set EMAIL_PASS=ybfxdxppjlodeche
flyctl secrets set EMAIL_TO=chengjie_726@163.com
flyctl secrets set EMAIL_FROM=2461298052@qq.com
```

**可选的环境变量：**

```bash
# 检查间隔（秒，默认60）
flyctl secrets set CHECK_INTERVAL=60

# Webhook 通知
flyctl secrets set WEBHOOK_ENABLED=true
flyctl secrets set WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### 5. 部署应用

```bash
flyctl deploy
```

部署需要几分钟时间。

### 6. 查看日志

```bash
flyctl logs
```

你应该能看到类似这样的输出：

```
使用环境变量配置
初始化邮件发送器...
  服务: qq
  用户: 2461298052@qq.com
✓ 邮件配置验证成功
============================================================
🚀 Torn 公司申请监控守护进程已启动
============================================================
API Keys 数量：3
检查间隔：60 秒
邮件通知：✓ 启用
Webhook：✗ 禁用
============================================================
[2026/1/17 19:30:00] 第 1 次检查...
  检查 API Key 1/3...
  检查 API Key 2/3...
  检查 API Key 3/3...
  没有新的申请
总计：已检查 1 次，发现 0 个新申请
```

## 常用命令

### 查看应用状态

```bash
flyctl status
```

### 查看实时日志

```bash
flyctl logs -f
```

### 重启应用

```bash
flyctl apps restart company-monitor
```

### 停止应用

```bash
flyctl apps stop company-monitor
```

### 启动应用

```bash
flyctl apps start company-monitor
```

### 查看环境变量

```bash
flyctl secrets list
```

### 更新环境变量

```bash
flyctl secrets set KEY=VALUE
```

### 删除环境变量

```bash
flyctl secrets unset KEY
```

### 重新部署

```bash
# 推送代码到 GitHub
git add .
git commit -m "Update company monitor"
git push

# 部署到 Fly.io
flyctl deploy
```

## 添加/更新 API Keys

### 添加新的 API Key

```bash
# 假设当前有 key1,key2，要添加 key3
flyctl secrets set TORN_API_KEYS=key1,key2,key3
```

**注意：**
- 多个 key 用逗号分隔
- 不要有空格
- 每次设置会覆盖之前的值，所以要包含所有 key

### 查看当前配置的 API Keys 数量

查看日志中的 "API Keys 数量" 行：

```bash
flyctl logs | grep "API Keys"
```

## 监控和调试

### 检查应用是否正常运行

```bash
flyctl status
```

看到 `Status: running` 说明正常。

### 查看最近的日志

```bash
flyctl logs --lines 100
```

### 查看错误日志

```bash
flyctl logs | grep "❌"
```

### 测试邮件功能

如果怀疑邮件有问题，可以：

1. 查看日志中的邮件验证信息
2. 等待有新申请时查看是否发送成功
3. 本地运行 `npm test` 测试邮件配置

## 成本说明

Fly.io 免费额度：
- 3 个共享 CPU 虚拟机（256MB RAM）
- 3GB 持久化存储
- 160GB 出站流量/月

Company Monitor 使用：
- 1 个虚拟机（256MB RAM）
- < 100MB 存储
- < 1GB 流量/月

**完全在免费额度内！**

## 故障排除

### 问题 1：部署失败

**可能原因：**
- Dockerfile 错误
- 依赖安装失败

**解决方法：**
```bash
flyctl logs
```
查看错误信息。

### 问题 2：应用启动后立即停止

**可能原因：**
- 环境变量未设置
- API Key 错误

**解决方法：**
```bash
flyctl logs
flyctl secrets list
```

### 问题 3：收不到邮件

**可能原因：**
- 邮箱配置错误
- 授权码错误
- 邮箱服务阻止

**解决方法：**
1. 检查日志中的邮件验证信息
2. 确认授权码正确（16位，无空格）
3. 尝试其他邮箱服务（163、Gmail）

### 问题 4：API 请求失败

**可能原因：**
- API Key 错误
- API Key 权限不足
- API 限制

**解决方法：**
1. 检查 API Key 是否正确
2. 确认 Key 有 `company` 权限
3. 添加更多 API Key 分散请求

### 问题 5：应用自动停止

**原因：**
Fly.io 的 `auto_stop_machines` 功能会在应用空闲时停止。

**解决方法：**
这是正常的！应用会在需要时自动启动。如果想保持运行：

编辑 `fly.toml`：
```toml
[http_service]
  auto_stop_machines = 'off'
  min_machines_running = 1
```

然后重新部署：
```bash
flyctl deploy
```

## 多区域部署（可选）

如果想提高可靠性，可以部署到多个区域：

```bash
# 添加新区域
flyctl scale count 2 --region sjc,nrt

# sjc = San Jose (美国西海岸)
# nrt = Tokyo (日本)
```

## 备份和恢复

### 备份状态文件

状态文件 `company-monitor-state.json` 存储在容器中，重启会丢失。

如果需要持久化，可以使用 Fly.io Volumes：

```bash
# 创建 volume
flyctl volumes create company_data --size 1

# 修改 fly.toml 添加 mount
[mounts]
  source = "company_data"
  destination = "/app/data"
```

然后修改代码中的 `STATE_FILE` 路径。

## 安全建议

1. **不要在代码中硬编码敏感信息**
2. **定期更换 API Key**
3. **使用邮箱授权码，不用登录密码**
4. **限制 API Key 权限**（只需 company 权限）
5. **定期检查日志**

## 更新应用

```bash
# 1. 修改代码
# 2. 提交到 git
git add .
git commit -m "Update"
git push

# 3. 部署
flyctl deploy
```

## 删除应用

如果不再需要：

```bash
flyctl apps destroy company-monitor
```

## 需要帮助？

- Fly.io 文档：https://fly.io/docs/
- Fly.io 社区：https://community.fly.io/
- GitHub Issues：https://github.com/xiansakana/xiansakana-torn-scripts/issues

## 下一步

- 添加更多 API Key 提高监控频率
- 配置 Webhook 通知
- 设置多区域部署提高可靠性
