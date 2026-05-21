import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { Copy, Check, AlertTriangle } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

function b64urlDecode(str: string): string {
  const s = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4
  const padded = pad ? s + '='.repeat(4 - pad) : s
  try {
    return decodeURIComponent(escape(atob(padded)))
  } catch {
    return atob(padded)
  }
}

function parseJwt(token: string) {
  const parts = token.trim().split('.')
  if (parts.length !== 3) throw new Error('JWT must have 3 parts separated by dots')
  return {
    header: JSON.parse(b64urlDecode(parts[0])),
    payload: JSON.parse(b64urlDecode(parts[1])),
    signature: parts[2],
  }
}

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export default function JwtDecoder() {
  const { t } = useTranslation(['common', 'jwt-decoder'])
  const [token, setToken] = useState(SAMPLE)
  const [result, setResult] = useState<ReturnType<typeof parseJwt> | null>(null)
  const [error, setError] = useState('')
  const [copiedKey, setCopiedKey] = useState('')

  const decode = () => {
    try {
      setResult(parseJwt(token))
      setError('')
    } catch (e: unknown) {
      setError((e as Error).message)
      setResult(null)
    }
  }

  const handleCopy = async (text: string, key: string) => {
    await copyToClipboard(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(''), 1800)
  }

  const expiry = result ? (() => {
    const payload = result.payload as Record<string, unknown>
    if (!payload.exp) return null
    const exp = Number(payload.exp)
    const now = Date.now() / 1000
    return {
      expired: exp < now,
      msg: exp < now
        ? t('jwt-decoder:expired', { date: new Date(exp * 1000).toLocaleString() })
        : t('jwt-decoder:expires', { date: new Date(exp * 1000).toLocaleString() })
    }
  })() : null

  const Section = ({ title, data, colorClass }: { title: string; data: object; colorClass: string }) => (
    <div className="tool-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>{title}</div>
        <button className="btn-ghost py-1 px-2 text-xs" onClick={() => handleCopy(JSON.stringify(data, null, 2), title)}>
          {copiedKey === title ? <Check size={11} className="status-success" /> : <Copy size={11} />}
        </button>
      </div>
      <pre className="font-mono text-xs text-foreground leading-relaxed overflow-x-auto scrollbar-thin">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )

  return (
    <ToolLayout name={t('tools:jwt-decoder.name')} description={t('tools:jwt-decoder.description')} category="encode" toolId="jwt-decoder">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('jwt-decoder:tokenLabel')}</label>
          <textarea
            className="code-area w-full p-3 text-[12px]"
            rows={5}
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder={t('jwt-decoder:tokenPlaceholder')}
          />
          {token && (
            <div className="flex gap-1 font-mono text-[11px] flex-wrap mt-0.5">
              {token.split('.').map((part, i) => (
                <span key={i} className={[
                  'px-1.5 py-0.5 rounded truncate max-w-xs',
                  i === 0 ? 'bg-pink-500/15 text-pink-400' :
                  i === 1 ? 'bg-purple-500/15 text-purple-400' :
                  'bg-blue-500/15 text-blue-400'
                ].join(' ')}>
                  {t(`jwt-decoder:tab${['Header','Payload','Signature'][i]}`)}: {part.slice(0, 20)}...
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button className="btn-primary" onClick={decode}>{t('common:actions.decode')}</button>
          <button className="btn-ghost" onClick={() => setToken(SAMPLE)}>{t('jwt-decoder:loadSample')}</button>
          <button className="btn-ghost" onClick={() => { setToken(''); setResult(null); setError('') }}>{t('common:actions.clear')}</button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {expiry && (
          <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${expiry.expired ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-green-500/30 bg-green-500/10 text-green-400'}`}>
            {expiry.expired ? <AlertTriangle size={14} /> : <span>&#10003;</span>} {expiry.msg}
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-3">
            <Section title={t('jwt-decoder:tabHeader')} data={result.header} colorClass="text-pink-400" />
            <Section title={t('jwt-decoder:tabPayload')} data={result.payload} colorClass="text-purple-400" />
            <div className="tool-card p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">{t('jwt-decoder:tabSignature')}</div>
              <code className="font-mono text-xs text-muted-foreground break-all">{result.signature}</code>
              <div className="mt-2 text-xs text-muted-foreground">{t('jwt-decoder:sigNote')}</div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
