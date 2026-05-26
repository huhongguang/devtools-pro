import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import './index.css'
import './i18n/config'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f1117', color: '#a78bfa', fontFamily: 'sans-serif' }}>Loading...</div>}>
        <BrowserRouter>
          <App />
          <Analytics />
        </BrowserRouter>
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>,
)
