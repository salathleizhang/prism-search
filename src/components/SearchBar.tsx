import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Locale, messages } from '../i18n'

interface SearchBarProps {
  locale: Locale
  query: string
  onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onSearchClick: () => void
  inputRef: React.RefObject<HTMLInputElement>
  shakeInput: boolean
}

export default function SearchBar({ locale, query, onChange, onKeyDown, onSearchClick, inputRef, shakeInput }: SearchBarProps) {
  const text = messages[locale]

  return (
    <motion.div
      className="w-full mb-8"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="flex items-center gap-3"
        animate={shakeInput ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div
          className="flex-1 flex items-center gap-2 px-4 transition-all duration-200"
          style={{
            height: 54,
            background: 'white',
            border: '1.5px solid #e5e5ea',
            borderRadius: 14,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = '#007AFF'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,122,255,0.12)'
          }}
          onBlur={e => {
            if (e.currentTarget.contains(e.relatedTarget as Node)) return
            e.currentTarget.style.borderColor = '#e5e5ea'
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={e => {
            if (!e.currentTarget.matches(':focus-within')) e.currentTarget.style.borderColor = '#c7c7cc'
          }}
          onMouseLeave={e => {
            if (!e.currentTarget.matches(':focus-within')) e.currentTarget.style.borderColor = '#e5e5ea'
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={text.searchPlaceholder}
            value={query}
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            style={{
              flex: 1,
              height: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 15,
              color: '#1c1c1e',
              caretColor: '#007AFF',
            }}
            className="placeholder:text-[#aeaeb2]"
          />

          <AnimatePresence>
            {query.trim() && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                style={{
                  flexShrink: 0,
                  background: '#007AFF',
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 9px',
                  borderRadius: 7,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  cursor: 'default',
                }}
              >
                Enter
              </motion.span>
            )}
          </AnimatePresence>

          {query && (
            <button
              type="button"
              onClick={() => { onChange(''); inputRef.current?.focus() }}
              style={{
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                padding: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#aeaeb2',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.707 12.293a1 1 0 0 1-1.414 1.414L12 13.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L10.586 12 8.293 9.707a1 1 0 0 1 1.414-1.414L12 10.586l2.293-2.293a1 1 0 0 1 1.414 1.414L13.414 12l2.293 2.293z" />
              </svg>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onSearchClick}
          className="flex items-center justify-center rounded-[14px] transition-all duration-150 active:scale-95"
          style={{
            width: 54,
            height: 54,
            flexShrink: 0,
            background: '#007AFF',
            border: '1.5px solid #007AFF',
            boxShadow: '0 1px 4px rgba(0,122,255,0.25)',
            color: 'white',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0066dd'; e.currentTarget.style.borderColor = '#0066dd' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#007AFF'; e.currentTarget.style.borderColor = '#007AFF' }}
          aria-label={locale === 'zh-CN' ? '搜索' : 'Search'}
          title={locale === 'zh-CN' ? '搜索' : 'Search'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}
