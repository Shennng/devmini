# DevMini 极简开发者工具箱

一个简洁的开发者工具箱，提供常用的开发辅助功能。

## 快速开始

```bash
cd /root/.openclaw/workspace/devmini
npm install
npm run dev
```

## 提交更改

项目已配置自动推送到 GitHub：

```bash
# 方式1: 使用辅助脚本
./git-push.sh "描述你的更改"

# 方式2: 手动操作
git add .
git commit -m "描述你的更改"
git push origin main
```

## 部署

- 本地开发: http://localhost:3000
- 生产环境: http://142.171.209.151:997 (nginx 代理)

## 技术栈

- Next.js 15
- Tailwind CSS v4
- Radix UI
