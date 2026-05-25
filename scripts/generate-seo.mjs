import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'

const SITE_URL = 'https://www.devtoolspro.app'

const TOOLS = [
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Format, validate and minify JSON data', category: 'format', keywords: ['json', 'format', 'validate', 'minify', 'pretty'] },
  { id: 'base64', name: 'Base64', description: 'Encode and decode Base64 strings', category: 'encode', keywords: ['base64', 'encode', 'decode'] },
  { id: 'timestamp', name: 'Timestamp', description: 'Convert Unix timestamps to dates', category: 'convert', keywords: ['timestamp', 'unix', 'date', 'time'] },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Test and debug regular expressions', category: 'text', keywords: ['regex', 'regexp', 'test', 'pattern'] },
  { id: 'url-encode', name: 'URL Encode/Decode', description: 'Encode and decode URL components', category: 'encode', keywords: ['url', 'encode', 'decode', 'percent'] },
  { id: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256 hashes', category: 'generate', keywords: ['hash', 'md5', 'sha', 'sha256', 'sha1'] },
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode and inspect JWT tokens', category: 'encode', keywords: ['jwt', 'token', 'auth', 'bearer', 'decode'] },
  { id: 'cron-parser', name: 'Cron Expression', description: 'Parse and explain cron expressions', category: 'convert', keywords: ['cron', 'schedule', 'crontab', 'expression'] },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate v4 UUIDs in bulk', category: 'generate', keywords: ['uuid', 'guid', 'unique', 'id', 'generate'] },
  { id: 'html-escape', name: 'HTML Escape', description: 'Escape and unescape HTML entities', category: 'encode', keywords: ['html', 'escape', 'entity', 'unescape', 'encode'] },
  { id: 'color-converter', name: 'Color Converter', description: 'Convert between HEX, RGB, HSL colors', category: 'convert', keywords: ['color', 'hex', 'rgb', 'hsl', 'convert'] },
  { id: 'number-base', name: 'Number Base', description: 'Convert numbers between bases 2/8/10/16', category: 'convert', keywords: ['binary', 'hex', 'octal', 'decimal', 'base', 'number'] },
  { id: 'yaml-json', name: 'YAML ↔ JSON', description: 'Convert between YAML and JSON formats', category: 'convert', keywords: ['yaml', 'json', 'convert', 'transform'] },
  { id: 'markdown-preview', name: 'Markdown Preview', description: 'Render Markdown with live preview', category: 'text', keywords: ['markdown', 'preview', 'render', 'md'] },
  { id: 'code-formatter', name: 'Code Beautifier', description: 'Beautify and minify JS/CSS/HTML code', category: 'format', keywords: ['code', 'beautify', 'format', 'minify', 'js', 'css', 'html'] },
  { id: 'text-diff', name: 'Text Diff', description: 'Compare two texts and highlight differences', category: 'text', keywords: ['diff', 'compare', 'difference', 'text'] },
  { id: 'image-base64', name: 'Image → Base64', description: 'Convert images to Base64 data URIs', category: 'encode', keywords: ['image', 'base64', 'data', 'uri', 'convert'] },
  { id: 'password-gen', name: 'Password Generator', description: 'Generate secure random passwords', category: 'generate', keywords: ['password', 'generate', 'random', 'secure'] },
  { id: 'http-status', name: 'HTTP Status Codes', description: 'Reference for all HTTP status codes', category: 'web', keywords: ['http', 'status', 'code', '404', '200', '500'] },
  { id: 'number-format', name: 'Number Format', description: 'Format numbers and convert to Chinese', category: 'convert', keywords: ['number', 'format', 'chinese', 'currency', 'comma'] },
]

const CATEGORIES = {
  encode: 'Encode/Decode',
  format: 'Format/Parse',
  generate: 'Generate',
  convert: 'Convert',
  text: 'Text',
  web: 'Web/Network',
}

// --- Generate sitemap.xml ---
function generateSitemap() {
  const distDir = resolve(process.cwd(), 'dist')
  const today = new Date().toISOString().split('T')[0]

  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    ...TOOLS.map(tool => ({
      loc: `/tools/${tool.id}`,
      priority: '0.8',
      changefreq: 'weekly',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  writeFileSync(resolve(distDir, 'sitemap.xml'), xml)
  console.log('✓ sitemap.xml generated')
}

// --- Generate static HTML for each route ---
function generateSeoHtml() {
  const distDir = resolve(process.cwd(), 'dist')
  const template = readFileSync(resolve(distDir, 'index.html'), 'utf-8')

  function buildPage(title, description, canonicalPath, keywords, jsonLd) {
    let html = template

    // Replace title
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)

    // Replace meta description
    html = html.replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${description}"`
    )

    // Replace canonical
    html = html.replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${SITE_URL}${canonicalPath}"`
    )

    // Replace OG tags
    html = html.replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${title}"`
    )
    html = html.replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${description}"`
    )
    html = html.replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${SITE_URL}${canonicalPath}"`
    )

    // Replace Twitter tags
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${title}"`
    )
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${description}"`
    )

    // Inject JSON-LD before </head>
    if (jsonLd) {
      const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
      html = html.replace('</head>', `${jsonLdScript}\n  </head>`)
    }

    // Inject keywords meta if provided
    if (keywords && keywords.length > 0) {
      const kwMeta = `<meta name="keywords" content="${keywords.join(', ')}" />`
      html = html.replace('</head>', `${kwMeta}\n  </head>`)
    }

    return html
  }

  // Generate home page (overwrite dist/index.html - already correct from Vite build)
  // No need to overwrite, the template already has home meta

  // Generate tool pages
  for (const tool of TOOLS) {
    const catLabel = CATEGORIES[tool.category] || tool.category
    const title = `${tool.name} — DevTools Pro`
    const description = `${tool.description}. Free online ${catLabel.toLowerCase()} tool — no signup, works in your browser.`
    const canonicalPath = `/tools/${tool.id}`
    const keywords = [...tool.keywords, 'devtools', 'online tool']
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    }

    const html = buildPage(title, description, canonicalPath, keywords, jsonLd)
    const outDir = resolve(distDir, 'tools', tool.id)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(resolve(outDir, 'index.html'), html)
  }

  console.log(`✓ SEO HTML generated for ${TOOLS.length} tool pages`)
}

generateSitemap()
generateSeoHtml()
