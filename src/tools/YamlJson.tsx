import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout, IoArea } from '@/components/layout/ToolLayout'
import yaml from 'js-yaml'

export default function YamlJson() {
  const { t } = useTranslation(['common', 'yaml-json'])
  const [input, setInput] = useState(`name: DevTools Pro
version: 1.0
tools:
  - name: JSON Formatter
    category: format
  - name: Base64
    category: encode
features:
  hot: true
  offline: true`)
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'yaml2json' | 'json2yaml'>('yaml2json')
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const convert = () => {
    if (!input.trim()) return
    try {
      if (mode === 'yaml2json') {
        const parsed = yaml.load(input)
        setOutput(JSON.stringify(parsed, null, 2))
        setStatus({ ok: true, msg: t('yaml-json:convertedToJson', '✓ Converted to JSON') })
      } else {
        const parsed = JSON.parse(input)
        setOutput(yaml.dump(parsed, { indent: 2, lineWidth: 80 }))
        setStatus({ ok: true, msg: t('yaml-json:convertedToYaml', '✓ Converted to YAML') })
      }
    } catch (e: unknown) {
      setStatus({ ok: false, msg: (e as Error).message })
      setOutput('')
    }
  }

  const swap = () => {
    setInput(output)
    setOutput('')
    setMode(m => m === 'yaml2json' ? 'json2yaml' : 'yaml2json')
    setStatus(null)
  }

  return (
    <ToolLayout name={t('tools:yaml-json.name', 'YAML ↔ JSON')} description={t('tools:yaml-json.description', 'Convert between YAML and JSON formats bidirectionally')} category="convert" toolId="yaml-json">
      <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            {(['yaml2json', 'json2yaml'] as const).map(m => (
              <button key={m} className={`btn-ghost py-1 px-3 text-xs ${mode === m ? 'border-primary/50 text-foreground' : ''}`}
                onClick={() => { setMode(m); setOutput(''); setStatus(null) }}>
                {m === 'yaml2json' ? t('yaml-json:modeYamlToJson', 'YAML → JSON') : t('yaml-json:modeJsonToYaml', 'JSON → YAML')}
              </button>
            ))}
          </div>
          <IoArea label={mode === 'yaml2json' ? t('yaml-json:yamlInput', 'YAML Input') : t('yaml-json:jsonInput', 'JSON Input')} value={input} onChange={setInput} rows={18} />
          <div className="flex gap-2">
            <button className="btn-primary" onClick={convert}>{t('common:actions.convert', 'Convert')} →</button>
            <button className="btn-ghost" onClick={swap}>⇄ {t('common:actions.swap', 'Swap')}</button>
            <button className="btn-ghost" onClick={() => { setInput(''); setOutput(''); setStatus(null) }}>{t('common:actions.clear', 'Clear')}</button>
          </div>
        </div>
        <IoArea
          label={mode === 'yaml2json' ? t('yaml-json:jsonOutput', 'JSON Output') : t('yaml-json:yamlOutput', 'YAML Output')}
          value={output}
          readOnly
          status={status}
          rows={22}
          filename={mode === 'yaml2json' ? 'output.json' : 'output.yaml'}
        />
      </div>
    </ToolLayout>
  )
}
