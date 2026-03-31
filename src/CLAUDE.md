# Prism Search 架构文档

## 项目结构

```
src/
├── App.tsx                       # 主应用组件：全局状态管理 + 搜索逻辑 + 路由
├── main.tsx                      # Vite 入口点
├── index.css                     # 全局样式（Apple Light 主题）
├── types.ts                      # Theme 类型、默认主题、applyTheme/loadTheme
├── site-config.ts                # Site/Category 类型、默认站点列表、localStorage CRUD
├── i18n.ts                       # 多语言文案（zh-CN / en），footerHint 为动态函数
├── icons.tsx                     # 可复用 SVG 图标组件库
└── components/
    ├── SearchBar.tsx             # 搜索输入框（受控 + shake 动画 + Enter badge）
    ├── SiteGrid.tsx              # 站点网格（分类展示 + 点击跳转）
    ├── SettingsModal.tsx         # 设置弹窗（站点 CRUD、分类管理、默认搜索引擎）
    └── ThemeModal.tsx            # 主题弹窗（纯色 / 渐变背景选择）
```

## 核心数据流

```
App.tsx（单一状态源）
  ├── sites[]          → SiteGrid, SettingsModal
  ├── categories[]     → SiteGrid, SettingsModal
  ├── query            → SearchBar, SiteGrid
  ├── defaultSiteId    → SettingsModal（选择），openDefaultSearch（执行）
  ├── locale           → 所有子组件
  └── theme            → ThemeModal（编辑），applyTheme（应用）
```

## 关键模块

### site-config.ts
- **职责**：站点与分类的类型定义、默认数据、localStorage 读写
- **关键导出**：`DEFAULT_SITES`、`loadSites()`、`loadCategories()`、`DEFAULT_SEARCH_KEY`、`loadDefaultSiteId()`
- **合并策略**：`loadSites()` 将用户数据与默认站点合并，保证默认站点始终存在

### i18n.ts
- **职责**：zh-CN / en 双语文案
- **注意**：`footerHint` 是 `(name: string) => string` 函数而非字符串，需传入当前默认引擎名调用

### App.tsx
- **职责**：全局状态 + 所有业务回调
- **搜索逻辑**：`openDefaultSearch` 优先使用 `defaultSiteId` 对应的启用站点，fallback 第一个启用站点，再 fallback Google URL
- **defaultSiteName**：由 `useMemo([sites, defaultSiteId])` 派生，用于 footer 提示

### SettingsModal.tsx
- **职责**：站点列表管理（CRUD、排序、分类）、分类管理（创建/删除）、默认搜索引擎选择
- **默认引擎 section**：底部，favicon + select，只显示 `enabled` 站点

## localStorage 键一览

| 键 | 内容 |
|----|------|
| `prism-search-sites` | 用户站点列表 |
| `prism-search-categories` | 用户分类列表 |
| `prism-search-theme` | 背景主题 |
| `prism-search-locale` | 界面语言 |
| `prism-search-default-site` | 默认搜索引擎 id |

## 设计原则

1. **单一真相源**：所有状态在 App.tsx，子组件无副作用
2. **受控组件**：SearchBar / SettingsModal 均为纯受控
3. **最小 fallback 链**：`defaultSiteId → enabledSites[0] → google.com`
4. **iOS 美学**：系统字体、明确交互反馈、微妙阴影和边框

## 技术栈

- **React 18**：函数组件 + Hooks
- **TypeScript**：全类型覆盖
- **Tailwind CSS**：原子化样式
- **Framer Motion**：动画
- **HeroUI**：Modal / Input 组件
- **Vite**：构建
