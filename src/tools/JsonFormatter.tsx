import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout, IoArea } from '@/components/layout/ToolLayout'

export default function JsonFormatter() {
  const { t } = useTranslation(['common', 'json-formatter'])
  const [input, setInput] = useState('{"name":"DevTools Pro","version":"1.0","tools":20,"features":["fast","free","beautiful"]}')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState(2)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
      setStatus({ ok: true, msg: t('common:status.validJson') })
    } catch (e: unknown) {
      setStatus({ ok: false, msg: (e as Error).message })
      setOutput('')
    }
  }, [input, indent, t])

  const minify = useCallback(() => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setStatus({ ok: true, msg: t('common:status.minified') })
    } catch (e: unknown) {
      setStatus({ ok: false, msg: (e as Error).message })
    }
  }, [input, t])

  const sortKeys = useCallback(() => {
    try {
      const parsed = JSON.parse(input)
      const sorted = JSON.parse(JSON.stringify(parsed, Object.keys(parsed).sort()))
      setOutput(JSON.stringify(sorted, null, indent))
      setStatus({ ok: true, msg: t('common:status.keysSorted') })
    } catch (e: unknown) {
      setStatus({ ok: false, msg: (e as Error).message })
    }
  }, [input, indent, t])

  return (
    <ToolLayout name={t('tools:json-formatter.name')} description={t('tools:json-formatter.description')} category="format" toolId="json-formatter">
      <div className="grid grid-cols-2 gap-4 h-full max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          <IoArea label={t('json-formatter:inputLabel')} value={input} onChange={setInput} placeholder={t('json-formatter:placeholders.input')} rows={18} />
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t('json-formatter:indent')}:</span>
              {[2, 4].map(n => (
                <button
                  key={n}
                  className={`btn-ghost py-1 px-3 text-xs ${indent === n ? 'border-primary/50 text-foreground' : ''}`}
                  onClick={() => setIndent(n)}
                >{n}</button>
              ))}
            </div>
            <button className="btn-primary" onClick={format}>{t('json-formatter:actions.format')}</button>
            <button className="btn-ghost" onClick={minify}>{t('json-formatter:actions.minify')}</button>
            <button className="btn-ghost" onClick={sortKeys}>{t('json-formatter:actions.sortKeys')}</button>
            <button className="btn-ghost" onClick={() => { setInput(''); setOutput(''); setStatus(null) }}>{t('common:actions.clear')}</button>
          </div>
        </div>
        <IoArea label={t('json-formatter:outputLabel')} value={output} readOnly status={status} rows={18} filename="output.json" />
      </div>
    </ToolLayout>
  )
}
