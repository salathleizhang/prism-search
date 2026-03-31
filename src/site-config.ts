export interface Category {
  id: string
  name: string
}

export interface Site {
  id: string
  name: string
  label: string
  domain: string
  searchUrl: string
  enabled: boolean
  categoryId: string
}

export const STORAGE_KEY = 'prism-search-sites'
export const CATEGORY_STORAGE_KEY = 'prism-search-categories'
export const UNCATEGORIZED_CATEGORY_ID = 'uncategorized'

export const UNCATEGORIZED_CATEGORY: Category = {
  id: UNCATEGORIZED_CATEGORY_ID,
  name: '未分类',
}

export const DEFAULT_SITES: Site[] = [
  { id: 'google', name: 'Google', label: '', domain: 'google.com', searchUrl: 'https://www.google.com/search?q=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'youtube', name: 'YouTube', label: '', domain: 'youtube.com', searchUrl: 'https://www.youtube.com/results?search_query=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'bilibili', name: 'Bilibili', label: '', domain: 'bilibili.com', searchUrl: 'https://search.bilibili.com/all?keyword=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'github', name: 'GitHub', label: '', domain: 'github.com', searchUrl: 'https://github.com/search?q=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'reddit', name: 'Reddit', label: '', domain: 'reddit.com', searchUrl: 'https://www.reddit.com/search/?q=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'zhihu', name: '知乎', label: '', domain: 'zhihu.com', searchUrl: 'https://www.zhihu.com/search?q=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'baidu', name: '百度', label: '', domain: 'baidu.com', searchUrl: 'https://www.baidu.com/s?wd=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'x', name: 'X', label: '', domain: 'x.com', searchUrl: 'https://x.com/search?q=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'bing', name: 'Bing', label: '', domain: 'bing.com', searchUrl: 'https://www.bing.com/search?q=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'wikipedia', name: 'Wikipedia', label: '', domain: 'wikipedia.org', searchUrl: 'https://en.wikipedia.org/w/index.php?search=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'xiaohongshu', name: '小红书', label: '', domain: 'xiaohongshu.com', searchUrl: 'https://www.xiaohongshu.com/search_result?keyword=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'pinterest', name: 'Pinterest', label: '', domain: 'pinterest.com', searchUrl: 'https://www.pinterest.com/search/pins/?q=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'artstation', name: 'ArtStation', label: '', domain: 'artstation.com', searchUrl: 'https://www.artstation.com/search?sort_by=relevance&query=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'sketchfab', name: 'Sketchfab', label: '', domain: 'sketchfab.com', searchUrl: 'https://sketchfab.com/search?q=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'fab', name: 'Fab', label: '', domain: 'fab.com', searchUrl: 'https://www.fab.com/search?q=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
  { id: 'unity-assets', name: 'Unity', label: '', domain: 'assetstore.unity.com', searchUrl: 'https://assetstore.unity.com/?q=', enabled: true, categoryId: UNCATEGORIZED_CATEGORY_ID },
]

function normalizeSite(site: Partial<Site>, fallback?: Site): Site {
  const normalizedName =
    site.id === 'unity-assets'
      ? 'Unity'
      : (site.name ?? fallback?.name ?? '')

  return {
    id: site.id ?? fallback?.id ?? `site-${Date.now()}`,
    name: normalizedName,
    label: site.label ?? fallback?.label ?? '',
    domain: site.domain ?? fallback?.domain ?? '',
    searchUrl: site.searchUrl ?? fallback?.searchUrl ?? '',
    enabled: site.enabled ?? fallback?.enabled ?? true,
    categoryId: site.categoryId ?? fallback?.categoryId ?? UNCATEGORIZED_CATEGORY_ID,
  }
}

export function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORY_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Category[]
      return parsed.filter(category => category.id !== UNCATEGORIZED_CATEGORY_ID)
    }
  } catch {
    /* ignore */
  }

  return []
}

export function loadSites(): Site[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Site>[]
      const normalizedParsed = parsed.map(site => normalizeSite(site))
      const parsedById = new Map(normalizedParsed.map(site => [site.id, site]))
      const mergedDefaults = DEFAULT_SITES.map(site => {
        const parsedSite = parsedById.get(site.id)
        if (!parsedSite) return site

        return normalizeSite({ ...parsedSite, label: '' }, site)
      })
      const customSites = normalizedParsed.filter(
        site => !DEFAULT_SITES.some(defaultSite => defaultSite.id === site.id),
      )

      return [...mergedDefaults, ...customSites]
    }
  } catch {
    /* ignore */
  }

  return DEFAULT_SITES
}

export const DEFAULT_SEARCH_KEY = 'prism-search-default-site'

export function loadDefaultSiteId(): string {
  return localStorage.getItem(DEFAULT_SEARCH_KEY) ?? 'google'
}
