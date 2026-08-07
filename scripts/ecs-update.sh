#!/bin/bash
# 在 ECS 上更新代码并重启服务（仓库根目录的 scripts/ 下运行）
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> git pull"
git pull --ff-only

echo "==> qq-bot"
cd "$ROOT/qq-bot"
npm install --production
if pm2 describe qq-bot >/dev/null 2>&1; then
    pm2 restart qq-bot
else
    echo "qq-bot 未运行，请先配置 config.json 并执行 ./deploy-ecs.sh"
fi

echo "==> torn-toolbox-desktop"
cd "$ROOT/torn-toolbox-desktop"
npm install --production
if pm2 describe torn-toolbox >/dev/null 2>&1; then
    pm2 restart torn-toolbox
else
    echo "torn-toolbox 未运行，请先配置 config.json 并执行 ./deploy-ecs.sh"
fi

echo "==> portal"
cd "$ROOT/portal"
if pm2 describe portal >/dev/null 2>&1; then
    pm2 restart portal
else
    echo "portal 未运行，请先配置 config.json 并执行 ./deploy-ecs.sh"
fi

pm2 save
echo "==> 更新完成"
pm2 status
