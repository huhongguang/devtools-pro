import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { Copy, Check } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

// Simple pure JS SHA implementations
function toHexString(bytes: Uint8Array) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function sha(algo: string, data: string) {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest(algo, enc.encode(data))
  return toHexString(new Uint8Array(buf))
}

// Pure JS MD5
function md5(str: string): string {
  function safeAdd(x: number, y: number) { const lsw = (x & 0xffff) + (y & 0xffff); const msw = (x >> 16) + (y >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xffff) }
  function bitRotateLeft(num: number, cnt: number) { return (num << cnt) | (num >>> (32 - cnt)) }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b) }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & c) | (~b & d), a, b, x, s, t) }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t) }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(b ^ c ^ d, a, b, x, s, t) }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(c ^ (b | ~d), a, b, x, s, t) }
  const bytes = new TextEncoder().encode(str)
  const length8 = bytes.length
  const paddedLen = Math.ceil((length8 + 9) / 64) * 64
  const extra = paddedLen - length8
  const i8 = new Uint8Array(length8 + extra)
  i8.set(bytes)
  i8[length8] = 0x80
  const length32 = i8.length >> 2
  const i32 = new Int32Array(i8.buffer)
  i32[length32 - 2] = length8 << 3
  i32[length32 - 1] = length8 >>> 29
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878
  for (let i = 0; i < length32; i += 16) {
    const aa = a, bb = b, cc = c, dd = d
    a = md5ff(a,b,c,d,i32[i+0],7,-680876936); d=md5ff(d,a,b,c,i32[i+1],12,-389564586); c=md5ff(c,d,a,b,i32[i+2],17,606105819); b=md5ff(b,c,d,a,i32[i+3],22,-1044525330)
    a=md5ff(a,b,c,d,i32[i+4],7,-176418897); d=md5ff(d,a,b,c,i32[i+5],12,1200080426); c=md5ff(c,d,a,b,i32[i+6],17,-1473231341); b=md5ff(b,c,d,a,i32[i+7],22,-45705983)
    a=md5ff(a,b,c,d,i32[i+8],7,1770035416); d=md5ff(d,a,b,c,i32[i+9],12,-1958414417); c=md5ff(c,d,a,b,i32[i+10],17,-42063); b=md5ff(b,c,d,a,i32[i+11],22,-1990404162)
    a=md5ff(a,b,c,d,i32[i+12],7,1804603682); d=md5ff(d,a,b,c,i32[i+13],12,-40341101); c=md5ff(c,d,a,b,i32[i+14],17,-1502002290); b=md5ff(b,c,d,a,i32[i+15],22,1236535329)
    a=md5gg(a,b,c,d,i32[i+1],5,-165796510); d=md5gg(d,a,b,c,i32[i+6],9,-1069501632); c=md5gg(c,d,a,b,i32[i+11],14,643717713); b=md5gg(b,c,d,a,i32[i+0],20,-373897302)
    a=md5gg(a,b,c,d,i32[i+5],5,-701558691); d=md5gg(d,a,b,c,i32[i+10],9,38016083); c=md5gg(c,d,a,b,i32[i+15],14,-660478335); b=md5gg(b,c,d,a,i32[i+4],20,-405537848)
    a=md5gg(a,b,c,d,i32[i+9],5,568446438); d=md5gg(d,a,b,c,i32[i+14],9,-1019803690); c=md5gg(c,d,a,b,i32[i+3],14,-187363961); b=md5gg(b,c,d,a,i32[i+8],20,1163531501)
    a=md5gg(a,b,c,d,i32[i+13],5,-1444681467); d=md5gg(d,a,b,c,i32[i+2],9,-51403784); c=md5gg(c,d,a,b,i32[i+7],14,1735328473); b=md5gg(b,c,d,a,i32[i+12],20,-1926607734)
    a=md5hh(a,b,c,d,i32[i+5],4,-378558); d=md5hh(d,a,b,c,i32[i+8],11,-2022574463); c=md5hh(c,d,a,b,i32[i+11],16,1839030562); b=md5hh(b,c,d,a,i32[i+14],23,-35309556)
    a=md5hh(a,b,c,d,i32[i+1],4,-1530992060); d=md5hh(d,a,b,c,i32[i+4],11,1272893353); c=md5hh(c,d,a,b,i32[i+7],16,-155497632); b=md5hh(b,c,d,a,i32[i+10],23,-1094730640)
    a=md5hh(a,b,c,d,i32[i+13],4,681279174); d=md5hh(d,a,b,c,i32[i+0],11,-358537222); c=md5hh(c,d,a,b,i32[i+3],16,-722521979); b=md5hh(b,c,d,a,i32[i+6],23,76029189)
    a=md5hh(a,b,c,d,i32[i+9],4,-640364487); d=md5hh(d,a,b,c,i32[i+12],11,-421815835); c=md5hh(c,d,a,b,i32[i+15],16,530742520); b=md5hh(b,c,d,a,i32[i+2],23,-995338651)
    a=md5ii(a,b,c,d,i32[i+0],6,-198630844); d=md5ii(d,a,b,c,i32[i+7],10,1126891415); c=md5ii(c,d,a,b,i32[i+14],15,-1416354905); b=md5ii(b,c,d,a,i32[i+5],21,-57434055)
    a=md5ii(a,b,c,d,i32[i+12],6,1700485571); d=md5ii(d,a,b,c,i32[i+3],10,-1894986606); c=md5ii(c,d,a,b,i32[i+10],15,-1051523); b=md5ii(b,c,d,a,i32[i+1],21,-2054922799)
    a=md5ii(a,b,c,d,i32[i+8],6,1873313359); d=md5ii(d,a,b,c,i32[i+15],10,-30611744); c=md5ii(c,d,a,b,i32[i+6],15,-1560198380); b=md5ii(b,c,d,a,i32[i+13],21,1309151649)
    a=md5ii(a,b,c,d,i32[i+4],6,-145523070); d=md5ii(d,a,b,c,i32[i+11],10,-1120210379); c=md5ii(c,d,a,b,i32[i+2],15,718787259); b=md5ii(b,c,d,a,i32[i+9],21,-343485551)
    a=safeAdd(a,aa); b=safeAdd(b,bb); c=safeAdd(c,cc); d=safeAdd(d,dd)
  }
  const i8out = new Int32Array([a,b,c,d])
  return toHexString(new Uint8Array(i8out.buffer))
}

interface HashResult { algo: string; value: string; label: string }

export default function HashGenerator() {
  const { t } = useTranslation(['common', 'hash-generator'])
  const [input, setInput] = useState('Hello, DevTools Pro!')
  const [results, setResults] = useState<HashResult[]>([])
  const [copiedIdx, setCopiedIdx] = useState(-1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isCryptoAvailable = typeof crypto !== 'undefined' && !!crypto.subtle

  const generate = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      if (!isCryptoAvailable) {
        throw new Error(t('hash-generator:cryptoUnavailable', 'Web Crypto API is not available. Please use HTTPS or localhost.'))
      }
      const [sha1, sha256, sha512] = await Promise.all([
        sha('SHA-1', input),
        sha('SHA-256', input),
        sha('SHA-512', input),
      ])
      setResults([
        { algo: 'MD5', value: md5(input), label: '128 bit' },
        { algo: 'SHA-1', value: sha1, label: '160 bit' },
        { algo: 'SHA-256', value: sha256, label: '256 bit' },
        { algo: 'SHA-512', value: sha512, label: '512 bit' },
      ])
    } catch (e: any) {
      setError(e?.message || t('hash-generator:generateError', 'Failed to generate hash.'))
    } finally {
      setLoading(false)
    }
  }, [input, isCryptoAvailable, t])

  useEffect(() => {
    generate()
  }, [generate])

  const handleCopy = async (v: string, i: number) => {
    await copyToClipboard(v)
    setCopiedIdx(i)
    setTimeout(() => setCopiedIdx(-1), 1800)
  }

  return (
    <ToolLayout name={t('tools:hash-generator.name')} description={t('tools:hash-generator.description')} category="generate" toolId="hash-generator">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('hash-generator:inputLabel')}</label>
          <textarea
            className="code-area w-full p-3 text-sm"
            rows={5}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t('hash-generator:inputPlaceholder')}
          />
        </div>
        <div className="flex gap-2 items-center">
          <button className="btn-primary" onClick={generate} disabled={loading}>
            {loading ? t('hash-generator:generating', 'Generating...') : t('common:actions.generate')}
          </button>
          <button className="btn-ghost" onClick={() => { setInput(''); setResults([]); setError('') }}>{t('common:actions.clear')}</button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col gap-2">
            {results.map((r, i) => (
              <div key={r.algo} className="tool-card p-3 flex items-center gap-3">
                <div className="flex-shrink-0 w-20">
                  <div className="text-xs font-bold text-primary">{r.algo}</div>
                  <div className="text-[10px] text-muted-foreground">{r.label}</div>
                </div>
                <code className="flex-1 font-mono text-xs text-foreground break-all leading-relaxed">{r.value}</code>
                <button
                  className="btn-ghost py-1.5 px-2.5 flex-shrink-0"
                  onClick={() => handleCopy(r.value, i)}
                >
                  {copiedIdx === i ? <Check size={12} className="status-success" /> : <Copy size={12} />}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="tool-card p-4 text-xs text-muted-foreground">
          <div className="font-semibold text-foreground mb-1">{t('hash-generator:aboutTitle')}</div>
          <p>{t('hash-generator:aboutText')}</p>
        </div>
      </div>
    </ToolLayout>
  )
}
