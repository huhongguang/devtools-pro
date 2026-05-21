import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { Copy, Check, RefreshCw } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function uuidv1Like(): string {
  const now = Date.now()
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(6))).map(b => b.toString(16).padStart(2,'0')).join('')
  const ts = (BigInt(now) * 10000n + 122192928000000000n).toString(16).padStart(16, '0')
  return `${ts.slice(8,16)}-${ts.slice(4,8)}-1${ts.slice(1,4)}-${(0x80 | (parseInt(rand.slice(0,2), 16) & 0x3f)).toString(16)}${rand.slice(2,4)}-${rand.slice(4)}`
}

export default function UuidGenerator() {
  const { t } = useTranslation(['common', 'uuid-generator'])
  const [count, setCount] = useState(5)
  const [version, setVersion] = useState<'v4' | 'v1'>('v4')
  const [upper, setUpper] = useState(false)
  const [noDash, setNoDash] = useState(false)
  const [uuids, setUuids] = useState<string[]>([])
  const [copiedIdx, setCopiedIdx] = useState(-1)
  const [copiedAll, setCopiedAll] = useState(false)

  const generate = () => {
    const gen = () => version === 'v4' ? uuidv4() : uuidv1Like()
    let list = Array.from({ length: Math.min(count, 100) }, gen)
    if (noDash) list = list.map(u => u.replace(/-/g, ''))
    if (upper) list = list.map(u => u.toUpperCase())
    setUuids(list)
  }

  const handleCopy = async (v: string, i: number) => {
    await copyToClipboard(v)
    setCopiedIdx(i)
    setTimeout(() => setCopiedIdx(-1), 1500)
  }

  const handleCopyAll = async () => {
    await copyToClipboard(uuids.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1800)
  }

  return (
    <ToolLayout name={t('tools:uuid-generator.name', 'UUID Generator')} description={t('tools:uuid-generator.description', 'Generate RFC-compliant UUIDs (v4) in bulk')} category="generate" toolId="uuid-generator">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
        {/* Options */}
        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('uuid-generator:optionsLabel', 'Options')}</div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t('uuid-generator:versionLabel', 'Version')}:</span>
              {(['v4', 'v1'] as const).map(v => (
                <button key={v} className={`btn-ghost py-1 px-3 text-xs ${version === v ? 'border-primary/50 text-foreground' : ''}`} onClick={() => setVersion(v)}>
                  UUID {v}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t('uuid-generator:countLabel', 'Count')}:</span>
              {[1, 5, 10, 20, 50].map(n => (
                <button key={n} className={`btn-ghost py-1 px-2.5 text-xs ${count === n ? 'border-primary/50 text-foreground' : ''}`} onClick={() => setCount(n)}>{n}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              <input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} className="accent-primary" />
              {t('uuid-generator:uppercaseLabel', 'Uppercase')}
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              <input type="checkbox" checked={noDash} onChange={e => setNoDash(e.target.checked)} className="accent-primary" />
              {t('uuid-generator:noDashesLabel', 'No dashes')}
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn-primary" onClick={generate}><RefreshCw size={13} /> {t('common:actions.generate', 'Generate')}</button>
          {uuids.length > 0 && (
            <button className="btn-ghost" onClick={handleCopyAll}>
              {copiedAll ? <><Check size={13} className="status-success" /> {t('common:actions.copied', 'Copied')}</> : <><Copy size={13} /> {t('common:actions.copyAll', 'Copy all')}</>}
            </button>
          )}
        </div>

        {uuids.length > 0 && (
          <div className="tool-card overflow-hidden">
            <div className="px-4 py-2 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{t('uuid-generator:generatedCount', { count: uuids.length })}</span>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {uuids.map((u, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-border last:border-0 hover:bg-surface-elevated transition-colors group">
                  <code className="font-mono text-sm text-foreground">{u}</code>
                  <button
                    className="opacity-0 group-hover:opacity-100 btn-ghost py-1 px-2 text-xs transition-opacity"
                    onClick={() => handleCopy(u, i)}
                  >
                    {copiedIdx === i ? <Check size={11} className="status-success" /> : <Copy size={11} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
