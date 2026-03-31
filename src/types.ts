// ============================================================
// 主题类型 & 存储
// ============================================================
export interface Theme {
  type: 'solid' | 'gradient'
  color: string
  colorTo: string
}

export interface Category {
  id: string
  name: string
}

export const DEFAULT_THEME: Theme = { type: 'solid', color: '#f2f2f7', colorTo: '#c7d7f0' }
export const THEME_KEY = 'prism-search-theme'
export const CATEGORY_STORAGE_KEY = 'prism-search-categories'
export const UNCATEGORIZED_CATEGORY_ID = 'uncategorized'
export const UNCATEGORIZED_CATEGORY: Category = { id: UNCATEGORIZED_CATEGORY_ID, name: '未分类' }

export function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw) return { ...DEFAULT_THEME, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_THEME
}

export function applyTheme(theme: Theme) {
  document.body.style.background =
    theme.type === 'solid'
      ? theme.color
      : `linear-gradient(to bottom, ${theme.color}, ${theme.colorTo})`
}

// ============================================================
// 站点类型 & 存储
// ============================================================
export interface Site {
  id: string
  name: string
  label: string
  domain: string
  searchUrl: string
  enabled: boolean
  categoryId?: string
}

export const DEFAULT_SITES: Site[] = [
  { id: 'google',    name: 'Google',    label: '网页', domain: 'google.com',    searchUrl: 'https://www.google.com/search?q=',               enabled: true },
  { id: 'youtube',   name: 'YouTube',   label: '视频', domain: 'youtube.com',   searchUrl: 'https://www.youtube.com/results?search_query=',   enabled: true },
  { id: 'bilibili',  name: 'Bilibili',  label: 'B站',  domain: 'bilibili.com',  searchUrl: 'https://search.bilibili.com/all?keyword=',        enabled: true },
  { id: 'github',    name: 'GitHub',    label: '代码', domain: 'github.com',    searchUrl: 'https://github.com/search?q=',                   enabled: true },
  { id: 'reddit',    name: 'Reddit',    label: '论坛', domain: 'reddit.com',    searchUrl: 'https://www.reddit.com/search/?q=',               enabled: true },
  { id: 'zhihu',     name: '知乎',      label: '问答', domain: 'zhihu.com',     searchUrl: 'https://www.zhihu.com/search?q=',                 enabled: true },
  { id: 'baidu',     name: '百度',      label: '搜索', domain: 'baidu.com',     searchUrl: 'https://www.baidu.com/s?wd=',                     enabled: true },
  { id: 'x',         name: 'X',         label: '推文', domain: 'x.com',         searchUrl: 'https://x.com/search?q=',                         enabled: true },
  { id: 'bing',      name: 'Bing',      label: '微软', domain: 'bing.com',      searchUrl: 'https://www.bing.com/search?q=',                  enabled: true },
  { id: 'wikipedia', name: 'Wikipedia', label: '百科', domain: 'wikipedia.org', searchUrl: 'https://en.wikipedia.org/w/index.php?search=',    enabled: true },
  { id: 'xiaohongshu', name: '小红书',            label: '种草',   domain: 'xiaohongshu.com',      searchUrl: 'https://www.xiaohongshu.com/search_result?keyword=', enabled: true },
  { id: 'pinterest',   name: 'Pinterest',       label: '灵感',   domain: 'pinterest.com',        searchUrl: 'https://www.pinterest.com/search/pins/?q=',         enabled: true },
  { id: 'artstation',  name: 'ArtStation',      label: '作品',   domain: 'artstation.com',       searchUrl: 'https://www.artstation.com/search?sort_by=relevance&query=', enabled: true },
  { id: 'sketchfab',   name: 'Sketchfab',       label: '3D',    domain: 'sketchfab.com',        searchUrl: 'https://sketchfab.com/search?q=',                  enabled: true },
  { id: 'fab',         name: 'Fab',             label: '素材',   domain: 'fab.com',              searchUrl: 'https://www.fab.com/search?q=',                    enabled: true },
  { id: 'unity-assets', name: 'Unity',             label: 'Unity', domain: 'assetstore.unity.com', searchUrl: 'https://assetstore.unity.com/?q=',                 enabled: true },
]

export const STORAGE_KEY = 'prism-search-sites'

export function loadSites(): Site[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Site[]
      const normalizedParsed = parsed.map(site => ({ enabled: true, ...site }))
      const parsedById = new Map(normalizedParsed.map(site => [site.id, site]))
      const mergedDefaults = DEFAULT_SITES.map(site => parsedById.get(site.id) ?? site)
      const customSites = normalizedParsed.filter(
        site => !DEFAULT_SITES.some(defaultSite => defaultSite.id === site.id),
      )
      return [...mergedDefaults, ...customSites]
    }
  } catch { /* ignore */ }
  return DEFAULT_SITES
}
