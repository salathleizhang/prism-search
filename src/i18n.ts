export type Locale = 'zh-CN' | 'en'

export const LOCALE_STORAGE_KEY = 'prism-search-locale'

export const locales: Locale[] = ['zh-CN', 'en']

export const siteLocaleMap: Record<string, { label: Record<Locale, string> }> = {
  google: { label: { 'zh-CN': '', en: '' } },
  youtube: { label: { 'zh-CN': '', en: '' } },
  bilibili: { label: { 'zh-CN': '', en: '' } },
  github: { label: { 'zh-CN': '', en: '' } },
  reddit: { label: { 'zh-CN': '', en: '' } },
  zhihu: { label: { 'zh-CN': '', en: '' } },
  baidu: { label: { 'zh-CN': '', en: '' } },
  x: { label: { 'zh-CN': '', en: '' } },
  bing: { label: { 'zh-CN': '', en: '' } },
  wikipedia: { label: { 'zh-CN': '', en: '' } },
  xiaohongshu: { label: { 'zh-CN': '', en: '' } },
  pinterest: { label: { 'zh-CN': '', en: '' } },
  artstation: { label: { 'zh-CN': '', en: '' } },
  sketchfab: { label: { 'zh-CN': '', en: '' } },
  fab: { label: { 'zh-CN': '', en: '' } },
  'unity-assets': { label: { 'zh-CN': '', en: '' } },
}

export const messages = {
  'zh-CN': {
    appTitle: '棱镜搜索',
    appSubtitle: 'Prism Search',
    footerHint: (name: string) => `点击图标直达 · Enter 使用 ${name}`,
    openTheme: '更换背景皮肤',
    manageSites: '管理搜索站点',
    searchPlaceholder: '搜索任何内容…',
    settings: {
      currentSites: '当前站点',
      noSites: '暂无站点，请在下方添加',
      sortSites: '拖动排序',
      chooseCategory: '选择分类',
      delete: '删除',
      hide: '点击隐藏',
      show: '点击显示',
      addSite: '添加站点',
      siteName: '站点名称',
      siteLabel: '标签，可选',
      domain: '域名，例如 example.com',
      searchUrl: '搜索链接，例如 https://example.com/search?q=',
      searchUrlHint: '搜索词会自动拼接到链接末尾，新站点默认归到未分类。',
      addSiteButton: '添加站点',
      categoryManager: '分类管理',
      newCategoryName: '新分类名称',
      createCategory: '创建分类',
      resetSites: '恢复默认站点列表',
      categoryRequired: '请输入分类名称',
      categoryExists: '分类已存在',
      siteNameRequired: '请填写站点名称',
      domainRequired: '请填写域名，例如 example.com',
      searchUrlRequired: '请填写搜索链接',
      searchUrlInvalid: '搜索链接需要以 http:// 或 https:// 开头',
      uncategorized: '未分类',
      defaultEngine: '默认搜索引擎',
    },
    theme: {
      title: '皮肤与背景',
      solid: '纯色',
      gradient: '上下渐变',
      presetColors: '预设颜色',
      customColor: '自定义颜色',
      presetGradients: '预设渐变',
      customGradient: '自定义渐变',
      top: '顶部',
      bottom: '底部',
      resetTheme: '恢复默认背景',
    },
    lang: {
      current: '中文',
      switchTo: '切换到英文',
      short: '中',
    },
  },
  en: {
    appTitle: 'Prism Search',
    appSubtitle: 'One query, every engine',
    footerHint: (name: string) => `Click an icon to search · Press Enter for ${name}`,
    openTheme: 'Change background theme',
    manageSites: 'Manage search sites',
    searchPlaceholder: 'Search anything…',
    settings: {
      currentSites: 'Current Sites',
      noSites: 'No sites yet. Add one below.',
      sortSites: 'Drag to reorder',
      chooseCategory: 'Choose category',
      delete: 'Delete',
      hide: 'Hide site',
      show: 'Show site',
      addSite: 'Add Site',
      siteName: 'Site name',
      siteLabel: 'Label (optional)',
      domain: 'Domain, e.g. example.com',
      searchUrl: 'Search URL, e.g. https://example.com/search?q=',
      searchUrlHint: 'The query is appended automatically. New sites start in Uncategorized.',
      addSiteButton: 'Add Site',
      categoryManager: 'Categories',
      newCategoryName: 'New category name',
      createCategory: 'Create Category',
      resetSites: 'Restore default site list',
      categoryRequired: 'Please enter a category name',
      categoryExists: 'That category already exists',
      siteNameRequired: 'Please enter a site name',
      domainRequired: 'Please enter a domain, e.g. example.com',
      searchUrlRequired: 'Please enter a search URL',
      searchUrlInvalid: 'Search URL must start with http:// or https://',
      uncategorized: 'Uncategorized',
      defaultEngine: 'Default Search Engine',
    },
    theme: {
      title: 'Theme & Background',
      solid: 'Solid',
      gradient: 'Gradient',
      presetColors: 'Preset Colors',
      customColor: 'Custom Color',
      presetGradients: 'Preset Gradients',
      customGradient: 'Custom Gradient',
      top: 'Top',
      bottom: 'Bottom',
      resetTheme: 'Reset default background',
    },
    lang: {
      current: 'English',
      switchTo: 'Switch to Chinese',
      short: 'EN',
    },
  },
} as const

export function loadLocale(): Locale {
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (raw === 'zh-CN' || raw === 'en') return raw
  } catch {
    /* ignore */
  }
  return 'en'
}

export function getSiteLabel(siteId: string, locale: Locale, fallback: string) {
  return siteLocaleMap[siteId]?.label[locale] ?? fallback
}
