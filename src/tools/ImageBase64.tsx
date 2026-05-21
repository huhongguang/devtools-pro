import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { Upload, Copy, Check } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

export default function ImageBase64() {
  const { t } = useTranslation(['common', 'image-base64'])
  const [dataUri, setDataUri] = useState('')
  const [info, setInfo] = useState<{ name: string; size: string; type: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [decodeInput, setDecodeInput] = useState('')
  const [decodedSrc, setDecodedSrc] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setInfo({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', type: file.type })
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result as string
      setDataUri(result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleFile(file)
  }

  const handleCopy = async (v: string) => {
    await copyToClipboard(v)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const decode = () => {
    const src = decodeInput.trim()
    if (src.startsWith('data:image') || src.startsWith('http')) {
      setDecodedSrc(src)
    } else {
      setDecodedSrc('data:image/png;base64,' + src)
    }
  }

  return (
    <ToolLayout name={t('tools:image-base64.name', 'Image → Base64')} description={t('tools:image-base64.description', 'Convert images to Base64 data URIs for embedding in code')} category="encode" toolId="image-base64">
      <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
        {/* Upload */}
        <div
          className="tool-card border-dashed p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
          <div className="text-sm font-medium text-foreground mb-1">{t('image-base64:dropHint', 'Drop image here or click to upload')}</div>
          <div className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP, SVG</div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        {dataUri && (
          <>
            {info && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{info.name}</span>
                <span>{info.type}</span>
                <span>{info.size}</span>
                <span>{Math.round(dataUri.length / 1024)} KB (Base64)</span>
              </div>
            )}
            <img src={dataUri} alt="preview" className="max-h-48 rounded-lg border border-border object-contain" />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('image-base64:dataUriLabel', 'Data URI')}</label>
                <button className="btn-ghost py-1 px-2 text-xs" onClick={() => handleCopy(dataUri)}>
                  {copied ? <><Check size={11} className="status-success" /> {t('common:actions.copied', 'Copied')}</> : <><Copy size={11} /> {t('common:actions.copy', 'Copy')}</>}
                </button>
              </div>
              <textarea
                className="code-area w-full p-3 font-mono text-[11px]"
                rows={4}
                value={dataUri}
                readOnly
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('image-base64:cssBgLabel', 'CSS Background')}</div>
              <code className="font-mono text-xs text-muted-foreground p-2 bg-muted rounded">background-image: url('{dataUri.slice(0, 60)}...')</code>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('image-base64:htmlImgLabel', 'HTML img tag')}</div>
              <code className="font-mono text-xs text-muted-foreground p-2 bg-muted rounded">&lt;img src="{dataUri.slice(0, 50)}..." alt="image" /&gt;</code>
            </div>
          </>
        )}

        {/* Decode section */}
        <div className="tool-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('image-base64:decodeTitle', 'Decode Base64 → Preview')}</div>
          <div className="flex gap-2">
            <input
              className="code-area flex-1 px-3 py-2 font-mono text-xs"
              placeholder={t('image-base64:decodePlaceholder', 'Paste data URI or raw Base64...')}
              value={decodeInput}
              onChange={e => setDecodeInput(e.target.value)}
            />
            <button className="btn-primary px-4" onClick={decode}>{t('common:actions.preview', 'Preview')}</button>
          </div>
          {decodedSrc && <img src={decodedSrc} alt="decoded" className="mt-3 max-h-40 rounded border border-border object-contain" onError={e => (e.currentTarget.style.display = 'none')} />}
        </div>
      </div>
    </ToolLayout>
  )
}
