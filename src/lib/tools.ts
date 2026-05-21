export interface Tool {
  id: string
  name: string
  description: string
  category: Category
  icon: string
  keywords: string[]
  hot?: boolean
}

export type Category = 'encode' | 'format' | 'generate' | 'convert' | 'text' | 'web'

export const CATEGORIES: Record<Category, { label: string; color: string; bg: string }> = {
  encode:   { label: 'Encode/Decode', color: 'hsl(199 89% 55%)',  bg: 'hsl(199 89% 55% / 0.12)' },
  format:   { label: 'Format/Parse',  color: 'hsl(142 71% 45%)',  bg: 'hsl(142 71% 45% / 0.12)' },
  generate: { label: 'Generate',      color: 'hsl(262 83% 67%)',  bg: 'hsl(262 83% 67% / 0.12)' },
  convert:  { label: 'Convert',       color: 'hsl(38 92% 55%)',   bg: 'hsl(38 92% 55% / 0.12)' },
  text:     { label: 'Text',          color: 'hsl(340 82% 60%)',  bg: 'hsl(340 82% 60% / 0.12)' },
  web:      { label: 'Web/Network',   color: 'hsl(168 84% 42%)',  bg: 'hsl(168 84% 42% / 0.12)' },
}

export const TOOLS: Tool[] = [
  { id: 'json-formatter',   name: 'JSON Formatter',      description: 'Format, validate and minify JSON data', category: 'format',   icon: '{ }', keywords: ['json', 'format', 'validate', 'minify', 'pretty'], hot: true },
  { id: 'base64',           name: 'Base64',              description: 'Encode and decode Base64 strings',      category: 'encode',   icon: 'B64', keywords: ['base64', 'encode', 'decode'], hot: true },
  { id: 'timestamp',        name: 'Timestamp',           description: 'Convert Unix timestamps to dates',      category: 'convert',  icon: '⏱',  keywords: ['timestamp', 'unix', 'date', 'time'], hot: true },
  { id: 'regex-tester',     name: 'Regex Tester',        description: 'Test and debug regular expressions',    category: 'text',     icon: '.*',  keywords: ['regex', 'regexp', 'test', 'pattern'], hot: true },
  { id: 'url-encode',       name: 'URL Encode/Decode',   description: 'Encode and decode URL components',      category: 'encode',   icon: '🔗', keywords: ['url', 'encode', 'decode', 'percent'] },
  { id: 'hash-generator',   name: 'Hash Generator',      description: 'Generate MD5, SHA-1, SHA-256 hashes',  category: 'generate', icon: '#',   keywords: ['hash', 'md5', 'sha', 'sha256', 'sha1'] },
  { id: 'jwt-decoder',      name: 'JWT Decoder',         description: 'Decode and inspect JWT tokens',         category: 'encode',   icon: 'JWT', keywords: ['jwt', 'token', 'auth', 'bearer', 'decode'], hot: true },
  { id: 'cron-parser',      name: 'Cron Expression',     description: 'Parse and explain cron expressions',    category: 'convert',  icon: '⚙',  keywords: ['cron', 'schedule', 'crontab', 'expression'] },
  { id: 'uuid-generator',   name: 'UUID Generator',      description: 'Generate v4 UUIDs in bulk',             category: 'generate', icon: 'UUID', keywords: ['uuid', 'guid', 'unique', 'id', 'generate'] },
  { id: 'html-escape',      name: 'HTML Escape',         description: 'Escape and unescape HTML entities',     category: 'encode',   icon: '</>',  keywords: ['html', 'escape', 'entity', 'unescape', 'encode'] },
  { id: 'color-converter',  name: 'Color Converter',     description: 'Convert between HEX, RGB, HSL colors',  category: 'convert',  icon: '🎨', keywords: ['color', 'hex', 'rgb', 'hsl', 'convert'] },
  { id: 'number-base',      name: 'Number Base',         description: 'Convert numbers between bases 2/8/10/16', category: 'convert', icon: '01', keywords: ['binary', 'hex', 'octal', 'decimal', 'base', 'number'] },
  { id: 'yaml-json',        name: 'YAML ↔ JSON',         description: 'Convert between YAML and JSON formats', category: 'convert',  icon: 'YML', keywords: ['yaml', 'json', 'convert', 'transform'] },
  { id: 'markdown-preview', name: 'Markdown Preview',    description: 'Render Markdown with live preview',     category: 'text',     icon: 'MD',  keywords: ['markdown', 'preview', 'render', 'md'] },
  { id: 'code-formatter',   name: 'Code Beautifier',     description: 'Beautify and minify JS/CSS/HTML code',  category: 'format',   icon: '</>', keywords: ['code', 'beautify', 'format', 'minify', 'js', 'css', 'html'] },
  { id: 'text-diff',        name: 'Text Diff',           description: 'Compare two texts and highlight differences', category: 'text', icon: '±',  keywords: ['diff', 'compare', 'difference', 'text'] },
  { id: 'image-base64',     name: 'Image → Base64',      description: 'Convert images to Base64 data URIs',    category: 'encode',   icon: '🖼', keywords: ['image', 'base64', 'data', 'uri', 'convert'] },
  { id: 'password-gen',     name: 'Password Generator',  description: 'Generate secure random passwords',      category: 'generate', icon: '🔑', keywords: ['password', 'generate', 'random', 'secure'] },
  { id: 'http-status',      name: 'HTTP Status Codes',   description: 'Reference for all HTTP status codes',   category: 'web',      icon: '🌐', keywords: ['http', 'status', 'code', '404', '200', '500'] },
  { id: 'number-format',    name: 'Number Format',       description: 'Format numbers and convert to Chinese',  category: 'convert',  icon: '123', keywords: ['number', 'format', 'chinese', 'currency', 'comma'] },
]
