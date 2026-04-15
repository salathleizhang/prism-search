import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Theme,
  loadTheme, applyTheme,
  THEME_KEY,
} from './types'
import {
  Category,
  Site,
  loadSites,
  loadCategories,
  STORAGE_KEY,
  CATEGORY_STORAGE_KEY,
  DEFAULT_SEARCH_KEY,
  DEFAULT_SITES,
  UNCATEGORIZED_CATEGORY_ID,
  loadDefaultSiteId,
} from './site-config'
import { IconGear, IconShirt, IconEye, IconEyeOff, IconGitHub } from './icons'
import { Locale, LOCALE_STORAGE_KEY, loadLocale, messages } from './i18n'
import SearchBar from './components/SearchBar'
import SiteGrid from './components/SiteGrid'
import SettingsModal from './components/SettingsModal'
import ThemeModal from './components/ThemeModal'

export default function App() {
  const [sites, setSites]             = useState<Site[]>(loadSites)
  const [categories, setCategories]   = useState<Category[]>(loadCategories)
  const [locale, setLocale]           = useState<Locale>(loadLocale)
  const [query, setQuery]             = useState('')
  const [shakeInput, setShakeInput]   = useState(false)
  const inputRef                      = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen]           = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [theme, setTheme]             = useState<Theme>(loadTheme)
  const [showSites, setShowSites]     = useState(true)
  const [defaultSiteId, setDefaultSiteId] = useState<string>(loadDefaultSiteId)

  const text = messages[locale]
  const defaultSiteName = useMemo(
    () => (sites.find(s => s.id === defaultSiteId && s.enabled) ?? sites.find(s => s.enabled))?.name ?? 'Google',
    [sites, defaultSiteId],
  )

  useEffect(() => { applyTheme(theme) }, [])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(sites)) }, [sites])
  useEffect(() => { localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories)) }, [categories])
  useEffect(() => { localStorage.setItem(LOCALE_STORAGE_KEY, locale) }, [locale])
  useEffect(() => { localStorage.setItem(DEFAULT_SEARCH_KEY, defaultSiteId) }, [defaultSiteId])

  const handleThemeChange = useCallback((t: Theme) => {
    setTheme(t)
    applyTheme(t)
    localStorage.setItem(THEME_KEY, JSON.stringify(t))
  }, [])

  const deleteSite = useCallback((id: string) => setSites(prev => prev.filter(s => s.id !== id)), [])
  const toggleSite = useCallback((id: string) => setSites(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)), [])
  const addSite    = useCallback((site: Site) => setSites(prev => [...prev, site]), [])
  const resetSites = useCallback(() => setSites(DEFAULT_SITES), [])
  const assignCategory = useCallback((siteId: string, categoryId: string) => {
    setSites(prev => prev.map(site => (
      site.id === siteId
        ? { ...site, categoryId }
        : site
    )))
  }, [])
  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
    setSites(prev => prev.map(s => s.categoryId === id ? { ...s, categoryId: UNCATEGORIZED_CATEGORY_ID } : s))
  }, [])

  const createCategory = useCallback((name: string) => {
    const trimmedName = name.trim()
    if (!trimmedName) return false

    let created = false

    setCategories(prev => {
      if (prev.some(category => category.name.toLowerCase() === trimmedName.toLowerCase())) {
        return prev
      }

      created = true
      return [
        ...prev,
        {
          id: `category-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: trimmedName,
        },
      ]
    })

    return created
  }, [])

  const openDefaultSearch = useCallback((q: string) => {
    const enabledSites = sites.filter(s => s.enabled)
    const site = enabledSites.find(s => s.id === defaultSiteId) ?? enabledSites[0]
    window.open(
      site
        ? `${site.searchUrl}${encodeURIComponent(q)}`
        : `https://www.google.com/search?q=${encodeURIComponent(q)}`,
      '_blank',
    )
  }, [sites, defaultSiteId])

  const handleSearch = useCallback((site: Site) => {
    if (!query.trim()) {
      setShakeInput(true)
      setTimeout(() => setShakeInput(false), 500)
      inputRef.current?.focus()
      return
    }
    window.open(`${site.searchUrl}${encodeURIComponent(query.trim())}`, '_blank')
  }, [query])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' || !query.trim()) return
    openDefaultSearch(query.trim())
  }, [query, openDefaultSearch])

  const handleSearchClick = useCallback(() => {
    if (!query.trim()) { inputRef.current?.focus(); return }
    openDefaultSearch(query.trim())
  }, [query, openDefaultSearch])

  const toggleLocale = useCallback(() => {
    setLocale(prev => (prev === 'zh-CN' ? 'en' : 'zh-CN'))
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 pointer-events-none"
        aria-label="Navigation"
      >
        <motion.a
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          href="https://github.com/salathleizhang/prism-search"
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto p-2 rounded-xl text-[#8e8e93] hover:text-[#3c3c43] hover:bg-[#e5e5ea] transition-colors duration-150"
          aria-label="GitHub"
          title="GitHub"
        >
          <IconGitHub />
        </motion.a>

        <div className="pointer-events-auto flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleLocale}
            className="h-9 min-w-[52px] px-3 rounded-xl text-[12px] font-semibold text-[#636366] hover:text-[#1c1c1e] hover:bg-[#e5e5ea] transition-colors duration-150"
            aria-label={text.lang.switchTo}
            title={text.lang.switchTo}
          >
            {text.lang.short}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSites(prev => !prev)}
            className="p-2 rounded-xl text-[#8e8e93] hover:text-[#3c3c43] hover:bg-[#e5e5ea] transition-colors duration-150"
            aria-label={showSites ? '隐藏网站' : '显示网站'}
            title={showSites ? '隐藏网站' : '显示网站'}
          >
            {showSites ? <IconEye /> : <IconEyeOff />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsThemeOpen(true)}
            className="p-2 rounded-xl text-[#8e8e93] hover:text-[#3c3c43] hover:bg-[#e5e5ea] transition-colors duration-150"
            aria-label={text.openTheme}
            title={text.openTheme}
          >
            <IconShirt />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="group p-2 rounded-xl text-[#8e8e93] hover:text-[#3c3c43] hover:bg-[#e5e5ea] transition-colors duration-150"
            aria-label={text.manageSites}
            title={text.manageSites}
          >
            <IconGear className="transition-transform duration-300 group-hover:rotate-45" />
          </motion.button>
        </div>
      </motion.nav>

      <div className="w-full max-w-5xl flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <h1
            className="text-5xl select-none font-brand-zh"
            style={{
              color: '#1c1c1e',
              letterSpacing: locale === 'zh-CN' ? '0.02em' : '-0.02em',
              fontWeight: 700,
              lineHeight: 1.08,
            }}
          >
            {text.appTitle}
          </h1>
          <p className="text-sm mt-2 tracking-[0.18em] select-none font-brand-en font-medium" style={{ color: '#8e8e93' }}>
            {text.appSubtitle}
          </p>
        </motion.div>

        <SearchBar
          locale={locale}
          query={query}
          onChange={setQuery}
          onKeyDown={handleKeyDown}
          onSearchClick={handleSearchClick}
          inputRef={inputRef}
          shakeInput={shakeInput}
        />

        {showSites && <SiteGrid locale={locale} sites={sites} categories={categories} query={query} onSearch={handleSearch} />}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-[11px] tracking-wide mt-8 select-none"
          style={{ color: '#aeaeb2' }}
        >
          {text.footerHint(defaultSiteName)}
        </motion.p>
      </div>

      <SettingsModal
        locale={locale}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        sites={sites}
        categories={categories}
        onDelete={deleteSite}
        onToggle={toggleSite}
        onAdd={addSite}
        onReset={resetSites}
        onReorder={setSites}
        onAssignCategory={assignCategory}
        onCreateCategory={createCategory}
        onDeleteCategory={deleteCategory}
        defaultSiteId={defaultSiteId}
        onDefaultSiteChange={setDefaultSiteId}
      />
      <ThemeModal
        locale={locale}
        isOpen={isThemeOpen}
        onOpenChange={setIsThemeOpen}
        theme={theme}
        onChange={handleThemeChange}
      />
    </div>
  )
}
