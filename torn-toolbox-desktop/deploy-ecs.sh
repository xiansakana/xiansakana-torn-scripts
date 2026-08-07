#!/bin/bash
# torn-toolbox-desktop 阿里云 ECS 部署（压价/公司监听 Web 配置页，默认 :8790）
set -e

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

echo "==> 检查 Node.js..."
if ! command -v node >/dev/null 2>&1; then
    echo "安装 Node.js 20..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    yum install -y nodejs || apt-get install -y nodejs
fi
node -v
npm -v

echo "==> 安装依赖..."
npm install --production

echo "==> 安装 pm2..."
npm install -g pm2

if [ ! -f config.json ]; then
    cp config.ecs.example.json config.json
    echo "已创建 config.json，请编辑后重新运行本脚本"
    echo "  nano config.json"
    echo "必改项:"
    echo "  - tornApiKey"
    echo "  - server.adminToken（访问配置页的密码）"
    echo "  - notify.qq.token（与 /opt/qq-bot 的 notifyToken 一致）"
    exit 1
fi

if grep -q '"host": "127.0.0.1"' config.json; then
    echo "提示: server.host 为 127.0.0.1，仅本机/portal(:80) 可访问（推荐）"
fi

echo "==> 启动 torn-toolbox-desktop..."
pm2 delete torn-toolbox 2>/dev/null || true
pm2 delete torn-desktop 2>/dev/null || true
pm2 start src/server.js --name torn-toolbox
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo "==> 本机健康检查..."
sleep 1
curl -sf -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:8790/ || true
echo "==> 监听地址（推荐 127.0.0.1:8790，由 portal :80 对外）"
ss -tlnp | grep 8790 || netstat -tlnp 2>/dev/null | grep 8790 || true

PUBLIC_IP="$(curl -s --max-time 3 ifconfig.me 2>/dev/null || echo '你的公网IP')"
echo ""
echo "部署完成。"
echo "1. 推荐通过 portal 访问: http://${PUBLIC_IP}/ → Torn 压价助手"
echo "2. 若未部署 portal，可安全组放行 8790 直连（不推荐）"
echo "3. QQ 通知走本机 qq-bot (127.0.0.1:8787)，无需对外开放 8787"
