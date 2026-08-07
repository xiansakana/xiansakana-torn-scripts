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

### 配置 torn-toolbox-desktop

```bash
cd ../torn-toolbox-desktop
cp config.ecs.example.json config.json
nano config.json
chmod +x deploy-ecs.sh
./deploy-ecs.sh
```

`torn-toolbox-desktop` 的 `notify.qq.token` 必须与 `qq-bot` 的 `server.notifyToken` 一致。

### 安全组

- 放行 **8790**（配置页，建议限制来源 IP）
- **8787 不必**对公网开放

访问配置页：

```
http://123.56.235.12:8790/?token=你的adminToken
```

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

---

## 四、ECS 免密拉代码（可选）

HTTPS 每次 `git pull` 要输密码时，可在 ECS 配 SSH Deploy Key：

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub
```

把公钥加到 GitHub → 仓库 → Settings → Deploy keys（只读即可）。

然后改 remote：

```bash
cd /opt/xiansakana-torn-scripts
git remote set-url origin git@github.com:xiansakana/xiansakana-torn-scripts.git
```

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
