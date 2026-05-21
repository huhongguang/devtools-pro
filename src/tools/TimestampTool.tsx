import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { RefreshCw } from 'lucide-react'

function fmt(d: Date, tz: string) {
  try {
    return d.toLocaleString('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  } catch { return 'Invalid timezone' }
}

const COMMON_TZ = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Shanghai', 'Asia/Tokyo', 'Australia/Sydney']

export default function TimestampTool() {
  const { t } = useTranslation(['common', 'timestamp'])
  const [now, setNow] = useState(Date.now())
  const [tsInput, setTsInput] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [result, setResult] = useState<{ ts: number; date: Date } | null>(null)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [running])

  const fromTs = () => {
    const v = parseInt(tsInput.trim())
    if (isNaN(v)) return
    const d = new Date(v < 1e10 ? v * 1000 : v)
    setResult({ ts: v < 1e10 ? v : Math.floor(v / 1000), date: d })
  }

  const fromDate = () => {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) return
    setResult({ ts: Math.floor(d.getTime() / 1000), date: d })
  }

  const nowSec = Math.floor(now / 1000)

  return (
    <ToolLayout name={t('tools:timestamp.name')} description={t('tools:timestamp.description')} category="convert" toolId="timestamp">
      <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
        {/* Live clock */}
        <div className="tool-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('timestamp:currentTime')}</span>
            <button className={`btn-ghost py-1 px-2 text-xs ${running ? 'text-green-400 border-green-400/30' : ''}`} onClick={() => setRunning(r => !r)}>
              <RefreshCw size={11} className={running ? 'animate-spin' : ''} /> {running ? t('timestamp:live') : t('timestamp:paused')}
            </button>
          </div>
          <div className="font-mono text-3xl font-bold text-gradient mb-1">{nowSec}</div>
          <div className="font-mono text-sm text-muted-foreground">{new Date(now).toISOString()}</div>
          <div className="text-xs text-muted-foreground mt-1">{new Date(now).toLocaleString()}</div>
          <button className="btn-ghost mt-3 text-xs" onClick={() => setTsInput(String(nowSec))}>
            {t('timestamp:useThis')}
          </button>
        </div>

        {/* Timestamp → Date */}
        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('timestamp:tsToDate')}</div>
          <div className="flex gap-2">
            <input
              className="code-area flex-1 px-3 py-2 font-mono text-sm"
              placeholder={t('timestamp:placeholderTs')}
              value={tsInput}
              onChange={e => setTsInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fromTs()}
            />
            <button className="btn-primary px-4" onClick={fromTs}>{t('common:actions.convert')}</button>
          </div>
          {result && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {COMMON_TZ.map(tz => (
                <div key={tz} className="flex justify-between items-center py-1.5 px-2 rounded bg-muted text-xs">
                  <span className="text-muted-foreground">{tz}</span>
                  <span className="font-mono text-foreground">{fmt(result.date, tz)}</span>
                </div>
              ))}
              <div className="col-span-2 flex items-center gap-2 py-1.5 px-2 rounded bg-muted text-xs">
                <span className="text-muted-foreground">{t('timestamp:iso8601')}</span>
                <span className="font-mono text-foreground ml-auto">{result.date.toISOString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Date → Timestamp */}
        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('timestamp:dateToTs')}</div>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              className="code-area flex-1 px-3 py-2 text-sm"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
            />
            <button className="btn-primary px-4" onClick={fromDate}>{t('common:actions.convert')}</button>
          </div>
          {result && dateInput && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="flex justify-between items-center py-1.5 px-2 rounded bg-muted text-xs">
                <span className="text-muted-foreground">{t('timestamp:unixSeconds')}</span>
                <span className="font-mono text-foreground">{result.ts}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-2 rounded bg-muted text-xs">
                <span className="text-muted-foreground">{t('timestamp:unixMs')}</span>
                <span className="font-mono text-foreground">{result.ts * 1000}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
