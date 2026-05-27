import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import HomePage from '@/pages/HomePage'

// Lazy-ish: all tools imported
import JsonFormatter from '@/tools/JsonFormatter'
import Base64Tool from '@/tools/Base64Tool'
import TimestampTool from '@/tools/TimestampTool'
import RegexTester from '@/tools/RegexTester'
import UrlEncode from '@/tools/UrlEncode'
import HashGenerator from '@/tools/HashGenerator'
import JwtDecoder from '@/tools/JwtDecoder'
import CronParser from '@/tools/CronParser'
import UuidGenerator from '@/tools/UuidGenerator'
import HtmlEscape from '@/tools/HtmlEscape'
import ColorConverter from '@/tools/ColorConverter'
import NumberBase from '@/tools/NumberBase'
import YamlJson from '@/tools/YamlJson'
import MarkdownPreview from '@/tools/MarkdownPreview'
import CodeFormatter from '@/tools/CodeFormatter'
import TextDiff from '@/tools/TextDiff'
import ImageBase64 from '@/tools/ImageBase64'
import PasswordGenerator from '@/tools/PasswordGenerator'
import HttpStatus from '@/tools/HttpStatus'
import NumberFormat from '@/tools/NumberFormat'

export default function App() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden' }}>
      <Sidebar darkMode={dark} onToggleDark={() => setDark(d => !d)} />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools/json-formatter" element={<JsonFormatter />} />
          <Route path="/tools/base64" element={<Base64Tool />} />
          <Route path="/tools/timestamp" element={<TimestampTool />} />
          <Route path="/tools/regex-tester" element={<RegexTester />} />
          <Route path="/tools/url-encode" element={<UrlEncode />} />
          <Route path="/tools/hash-generator" element={<HashGenerator />} />
          <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
          <Route path="/tools/cron-parser" element={<CronParser />} />
          <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
          <Route path="/tools/html-escape" element={<HtmlEscape />} />
          <Route path="/tools/color-converter" element={<ColorConverter />} />
          <Route path="/tools/number-base" element={<NumberBase />} />
          <Route path="/tools/yaml-json" element={<YamlJson />} />
          <Route path="/tools/markdown-preview" element={<MarkdownPreview />} />
          <Route path="/tools/code-formatter" element={<CodeFormatter />} />
          <Route path="/tools/text-diff" element={<TextDiff />} />
          <Route path="/tools/image-base64" element={<ImageBase64 />} />
          <Route path="/tools/password-gen" element={<PasswordGenerator />} />
          <Route path="/tools/http-status" element={<HttpStatus />} />
          <Route path="/tools/number-format" element={<NumberFormat />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
