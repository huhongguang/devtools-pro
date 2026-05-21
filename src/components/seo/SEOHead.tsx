import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://devtools-ashy-nine.vercel.app'
const SITE_NAME = 'DevTools Pro'

interface SEOHeadProps {
  title: string
  description: string
  canonicalPath: string
  keywords?: string[]
  jsonLd?: Record<string, unknown>
}

export default function SEOHead({ title, description, canonicalPath, keywords, jsonLd }: SEOHeadProps) {
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
