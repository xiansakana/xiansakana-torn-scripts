# 配置指南

本项目支持三种配置方式，按优先级从高到低：

## 1️⃣ 环境变量（推荐用于 Railway）

### 本地使用 .env 文件

创建 `.env` 文件（已在 `.gitignore` 中，不会被推送）：

```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件，填入你的信息
```

`.env` 文件内容：
```env
TORN_API_KEY=你的API密钥
EMAIL_ENABLED=true
EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASS=你的应用密码
EMAIL_TO=接收通知的邮箱
```

### Railway 部署

在 Railway 项目的 **Variables** 标签直接添加环境变量，无需 `.env` 文件。

---

## 2️⃣ config.json 文件（推荐用于本地）

创建 `config.json` 文件（已在 `.gitignore` 中，不会被推送）：

```bash
# 复制示例文件
cp config.example.json config.json

# 编辑 config.json 文件，填入你的信息
```

`config.json` 内容：
```json
{
  "tornApiKey": "你的API密钥",
  "checkInterval": 60,
  "email": {
    "enabled": true,
    "service": "gmail",
    "auth": {
      "user": "your@gmail.com",
      "pass": "你的应用密码"
    },
    "to": "接收通知的邮箱",
    "from": "your@gmail.com"
  }
}
```

---

## 3️⃣ 配置优先级

脚本按以下顺序查找配置：

1. **环境变量** - 优先级最高
   - 从 `.env` 文件加载（本地）
   - 或从系统环境变量读取（Railway）

2. **config.json** - 如果没有环境变量
   - 适合本地开发

3. **默认配置** - 如果都没有
   - 会创建 `config.example.json` 并提示配置

---

## 📁 文件说明

### 会被推送到 Git 的文件（示例）
- ✅ `.env.example` - 环境变量示例
- ✅ `config.example.json` - 配置文件示例
- ✅ `.gitignore` - 忽略敏感文件

### 不会被推送的文件（包含真实信息）
- ❌ `.env` - 你的环境变量
- ❌ `config.json` - 你的配置文件
- ❌ `oc-monitor-state.json` - 运行状态

---

## 🔄 配置同步

### 场景 1：本地和 Render 使用相同配置

**本地：**
```bash
# 使用 .env 文件
node oc-monitor-daemon.js
```

**Render：**
在 Environment 标签复制 `.env` 文件的内容

### 场景 2：本地使用 config.json，Render 使用环境变量

**本地：**
```bash
# 使用 config.json
node oc-monitor-daemon.js
```

**Render：**
在 Environment 标签配置环境变量

---

## 🔒 安全建议

### ✅ 推荐做法

1. **本地开发**：使用 `.env` 或 `config.json`
2. **Railway 部署**：使用环境变量
3. **永远不要**：把真实信息提交到 Git

### ❌ 避免的错误

```bash
# 错误：把真实配置推送到 Git
git add config.json  # ❌ 不要这样做！
git add .env         # ❌ 不要这样做！

# 正确：只推送示例文件
git add config.example.json  # ✅
git add .env.example         # ✅
```

### 🔍 推送前检查

```bash
# 查看将要提交的文件
git status

# 确认这些文件不在列表中：
# - config.json
# - .env
# - oc-monitor-state.json
```

---

## 📝 快速开始

### 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 配置（选择一种方式）
# 方式 A：使用 .env
cp .env.example .env
# 编辑 .env

# 方式 B：使用 config.json
cp config.example.json config.json
# 编辑 config.json

# 3. 运行
node oc-monitor-daemon.js
```

### Render 部署

```bash
# 1. 推送到 GitHub
git push

# 2. 在 Render 配置环境变量
# 参考 .env.example 或 RENDER_DEPLOY.md

# 3. 部署完成！
```

---

## 🆘 故障排查

### 问题：找不到配置

**错误信息：**
```
❌ 请配置 Torn API Key！
```

**解决方法：**
1. 检查是否创建了 `.env` 或 `config.json`
2. 检查文件内容是否正确
3. 检查环境变量是否设置

### 问题：配置没有生效

**检查优先级：**
```bash
# 环境变量会覆盖 config.json
# 如果设置了环境变量，config.json 会被忽略
```

### 问题：Railway 上找不到配置

**解决方法：**
1. 确认在 Railway Variables 标签添加了环境变量
2. 重启服务使环境变量生效
3. 查看 Logs 确认配置是否加载

---

## 📚 相关文档

- [快速开始](./RENDER_QUICK_START.md) - 3分钟部署到 Render
- [Render 部署](./RENDER_DEPLOY.md) - 完整部署指南
- [主文档](./README.md) - 项目说明
