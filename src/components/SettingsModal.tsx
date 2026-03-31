import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react'
import { Category, Site, UNCATEGORIZED_CATEGORY_ID } from '../site-config'
import { Locale, getSiteLabel, messages } from '../i18n'
import { IconGrip, IconTrash, IconCheck } from '../icons'

const EMPTY_FORM = { name: '', domain: '', searchUrl: '', label: '' }

const INPUT_CLS = {
  inputWrapper: [
    'h-9 px-3',
    'bg-[#f2f2f7]',
    'border border-[#e5e5ea]',
    'hover:border-[#c7c7cc]',
    'focus-within:!border-[#007AFF]',
    'focus-within:bg-white',
    'rounded-[10px]',
    'transition-all duration-150',
    '!ring-0 shadow-none',
    'flex items-center',
  ].join(' '),
  innerWrapper: 'bg-transparent',
  input: 'bg-transparent appearance-none text-[13px] text-[#1c1c1e] placeholder:text-[#aeaeb2] outline-none focus:outline-none',
}

const selectClassName = [
  'h-8 min-w-[112px] px-2.5 rounded-[10px] text-[12px]',
  'bg-[#f2f2f7] border border-[#e5e5ea] text-[#3c3c43]',
  'focus:outline-none focus:border-[#007AFF]',
].join(' ')

interface SettingsModalProps {
  locale: Locale
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  sites: Site[]
  categories: Category[]
  onDelete: (id: string) => void
  onToggle: (id: string) => void
  onAdd: (site: Site) => void
  onReset: () => void
  onReorder: (newSites: Site[]) => void
  onAssignCategory: (siteId: string, categoryId: string) => void
  onCreateCategory: (name: string) => boolean
  onDeleteCategory: (id: string) => void
  defaultSiteId: string
  onDefaultSiteChange: (id: string) => void
}

const SettingsModal = React.memo(function SettingsModal({
  locale,
  isOpen,
  onOpenChange,
  sites,
  categories,
  onDelete,
  onToggle,
  onAdd,
  onReset,
  onReorder,
  onAssignCategory,
  onCreateCategory,
  onDeleteCategory,
  defaultSiteId,
  onDefaultSiteChange,
}: SettingsModalProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const dragIndex = React.useRef<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const text = messages[locale].settings

  const categoryOptions = [
    { id: UNCATEGORIZED_CATEGORY_ID, name: text.uncategorized },
    ...categories,
  ]

  const enabledSites = sites.filter(s => s.enabled)
  const resolvedDefaultSite = enabledSites.find(s => s.id === defaultSiteId) ?? enabledSites[0]
  const resolvedDefaultId = resolvedDefaultSite?.id ?? ''

  function setField(key: keyof typeof EMPTY_FORM, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
    setError('')
  }

  function handleAddCategory() {
    const trimmed = categoryName.trim()
    if (!trimmed) {
      setCategoryError(text.categoryRequired)
      return
    }

    if (!onCreateCategory(trimmed)) {
      setCategoryError(text.categoryExists)
      return
    }

    setCategoryName('')
    setCategoryError('')
  }

  function handleAdd() {
    if (!form.name.trim())      { setError(text.siteNameRequired); return }
    if (!form.domain.trim())    { setError(text.domainRequired); return }
    if (!form.searchUrl.trim()) { setError(text.searchUrlRequired); return }
    if (!form.searchUrl.startsWith('http')) { setError(text.searchUrlInvalid); return }

    onAdd({
      id: `${form.domain.replace(/\W+/g, '-')}-${Date.now()}`,
      name: form.name.trim(),
      label: form.label.trim() || form.name.trim().slice(0, 2),
      domain: form.domain.trim().toLowerCase(),
      searchUrl: form.searchUrl.trim(),
      enabled: true,
      categoryId: UNCATEGORIZED_CATEGORY_ID,
    })
    setForm(EMPTY_FORM)
    setError('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        wrapper: 'fixed inset-0 z-[9999] flex items-center justify-center',
        backdrop: 'fixed inset-0 z-[9998] bg-black/40',
        base: 'bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] max-w-[920px] w-full max-h-[80vh] my-auto z-[9999]',
        header: 'border-b border-[#f2f2f7] pt-4 pb-2.5 px-4 shrink-0',
        body: 'px-4 py-4 overflow-y-auto',
        closeButton: 'top-3 right-3 text-[#8e8e93] hover:text-[#3c3c43] hover:bg-[#f2f2f7] rounded-xl',
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-[#1c1c1e]">{messages[locale].manageSites}</span>
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: '#f2f2f7', color: '#8e8e93' }}
                >
                  {sites.length}
                </span>
              </div>
            </ModalHeader>

            <ModalBody>
              <div className="space-y-5">
                <section>
                  <p className="text-[10px] font-medium tracking-wide uppercase text-[#8e8e93] mb-2">
                    {text.currentSites}
                  </p>
                  <div
                    className="rounded-[14px] overflow-hidden max-h-[280px] overflow-y-auto"
                    style={{ border: '1px solid #e5e5ea' }}
                  >
                    {sites.length === 0 ? (
                      <div className="py-8 text-center text-[13px] text-[#aeaeb2]">
                        {text.noSites}
                      </div>
                    ) : (
                      <AnimatePresence initial={false}>
                        {sites.map((site, idx) => (
                          <motion.div
                            key={site.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            draggable
                            onDragStart={() => { dragIndex.current = idx }}
                            onDragOver={e => { e.preventDefault(); setDragOverIdx(idx) }}
                            onDrop={() => {
                              if (dragIndex.current === null || dragIndex.current === idx) return
                              const next = [...sites]
                              const [moved] = next.splice(dragIndex.current, 1)
                              next.splice(idx, 0, moved)
                              onReorder(next)
                              dragIndex.current = null
                              setDragOverIdx(null)
                            }}
                            onDragEnd={() => { dragIndex.current = null; setDragOverIdx(null) }}
                            className="group grid grid-cols-[20px_20px_minmax(0,1fr)_132px_36px_28px] items-center gap-3 px-4 py-2.5"
                            style={{
                              borderTop: idx > 0 ? '1px solid #f2f2f7' : 'none',
                              background: dragOverIdx === idx ? '#f0f6ff' : 'white',
                              transition: 'background 0.1s',
                            }}
                          >
                            <span
                              className="flex-shrink-0 text-[#c7c7cc] group-hover:text-[#aeaeb2] transition-colors duration-150 select-none"
                              style={{ cursor: 'grab' }}
                              title={text.sortSites}
                            >
                              <IconGrip />
                            </span>
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`}
                              alt={site.name}
                              width={20}
                              height={20}
                              className="rounded-md flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[13px] font-medium text-[#1c1c1e] truncate block">{site.name}</span>
                              <span className="text-[11px] text-[#aeaeb2] truncate block">{site.domain}</span>
                            </div>
                            <select
                              value={site.categoryId || UNCATEGORIZED_CATEGORY_ID}
                              onChange={e => onAssignCategory(site.id, e.target.value)}
                              className={selectClassName}
                              title={text.chooseCategory}
                            >
                              {categoryOptions.map(category => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => onDelete(site.id)}
                              className="flex-shrink-0 p-1.5 rounded-lg text-[#c7c7cc] hover:text-[#ff3b30] hover:bg-[#fff0ef] transition-all duration-150 opacity-0 group-hover:opacity-100"
                              title={text.delete}
                            >
                              <IconTrash />
                            </button>
                            <button
                              onClick={() => onToggle(site.id)}
                              className="flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all duration-150"
                              style={{
                                background: site.enabled ? '#007AFF' : 'transparent',
                                border: `1.5px solid ${site.enabled ? '#007AFF' : '#c7c7cc'}`,
                                color: 'white',
                              }}
                              title={site.enabled ? text.hide : text.show}
                            >
                              {site.enabled && <IconCheck />}
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </section>

                <section>
                  <p className="text-[10px] font-medium tracking-wide uppercase text-[#8e8e93] mb-2">
                    {text.addSite}
                  </p>
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder={text.siteName} value={form.name} onValueChange={v => setField('name', v)} size="sm" variant="bordered" classNames={INPUT_CLS} />
                      <Input placeholder={text.siteLabel} value={form.label} onValueChange={v => setField('label', v)} size="sm" variant="bordered" classNames={INPUT_CLS} />
                    </div>
                    <Input placeholder={text.domain} value={form.domain} onValueChange={v => setField('domain', v)} size="sm" variant="bordered" classNames={INPUT_CLS} />
                    <Input placeholder={text.searchUrl} value={form.searchUrl} onValueChange={v => setField('searchUrl', v)} size="sm" variant="bordered" classNames={INPUT_CLS} />

                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[12px] text-[#ff3b30]"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <p className="text-[11px] text-[#aeaeb2] leading-relaxed">{text.searchUrlHint}</p>

                    <button
                      onClick={handleAdd}
                      className="w-full h-9 rounded-[10px] text-[13px] font-semibold transition-all duration-150 active:scale-[0.98]"
                      style={{ background: '#007AFF', color: 'white' }}
                    >
                      {text.addSiteButton}
                    </button>
                  </div>
                </section>

                <section>
                  <p className="text-[10px] font-medium tracking-wide uppercase text-[#8e8e93] mb-2">
                    {text.categoryManager}
                  </p>
                  <div className="rounded-[16px] border border-[#e5e5ea] p-3 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {categoryOptions.map(category => (
                        <span
                          key={category.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium"
                          style={{
                            background: category.id === UNCATEGORIZED_CATEGORY_ID ? '#f2f2f7' : '#eef6ff',
                            color: category.id === UNCATEGORIZED_CATEGORY_ID ? '#636366' : '#007AFF',
                          }}
                        >
                          {category.name}
                          {category.id !== UNCATEGORIZED_CATEGORY_ID && (
                            <button
                              onClick={() => onDeleteCategory(category.id)}
                              title={text.delete}
                              className="ml-0.5 leading-none opacity-50 hover:opacity-100 transition-opacity"
                              style={{ fontSize: 14, lineHeight: 1 }}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <Input
                          placeholder={text.newCategoryName}
                          value={categoryName}
                          onValueChange={value => { setCategoryName(value); setCategoryError('') }}
                          size="sm"
                          variant="bordered"
                          classNames={INPUT_CLS}
                        />
                      </div>
                      <button
                        onClick={handleAddCategory}
                        className="h-9 min-w-[120px] px-4 rounded-[10px] text-[13px] font-semibold whitespace-nowrap shrink-0 transition-all duration-150 active:scale-[0.98]"
                        style={{ background: '#007AFF', color: 'white' }}
                      >
                        {text.createCategory}
                      </button>
                    </div>

                    <AnimatePresence>
                      {categoryError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[12px] text-[#ff3b30]"
                        >
                          {categoryError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </section>

                <section>
                  <p className="text-[10px] font-medium tracking-wide uppercase text-[#8e8e93] mb-2">
                    {text.defaultEngine}
                  </p>
                  <div className="flex items-center gap-2">
                    {resolvedDefaultSite && (
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${resolvedDefaultSite.domain}&sz=32`}
                        alt={resolvedDefaultSite.name}
                        width={16}
                        height={16}
                        className="rounded flex-shrink-0"
                      />
                    )}
                    <select
                      value={resolvedDefaultId}
                      onChange={e => onDefaultSiteChange(e.target.value)}
                      className={selectClassName}
                    >
                      {enabledSites.map(site => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                    </select>
                  </div>
                </section>

                <div className="pt-3 border-t border-[#f2f2f7] text-center">
                  <button
                    onClick={onReset}
                    className="text-[12px] text-[#aeaeb2] hover:text-[#8e8e93] transition-colors duration-150"
                  >
                    {text.resetSites}
                  </button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
})

export default SettingsModal
