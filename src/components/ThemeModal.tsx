import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react'
import { Theme, DEFAULT_THEME } from '../types'
import { IconShirt } from '../icons'
import { Locale, messages } from '../i18n'

const SOLID_PRESETS = [
  '#f2f2f7', '#ffffff', '#1c1c1e', '#2c2c2e',
  '#e8f4fd', '#e8f5e9', '#fff3e0', '#fce4ec',
  '#ede7f6', '#e0f2f1', '#fafafa', '#f5f0e8',
]

const GRADIENT_PRESETS: Array<[string, string]> = [
  ['#f2f2f7', '#c7d7f0'],
  ['#e8f4fd', '#b3d9f7'],
  ['#e8f5e9', '#a5d6a7'],
  ['#fff3e0', '#ffcc80'],
  ['#fce4ec', '#f48fb1'],
  ['#ede7f6', '#b39ddb'],
  ['#1c1c2e', '#0d47a1'],
  ['#0d0d0d', '#1a1a2e'],
]

interface ThemeModalProps {
  locale: Locale
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  theme: Theme
  onChange: (t: Theme) => void
}

const ThemeModal = React.memo(function ThemeModal({ locale, isOpen, onOpenChange, theme, onChange }: ThemeModalProps) {
  const [local, setLocal] = useState<Theme>(theme)
  const text = messages[locale].theme

  useEffect(() => { if (isOpen) setLocal(theme) }, [isOpen, theme])

  function commit(patch: Partial<Theme>) {
    const next = { ...local, ...patch }
    setLocal(next)
    onChange(next)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="sm"
      classNames={{
        wrapper: 'fixed inset-0 z-[9999] flex items-center justify-center',
        backdrop: 'fixed inset-0 z-[9998] bg-black/40',
        base: 'bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] max-w-[400px] w-full my-auto z-[9999]',
        header: 'border-b border-[#f2f2f7] pt-4 pb-2.5 px-4 shrink-0',
        body: 'px-4 py-4',
        closeButton: 'top-3 right-3 text-[#8e8e93] hover:text-[#3c3c43] hover:bg-[#f2f2f7] rounded-xl',
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-2">
                <IconShirt />
                <span className="text-[15px] font-semibold text-[#1c1c1e]">{text.title}</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex rounded-[10px] overflow-hidden border border-[#e5e5ea] mb-4">
                {(['solid', 'gradient'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => commit({ type })}
                    className="flex-1 py-2 text-[13px] font-medium transition-all duration-150"
                    style={{
                      background: local.type === type ? '#007AFF' : 'transparent',
                      color: local.type === type ? 'white' : '#3c3c43',
                    }}
                  >
                    {type === 'solid' ? text.solid : text.gradient}
                  </button>
                ))}
              </div>

              {local.type === 'solid' ? (
                <>
                  <p className="text-[10px] font-medium tracking-wide uppercase text-[#8e8e93] mb-2">{text.presetColors}</p>
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {SOLID_PRESETS.map(c => (
                      <button
                        key={c}
                        onClick={() => commit({ color: c })}
                        title={c}
                        className="w-full aspect-square rounded-[10px] transition-all duration-150"
                        style={{
                          background: c,
                          border: local.color === c ? '2.5px solid #007AFF' : '1.5px solid #e5e5ea',
                          boxShadow: local.color === c ? '0 0 0 2px rgba(0,122,255,0.2)' : 'none',
                          transform: local.color === c ? 'scale(1.08)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-medium tracking-wide uppercase text-[#8e8e93] mb-2">{text.customColor}</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={local.color}
                      onChange={e => commit({ color: e.target.value })}
                      className="w-10 h-10 rounded-[10px] cursor-pointer border border-[#e5e5ea]"
                      style={{ padding: '2px' }}
                    />
                    <span className="text-[13px] font-mono text-[#3c3c43]">{local.color}</span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-medium tracking-wide uppercase text-[#8e8e93] mb-2">{text.presetGradients}</p>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {GRADIENT_PRESETS.map(([from, to]) => (
                      <button
                        key={`${from}-${to}`}
                        onClick={() => commit({ color: from, colorTo: to })}
                        title={`${from} -> ${to}`}
                        className="w-full aspect-[2/1] rounded-[10px] transition-all duration-150"
                        style={{
                          background: `linear-gradient(to bottom, ${from}, ${to})`,
                          border: local.color === from && local.colorTo === to ? '2.5px solid #007AFF' : '1.5px solid #e5e5ea',
                          boxShadow: local.color === from && local.colorTo === to ? '0 0 0 2px rgba(0,122,255,0.2)' : 'none',
                          transform: local.color === from && local.colorTo === to ? 'scale(1.06)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-medium tracking-wide uppercase text-[#8e8e93] mb-2">{text.customGradient}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <input
                        type="color"
                        value={local.color}
                        onChange={e => commit({ color: e.target.value })}
                        className="w-10 h-10 rounded-[10px] cursor-pointer border border-[#e5e5ea]"
                        style={{ padding: '2px' }}
                      />
                      <span className="text-[9px] text-[#8e8e93]">{text.top}</span>
                    </div>
                    <div
                      className="flex-1 h-10 rounded-[10px]"
                      style={{ background: `linear-gradient(to right, ${local.color}, ${local.colorTo})` }}
                    />
                    <div className="flex flex-col items-center gap-1">
                      <input
                        type="color"
                        value={local.colorTo}
                        onChange={e => commit({ colorTo: e.target.value })}
                        className="w-10 h-10 rounded-[10px] cursor-pointer border border-[#e5e5ea]"
                        style={{ padding: '2px' }}
                      />
                      <span className="text-[9px] text-[#8e8e93]">{text.bottom}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-4 pt-3 border-t border-[#f2f2f7] text-center">
                <button
                  onClick={() => commit(DEFAULT_THEME)}
                  className="text-[12px] text-[#aeaeb2] hover:text-[#8e8e93] transition-colors duration-150"
                >
                  {text.resetTheme}
                </button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
})

export default ThemeModal
