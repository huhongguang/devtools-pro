import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link2, Copy, Check, BookmarkPlus } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

interface ShareBookmarkBarProps {
  toolId: string
  toolName: string
}

function WeiboIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm-1.763-7.247c-2.607.269-4.31 2.113-3.804 4.122.501 2.005 2.962 3.291 5.57 3.021 2.606-.268 4.31-2.109 3.804-4.117-.501-2.008-2.962-3.293-5.57-3.026zm1.558 4.364c-.254.6-.937.889-1.525.645-.582-.239-.824-.889-.57-1.484.251-.594.926-.886 1.512-.65.59.24.835.889.583 1.489zm1.22-1.483c-.1.227-.34.34-.537.251-.194-.087-.283-.345-.183-.572.102-.228.338-.34.534-.252.198.09.289.348.186.573zm.986-3.736c-1.621-.491-3.458.092-4.162 1.308-.714 1.232-.084 2.648 1.538 3.14 1.675.51 3.545-.076 4.227-1.319.676-1.229.024-2.627-1.603-3.129zm6.468-2.421c-.303-1.049-1.274-1.667-2.252-1.621l-.345-.751c1.282-.09 2.527.719 2.934 2.009.405 1.283-.155 2.627-1.284 3.168l-.351-.747c.856-.398 1.299-1.375 1.298-2.058zM17.64 6.41c1.367.438 2.258 1.584 2.394 2.867l-.811.027c-.107-1.064-.806-1.97-1.88-2.316-1.066-.342-2.17-.019-2.852.736l-.602-.479c.851-.936 2.279-1.293 3.751-.835z"/>
    </svg>
  )
}

function TwitterXIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function FacebookIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function LinkedInIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

const SHARE_URLS: Record<string, (url: string, title: string) => string> = {
  weibo:    (url, title) => `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  twitter:  (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  facebook: (url)        => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  linkedin: (url)        => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
}

export default function ShareBookmarkBar({ toolName }: ShareBookmarkBarProps) {
  const { t } = useTranslation('common')
  const [copied, setCopied] = useState(false)

  const url = window.location.href
  const shareTitle = `${toolName} — DevTools Pro`

  const handleCopy = useCallback(async () => {
    await copyToClipboard(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }, [url])

  const handleShare = useCallback((platform: string) => {
    const fn = SHARE_URLS[platform]
    if (!fn) return
    window.open(fn(url, shareTitle), '_blank', 'noopener,noreferrer,width=600,height=500')
  }, [url, shareTitle])

  const handleBookmark = useCallback(() => {
    const w = window as any
    if (w.external && typeof w.external.AddFavorite === 'function') {
      w.external.AddFavorite(url, shareTitle)
      return
    }
    if (w.sidebar && typeof w.sidebar.addPanel === 'function') {
      w.sidebar.addPanel(shareTitle, url, '')
      return
    }
    const isMac = navigator.platform.toUpperCase().includes('MAC')
    const shortcut = isMac ? '⌘+D' : 'Ctrl+D'
    alert(t('share.bookmarkHint', `Press ${shortcut} to bookmark this page`, { shortcut }))
  }, [url, shareTitle, t])

  return (
    <div className="flex flex-col items-center gap-3 py-4 px-1.5 border-e border-border bg-surface w-10 flex-shrink-0">

      {/* URL copy button — icon only, tooltip shows full URL */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleCopy}
          className={`btn-ghost p-1.5 flex flex-col items-center gap-0.5 ${copied ? '' : 'text-muted-foreground hover:text-foreground'}`}
          title={`${t('share.copyUrl')}: ${url}`}
        >
          {copied
            ? <Check size={14} className="status-success" />
            : <Link2 size={14} />
          }
          <span className="text-[9px] leading-none">
            {copied ? t('share.urlCopied').split(' ')[0] : 'URL'}
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-5 h-px bg-border" />

      {/* Social share buttons — vertical */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => handleShare('weibo')}
          className="btn-ghost p-1.5 text-muted-foreground hover:text-foreground"
          title={t('share.shareToWeibo')}
        >
          <WeiboIcon size={14} />
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="btn-ghost p-1.5 text-muted-foreground hover:text-foreground"
          title={t('share.shareToTwitter')}
        >
          <TwitterXIcon size={14} />
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="btn-ghost p-1.5 text-muted-foreground hover:text-foreground"
          title={t('share.shareToFacebook')}
        >
          <FacebookIcon size={14} />
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="btn-ghost p-1.5 text-muted-foreground hover:text-foreground"
          title={t('share.shareToLinkedIn')}
        >
          <LinkedInIcon size={14} />
        </button>
      </div>

      {/* Divider */}
      <div className="w-5 h-px bg-border" />

      {/* Bookmark this page */}
      <button
        onClick={handleBookmark}
        className="btn-ghost p-1.5 flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground"
        title={t('share.bookmark')}
      >
        <BookmarkPlus size={14} />
        <span className="text-[9px] leading-none">☆</span>
      </button>

    </div>
  )
}
