import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { Search } from 'lucide-react'

interface StatusCode {
  code: number
  phrase: string
  description: string
  category: string
  color: string
}

const CODES: StatusCode[] = [
  // 1xx
  { code: 100, phrase: 'Continue', description: 'The server has received the request headers and the client should proceed.', category: '1xx', color: 'hsl(215 16% 52%)' },
  { code: 101, phrase: 'Switching Protocols', description: 'Requester asked server to switch protocols.', category: '1xx', color: 'hsl(215 16% 52%)' },
  { code: 103, phrase: 'Early Hints', description: 'Preload resources before the server sends a final response.', category: '1xx', color: 'hsl(215 16% 52%)' },
  // 2xx
  { code: 200, phrase: 'OK', description: 'Standard response for successful HTTP requests.', category: '2xx', color: 'hsl(142 71% 45%)' },
  { code: 201, phrase: 'Created', description: 'Request has been fulfilled and a new resource was created.', category: '2xx', color: 'hsl(142 71% 45%)' },
  { code: 202, phrase: 'Accepted', description: 'Request accepted for processing but not yet completed.', category: '2xx', color: 'hsl(142 71% 45%)' },
  { code: 204, phrase: 'No Content', description: 'Server processed the request, but no content is returned.', category: '2xx', color: 'hsl(142 71% 45%)' },
  { code: 206, phrase: 'Partial Content', description: 'Server is delivering only part of the resource (byte serving).', category: '2xx', color: 'hsl(142 71% 45%)' },
  // 3xx
  { code: 301, phrase: 'Moved Permanently', description: 'This and all future requests should be directed to the new URL.', category: '3xx', color: 'hsl(199 89% 48%)' },
  { code: 302, phrase: 'Found', description: 'Resource temporarily moved. Client should use same URL next time.', category: '3xx', color: 'hsl(199 89% 48%)' },
  { code: 304, phrase: 'Not Modified', description: 'Resource has not been modified since version in the request headers.', category: '3xx', color: 'hsl(199 89% 48%)' },
  { code: 307, phrase: 'Temporary Redirect', description: 'Request should be repeated with another URI, method preserved.', category: '3xx', color: 'hsl(199 89% 48%)' },
  { code: 308, phrase: 'Permanent Redirect', description: 'All future requests should use another URI, method preserved.', category: '3xx', color: 'hsl(199 89% 48%)' },
  // 4xx
  { code: 400, phrase: 'Bad Request', description: 'Server cannot process the request due to client error.', category: '4xx', color: 'hsl(38 92% 50%)' },
  { code: 401, phrase: 'Unauthorized', description: 'Authentication required. Credentials not provided or invalid.', category: '4xx', color: 'hsl(38 92% 50%)' },
  { code: 403, phrase: 'Forbidden', description: 'Server refuses to authorize the request.', category: '4xx', color: 'hsl(38 92% 50%)' },
  { code: 404, phrase: 'Not Found', description: 'The requested resource could not be found on the server.', category: '4xx', color: 'hsl(38 92% 50%)' },
  { code: 405, phrase: 'Method Not Allowed', description: 'Request method is not supported for the requested resource.', category: '4xx', color: 'hsl(38 92% 50%)' },
  { code: 408, phrase: 'Request Timeout', description: 'Server timed out waiting for the request.', category: '4xx', color: 'hsl(38 92% 50%)' },
  { code: 409, phrase: 'Conflict', description: 'Request conflicts with the current state of the server.', category: '4xx', color: 'hsl(38 92% 50%)' },
  { code: 410, phrase: 'Gone', description: 'Resource is no longer available and will not be available again.', category: '4xx', color: 'hsl(38 92% 50%)' },
  { code: 422, phrase: 'Unprocessable Entity', description: 'Request was well-formed but was unable to be followed due to semantic errors.', category: '4xx', color: 'hsl(38 92% 50%)' },
  { code: 429, phrase: 'Too Many Requests', description: 'User has sent too many requests in a given amount of time (rate limiting).', category: '4xx', color: 'hsl(38 92% 50%)' },
  // 5xx
  { code: 500, phrase: 'Internal Server Error', description: 'Generic error message for unexpected server conditions.', category: '5xx', color: 'hsl(0 72% 51%)' },
  { code: 501, phrase: 'Not Implemented', description: 'Server does not support the functionality required.', category: '5xx', color: 'hsl(0 72% 51%)' },
  { code: 502, phrase: 'Bad Gateway', description: 'Server received an invalid response from the upstream server.', category: '5xx', color: 'hsl(0 72% 51%)' },
  { code: 503, phrase: 'Service Unavailable', description: 'Server is not ready to handle the request. Common for maintenance.', category: '5xx', color: 'hsl(0 72% 51%)' },
  { code: 504, phrase: 'Gateway Timeout', description: 'Server acting as gateway did not get response in time.', category: '5xx', color: 'hsl(0 72% 51%)' },
  { code: 507, phrase: 'Insufficient Storage', description: 'Server is unable to store the representation to complete the request.', category: '5xx', color: 'hsl(0 72% 51%)' },
]

const CATS = ['1xx', '2xx', '3xx', '4xx', '5xx']
const CAT_LABELS: Record<string, string> = { '1xx': 'Informational', '2xx': 'Success', '3xx': 'Redirection', '4xx': 'Client Error', '5xx': 'Server Error' }

export default function HttpStatus() {
  const { t } = useTranslation(['common', 'http-status'])
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [selected, setSelected] = useState<StatusCode | null>(null)

  const filtered = CODES.filter(c => {
    const matchCat = cat === 'all' || c.category === cat
    const matchSearch = !search || c.code.toString().includes(search) || c.phrase.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <ToolLayout name={t('tools:http-status.name', 'HTTP Status Codes')} description={t('tools:http-status.description', 'Complete reference for all HTTP response status codes')} category="web" toolId="http-status">
      <div className="flex gap-4 max-w-7xl mx-auto w-full" style={{ height: 'calc(100vh - 160px)' }}>
        {/* List */}
        <div className="flex flex-col w-80 flex-shrink-0">
          <div className="relative mb-3">
            <Search size={13} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="code-area w-full ps-8 pe-3 py-2 text-sm" placeholder={t('http-status:searchPlaceholder', 'Search codes...')} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1 mb-3 flex-wrap">
            <button className={`btn-ghost py-0.5 px-2 text-xs ${cat === 'all' ? 'border-primary/50 text-foreground' : ''}`} onClick={() => setCat('all')}>{t('http-status:filterAll', 'All')}</button>
            {CATS.map(c => (
              <button key={c} className={`btn-ghost py-0.5 px-2 text-xs ${cat === c ? 'border-primary/50 text-foreground' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col gap-1">
            {filtered.map(code => (
              <button
                key={code.code}
                className={`w-full text-left p-2.5 rounded-lg border transition-all ${selected?.code === code.code ? 'border-primary/40 bg-primary/10' : 'border-transparent hover:border-border hover:bg-surface-elevated'}`}
                onClick={() => setSelected(code)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold" style={{ color: code.color }}>{code.code}</span>
                  <span className="text-xs text-foreground truncate">{t(`http-status:codes.${code.code}.phrase`, code.phrase)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1">
          {selected ? (
            <div className="tool-card p-6 animate-fade-in h-full">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-4xl font-bold" style={{ color: selected.color }}>{selected.code}</span>
                <span className="text-xl font-semibold text-foreground">{t(`http-status:codes.${selected.code}.phrase`, selected.phrase)}</span>
                <span className="badge-category" style={{ background: selected.color + '22', color: selected.color }}>{t(`http-status:cat${selected.category}`, CAT_LABELS[selected.category])}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t(`http-status:codes.${selected.code}.desc`, selected.description)}</p>
              <div className="font-mono text-sm p-3 bg-muted rounded-lg text-muted-foreground">
                HTTP/1.1 <span style={{ color: selected.color }}>{selected.code} {t(`http-status:codes.${selected.code}.phrase`, selected.phrase)}</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="text-4xl mb-3">🌐</div>
                <div className="text-sm text-muted-foreground">{t('http-status:selectHint', 'Select a status code to view details')}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
