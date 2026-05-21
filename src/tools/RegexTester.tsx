import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'

export default function RegexTester() {
  const { t } = useTranslation(['common', 'regex-tester'])
  const FLAGS_DEF = [
    { flag: 'g', labelKey: 'flags.global', descKey: 'flags.globalDesc' },
    { flag: 'i', labelKey: 'flags.ignoreCase', descKey: 'flags.ignoreCaseDesc' },
    { flag: 'm', labelKey: 'flags.multiline', descKey: 'flags.multilineDesc' },
    { flag: 's', labelKey: 'flags.dotAll', descKey: 'flags.dotAllDesc' },
  ]

  const [pattern, setPattern] = useState('(\\w+)@([\\w.]+)')
  const [flags, setFlags] = useState(new Set(['g', 'i']))
  const [testStr, setTestStr] = useState('Contact us at hello@devtools.pro or support@example.com for help.')
  const [matches, setMatches] = useState<RegExpMatchArray[]>([])
  const [error, setError] = useState('')
  const [replace, setReplace] = useState('')
  const [replaced, setReplaced] = useState('')

  useEffect(() => {
    if (!pattern) { setMatches([]); setError(''); return }
    try {
      new RegExp(pattern, [...flags].join(''))
      const m = [...testStr.matchAll(new RegExp(pattern, flags.has('g') ? [...flags].join('') : 'g' + [...flags].join('')))]
      setMatches(m)
      setError('')
    } catch (e: unknown) {
      setError((e as Error).message)
      setMatches([])
    }
  }, [pattern, flags, testStr])

  const toggleFlag = (f: string) => {
    setFlags(prev => {
      const next = new Set(prev)
      next.has(f) ? next.delete(f) : next.add(f)
      return next
    })
  }

  const doReplace = () => {
    try {
      const re = new RegExp(pattern, [...flags].join(''))
      setReplaced(testStr.replace(re, replace))
    } catch { setReplaced('') }
  }

  const highlighted = () => {
    if (!pattern || error || matches.length === 0) return testStr
    try {
      const re = new RegExp(pattern, 'g' + (flags.has('i') ? 'i' : '') + (flags.has('m') ? 'm' : '') + (flags.has('s') ? 's' : ''))
      return testStr.replace(re, m => `\x00${m}\x01`)
    } catch { return testStr }
  }

  const parts = highlighted().split(/\x00|\x01/)

  return (
    <ToolLayout name={t('tools:regex-tester.name')} description={t('tools:regex-tester.description')} category="text" toolId="regex-tester">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('regex-tester:patternLabel')}</div>
          <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2 font-mono text-sm">
            <span className="text-muted-foreground">/</span>
            <input
              className="flex-1 bg-transparent outline-none text-foreground"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder={t('regex-tester:patternPlaceholder')}
            />
            <span className="text-muted-foreground">/</span>
            <span className="text-primary font-bold">{[...flags].join('')}</span>
          </div>
          {error && <div className="mt-1.5 text-xs status-error">{error}</div>}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {FLAGS_DEF.map(({ flag, labelKey }) => (
              <button
                key={flag}
                className={`btn-ghost py-1 px-3 text-xs ${flags.has(flag) ? 'border-primary/50 text-foreground bg-primary/10' : ''}`}
                onClick={() => toggleFlag(flag)}
                title={t(`regex-tester:${labelKey}`)}
              >
                <span className="font-mono">{flag}</span> <span className="text-muted-foreground">{t(`regex-tester:${labelKey}`)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="tool-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('regex-tester:testStringLabel')}</div>
            <div className="text-xs">
              {matches.length > 0
                ? <span className="status-success font-medium">{t('common:status.matches', { count: matches.length })}</span>
                : <span className="text-muted-foreground">{t('common:status.noMatches')}</span>
              }
            </div>
          </div>
          <textarea
            className="code-area w-full p-3 text-sm"
            rows={4}
            value={testStr}
            onChange={e => setTestStr(e.target.value)}
            placeholder={t('regex-tester:testStringPlaceholder')}
          />
          {matches.length > 0 && (
            <div className="mt-2 p-3 rounded-lg bg-muted font-mono text-sm leading-relaxed break-all">
              {parts.map((part, i) =>
                i % 2 === 1
                  ? <mark key={i} className="rounded px-0.5" style={{ background: 'hsl(262 83% 67% / 0.3)', color: 'hsl(262 83% 80%)' }}>{part}</mark>
                  : <span key={i}>{part}</span>
              )}
            </div>
          )}
        </div>

        {matches.length > 0 && (
          <div className="tool-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('regex-tester:matchesLabel')}</div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
              {matches.map((m, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5 px-3 rounded bg-muted text-xs font-mono">
                  <span className="text-muted-foreground w-6 text-right">{i}</span>
                  <span className="text-foreground">{m[0]}</span>
                  {m.slice(1).map((g, gi) => g !== undefined && (
                    <span key={gi} className="text-primary">{t('regex-tester:groupLabel', { n: gi + 1 })}: {g}</span>
                  ))}
                  <span className="ml-auto text-muted-foreground">@{m.index}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('regex-tester:replaceLabel')}</div>
          <div className="flex gap-2">
            <input
              className="code-area flex-1 px-3 py-2 font-mono text-sm"
              placeholder={t('regex-tester:replacePlaceholder')}
              value={replace}
              onChange={e => setReplace(e.target.value)}
            />
            <button className="btn-primary px-4" onClick={doReplace}>{t('common:actions.convert')}</button>
          </div>
          {replaced && <div className="mt-2 p-3 rounded-lg bg-muted font-mono text-sm text-foreground">{replaced}</div>}
        </div>
      </div>
    </ToolLayout>
  )
}
