# ECS 部署（Git 方式）

以后改代码只需：**本机 push → ECS 上 `git pull` + 重启**，不用 scp。

## 一、本机：首次提交并推送

```powershell
cd "d:\data\OneDrive\torncity\脚本\xiansakana-torn-scripts"
git add qq-bot torn-toolbox-desktop scripts DEPLOY-ECS.md
git commit -m "Add qq-bot and torn-toolbox-desktop for ECS deployment"
git push
```

`config.json` 已在 `.gitignore` 里，**不会**上传密钥。

---

## 二、ECS：首次克隆

SSH 登录 ECS 后：

```bash
cd /opt
git clone https://github.com/xiansakana/xiansakana-torn-scripts.git
cd xiansakana-torn-scripts
```

### 配置 qq-bot（若尚未部署）

```bash
cd qq-bot
cp config.ecs.example.json config.json
nano config.json
chmod +x deploy-ecs.sh
./deploy-ecs.sh
```

### 配置 torn-toolbox-desktop（压价 + 公司，两个独立进程）

```bash
cd ../torn-toolbox-desktop
# 若已有旧版 config.json，会自动拆分为两份配置
node scripts/migrate-config.mjs   # 可选，deploy 时也会执行
cp config.undercut.example.json config.undercut.json
cp config.company.example.json config.company.json
nano config.undercut.json
nano config.company.json
chmod +x deploy-ecs.sh
./deploy-ecs.sh
```

- **压价助手** `torn-undercut` → `127.0.0.1:8790` → portal `/torn-toolbox/undercut/`
- **公司监听** `torn-company` → `127.0.0.1:8791` → portal `/torn-toolbox/company/`
- portal 卡片 **Torn 工具箱** → `/torn-toolbox/` 导航页（两个子入口）
- 两份配置的 `notify.qq.token` 均与 `qq-bot` 的 `server.notifyToken` 一致
- `adminToken` 需写入 portal 对应 hidden proxy 配置（见 `portal/config.ecs.example.json`）

### 配置 portal（:80 服务导航，推荐）

```bash
cd ../portal
cp config.ecs.example.json config.json
nano config.json   # 设置 auth.username / password / sessionSecret
chmod +x deploy-ecs.sh
./deploy-ecs.sh
```

`torn-toolbox` 的 `server.host` 保持 **127.0.0.1**（仅 portal 转发，不对外暴露 8790）。

在 `portal/config.json` 的 `services` 里可添加更多卡片（外链或 proxy）。

### 安全组

- **只需放行 80**（portal 统一入口）
- 8790 / 8791 / 6099 / 8787 均绑定 `127.0.0.1`，不应对外开放

访问：

```
http://123.56.235.12/
```

登录后点击 **Torn 工具箱**，再进入压价助手或公司监听。**无需记端口**。

---

## 三、日常更新（改代码后）

**本机：**

```powershell
git add .
git commit -m "描述你的改动"
git push
```

**ECS：**

```bash
cd /opt/xiansakana-torn-scripts
chmod +x scripts/ecs-update.sh   # 只需第一次
./scripts/ecs-update.sh
```

一条命令完成：`git pull` → `npm install` → `pm2 restart`。

按需只重启部分服务：

```bash
./scripts/ecs-update.sh --only undercut      # 仅压价助手
./scripts/ecs-update.sh --only company       # 仅公司监听
./scripts/ecs-update.sh --only qq-bot,napcat # 多个用逗号分隔
```

若 `git pull` 因 GitHub 超时失败，脚本会自动重试 3 次。

**GitHub 拉取经常超时？** 在本机（已 `git push`）执行：

```powershell
.\scripts\ecs-deploy-from-local.ps1
```

会把 `portal` / `qq-bot` / `torn-toolbox-desktop` / `scripts` 同步到 ECS 并重启，不依赖 ECS 访问 GitHub。

---

## 四、ECS 免密拉代码（SSH Deploy Key）

Deploy Key 文件在 ECS 上通常位于 `~/.ssh/github_deploy`，但**还需下面两步**，否则 `git pull` 仍会走 HTTPS 或 SSH 找不到密钥：

### 1. 配置 SSH 使用 Deploy Key（走 443 更稳）

```bash
cat > ~/.ssh/config <<'EOF'
Host github.com
    HostName ssh.github.com
    Port 443
    User git
    IdentityFile ~/.ssh/github_deploy
    IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

验证：

```bash
ssh -T git@github.com
# 应看到: Hi xiansakana/xiansakana-torn-scripts! You've successfully authenticated...
```

### 2. 把 remote 改成 SSH

```bash
cd /opt/xiansakana-torn-scripts
git remote set-url origin git@github.com:xiansakana/xiansakana-torn-scripts.git
git pull --ff-only
```

### 首次生成 Deploy Key（若还没有）

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub
```

把公钥加到 GitHub → 仓库 → Settings → Deploy keys（只读即可），然后执行上面 1、2 步。

---

## 五、若 ECS 上已有旧目录

之前用 scp 传到 `/opt/torn-toolbox-desktop` 的，可以备份 config 后改用 git：

```bash
cp /opt/torn-toolbox-desktop/config.json /tmp/torn-config.json
cp /opt/qq-bot/config.json /tmp/qq-config.json

rm -rf /opt/torn-toolbox-desktop /opt/qq-bot   # 确认 config 已备份再删

cd /opt
git clone https://github.com/xiansakana/xiansakana-torn-scripts.git
cp /tmp/qq-config.json xiansakana-torn-scripts/qq-bot/config.json
cp /tmp/torn-config.json xiansakana-torn-scripts/torn-toolbox-desktop/config.json

cd xiansakana-torn-scripts/qq-bot && ./deploy-ecs.sh
cd ../torn-toolbox-desktop && ./deploy-ecs.sh
```

---

## 六、GitHub 拉取超时（Connection timed out）

### 原因

阿里云 **国内地域** ECS 访问 `github.com:443` **时通时不通**，属于网络路由/防火墙问题，不是仓库或命令配错了。同一台机器有时 `curl https://github.com` 能通，`git pull` 却超时。

### 推荐方案（按优先级）

| 方案 | 做法 | 说明 |
|------|------|------|
| **A. 本机同步** | 本机 `git push` 后运行 `.\scripts\ecs-deploy-from-local.ps1` | 最稳，不依赖 ECS 连 GitHub |
| **B. 重试** | ECS 上 `./scripts/ecs-update.sh`（已内置 3 次重试） | 偶发超时可多试几次 |
| **C. SSH 拉取** | ECS 配置 Deploy Key，改用 `git@github.com:...` | 有时比 HTTPS 稳定 |
| **D. Gitee 镜像** | 本机 push 到 Gitee，ECS `git remote` 指向 Gitee | 国内最稳定，需维护双远程 |

### 方案 A：本机同步（推荐）

```powershell
cd "d:\data\OneDrive\torncity\脚本\xiansakana-torn-scripts"
git push
.\scripts\ecs-deploy-from-local.ps1
```

### 方案 C：ECS 改用 SSH（Deploy Key）

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub
# 添加到 GitHub → 仓库 → Settings → Deploy keys（Read-only）

cat >> ~/.ssh/config <<'EOF'
Host github.com
    HostName ssh.github.com
    Port 443
    User git
    IdentityFile ~/.ssh/github_deploy
EOF

cd /opt/xiansakana-torn-scripts
git remote set-url origin git@github.com:xiansakana/xiansakana-torn-scripts.git
git pull --ff-only
```

使用 `ssh.github.com:443` 可走 443 端口的 SSH，在部分网络环境下比 HTTPS 更稳。

### 方案 D：Gitee 镜像（可选）

1. 在 [Gitee](https://gitee.com) 导入 GitHub 仓库（或手动同步）
2. ECS 上：

```bash
cd /opt/xiansakana-torn-scripts
git remote set-url origin https://gitee.com/你的用户名/xiansakana-torn-scripts.git
git pull --ff-only
```

本机仍 push 到 GitHub；需要时再同步到 Gitee（或配置 Gitee 从 GitHub 镜像）。
