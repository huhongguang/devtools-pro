import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout, IoArea } from '@/components/layout/ToolLayout'

export default function Base64Tool() {
  const { t } = useTranslation(['common', 'base64'])
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const process = () => {
    if (!input.trim()) return
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
        setStatus({ ok: true, msg: t('base64:statusEncoded') })
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))))
        setStatus({ ok: true, msg: t('base64:statusDecoded') })
      }
    } catch {
      setStatus({ ok: false, msg: t('base64:errorInvalid') })
      setOutput('')
    }
  }

  const swap = () => {
    setInput(output)
    setOutput('')
    setMode(m => m === 'encode' ? 'decode' : 'encode')
    setStatus(null)
  }

  return (
    <ToolLayout name={t('tools:base64.name')} description={t('tools:base64.description')} category="encode" toolId="base64">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">{t('base64:mode')}:</span>
          {(['encode', 'decode'] as const).map(m => (
            <button
              key={m}
              className={`btn-ghost py-1 px-4 text-xs capitalize ${mode === m ? 'border-primary/50 text-foreground' : ''}`}
              onClick={() => { setMode(m); setOutput(''); setStatus(null) }}
            >{t(`base64:mode${m.charAt(0).toUpperCase() + m.slice(1)}`)}</button>
          ))}
        </div>
        <IoArea
          label={mode === 'encode' ? t('base64:inputLabel') : t('base64:inputLabelDecode')}
          value={input}
          onChange={v => { setInput(v); setOutput(''); setStatus(null) }}
          placeholder={mode === 'encode' ? t('base64:placeholderEncode') : t('base64:placeholderDecode')}
          rows={8}
        />
        <div className="flex gap-2">
          <button className="btn-primary" onClick={process}>{mode === 'encode' ? t('common:actions.encode') : t('common:actions.decode')}</button>
          <button className="btn-ghost" onClick={swap}>{t('common:actions.swap')}</button>
          <button className="btn-ghost" onClick={() => { setInput(''); setOutput(''); setStatus(null) }}>{t('common:actions.clear')}</button>
        </div>
        <IoArea
          label={mode === 'encode' ? t('base64:outputLabel') : t('base64:outputLabelDecode')}
          value={output}
          readOnly
          status={status}
          rows={8}
          filename={mode === 'encode' ? 'encoded.txt' : 'decoded.txt'}
        />
      </div>
    </ToolLayout>
  )
}
