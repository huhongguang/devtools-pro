import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { RefreshCw, Copy, Check } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  ambiguous: 'Il1O0',
}

interface GenOpts {
  uppercase: boolean
  lowercase: boolean
  digits: boolean
  symbols: boolean
  excludeAmbiguous: boolean
}

function generatePassword(length: number, opts: GenOpts): string {
  let chars = ''
  if (opts.uppercase) chars += CHARSETS.uppercase
  if (opts.lowercase) chars += CHARSETS.lowercase
  if (opts.digits) chars += CHARSETS.digits
  if (opts.symbols) chars += CHARSETS.symbols
  if (opts.excludeAmbiguous) {
    for (const c of CHARSETS.ambiguous) chars = chars.replace(new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
  }
  if (!chars) return ''
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, v => chars[v % chars.length]).join('')
}

function scorePassword(pwd: string): { score: number; label: string; color: string } {
  let s = 0
  if (pwd.length >= 8) s += 1
  if (pwd.length >= 12) s += 1
  if (pwd.length >= 16) s += 1
  if (/[A-Z]/.test(pwd)) s += 1
  if (/[a-z]/.test(pwd)) s += 1
  if (/\d/.test(pwd)) s += 1
  if (/[^A-Za-z0-9]/.test(pwd)) s += 2
  const labels = [
    { score: 3, label: 'Weak', color: 'hsl(0 72% 51%)' },
    { score: 5, label: 'Fair', color: 'hsl(38 92% 50%)' },
    { score: 7, label: 'Good', color: 'hsl(199 89% 48%)' },
    { score: 9, label: 'Strong', color: 'hsl(142 71% 45%)' },
  ]
  const lvl = [...labels].reverse().find(l => s >= l.score) || labels[0]
  return { score: Math.min(s, 8), label: lvl.label, color: lvl.color }
}

export default function PasswordGenerator() {
  const { t } = useTranslation(['common', 'password-gen'])
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({ uppercase: true, lowercase: true, digits: true, symbols: true, excludeAmbiguous: false })
  const [count, setCount] = useState(5)
  const [passwords, setPasswords] = useState<string[]>([])
  const [copiedIdx, setCopiedIdx] = useState(-1)

  const generate = () => {
    setPasswords(Array.from({ length: count }, () => generatePassword(length, opts)))
  }

  const handleCopy = async (v: string, i: number) => {
    await copyToClipboard(v)
    setCopiedIdx(i)
    setTimeout(() => setCopiedIdx(-1), 1500)
  }

  const preview = generatePassword(length, opts)
  const strength = scorePassword(preview)

  const STRENGTH_LABELS: Record<string, string> = {
    'Weak': t('password-gen:strengthWeak', 'Weak'),
    'Fair': t('password-gen:strengthFair', 'Fair'),
    'Good': t('password-gen:strengthGood', 'Good'),
    'Strong': t('password-gen:strengthStrong', 'Strong'),
  }

  const OPTS_LABELS: Record<string, string> = {
    uppercase: t('password-gen:optUppercase', 'Uppercase'),
    lowercase: t('password-gen:optLowercase', 'Lowercase'),
    digits: t('password-gen:optDigits', 'Digits'),
    symbols: t('password-gen:optSymbols', 'Symbols'),
    excludeAmbiguous: t('password-gen:optExcludeAmbiguous', 'Exclude Ambiguous'),
  }

  return (
    <ToolLayout name={t('tools:password-gen.name', 'Password Generator')} description={t('tools:password-gen.description', 'Generate cryptographically secure random passwords')} category="generate" toolId="password-gen">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
        {/* Options */}
        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('password-gen:optionsLabel', 'Options')}</div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-14">{t('password-gen:lengthLabel', 'Length')}: {length}</span>
              <input
                type="range" min={6} max={64} value={length}
                onChange={e => setLength(parseInt(e.target.value))}
                className="flex-1 accent-primary"
              />
              <input type="number" min={6} max={64} value={length}
                onChange={e => setLength(Math.max(6, Math.min(64, parseInt(e.target.value) || 16)))}
                className="code-area w-16 px-2 py-1 text-center text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(opts) as Array<keyof typeof opts>).map(key => (
                <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  <input type="checkbox" checked={opts[key]} onChange={e => setOpts(p => ({ ...p, [key]: e.target.checked }))} className="accent-primary w-4 h-4" />
                  <span>{OPTS_LABELS[key] || key}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t('password-gen:countLabel', 'Count')}:</span>
              {[1, 5, 10, 20].map(n => (
                <button key={n} className={`btn-ghost py-1 px-2.5 text-xs ${count === n ? 'border-primary/50 text-foreground' : ''}`} onClick={() => setCount(n)}>{n}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Strength preview */}
        <div className="tool-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">{t('password-gen:strengthPreview', 'Strength Preview')}</span>
            <span className="text-xs font-bold" style={{ color: strength.color }}>{STRENGTH_LABELS[strength.label] || strength.label}</span>
          </div>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i < strength.score ? strength.color : 'hsl(var(--border))' }} />
            ))}
          </div>
          <code className="font-mono text-sm text-foreground break-all">{preview}</code>
        </div>

        <button className="btn-primary w-fit" onClick={generate}><RefreshCw size={13} /> {t('common:actions.generate', 'Generate')}</button>

        {passwords.length > 0 && (
          <div className="tool-card overflow-hidden">
            <div className="px-4 py-2 border-b border-border">
              <span className="text-xs font-semibold text-muted-foreground">{t('password-gen:passwordsCount', { count: passwords.length })}</span>
            </div>
            {passwords.map((pwd, i) => {
              const s = scorePassword(pwd)
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-0 hover:bg-surface-elevated group">
                  <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <code className="font-mono text-sm text-foreground flex-1">{pwd}</code>
                  <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100" style={{ color: s.color }}>{STRENGTH_LABELS[s.label] || s.label}</span>
                  <button className="btn-ghost py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(pwd, i)}>
                    {copiedIdx === i ? <Check size={11} className="status-success" /> : <Copy size={11} />}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
