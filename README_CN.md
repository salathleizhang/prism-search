# 棱镜搜索 · Prism Search

一个简洁优雅的多引擎聚合搜索页，支持自定义站点、分类管理与主题切换。

[English](./README.md)

## 功能特性

- **多引擎搜索** — 内置 Google、GitHub、Bilibili、知乎、Perplexity、Claude 等 19 个常用站点，一键跳转
- **自定义站点** — 添加任意搜索引擎，支持启用/禁用、拖拽排序
- **分类管理** — 将站点分组整理，保持页面整洁
- **默认搜索引擎** — 设置 Enter 键触发的默认引擎
- **主题切换** — 纯色与渐变背景，多种预设色调
- **中英双语** — 支持 zh-CN / en 语言切换
- **本地持久化** — 所有配置存储在 localStorage，无需账号

## 技术栈

- **React 18** + **TypeScript**
- **Tailwind CSS** + **Framer Motion**
- **HeroUI** 组件库
- **Vite** 构建

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 添加自定义搜索引擎

搜索 URL 格式：`https://example.com/search?q=`（关键词会自动拼接到链接末尾）

## 字体许可

- **Source Han Sans SC（思源黑体）** — SIL Open Font License 1.1，© Adobe
- **Cormorant Garamond** — SIL Open Font License 1.1，© Christian Thalmann
- **ChillHuoFangSong（寒蝉火方宋）** — 请遵循字体原始授权协议

## License

[MIT](./LICENSE)
