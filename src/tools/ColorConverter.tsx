import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { Copy } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (!m) return null
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100; l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) }
}

function toHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

export default function ColorConverter() {
  const { t } = useTranslation(['common', 'color-converter'])
  const [hex, setHex] = useState('#7c3aed')
  const [rgb, setRgb] = useState({ r: 124, g: 58, b: 237 })
  const [hsl, setHsl] = useState({ h: 262, s: 83, l: 58 })
  const [pickerColor, setPickerColor] = useState('#7c3aed')
  const pickerRef = useRef<HTMLInputElement>(null)

  const updateFromHex = (h: string) => {
    const r = hexToRgb(h)
    if (!r) return
    setRgb(r)
    setHsl(rgbToHsl(r.r, r.g, r.b))
    setPickerColor(h)
  }

  const updateFromRgb = (r: { r: number; g: number; b: number }) => {
    setRgb(r)
    const h = toHex(r.r, r.g, r.b)
    setHex(h); setPickerColor(h)
    setHsl(rgbToHsl(r.r, r.g, r.b))
  }

  const updateFromHsl = (h: { h: number; s: number; l: number }) => {
    setHsl(h)
    const r = hslToRgb(h.h, h.s, h.l)
    setRgb(r)
    const hex = toHex(r.r, r.g, r.b)
    setHex(hex); setPickerColor(hex)
  }

  const textColor = hsl.l > 55 ? '#000' : '#fff'

  return (
    <ToolLayout name={t('tools:color-converter.name', 'Color Converter')} description={t('tools:color-converter.description', 'Convert colors between HEX, RGB, and HSL formats')} category="convert" toolId="color-converter">
      <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
        {/* Preview */}
        <div className="tool-card overflow-hidden">
          <div className="h-24 flex items-center justify-center transition-colors" style={{ background: hex }}>
            <span className="font-bold text-lg font-mono" style={{ color: textColor }}>{hex}</span>
          </div>
          <div className="p-3 flex items-center gap-2">
            <input
              ref={pickerRef}
              type="color"
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              value={pickerColor}
              onChange={e => { setPickerColor(e.target.value); setHex(e.target.value); updateFromHex(e.target.value) }}
            />
            <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => pickerRef.current?.click()}>
              {t('color-converter:openPicker', 'Open color picker')}
            </button>
          </div>
        </div>

        {/* HEX */}
        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">HEX</div>
          <div className="flex items-center gap-2">
            <input
              className="code-area flex-1 px-3 py-2 font-mono text-sm uppercase"
              value={hex}
              onChange={e => { setHex(e.target.value); updateFromHex(e.target.value) }}
              placeholder="#000000"
            />
            <button className="btn-ghost" onClick={() => copyToClipboard(hex)}><Copy size={13} /></button>
          </div>
        </div>

        {/* RGB */}
        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">RGB</div>
          <div className="grid grid-cols-3 gap-2">
            {(['r', 'g', 'b'] as const).map((c, i) => (
              <div key={c}>
                <label className="text-[10px] text-muted-foreground uppercase">{[t('color-converter:red','Red'), t('color-converter:green','Green'), t('color-converter:blue','Blue')][i]}</label>
                <input
                  type="number" min={0} max={255}
                  className="code-area w-full px-2 py-1.5 font-mono text-sm mt-0.5"
                  value={rgb[c]}
                  onChange={e => updateFromRgb({ ...rgb, [c]: Math.min(255, Math.max(0, parseInt(e.target.value) || 0)) })}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <code className="text-xs font-mono text-muted-foreground">rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
            <button className="btn-ghost py-0.5 px-2 text-xs ms-auto" onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}><Copy size={11} /></button>
          </div>
        </div>

        {/* HSL */}
        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">HSL</div>
          <div className="grid grid-cols-3 gap-2">
            {(['h', 's', 'l'] as const).map((c, i) => (
              <div key={c}>
                <label className="text-[10px] text-muted-foreground uppercase">{[t('color-converter:hue','Hue (0-360)'), t('color-converter:sat','Sat (%)'), t('color-converter:light','Light (%)')][i]}</label>
                <input
                  type="number" min={0} max={[360, 100, 100][i]}
                  className="code-area w-full px-2 py-1.5 font-mono text-sm mt-0.5"
                  value={hsl[c]}
                  onChange={e => updateFromHsl({ ...hsl, [c]: Math.min([360, 100, 100][i], Math.max(0, parseInt(e.target.value) || 0)) })}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <code className="text-xs font-mono text-muted-foreground">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
            <button className="btn-ghost py-0.5 px-2 text-xs ms-auto" onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}><Copy size={11} /></button>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
