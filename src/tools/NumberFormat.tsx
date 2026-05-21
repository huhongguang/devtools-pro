import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { Copy } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

function numberToChinese(num: number): string {
  const digits = ['\u96f6', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d']
  const units = ['', '\u5341', '\u767e', '\u5343', '\u4e07', '\u5341\u4e07', '\u767e\u4e07', '\u5343\u4e07', '\u4ebf']
  if (num === 0) return '\u96f6'
  if (!isFinite(num)) return 'N/A'
  const str = Math.floor(Math.abs(num)).toString()
  let result = ''
  let needZero = false
  for (let i = 0; i < str.length; i++) {
    const d = parseInt(str[i])
    const pos = str.length - 1 - i
    if (d === 0) {
      needZero = true
    } else {
      if (needZero) result += '\u96f6'
      result += digits[d] + units[pos]
      needZero = false
    }
  }
  return (num < 0 ? '\u8d1f' : '') + result
}

function numberToCapital(num: number): string {
  const digits = ['\u96f6', '\u58f9', '\u8d30', '\u53c1', '\u8086', '\u4f0d', '\u9646', '\u67d2', '\u634c', '\u7396']
  const units = ['', '\u62fe', '\u4f70', '\u4edf', '\u4e07', '\u62fe\u4e07', '\u4f70\u4e07', '\u4edf\u4e07', '\u4ebf']
  const str = Math.floor(Math.abs(num)).toString()
  let result = ''
  let needZero = false
  for (let i = 0; i < str.length; i++) {
    const d = parseInt(str[i])
    const pos = str.length - 1 - i
    if (d === 0) { needZero = true }
    else { if (needZero) result += '\u96f6'; result += digits[d] + units[pos]; needZero = false }
  }
  const cents = Math.round((Math.abs(num) - Math.floor(Math.abs(num))) * 100)
  const fen = cents % 10
  const jiao = Math.floor(cents / 10)
  let money = (num < 0 ? '\u8d1f' : '') + result + '\u5143'
  if (jiao > 0) money += digits[jiao] + '\u89d2'
  if (fen > 0) money += digits[fen] + '\u5206'
  if (jiao === 0 && fen === 0) money += '\u6574'
  return money
}

export default function NumberFormat() {
  const { t } = useTranslation(['common', 'number-format'])
  const [input, setInput] = useState('1234567.89')
  const [result, setResult] = useState<Array<{ key: string; label: string; value: string }>>([])

  const process = () => {
    const n = parseFloat(input.replace(/,/g, ''))
    if (isNaN(n)) return
    setResult([
      { key: 'commaSeparated',  label: t('number-format:commaSeparated',  'Comma separated'),    value: n.toLocaleString('en-US') },
      { key: 'fixed2',          label: t('number-format:fixed2',          'Fixed 2 decimals'),   value: n.toFixed(2) },
      { key: 'scientific',      label: t('number-format:scientific',      'Scientific'),         value: n.toExponential(2) },
      { key: 'percentage',      label: t('number-format:percentage',      'Percentage'),         value: (n / 100).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2 }) },
      { key: 'currencyUSD',     label: t('number-format:currencyUSD',     'Currency (USD)'),     value: n.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) },
      { key: 'currencyCNY',     label: t('number-format:currencyCNY',     'Currency (CNY)'),     value: n.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' }) },
      { key: 'chinesePlain',    label: t('number-format:chinesePlain',    'Chinese (普通)'),     value: numberToChinese(n) },
      { key: 'chineseCapital',  label: t('number-format:chineseCapital',  'Chinese (大写)'),     value: numberToCapital(n) },
      { key: 'binary',          label: t('number-format:binary',          'Binary'),             value: Math.floor(n).toString(2) },
      { key: 'hexadecimal',     label: t('number-format:hexadecimal',     'Hexadecimal'),        value: Math.floor(n).toString(16).toUpperCase() },
      { key: 'octal',           label: t('number-format:octal',           'Octal'),              value: Math.floor(n).toString(8) },
      { key: 'bytes',           label: t('number-format:bytes',           'Bytes'),              value: n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(1) + ' KB' : (n / 1048576).toFixed(1) + ' MB' },
    ])
  }

  return (
    <ToolLayout name={t('tools:number-format.name', 'Number Format')} description={t('tools:number-format.description', 'Format numbers in various styles including Chinese capitals')} category="convert" toolId="number-format">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
        <div className="flex gap-2">
          <input
            className="code-area flex-1 px-3 py-2.5 font-mono text-lg"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t('number-format:placeholder', 'Enter a number...')}
            onKeyDown={e => e.key === 'Enter' && process()}
          />
          <button className="btn-primary px-6" onClick={process}>{t('common:actions.format', 'Format')}</button>
        </div>

        {result.length > 0 && (
          <div className="tool-card overflow-hidden">
            {result.map(({ key, label, value }) => (
              <div key={key} className="flex items-center justify-between px-4 py-2.5 border-b border-border last:border-0 hover:bg-surface-elevated group">
                <span className="text-xs text-muted-foreground w-36">{label}</span>
                <span className="font-mono text-sm text-foreground flex-1 ms-4">{value}</span>
                <button className="btn-ghost py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(value)}>
                  <Copy size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
