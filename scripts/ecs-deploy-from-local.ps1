# 本机推送代码到 ECS（GitHub pull 超时时使用）
# 用法: 在本机仓库根目录执行
#   git push   # 先推到 GitHub 备份
#   .\scripts\ecs-deploy-from-local.ps1

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path $PSScriptRoot -Parent
$Key = Join-Path $env:USERPROFILE ".ssh\ecs_torn"
$Host = "root@123.56.235.12"
$RemoteRoot = "/opt/xiansakana-torn-scripts"

$Dirs = @("portal", "qq-bot", "torn-toolbox-desktop", "scripts")

Write-Host "==> 同步到 ECS: $Host`:$RemoteRoot"
foreach ($dir in $Dirs) {
    $localPath = Join-Path $RepoRoot $dir
    if (-not (Test-Path $localPath)) {
        Write-Warning "跳过不存在的目录: $dir"
        continue
    }
    Write-Host "  - $dir"
    scp -i $Key -r $localPath "${Host}:${RemoteRoot}/"
}

Write-Host "==> 重启服务（跳过 ECS git pull）"
ssh -i $Key $Host "cd $RemoteRoot && bash scripts/ecs-update.sh --skip-pull"

Write-Host "==> 部署完成"
