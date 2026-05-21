import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import * as Diff from 'diff'

export default function TextDiff() {
  const { t } = useTranslation(['common', 'text-diff'])
  const [left, setLeft] = useState('The quick brown fox jumps over the lazy dog.\nThis is line two.\nThis is line three.\nDevTools Pro is awesome!')
  const [right, setRight] = useState('The quick brown fox leaps over the lazy cat.\nThis is line two.\nThis is a new line!\nDevTools Pro is awesome!')
  const [diffs, setDiffs] = useState<Diff.Change[]>([])
  const [mode, setMode] = useState<'char' | 'word' | 'line'>('line')
  const [stats, setStats] = useState<{ added: number; removed: number } | null>(null)

  const compare = () => {
    let result: Diff.Change[]
    if (mode === 'char') result = Diff.diffChars(left, right)
    else if (mode === 'word') result = Diff.diffWords(left, right)
    else result = Diff.diffLines(left, right)
    setDiffs(result)
    const added = result.filter(d => d.added).reduce((sum, d) => sum + d.count!, 0)
    const removed = result.filter(d => d.removed).reduce((sum, d) => sum + d.count!, 0)
    setStats({ added, removed })
  }

  return (
    <ToolLayout name={t('tools:text-diff.name', 'Text Diff')} description={t('tools:text-diff.description', 'Compare two texts and highlight differences')} category="text" toolId="text-diff">
      <div className="flex flex-col gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{t('text-diff:modeLabel', 'Mode')}:</span>
            {(['char', 'word', 'line'] as const).map(m => (
              <button key={m} className={`btn-ghost py-1 px-3 text-xs capitalize ${mode === m ? 'border-primary/50 text-foreground' : ''}`}
                onClick={() => { setMode(m); setDiffs([]) }}>{t(`text-diff:mode${m.charAt(0).toUpperCase() + m.slice(1)}`, m)}</button>
            ))}
          </div>
          {stats && (
            <div className="ms-auto flex items-center gap-3 text-xs">
              <span style={{ color: 'hsl(142 71% 45%)' }}>+{stats.added} {t('text-diff:added', 'added')}</span>
              <span style={{ color: 'hsl(0 72% 51%)' }}>−{stats.removed} {t('text-diff:removed', 'removed')}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('text-diff:originalLabel', 'Original')}</label>
            <textarea className="code-area w-full p-3 text-sm" rows={10} value={left} onChange={e => setLeft(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('text-diff:modifiedLabel', 'Modified')}</label>
            <textarea className="code-area w-full p-3 text-sm" rows={10} value={right} onChange={e => setRight(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn-primary" onClick={compare}>{t('common:actions.compare', 'Compare')}</button>
          <button className="btn-ghost" onClick={() => { setLeft(''); setRight(''); setDiffs([]); setStats(null) }}>{t('common:actions.clear', 'Clear')}</button>
        </div>

        {diffs.length > 0 && (
          <div className="tool-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('text-diff:resultTitle', 'Diff Result')}</div>
            <div className="font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap break-all">
              {diffs.map((d, i) => (
                <span
                  key={i}
                  style={
                    d.added
                      ? { background: 'hsl(142 71% 45% / 0.2)', color: 'hsl(142 71% 60%)', padding: '0 2px', borderRadius: '2px', textDecoration: 'none' }
                      : d.removed
                      ? { background: 'hsl(0 72% 51% / 0.2)', color: 'hsl(0 72% 65%)', padding: '0 2px', borderRadius: '2px', textDecoration: 'line-through' }
                      : { color: 'hsl(213 31% 91%)' }
                  }
                >
                  {d.value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
