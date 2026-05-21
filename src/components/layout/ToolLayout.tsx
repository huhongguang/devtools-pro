import { useState, useCallback } from 'react'
import { Copy, Check, Download, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { copyToClipboard, downloadText } from '@/lib/utils'
import { CATEGORIES, type Category } from '@/lib/tools'
import ShareBookmarkBar from './ShareBookmarkBar'

interface ToolLayoutProps {
  name: string
  description: string
  category: Category
  toolId: string
  children: React.ReactNode
}

export function ToolLayout({ name, description, category, toolId, children }: ToolLayoutProps) {
  const { t } = useTranslation('common')
  const cat = CATEGORIES[category]
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="border-b border-border px-6 py-4 flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-base font-semibold text-foreground">{name}</h1>
            <span
              className="badge-category text-[10px]"
              style={{ background: cat.bg, color: cat.color }}
            >
              {t(`tools:categories.${category}`, cat.label)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ShareBookmarkBar toolId={toolId} toolName={name} />
        <div className="flex-1 overflow-auto scrollbar-thin">
          <div className="max-w-7xl mx-auto w-full p-6 h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

interface IoAreaProps {
  label: string
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
  placeholder?: string
  rows?: number
  filename?: string
  actions?: React.ReactNode
  status?: { ok: boolean; msg: string } | null
  mono?: boolean
}

export function IoArea({ label, value, onChange, readOnly, placeholder, rows = 8, filename, actions, status, mono = true }: IoAreaProps) {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation('common')

  const handleCopy = useCallback(async () => {
    if (!value) return
    await copyToClipboard(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }, [value])

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
          {status && (
            <span className={`text-[11px] font-medium ${status.ok ? 'status-success' : 'status-error'}`}>
              {status.msg}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {actions}
          {filename && value && (
            <button className="btn-ghost py-1 px-2 text-[11px]" onClick={() => downloadText(value, filename)}>
              <Download size={11} /> {t('actions.save')}
            </button>
          )}
          <button className="btn-ghost py-1 px-2 text-[11px]" onClick={handleCopy} disabled={!value}>
            {copied
              ? <><Check size={11} className="status-success" /> {t('actions.copied')}</>
              : <><Copy size={11} /> {t('actions.copy')}</>
            }
          </button>
        </div>
      </div>
      <textarea
        className={`code-area w-full p-3 ${mono ? 'font-mono text-[12.5px]' : 'text-sm'}`}
        style={{ minHeight: `${rows * 1.65 * 13 + 24}px` }}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  )
}

interface ActionBarProps {
  onProcess: () => void
  onClear?: () => void
  onSwap?: () => void
  processLabel?: string
  extra?: React.ReactNode
}

export function ActionBar({ onProcess, onClear, onSwap, processLabel, extra }: ActionBarProps) {
  const { t } = useTranslation('common')
  return (
    <div className="flex items-center gap-2 py-2">
      <button className="btn-primary" onClick={onProcess}>{processLabel ?? t('actions.process')}</button>
      {onSwap && (
        <button className="btn-ghost" onClick={onSwap}>
          <RotateCcw size={13} /> {t('actions.swap')}
        </button>
      )}
      {onClear && (
        <button className="btn-ghost" onClick={onClear}>
          <XIcon size={13} /> {t('actions.clear')}
        </button>
      )}
      {extra}
    </div>
  )
}

function XIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
