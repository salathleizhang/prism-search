import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Category, Site, UNCATEGORIZED_CATEGORY_ID } from '../site-config'
import { Locale, getSiteLabel, messages } from '../i18n'

interface SiteGridProps {
  locale: Locale
  sites: Site[]
  categories: Category[]
  query: string
  onSearch: (site: Site) => void
}

export default function SiteGrid({ locale, sites, categories, query, onSearch }: SiteGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const isEmpty = !query.trim()
  const text = messages[locale].settings
  const enabledSites = sites.filter(site => site.enabled)
  const groupedSites = [
    {
      category: { id: UNCATEGORIZED_CATEGORY_ID, name: text.uncategorized },
      sites: enabledSites.filter(site => (site.categoryId || UNCATEGORIZED_CATEGORY_ID) === UNCATEGORIZED_CATEGORY_ID),
    },
    ...categories.map(category => ({
      category,
      sites: enabledSites.filter(site => site.categoryId === category.id),
    })),
  ].filter(group => group.sites.length > 0)

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col items-center gap-7"
    >
      <AnimatePresence mode="popLayout">
        {groupedSites.map((group, groupIdx) => {
          const sectionDelay = 0.45 + groupIdx * 0.22
          const cardsDelay = sectionDelay + (group.category.id !== UNCATEGORIZED_CATEGORY_ID ? 0.08 : 0)

          return (
          <motion.section
            key={group.category.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, delay: sectionDelay, ease: 'easeOut' }}
            className="w-full flex flex-col items-center gap-3"
          >
            {group.category.id !== UNCATEGORIZED_CATEGORY_ID && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: sectionDelay, ease: 'easeOut' }}
                className="text-center"
              >
                <h2 className="text-[14px] font-semibold tracking-[0.08em]" style={{ color: '#3c3c43' }}>
                  {group.category.name}
                </h2>
              </motion.div>
            )}

            <div className="flex flex-wrap justify-center gap-2.5 w-full">
              {group.sites.map((site, idx) => {
                const isHovered = hoveredId === site.id
                const localizedLabel = getSiteLabel(site.id, locale, site.label)
                return (
                  <motion.button
                    key={site.id}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: cardsDelay + idx * 0.06 }}
                    layout
                    exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                    onHoverStart={() => setHoveredId(site.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onSearch(site)}
                    className="w-[92px] h-[92px] flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-[14px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2"
                    style={{
                      border: `1px solid ${isHovered ? '#007AFF' : '#e5e5ea'}`,
                      boxShadow: isHovered ? '0 2px 12px rgba(0,122,255,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
                      backgroundColor: isHovered ? '#f0f7ff' : 'white',
                      opacity: isEmpty ? 0.5 : 1,
                      transition: 'border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease, opacity 0.2s ease',
                    }}
                  >
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`}
                      alt={site.name}
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                    <span
                      className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-medium leading-[1.2] text-center"
                      style={{ color: isHovered ? '#007AFF' : '#3c3c43' }}
                      title={site.name}
                    >
                      {site.name}
                    </span>
                    <span className="text-[9px] leading-none" style={{ color: '#aeaeb2' }}>
                      {localizedLabel}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </motion.section>
        )})}
      </AnimatePresence>
    </motion.div>
  )
}
