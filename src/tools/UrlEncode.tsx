import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout, IoArea } from '@/components/layout/ToolLayout'

export default function UrlEncode() {
  const { t } = useTranslation(['common', 'url-encode'])
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [full, setFull] = useState(false)

  const process = () => {
    if (!input) return
    try {
      if (mode === 'encode') {
        setOutput(full ? encodeURIComponent(input) : encodeURI(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
    } catch {
      setOutput(t('url-encode:errorInvalid'))
    }
  }

  return (
    <ToolLayout name={t('tools:url-encode.name')} description={t('tools:url-encode.description')} category="encode" toolId="url-encode">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{t('url-encode:mode')}:</span>
            {(['encode', 'decode'] as const).map(m => (
              <button key={m} className={`btn-ghost py-1 px-4 text-xs capitalize ${mode === m ? 'border-primary/50 text-foreground' : ''}`}
                onClick={() => { setMode(m); setOutput('') }}>
                {t(`url-encode:mode${m.charAt(0).toUpperCase() + m.slice(1)}`)}
              </button>
            ))}
          </div>
          {mode === 'encode' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t('url-encode:scope')}:</span>
              <button className={`btn-ghost py-1 px-3 text-xs ${!full ? 'border-primary/50 text-foreground' : ''}`} onClick={() => setFull(false)}>{t('url-encode:scopeURI')}</button>
              <button className={`btn-ghost py-1 px-3 text-xs ${full ? 'border-primary/50 text-foreground' : ''}`} onClick={() => setFull(true)}>{t('url-encode:scopeComponent')}</button>
            </div>
          )}
        </div>
        <IoArea
          label={t('url-encode:inputLabel')}
          value={input}
          onChange={setInput}
          placeholder={t('url-encode:placeholderEncode')}
          rows={5}
        />
        <div className="flex gap-2">
          <button className="btn-primary" onClick={process}>{mode === 'encode' ? t('common:actions.encode') : t('common:actions.decode')}</button>
          <button className="btn-ghost" onClick={() => { setInput(output); setOutput(''); setMode(m => m === 'encode' ? 'decode' : 'encode') }}>{t('common:actions.swap')}</button>
          <button className="btn-ghost" onClick={() => { setInput(''); setOutput('') }}>{t('common:actions.clear')}</button>
        </div>
        <IoArea label={t('url-encode:outputLabel')} value={output} readOnly rows={5} filename="url.txt" />
      </div>
    </ToolLayout>
  )
}
