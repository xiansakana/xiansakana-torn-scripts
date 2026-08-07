#!/bin/bash
# 在 ECS 上更新代码并重启服务（仓库根目录的 scripts/ 下运行）
# 用法: ./scripts/ecs-update.sh [--skip-pull]
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SKIP_PULL=false
if [[ "${1:-}" == "--skip-pull" ]]; then
    SKIP_PULL=true
fi

git_pull_with_retry() {
    local attempt max=3 delay=5
    for attempt in $(seq 1 "$max"); do
        echo "==> git pull (尝试 $attempt/$max)"
        if git pull --ff-only; then
            return 0
        fi
        if [[ "$attempt" -lt "$max" ]]; then
            echo "git pull 失败，${delay}s 后重试..."
            sleep "$delay"
            delay=$((delay * 2))
        fi
    done
    echo ""
    echo "错误: 无法从 GitHub 拉取代码（国内网络访问 GitHub 443 不稳定）。"
    echo "可选方案:"
    echo "  1. 稍后再在 ECS 上重试: ./scripts/ecs-update.sh"
    echo "  2. 本机执行: scripts/ecs-deploy-from-local.ps1（跳过 ECS git pull）"
    echo "  3. 改用 SSH 拉取: git remote set-url origin git@github.com:xiansakana/xiansakana-torn-scripts.git"
    echo "     或使用 Gitee 镜像（见 DEPLOY-ECS.md）"
    return 1
}

if [[ "$SKIP_PULL" != true ]]; then
    git_pull_with_retry
else
    echo "==> 跳过 git pull（代码已由本机同步）"
fi

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
