import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout, IoArea } from '@/components/layout/ToolLayout'

const ENTITIES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;'
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"'/]/g, c => ENTITIES[c] || c)
}

function unescapeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#(d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
}

const CHAR_TABLE = [
  { char: '&', entity: '&amp;', code: '&#38;' },
  { char: '<', entity: '&lt;', code: '&#60;' },
  { char: '>', entity: '&gt;', code: '&#62;' },
  { char: '"', entity: '&quot;', code: '&#34;' },
  { char: "'", entity: '&#x27;', code: '&#39;' },
  { char: 'c', entity: '&copy;', code: '&#169;' },
  { char: 'r', entity: '&reg;', code: '&#174;' },
  { char: 'tm', entity: '&trade;', code: '&#8482;' },
  { char: 'eu', entity: '&euro;', code: '&#8364;' },
  { char: 'lb', entity: '&pound;', code: '&#163;' },
  { char: 'yn', entity: '&yen;', code: '&#165;' },
  { char: '->', entity: '&rarr;', code: '&#8594;' },
  { char: '<-', entity: '&larr;', code: '&#8592;' },
  { char: 'ok', entity: '&check;', code: '&#10003;' },
  { char: 'x', entity: '&times;', code: '&#215;' },
  { char: '/', entity: '&divide;', code: '&#247;' },
]

export default function HtmlEscape() {
  const { t } = useTranslation(['common', 'html-escape'])
  const [input, setInput] = useState('<h1>Hello "World" & <em>DevTools</em>!</h1>')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape')

  const process = () => {
    setOutput(mode === 'escape' ? escapeHtml(input) : unescapeHtml(input))
  }

  return (
    <ToolLayout name={t('tools:html-escape.name', 'HTML Escape')} description={t('tools:html-escape.description', 'Escape HTML special characters and decode HTML entities')} category="encode" toolId="html-escape">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2">
          {(['escape', 'unescape'] as const).map(m => (
            <button key={m} className={`btn-ghost py-1 px-4 text-xs capitalize ${mode === m ? 'border-primary/50 text-foreground' : ''}`}
              onClick={() => { setMode(m); setOutput('') }}>{t(`html-escape:mode${m.charAt(0).toUpperCase() + m.slice(1)}`, m)}</button>
          ))}
        </div>
        <IoArea
          label={mode === 'escape' ? t('html-escape:inputLabelEscape', 'HTML / Text') : t('html-escape:inputLabelUnescape', 'Escaped HTML')}
          value={input}
          onChange={setInput}
          placeholder={mode === 'escape' ? '<h1>Hello "World"</h1>' : '&lt;h1&gt;Hello &quot;World&quot;&lt;/h1&gt;'}
          rows={6}
        />
        <div className="flex gap-2">
          <button className="btn-primary" onClick={process}>{mode === 'escape' ? t('html-escape:modeEscape', 'Escape') : t('html-escape:modeUnescape', 'Unescape')}</button>
          <button className="btn-ghost" onClick={() => { setInput(output); setOutput(''); setMode(m => m === 'escape' ? 'unescape' : 'escape') }}>{t('common:actions.swap', 'Swap')}</button>
          <button className="btn-ghost" onClick={() => { setInput(''); setOutput('') }}>{t('common:actions.clear', 'Clear')}</button>
        </div>
        <IoArea label={t('html-escape:resultLabel', 'Result')} value={output} readOnly rows={6} />

        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t('html-escape:commonEntities', 'Common HTML Entities')}</div>
          <div className="grid grid-cols-4 gap-1 text-xs">
            <div className="font-semibold text-muted-foreground py-1">{t('html-escape:colChar', 'Char')}</div>
            <div className="font-semibold text-muted-foreground py-1">{t('html-escape:colEntity', 'Entity')}</div>
            <div className="font-semibold text-muted-foreground py-1">{t('html-escape:colCode', 'Code')}</div>
            <div className="font-semibold text-muted-foreground py-1"></div>
            {CHAR_TABLE.map(({ char, entity, code }) => (
              <>
                <div key={'c-'+char} className="font-mono py-1 text-foreground">{char}</div>
                <div key={'e-'+char} className="font-mono py-1 text-primary">{entity}</div>
                <div key={'n-'+char} className="font-mono py-1 text-muted-foreground">{code}</div>
                <button key={'b-'+char} className="text-[10px] text-muted-foreground hover:text-foreground text-left" onClick={() => setInput(input + entity)}>{t('common:actions.insert', 'insert')}</button>
              </>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
