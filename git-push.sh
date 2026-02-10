#!/bin/bash
# DevMini 自动提交脚本

cd /root/.openclaw/workspace/devmini

if [ -z "$1" ]; then
    echo "用法: ./git-push.sh '提交描述'"
    exit 1
fi

# 添加所有更改
git add .

# 提交
git commit -m "$1"

# 推送到 GitHub
GIT_SSH_COMMAND="ssh -i ~/.ssh/github_new" git push origin main

echo "✅ 已推送到 GitHub"
