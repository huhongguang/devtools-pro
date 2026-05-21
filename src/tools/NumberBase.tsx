import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { Copy } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

function convert(value: string, from: number, to: number): string {
  try {
    const n = BigInt('0' + (from === 16 ? 'x' : from === 8 ? 'o' : from === 2 ? 'b' : '') + value.replace(/\s/g, ''))
    return n.toString(to)
  } catch {
    return 'Invalid input'
  }
}

const BASES = [
  { base: 2,  label: 'Binary',      prefix: '0b', color: 'text-pink-400' },
  { base: 8,  label: 'Octal',       prefix: '0o', color: 'text-yellow-400' },
  { base: 10, label: 'Decimal',     prefix: '',   color: 'text-green-400' },
  { base: 16, label: 'Hexadecimal', prefix: '0x', color: 'text-blue-400' },
]

export default function NumberBase() {
  const { t } = useTranslation(['common', 'number-base'])
  const [values, setValues] = useState<Record<number, string>>({ 2: '', 8: '', 10: '255', 16: '' })
  const [error, setError] = useState('')

  const handleChange = (value: string, fromBase: number) => {
    if (!value.trim()) {
      setValues({ 2: '', 8: '', 10: '', 16: '' })
      setError(''); return
    }
    setError('')
    const valid = fromBase === 2 ? /^[01]+$/ : fromBase === 8 ? /^[0-7]+$/ : fromBase === 10 ? /^\d+$/ : /^[0-9a-fA-F]+$/
    if (!valid.test(value.replace(/\s/g, ''))) {
      setError(t('number-base:invalidError', { base: BASES.find(b => b.base === fromBase)?.label }))
      setValues(prev => ({ ...prev, [fromBase]: value }))
      return
    }
    const newVals: Record<number, string> = { [fromBase]: value }
    BASES.forEach(({ base }) => {
      if (base !== fromBase) newVals[base] = convert(value, fromBase, base)
    })
    setValues(newVals)
  }

  return (
    <ToolLayout name={t('tools:number-base.name', 'Number Base')} description={t('tools:number-base.description', 'Convert numbers between binary, octal, decimal, and hexadecimal')} category="convert" toolId="number-base">
      <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
        {error && <div className="text-xs status-error px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">{error}</div>}

        {BASES.map(({ base, label, prefix, color }) => (
          <div key={base} className="tool-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{t(`number-base:${label.toLowerCase()}`, label)}</span>
                <span className="text-xs text-muted-foreground ms-2">{t('number-base:baseLabel', { n: base })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{prefix}</span>
                <button className="btn-ghost py-1 px-2" onClick={() => copyToClipboard(values[base] || '')}><Copy size={11} /></button>
              </div>
            </div>
            <input
              className="code-area w-full px-3 py-2 font-mono text-sm uppercase"
              value={values[base] || ''}
              onChange={e => handleChange(e.target.value.toLowerCase(), base)}
              placeholder={base === 2 ? '11111111' : base === 8 ? '377' : base === 10 ? '255' : 'ff'}
            />
          </div>
        ))}

        {/* Bit visualization */}
        {values[10] && !error && (
          <div className="tool-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('number-base:bitPattern', 'Bit Pattern (8-bit groups)')}</div>
            <div className="flex flex-wrap gap-1">
              {(values[2] || '').padStart(Math.ceil((values[2] || '').length / 8) * 8, '0').split('').map((bit, i) => (
                <span key={i}>
                  <span className={`font-mono text-sm ${bit === '1' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{bit}</span>
                  {(i + 1) % 8 === 0 && i !== (values[2] || '').length - 1 && <span className="text-border mx-0.5">·</span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
