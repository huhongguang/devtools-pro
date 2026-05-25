import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TOOLS, CATEGORIES, type Category } from '@/lib/tools'
import { Zap, TrendingUp } from 'lucide-react'
import SEOHead from '@/components/seo/SEOHead'

const SITE_URL = 'https://www.devtoolspro.app'
const categoryOrder: Category[] = ['format', 'encode', 'generate', 'convert', 'text', 'web']

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DevTools Pro',
  url: SITE_URL,
  description: 'Free online developer tools — JSON formatter, Base64, regex tester, JWT decoder, timestamp converter and 15+ more tools for developers.',
}

export default function HomePage() {
  const navigate = useNavigate()
  const { t } = useTranslation(['common', 'tools'])
  const hotTools = TOOLS.filter(t => t.hot)

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
      <SEOHead
        title="DevTools Pro — 20 Free Developer Utilities"
        description="Free online developer tools — JSON formatter, Base64, regex tester, JWT decoder, timestamp converter and 15+ more. All run locally in your browser, no signup required."
        canonicalPath="/"
        keywords={['developer tools', 'online tools', 'json formatter', 'base64', 'regex', 'jwt', 'hash', 'uuid', 'password generator']}
        jsonLd={homeJsonLd}
      />
      {/* Hero */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto w-full px-8 py-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">DevTools Pro</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-lg">
            {t('common:app.description')} {t('common:app.noSignup')}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              {t('common:home.allRunLocally')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              {t('common:home.toolsReady', { count: TOOLS.length })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto w-full px-8 py-6 flex flex-col gap-8">
        {/* Hot tools */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">{t('common:home.mostUsed')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {hotTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} onClick={() => navigate(`/tools/${tool.id}`)} hot />
            ))}
          </div>
        </div>

        {/* By category */}
        {categoryOrder.map(cat => {
          const tools = TOOLS.filter(t => t.category === cat)
          const catInfo = CATEGORIES[cat]
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: catInfo.color }} />
                <h2 className="text-sm font-semibold" style={{ color: catInfo.color }}>
                  {t(`tools:categories.${cat}`, catInfo.label)}
                </h2>
                <span className="text-xs text-muted-foreground">({tools.length})</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} onClick={() => navigate(`/tools/${tool.id}`)} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ToolCard({ tool, onClick, hot }: { tool: typeof TOOLS[0]; onClick: () => void; hot?: boolean }) {
  const { t } = useTranslation(['common', 'tools'])
  const catInfo = CATEGORIES[tool.category]
  return (
    <button
      className="tool-card p-4 text-left group cursor-pointer w-full"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center font-mono text-sm font-bold flex-shrink-0"
          style={{ background: catInfo.bg, color: catInfo.color }}
        >
          {tool.icon}
        </div>
        {hot && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'hsl(262 83% 67% / 0.15)', color: 'hsl(262 83% 72%)' }}>
            {t('common:nav.hotBadge')}
          </span>
        )}
      </div>
      <div className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
        {t(`tools:${tool.id}.name`, tool.name)}
      </div>
      <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {t(`tools:${tool.id}.description`, tool.description)}
      </div>
    </button>
  )
}
