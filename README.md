# DevMini 🚀

<div align="center">

**极简、极速、纯前端的开发者工具箱**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

*100% 纯前端 | 数据不上传服务器 | PWA 支持*

</div>

---

## ✨ 特性

- ⚡ **极速体验** - 首屏加载 < 0.8s，无后端依赖
- 🔒 **隐私安全** - 所有处理在浏览器本地完成，数据零上传
- 📱 **PWA 支持** - 可安装到桌面/手机，离线使用
- 🎨 **精美 UI** - 深色/浅色主题无缝切换，响应式设计
- ⌨️ **快捷操作** - 支持命令菜单（Cmd+K）快速访问工具

## 🛠️ 工具箱

| 分类 | 工具 | 说明 |
|------|------|------|
| **数据格式** | [JSON 格式化](/app/json-format) | 格式化、压缩、验证、修复、TS类型生成 |
| | [CSV-JSON 互转](/app/csv-json) | CSV 与 JSON 格式相互转换 |
| | [YAML-JSON 转换](/app/yaml-json) | YAML 与 JSON 格式相互转换 |
| **编码转换** | [Base64 编码](/app/base64) | 文本/文件的 Base64 编码与解码 |
| | [URL 编码](/app/url-encode) | URL 组件编码与解码，参数解析 |
| | [进制转换](/app/base-convert) | 2/8/10/16 进制整数互转 |
| **加密哈希** | [哈希生成](/app/hash) | MD5、SHA-256、SHA-512 等常用算法 |
| | [JWT 解码](/app/jwt-decode) | 在线解析 JWT Token 载荷 |
| **时间日期** | [时间戳转换](/app/timestamp) | Unix 时间戳 ↔ 人类可读时间 |
| **开发辅助** | [Cron 表达式解析](/app/cron-parser) | 可视化解析 Cron 表达式 |
| | [正则表达式测试](/app/regex) | 正则匹配、测试、代码生成 |
| | [颜色转换](/app/color) | HEX/RGB/HSL/HSV 颜色互转 |
| | [UUID 生成](/app/uuid) | 批量生成 UUID v1/v4/v5 |

## 🧩 技术栈

- **框架**: [Next.js 15](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **组件**: [shadcn/ui](https://ui.shadcn.com/) 风格组件
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **图标**: [Lucide React](https://lucide.dev/)
- **测试**: [Vitest](https://vitest.dev/) + React Testing Library
- **主题**: [next-themes](https://github.com/pacocoursey/next-themes)

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm / yarn / pnpm

### 安装运行

```bash
# 克隆仓库
git clone https://github.com/Shennng/devmini.git
cd devmini

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 构建部署

```bash
# 生产构建
npm run build

# 启动生产服务器
npm start
```

## 📦 部署方式

### Vercel（推荐）

```bash
npm i -g vercel
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 传统服务器

```bash
npm run build
# 使用 PM2 或 systemd 管理进程
```

## �盘 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd/Ctrl + K` | 打开命令菜单 |
| `Cmd/Ctrl + S` | 保存（工具页面） |
| `Cmd/Ctrl + D` | 复制结果 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-tool`)
3. 提交更改 (`git commit -m 'feat: 添加新工具'`)
4. 推送到分支 (`git push origin feature/amazing-tool`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

<div align="center">

**Made with ❤️ by [Shennng](https://github.com/Shennng)**

*如果这个项目对你有帮助，欢迎 Star ⭐*

</div>
