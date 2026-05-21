import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import type { TFunction } from 'i18next'

function parseCronField(value: string, field: string, t: TFunction): string {
  if (value === '*') return t('cron-parser:parse.every', { field })
  if (value === '?') return t('cron-parser:parse.any', { field })
  if (value.startsWith('*/')) return t('cron-parser:parse.everyN', { n: value.slice(2), field })
  if (value.includes('/')) {
    const [start, step] = value.split('/')
    return t('cron-parser:parse.everyNFrom', { n: step, field, start })
  }
  if (value.includes('-')) {
    const [s, e] = value.split('-')
    return t('cron-parser:parse.fromTo', { field, start: s, end: e })
  }
  if (value.includes(',')) {
    return t('cron-parser:parse.atList', { field, list: value.split(',').join(', ') })
  }
  return t('cron-parser:parse.at', { field, value })
}

function humanizeCron(expr: string, t: TFunction): string {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return t('cron-parser:parse.invalid')
  const [min, hour, dom, month, dow] = parts

  const descriptions: string[] = []
  const fields = [
    t('cron-parser:fields.minute'),
    t('cron-parser:fields.hour'),
    t('cron-parser:fields.dayOfMonth'),
    t('cron-parser:fields.month'),
    t('cron-parser:fields.dayOfWeek'),
  ]

  descriptions.push(parseCronField(min, fields[0], t))
  if (hour !== '*') descriptions.push(parseCronField(hour, fields[1], t))
  if (dom !== '*' && dom !== '?') descriptions.push(parseCronField(dom, fields[2], t))
  if (month !== '*') {
    const mNum = parseInt(month)
    const mName = isNaN(mNum) ? null : t(`cron-parser:months.${mNum}`, { defaultValue: '' })
    descriptions.push(mName ? t('cron-parser:parse.inMonth', { month: mName }) : parseCronField(month, fields[3], t))
  }
  if (dow !== '*' && dow !== '?') {
    const dNum = parseInt(dow)
    const dName = isNaN(dNum) ? null : t(`cron-parser:days.${dNum % 7}`, { defaultValue: '' })
    descriptions.push(dName ? t('cron-parser:parse.onDay', { day: dName }) : parseCronField(dow, fields[4], t))
  }

  return descriptions.join(', ')
}

const PRESET_KEYS = ['everyMinute', 'everyHour', 'everyDayMidnight', 'everyMondayNine', 'firstOfMonth', 'everyWeekday'] as const
const PRESET_VALUES = ['* * * * *', '0 * * * *', '0 0 * * *', '0 9 * * 1', '0 0 1 * *', '0 9 * * 1-5']

export default function CronParser() {
  const { t } = useTranslation(['common', 'cron-parser'])
  const [expr, setExpr] = useState('0 9 * * 1-5')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const fieldNames = [
    t('cron-parser:fields.minute'),
    t('cron-parser:fields.hour'),
    t('cron-parser:fields.dayOfMonth'),
    t('cron-parser:fields.month'),
    t('cron-parser:fields.dayOfWeek'),
  ]
  const fieldRanges = [
    t('cron-parser:fields.minuteRange'),
    t('cron-parser:fields.hourRange'),
    t('cron-parser:fields.domRange'),
    t('cron-parser:fields.monthRange'),
    t('cron-parser:fields.dowRange'),
  ]

  const parse = () => {
    const parts = expr.trim().split(/\s+/)
    if (parts.length !== 5) {
      setError(t('cron-parser:parse.invalid'))
      setDescription('')
      return
    }
    setError('')
    setDescription(humanizeCron(expr, t))
  }

  const parts = expr.trim().split(/\s+/)

  return (
    <ToolLayout name={t('tools:cron-parser.name')} description={t('tools:cron-parser.description')} category="convert" toolId="cron-parser">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('cron-parser:expressionLabel')}</div>
          <input
            className="code-area w-full px-3 py-2.5 font-mono text-lg"
            value={expr}
            onChange={e => setExpr(e.target.value)}
            placeholder="* * * * *"
          />
          <div className="mt-2 grid grid-cols-5 gap-1">
            {fieldNames.map((f, i) => (
              <div key={f} className="text-center">
                <div className={`font-mono text-sm font-bold py-1 rounded ${parts[i] && parts[i] !== '*' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {parts[i] || '*'}
                </div>
                <div className="text-[10px] text-muted-foreground">{f}</div>
              </div>
            ))}
          </div>
          {error && <div className="mt-2 text-xs status-error">{error}</div>}
        </div>

        <div className="flex gap-2">
          <button className="btn-primary" onClick={parse}>{t('common:actions.parse')}</button>
          <button className="btn-ghost" onClick={() => { setExpr(''); setDescription(''); setError('') }}>{t('common:actions.clear')}</button>
        </div>

        {description && (
          <div className="tool-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('cron-parser:descriptionLabel')}</div>
            <p className="text-foreground text-sm leading-relaxed">{description}</p>
          </div>
        )}

        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('cron-parser:presetsLabel')}</div>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_KEYS.map((key, idx) => (
              <button
                key={key}
                className={`text-left p-3 rounded-lg border text-xs transition-colors hover:border-primary/40 ${expr === PRESET_VALUES[idx] ? 'border-primary/40 bg-primary/10' : 'border-border bg-muted/50'}`}
                onClick={() => { setExpr(PRESET_VALUES[idx]); setDescription(humanizeCron(PRESET_VALUES[idx], t)); setError('') }}
              >
                <div className="font-semibold text-foreground mb-0.5">{t(`cron-parser:presets.${key}`)}</div>
                <div className="font-mono text-muted-foreground">{PRESET_VALUES[idx]}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('cron-parser:fieldRefLabel')}</div>
          <table className="w-full text-xs">
            <thead>
              <tr>{fieldNames.map(f => <th key={f} className="text-left py-1 pr-3 text-muted-foreground font-medium">{f}</th>)}</tr>
            </thead>
            <tbody>
              <tr>{fieldRanges.map((r, i) => <td key={i} className="font-mono text-foreground pb-1 pr-3">{r}</td>)}</tr>
            </tbody>
          </table>
          <div className="mt-2 text-muted-foreground text-xs">{t('cron-parser:specialNote')}</div>
        </div>
      </div>
    </ToolLayout>
  )
}
