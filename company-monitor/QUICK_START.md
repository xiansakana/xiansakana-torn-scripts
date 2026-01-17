# 快速开始

## 方式一：浏览器脚本（最简单）

1. 安装 Tampermonkey 浏览器扩展
2. 点击安装 `company-monitor_1.0.0.user.js`
3. 访问 Torn 网站，点击右侧"公司"按钮
4. 输入 API Key，点击"开始监听"

**优点：** 简单易用，无需配置
**缺点：** 需要保持浏览器打开

---

## 方式二：本地运行（推荐测试）

### 1. 安装依赖

```bash
cd company-monitor
npm install
```

### 2. 配置

复制并编辑 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env`，填入你的信息：

```env
# 你的 API Keys（多个用逗号分隔）
TORN_API_KEYS=你的key1,你的key2

# 邮件配置
EMAIL_USER=2461298052@qq.com
EMAIL_PASS=你的QQ邮箱授权码
EMAIL_TO=chengjie_726@163.com
```

### 3. 测试邮件

```bash
npm test
```

看到 "✅ 成功！" 说明邮件配置正确。

### 4. 运行

```bash
npm start
```

按 `Ctrl+C` 停止。

---

## 方式三：云端部署（推荐生产）

### 使用 Fly.io（免费）

**完整部署指南请查看：[FLY_DEPLOY.md](FLY_DEPLOY.md)**

**快速步骤：**

1. **安装并登录**
   ```bash
   # Windows
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   
   # 登录
   flyctl auth login
   ```

2. **创建应用**
   ```bash
   cd company-monitor
   flyctl launch
   ```

3. **设置环境变量**
   ```bash
   flyctl secrets set TORN_API_KEYS=key1,key2,key3
   flyctl secrets set EMAIL_ENABLED=true
   flyctl secrets set EMAIL_SERVICE=qq
   flyctl secrets set EMAIL_USER=2461298052@qq.com
   flyctl secrets set EMAIL_PASS=你的授权码
   flyctl secrets set EMAIL_TO=chengjie_726@163.com
   flyctl secrets set EMAIL_FROM=2461298052@qq.com
   ```

4. **部署**
   ```bash
   flyctl deploy
   ```

5. **查看日志**
   ```bash
   flyctl logs
   ```

详细说明、故障排除、常用命令等请查看 [FLY_DEPLOY.md](FLY_DEPLOY.md)

---

## 添加多个 API Key

### 为什么需要多个 API Key？

- 监控多个公司
- 避免 API 限制
- 提高可靠性

### 如何添加？

**方式 1：环境变量**

```env
TORN_API_KEYS=key1,key2,key3
```

**方式 2：Fly.io**

```bash
flyctl secrets set TORN_API_KEYS=key1,key2,key3
```

用逗号分隔多个 key，不要有空格。

---

## 获取 QQ 邮箱授权码

1. 登录 https://mail.qq.com
2. 设置 → 账户
3. 找到 "POP3/SMTP服务"
4. 点击"开启"
5. 按提示发送短信
6. 获得 16 位授权码（类似：`abcd efgh ijkl mnop`）
7. **去掉空格**，填入配置：`abcdefghijklmnop`

---

## 常见问题

### Q: 收不到邮件？

A: 
1. 检查垃圾邮件箱
2. 运行 `npm test` 测试邮件
3. 确认授权码正确（16位，无空格）

### Q: API 请求失败？

A:
1. 检查 API Key 是否正确
2. 确认 Key 有 `company` 权限
3. 检查网络连接

### Q: 如何停止监控？

A:
- 本地运行：按 `Ctrl+C`
- Fly.io：`flyctl apps stop company-monitor`

### Q: 如何查看日志？

A:
- 本地运行：直接在终端查看
- Fly.io：`flyctl logs`

---

## 下一步

- 查看 [README.md](README.md) 了解更多功能
- 查看 [FLY_DEPLOY.md](FLY_DEPLOY.md) 了解详细部署步骤
