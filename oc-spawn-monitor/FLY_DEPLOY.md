# Fly.io 部署指南（完全免费）

## 🎉 为什么选择 Fly.io？

- ✅ **完全免费** - 免费额度足够使用
- ✅ **3个免费 VM** - 每个 256MB RAM
- ✅ **160GB 流量/月** - 足够使用
- ✅ **持续运行** - 不会休眠
- ✅ **全球部署** - 多个区域可选

---

## 📋 准备工作

1. **GitHub 账号** - 代码已推送 ✅
2. **Fly.io 账号** - 访问 https://fly.io 注册
3. **Torn API Key** - 已准备好 ✅
4. **Gmail 应用密码** - 已准备好 ✅
5. **flyctl CLI** - Fly.io 命令行工具

---

## 🚀 部署步骤

### 步骤 1：安装 flyctl

#### Windows (PowerShell)
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

#### macOS/Linux
```bash
curl -L https://fly.io/install.sh | sh
```

安装后重启终端，验证安装：
```bash
flyctl version
```

### 步骤 2：登录 Fly.io

```bash
flyctl auth login
```

这会打开浏览器，用 GitHub 账号登录即可。

### 步骤 3：进入项目目录

```bash
cd oc-spawn-monitor
```

### 步骤 4：创建应用

```bash
flyctl launch
```

会提示一些问题：
- **App Name**: 按回车使用默认名称，或输入自定义名称
- **Region**: 选择 `sjc` (San Jose) 或离你最近的区域
- **Would you like to set up a Postgresql database?**: 选择 **No**
- **Would you like to set up an Upstash Redis database?**: 选择 **No**
- **Would you like to deploy now?**: 选择 **No**（先配置环境变量）

### 步骤 5：配置环境变量（密钥）

使用 `flyctl secrets` 命令设置敏感信息：

```bash
flyctl secrets set TORN_API_KEY=DfxcuzzjBzvuh0t0
flyctl secrets set EMAIL_ENABLED=true
flyctl secrets set EMAIL_SERVICE=gmail
flyctl secrets set EMAIL_USER=saltedfishcj@gmail.com
flyctl secrets set EMAIL_PASS="rybc xcsw aipj etql"
flyctl secrets set EMAIL_TO=chengjie726@163.com
flyctl secrets set EMAIL_FROM=saltedfishcj@gmail.com
```

**注意**：
- 密码包含空格时用引号括起来
- secrets 是加密存储的，不会出现在配置文件中

### 步骤 6：部署

```bash
flyctl deploy
```

部署过程：
1. 构建 Docker 镜像
2. 上传到 Fly.io
3. 启动应用

### 步骤 7：查看日志

```bash
flyctl logs
```

应该看到：
```
🚀 Torn OC Spawn 监控守护进程已启动
检查间隔：60 秒
邮件通知：✓ 启用
```

---

## 📊 Fly.io 免费额度

### 免费套餐包含

| 资源 | 免费额度 |
|------|---------|
| **VM 数量** | 最多 3 个 |
| **RAM** | 每个 VM 256MB |
| **CPU** | 共享 CPU |
| **存储** | 3GB 持久化存储 |
| **流量** | 160GB 出站/月 |
| **价格** | $0/月 |

### 我们的使用

- **1 个 VM** - 256MB RAM
- **极少流量** - 每分钟一次 API 请求
- **预计费用**: **$0/月** ✅

---

## 🔧 常用命令

### 查看应用状态
```bash
flyctl status
```

### 查看实时日志
```bash
flyctl logs
```

### 查看环境变量
```bash
flyctl secrets list
```

### 更新环境变量
```bash
flyctl secrets set KEY=VALUE
```

### 重启应用
```bash
flyctl apps restart
```

### 停止应用
```bash
flyctl scale count 0
```

### 启动应用
```bash
flyctl scale count 1
```

### 删除应用
```bash
flyctl apps destroy oc-spawn-monitor
```

---

## 📧 Gmail 配置

### 获取应用专用密码

1. 访问 https://myaccount.google.com/security
2. 开启 **"两步验证"**
3. 访问 https://myaccount.google.com/apppasswords
4. 选择 **"应用"** → **"其他"**，输入 "Torn OC Monitor"
5. 点击 **"生成"**
6. 复制生成的 16 位密码
7. 使用 `flyctl secrets set EMAIL_PASS="密码"`

---

## 🔄 更新部署

当你修改代码并推送到 GitHub 后：

```bash
# 1. 拉取最新代码
git pull

# 2. 重新部署
cd oc-spawn-monitor
flyctl deploy
```

---

## 🐛 故障排查

### 问题 1：部署失败

**检查：**
```bash
# 查看详细日志
flyctl logs

# 检查应用状态
flyctl status
```

### 问题 2：邮件发送失败

**检查：**
```bash
# 查看日志中的错误
flyctl logs

# 确认环境变量设置正确
flyctl secrets list
```

### 问题 3：应用无法启动

**检查：**
```bash
# 查看启动日志
flyctl logs

# 检查 fly.toml 配置
cat fly.toml
```

### 问题 4：超出免费额度

**检查使用情况：**
```bash
flyctl dashboard
```

访问 https://fly.io/dashboard 查看详细使用情况

---

## 🔒 安全建议

1. **使用 secrets 存储敏感信息**
   ```bash
   flyctl secrets set KEY=VALUE
   ```
   不要把密钥写在 `fly.toml` 中

2. **定期更换密钥**
   - API Key
   - 邮箱密码

3. **限制访问权限**
   - 只给必要的人访问 Fly.io 账号

---

## 📝 fly.toml 配置说明

```toml
app = "oc-spawn-monitor"          # 应用名称
primary_region = "sjc"             # 主要区域（San Jose）

[env]
  CHECK_INTERVAL = "60"            # 非敏感的环境变量
  FILTER_MIN_DIFFICULTY = "simple"
  FILTER_MIN_SCOPE = "1"

[processes]
  app = "node oc-monitor-daemon.js"  # 启动命令

[[vm]]
  cpu_kind = "shared"              # 共享 CPU（免费）
  cpus = 1
  memory_mb = 256                  # 256MB RAM（免费额度）
```

---

## 💰 费用说明

### 免费额度足够吗？

✅ **完全足够！**

我们的应用：
- 1 个 VM (256MB) - 免费额度内
- 极少的 CPU 使用 - 每分钟只运行几秒
- 极少的流量 - 每分钟一次 API 请求
- 无持久化存储需求

**预计每月费用：$0** 🎊

### 如果超出免费额度

Fly.io 会发邮件通知，你可以：
1. 升级到付费套餐
2. 优化应用减少资源使用
3. 停止应用

---

## 🎯 测试部署

部署成功后：

1. 查看日志确认运行：
   ```bash
   flyctl logs
   ```

2. 应该看到：
   ```
   🚀 Torn OC Spawn 监控守护进程已启动
   检查间隔：60 秒
   邮件通知：✓ 启用
   
   [2026/1/17 10:00:00] 第 1 次检查...
   ```

3. 等待几分钟，当有新 OC 时会收到邮件通知

---

## 📞 获取帮助

- Fly.io 文档: https://fly.io/docs
- Fly.io 社区: https://community.fly.io
- 项目 Issues: 在 GitHub 仓库提交 Issue

---

## ✅ 部署检查清单

- [ ] flyctl 已安装
- [ ] Fly.io 账号已创建并登录
- [ ] 进入 oc-spawn-monitor 目录
- [ ] 运行 `flyctl launch` 创建应用
- [ ] 使用 `flyctl secrets set` 配置所有环境变量
- [ ] 运行 `flyctl deploy` 部署
- [ ] 使用 `flyctl logs` 确认运行正常
- [ ] 收到测试邮件通知

---

## 🎉 完成

恭喜！你的 OC 监控系统现在会 24/7 运行在 Fly.io 上，完全免费，随时通过邮件通知你新的 OC spawn！

**预计每月费用：$0** 🎊
