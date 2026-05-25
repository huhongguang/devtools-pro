import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { RefreshCw, Globe, Plus } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'
import UnitToggle from './timestamp/UnitToggle'
import CalendarPicker from './timestamp/CalendarPicker'
import { useTimezone } from './timestamp/useTimezone'

let nextId = 1
const genId = () => `row-${nextId++}`

interface TsRow {
  id: string
  input: string
  result: Date | null
}

interface DateRow {
  id: string
  input: string
  result: { sec: number; ms: number } | null
  calendarOpen: boolean
  dateOnly: string // YYYY-MM-DD for calendar
}

export default function TimestampTool() {
  const { t } = useTranslation(['common', 'timestamp'])
  const { tz, label } = useTimezone()

  // Current time
  const [now, setNow] = useState(Date.now())
  const [running, setRunning] = useState(true)
  const [currentUnit, setCurrentUnit] = useState<'s' | 'ms'>('s')

  // TS → Date rows
  const [tsUnit, setTsUnit] = useState<'s' | 'ms'>('s')
  const [tsRows, setTsRows] = useState<TsRow[]>([
    { id: genId(), input: '', result: null },
    { id: genId(), input: '', result: null },
    { id: genId(), input: '', result: null },
  ])

  // Date → TS rows
  const [dateUnit, setDateUnit] = useState<'s' | 'ms'>('s')
  const [dateRows, setDateRows] = useState<DateRow[]>([
    { id: genId(), input: '', result: null, calendarOpen: false, dateOnly: '' },
  ])

  // Live clock
  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [running])

  const nowSec = Math.floor(now / 1000)
  const displayNow = currentUnit === 's' ? nowSec : now

  // Copy handler
  const handleCopy = useCallback(async (text: string) => {
    await copyToClipboard(text)
  }, [])

  // TS → Date conversion
  const convertTsRow = (id: string) => {
    setTsRows(rows => rows.map(row => {
      if (row.id !== id) return row
      const v = parseInt(row.input.trim())
      if (isNaN(v) || row.input.trim() === '') return { ...row, result: null }
      const ms = tsUnit === 'ms' ? v : v * 1000
      const d = new Date(ms)
      if (isNaN(d.getTime())) return { ...row, result: null }
      return { ...row, result: d }
    }))
  }

  // Date → TS conversion
  const convertDateRow = (id: string) => {
    setDateRows(rows => rows.map(row => {
      if (row.id !== id) return row
      const dateStr = row.dateOnly
        ? `${row.dateOnly}T${row.input.includes('T') ? row.input.split('T')[1] : '00:00'}`
        : row.input
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return { ...row, result: null }
      return { ...row, result: { sec: Math.floor(d.getTime() / 1000), ms: d.getTime() } }
    }))
  }

  // Use current timestamp
  const useCurrentTs = () => {
    const val = currentUnit === 's' ? String(nowSec) : String(now)
    setTsRows(rows => rows.map((row, i) => i === 0 ? { ...row, input: val, result: new Date(tsUnit === 'ms' ? Number(val) : Number(val) * 1000) } : row))
  }

  // Add/remove TS rows
  const addTsRow = () => {
    if (tsRows.length >= 10) return
    setTsRows(rows => [...rows, { id: genId(), input: '', result: null }])
  }
  const removeTsRow = (id: string) => {
    if (tsRows.length <= 3) return
    setTsRows(rows => rows.filter(r => r.id !== id))
  }

  // Add/remove Date rows
  const addDateRow = () => {
    if (dateRows.length >= 10) return
    setDateRows(rows => [...rows, { id: genId(), input: '', result: null, calendarOpen: false, dateOnly: '' }])
  }
  const removeDateRow = (id: string) => {
    if (dateRows.length <= 1) return
    setDateRows(rows => rows.filter(r => r.id !== id))
  }

  // Calendar
  const openCalendar = (id: string) => {
    setDateRows(rows => rows.map(r => r.id === id ? { ...r, calendarOpen: true } : { ...r, calendarOpen: false }))
  }
  const closeCalendar = (id: string) => {
    setDateRows(rows => rows.map(r => r.id === id ? { ...r, calendarOpen: false } : r))
  }
  const selectCalendarDate = (id: string, dateStr: string) => {
    setDateRows(rows => rows.map(r => {
      if (r.id !== id) return r
      const timePart = r.input.includes('T') ? r.input.split('T')[1] : '00:00'
      return { ...r, dateOnly: dateStr, input: `${dateStr}T${timePart}`, calendarOpen: false }
    }))
    convertDateRow(id)
  }

  return (
    <ToolLayout name={t('tools:timestamp.name')} description={t('tools:timestamp.description')} category="convert" toolId="timestamp">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">

        {/* Current Time + TS→Date side by side */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Current Time */}
          <div className="tool-card p-4 md:w-[320px] flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('timestamp:currentTime')}</span>
              <div className="flex items-center gap-2">
                <UnitToggle value={currentUnit} onChange={setCurrentUnit} />
                <button className={`btn-ghost py-1 px-2 text-xs ${running ? 'text-green-400 border-green-400/30' : ''}`} onClick={() => setRunning(r => !r)}>
                  <RefreshCw size={11} className={running ? 'animate-spin' : ''} />
                  {running ? t('timestamp:live') : t('timestamp:paused')}
                </button>
              </div>
            </div>
            <div className="font-mono text-2xl font-bold text-gradient mb-1">
              {displayNow.toLocaleString()}
            </div>
            <div className="font-mono text-sm text-muted-foreground mb-2">{new Date(now).toISOString()}</div>
            <div className="flex items-center gap-1.5 text-sm mb-1">
              <Globe size={14} className="text-primary" />
              <span className="font-semibold text-foreground">{tz}</span>
              <span className="text-muted-foreground">({label})</span>
            </div>
            <div className="text-sm text-muted-foreground font-mono">{new Date(now).toLocaleString()}</div>
            <button className="btn-ghost mt-3 text-xs w-full" onClick={useCurrentTs}>
              {t('timestamp:useThis')}
            </button>
          </div>

          {/* Timestamp → Date */}
          <div className="tool-card p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('timestamp:tsToDate')}</span>
              <UnitToggle value={tsUnit} onChange={setTsUnit} />
            </div>
            <div className="flex flex-col gap-3">
              {tsRows.map((row, index) => (
                <div key={row.id} className="border border-border rounded-lg p-3">
                  <div className="flex gap-2 items-center">
                    <input
                      className="code-area flex-1 px-3 py-2 font-mono text-sm"
                      placeholder={tsUnit === 's' ? t('timestamp:placeholderTs') : t('timestamp:placeholderTsMs')}
                      value={row.input}
                      onChange={e => setTsRows(rows => rows.map(r => r.id === row.id ? { ...r, input: e.target.value } : r))}
                      onKeyDown={e => e.key === 'Enter' && convertTsRow(row.id)}
                    />
                    <button className="btn-primary py-1.5 px-3 text-xs" onClick={() => convertTsRow(row.id)}>
                      {t('common:actions.convert', 'Convert')}
                    </button>
                    {row.result && (
                      <button className="btn-ghost py-1.5 px-2 text-xs" onClick={() => handleCopy(row.result!.toISOString())}>
                        {t('common:actions.copy', 'Copy')}
                      </button>
                    )}
                    {index >= 3 && (
                      <button className="btn-ghost py-1.5 px-1 text-xs hover:text-destructive" onClick={() => removeTsRow(row.id)}>×</button>
                    )}
                  </div>
                  {row.result && (
                    <div className="mt-2 flex flex-col gap-1 text-xs font-mono">
                      <div className="flex justify-between px-2 py-1 rounded bg-muted">
                        <span className="text-muted-foreground">{t('timestamp:utcTime')}</span>
                        <span className="text-foreground">{row.result.toUTCString()}</span>
                      </div>
                      <div className="flex justify-between px-2 py-1 rounded bg-muted">
                        <span className="text-muted-foreground">{t('timestamp:localTime')}</span>
                        <span className="text-foreground">{row.result.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {tsRows.length < 10 && (
              <button className="btn-ghost mt-3 text-xs w-full" onClick={addTsRow}>
                <Plus size={11} /> {t('timestamp:addTimestamp', 'Add Timestamp')}
              </button>
            )}
          </div>
        </div>

        {/* Date → Timestamp */}
        <div className="tool-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('timestamp:dateToTs')}</span>
            <UnitToggle value={dateUnit} onChange={setDateUnit} />
          </div>
          <div className="flex flex-col gap-3">
            {dateRows.map((row, index) => (
              <div key={row.id} className="border border-border rounded-lg p-3 relative">
                <div className="flex gap-2 items-center">
                  <button
                    className={`btn-ghost py-1.5 px-1 text-xs ${row.calendarOpen ? 'border-primary/50 text-primary' : ''}`}
                    onClick={() => openCalendar(row.id)}
                  >
                    📅
                  </button>
                  <input
                    type="datetime-local"
                    className="code-area flex-1 px-3 py-2 text-sm"
                    value={row.input}
                    onChange={e => {
                      setDateRows(rows => rows.map(r => r.id === row.id ? { ...r, input: e.target.value } : r))
                    }}
                  />
                  <button className="btn-primary py-1.5 px-3 text-xs" onClick={() => convertDateRow(row.id)}>
                    {t('common:actions.convert', 'Convert')}
                  </button>
                  {row.result && (
                    <button className="btn-ghost py-1.5 px-2 text-xs" onClick={() => handleCopy(dateUnit === 's' ? String(row.result!.sec) : String(row.result!.ms))}>
                      {t('common:actions.copy', 'Copy')}
                    </button>
                  )}
                  {index >= 1 && (
                    <button className="btn-ghost py-1.5 px-1 text-xs hover:text-destructive" onClick={() => removeDateRow(row.id)}>×</button>
                  )}
                </div>
                {row.result && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="flex justify-between px-2 py-1 rounded bg-muted">
                      <span className="text-muted-foreground">{t('timestamp:unixSeconds')}</span>
                      <span className={dateUnit === 's' ? 'text-foreground font-bold' : 'text-muted-foreground'}>{row.result.sec}</span>
                    </div>
                    <div className="flex justify-between px-2 py-1 rounded bg-muted">
                      <span className="text-muted-foreground">{t('timestamp:unixMs')}</span>
                      <span className={dateUnit === 'ms' ? 'text-foreground font-bold' : 'text-muted-foreground'}>{row.result.ms}</span>
                    </div>
                  </div>
                )}
                {row.calendarOpen && (
                  <CalendarPicker
                    value={row.dateOnly}
                    onChange={(dateStr) => selectCalendarDate(row.id, dateStr)}
                    onClose={() => closeCalendar(row.id)}
                  />
                )}
              </div>
            ))}
          </div>
          {dateRows.length < 10 && (
            <button className="btn-ghost mt-3 text-xs w-full" onClick={addDateRow}>
              <Plus size={11} /> {t('timestamp:addDate', 'Add Date')}
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}