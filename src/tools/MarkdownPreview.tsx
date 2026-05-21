import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const SAMPLE = `# Hello, DevTools Pro!

A **beautiful** and *functional* markdown editor.

## Features

- Live preview as you type
- \`Syntax highlighting\` for code
- Tables, lists, and more

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`
}
console.log(greet('DevTools'))
\`\`\`

## Table

| Tool | Category | Hot |
|------|----------|-----|
| JSON Formatter | Format | ✓ |
| Base64 | Encode | ✓ |
| Regex Tester | Text | ✓ |

> **Tip:** This editor renders Markdown in real-time.
`

export default function MarkdownPreview() {
  const { t } = useTranslation(['common', 'markdown-preview'])
  const [md, setMd] = useState(SAMPLE)
  const [view, setView] = useState<'split' | 'preview' | 'editor'>('split')

  const html = DOMPurify.sanitize(marked(md, { breaks: true, gfm: true }) as string)

  return (
    <ToolLayout name={t('tools:markdown-preview.name', 'Markdown Preview')} description={t('tools:markdown-preview.description', 'Write Markdown with live side-by-side HTML preview')} category="text" toolId="markdown-preview">
      <div className="flex flex-col gap-3 h-full max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          {(['split', 'editor', 'preview'] as const).map(v => (
            <button key={v} className={`btn-ghost py-1 px-3 text-xs capitalize ${view === v ? 'border-primary/50 text-foreground' : ''}`} onClick={() => setView(v)}>{t(`markdown-preview:view${v.charAt(0).toUpperCase() + v.slice(1)}`, v)}</button>
          ))}
          <button className="btn-ghost ms-auto py-1 px-3 text-xs" onClick={() => setMd('')}>{t('common:actions.clear', 'Clear')}</button>
        </div>

        <div className="flex gap-4 flex-1 min-h-0" style={{ height: 'calc(100vh - 200px)' }}>
          {view !== 'preview' && (
            <div className="flex flex-col flex-1 min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 px-1">{t('markdown-preview:editorLabel', 'Markdown')}</div>
              <textarea
                className="code-area flex-1 p-3 text-sm resize-none"
                value={md}
                onChange={e => setMd(e.target.value)}
                placeholder={t('markdown-preview:placeholder', 'Type Markdown here...')}
              />
            </div>
          )}
          {view !== 'editor' && (
            <div className="flex flex-col flex-1 min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 px-1">{t('markdown-preview:previewLabel', 'Preview')}</div>
              <div
                className="flex-1 p-4 rounded-lg border border-border bg-muted overflow-y-auto scrollbar-thin prose-devtools"
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ color: 'hsl(213 31% 91%)', fontSize: '14px', lineHeight: 1.7 }}
              />
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
