import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout, IoArea } from '@/components/layout/ToolLayout'

function formatJS(code: string, indent: number): string {
  try {
    // Simple JS formatter: parse function bodies using JSON for objects, manual for code
    let level = 0
    let result = ''
    const lines = code.replace(/\s+/g, ' ').trim().split('')
    const ind = ' '.repeat(indent)
    let inStr = false; let strChar = ''
    for (let i = 0; i < lines.length; i++) {
      const c = lines[i]
      if (!inStr && (c === '"' || c === "'" || c === '`')) { inStr = true; strChar = c; result += c; continue }
      if (inStr && c === strChar && lines[i - 1] !== '\\') { inStr = false; result += c; continue }
      if (inStr) { result += c; continue }
      if (c === '{' || c === '[') { level++; result += c + '\n' + ind.repeat(level) }
      else if (c === '}' || c === ']') { level--; result += '\n' + ind.repeat(level) + c }
      else if (c === ',') { result += c + '\n' + ind.repeat(level) }
      else if (c === ':') { result += c + ' ' }
      else if (c === ';') { result += c + '\n' + ind.repeat(level) }
      else { result += c }
    }
    return result.trim()
  } catch { return code }
}

function minifyCode(code: string, lang: string): string {
  if (lang === 'json') {
    try { return JSON.stringify(JSON.parse(code)) } catch { return code }
  }
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,=<>])\s*/g, '$1').trim()
}

function formatCSS(code: string, indent: number): string {
  return code
    .replace(/\s*{\s*/g, ' {\n' + ' '.repeat(indent))
    .replace(/;\s*/g, ';\n' + ' '.repeat(indent))
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/^\s+$/gm, '')
    .trim()
}

export default function CodeFormatter() {
  const { t } = useTranslation(['common', 'code-formatter'])
  const [input, setInput] = useState('{"name":"DevTools","tools":["JSON","Base64","Regex"],"version":1}')
  const [output, setOutput] = useState('')
  const [lang, setLang] = useState<'json' | 'css' | 'js'>('json')
  const [indent, setIndent] = useState(2)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const format = () => {
    try {
      let result = ''
      if (lang === 'json') {
        result = JSON.stringify(JSON.parse(input), null, indent)
      } else if (lang === 'css') {
        result = formatCSS(input, indent)
      } else {
        result = formatJS(input, indent)
      }
      setOutput(result)
      setStatus({ ok: true, msg: t('common:status.formatted', '✓ Formatted') })
    } catch (e: unknown) {
      setStatus({ ok: false, msg: (e as Error).message })
    }
  }

  const minify = () => {
    setOutput(minifyCode(input, lang))
    setStatus({ ok: true, msg: t('code-formatter:minifiedStatus', { from: input.length, to: minifyCode(input, lang).length }) })
  }

  return (
    <ToolLayout name={t('tools:code-formatter.name', 'Code Beautifier')} description={t('tools:code-formatter.description', 'Format and minify JSON, CSS, JavaScript code')} category="format" toolId="code-formatter">
      <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              {(['json', 'css', 'js'] as const).map(l => (
                <button key={l} className={`btn-ghost py-1 px-3 text-xs uppercase ${lang === l ? 'border-primary/50 text-foreground' : ''}`}
                  onClick={() => { setLang(l); setOutput(''); setStatus(null) }}>{l}</button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{t('code-formatter:indentLabel', 'Indent')}:</span>
              {[2, 4].map(n => (
                <button key={n} className={`btn-ghost py-1 px-2.5 text-xs ${indent === n ? 'border-primary/50 text-foreground' : ''}`}
                  onClick={() => setIndent(n)}>{n}</button>
              ))}
            </div>
          </div>
          <IoArea label={t('code-formatter:inputLabel', 'Input Code')} value={input} onChange={setInput} rows={18} />
          <div className="flex gap-2">
            <button className="btn-primary" onClick={format}>{t('common:actions.format', 'Format')}</button>
            <button className="btn-ghost" onClick={minify}>{t('code-formatter:minifyBtn', 'Minify')}</button>
            <button className="btn-ghost" onClick={() => { setInput(''); setOutput(''); setStatus(null) }}>{t('common:actions.clear', 'Clear')}</button>
          </div>
        </div>
        <IoArea label={t('code-formatter:outputLabel', 'Output')} value={output} readOnly status={status} rows={22} filename={`output.${lang}`} />
      </div>
    </ToolLayout>
  )
}
