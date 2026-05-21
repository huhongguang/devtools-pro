import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TOOLS, CATEGORIES, type Category } from '@/lib/tools'
import { Search, X, Zap, Github, Moon, Sun, Globe } from 'lucide-react'

const categoryOrder: Category[] = ['format', 'encode', 'generate', 'convert', 'text', 'web']

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ru', label: 'Русский' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ar', label: 'العربية' },
]

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (code: string) => {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        title={current.label}
      >
        <Globe size={14} />
      </button>
      {open && (
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-40 bg-surface-elevated border border-border rounded-lg shadow-xl overflow-hidden z-50 py-1">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`w-full text-start px-3 py-1.5 text-xs hover:bg-muted transition-colors flex items-center justify-between ${
                lang.code === i18n.language ? 'text-primary font-semibold' : 'text-foreground'
              }`}
              dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
            >
              <span>{lang.label}</span>
              {lang.code === i18n.language && <span className="text-primary">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface SidebarProps {
  darkMode: boolean
  onToggleDark: () => void
}

export default function Sidebar({ darkMode, onToggleDark }: SidebarProps) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation(['common', 'tools'])

  const currentTool = location.pathname.replace('/tools/', '')
  const filtered = search
    ? TOOLS.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.keywords.some(k => k.includes(search.toLowerCase()))
      )
    : null

  const grouped = categoryOrder.reduce<Record<Category, typeof TOOLS>>((acc, cat) => {
    acc[cat] = TOOLS.filter(t => t.category === cat)
    return acc
  }, {} as Record<Category, typeof TOOLS>)

  return (
    <aside className="flex flex-col w-60 h-screen border-e border-border bg-background flex-shrink-0 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/')}>
        <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
          <Zap size={14} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-sm text-gradient">DevTools Pro</div>
          <div className="text-[10px] text-muted-foreground">{t('common:app.tagline')}</div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-border">
        <div className="relative">
          <Search size={13} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full bg-muted border border-border rounded-lg ps-8 pe-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            placeholder={t('common:nav.searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2">
        {/* Home */}
        <div
          className={`sidebar-item mb-1 ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <span className="text-base">🏠</span>
          <span>{t('common:nav.allTools')}</span>
          <span className="ms-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{TOOLS.length}</span>
        </div>

        {filtered ? (
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {t('common:nav.searchResults', { count: filtered.length })}
            </div>
            {filtered.map(tool => (
              <div
                key={tool.id}
                className={`sidebar-item ${currentTool === tool.id ? 'active' : ''}`}
                onClick={() => navigate(`/tools/${tool.id}`)}
              >
                <span className="text-sm font-mono w-6 text-center">{tool.icon}</span>
                <span className="truncate">{t(`tools:${tool.id}.name`, tool.name)}</span>
              </div>
            ))}
          </div>
        ) : (
          categoryOrder.map(cat => (
            <div key={cat} className="mb-3">
              <div
                className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider mb-0.5"
                style={{ color: CATEGORIES[cat].color }}
              >
                {t(`tools:categories.${cat}`, CATEGORIES[cat].label)}
              </div>
              {grouped[cat].map(tool => (
                <div
                  key={tool.id}
                  className={`sidebar-item ${currentTool === tool.id ? 'active' : ''}`}
                  onClick={() => navigate(`/tools/${tool.id}`)}
                >
                  <span className="text-sm font-mono w-6 text-center leading-none">{tool.icon}</span>
                  <span className="truncate">{t(`tools:${tool.id}.name`, tool.name)}</span>
                  {tool.hot && (
                    <span className="ms-auto text-[9px] font-bold px-1 py-0.5 rounded" style={{ background: 'hsl(262 83% 67% / 0.15)', color: 'hsl(262 83% 72%)' }}>
                      {t('common:nav.hotBadge')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-2.5 flex items-center justify-between">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors">
          <Github size={14} />
        </a>
        <LanguageSwitcher />
        <button onClick={onToggleDark} className="text-muted-foreground hover:text-foreground transition-colors">
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <span className="text-[10px] text-muted-foreground">v1.0.0</span>
      </div>
    </aside>
  )
}
