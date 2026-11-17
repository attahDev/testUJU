import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function siteUrl() {
  const explicit = process.env.VITE_SITE_URL
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  return (explicit || (vercel ? `https://${vercel}` : '')).replace(/\/+$/, '')
}

const stampSiteUrl = () => ({
  name: 'stamp-site-url',
  transformIndexHtml: { order: 'pre', handler: (html) => html.replaceAll('%SITE_URL%', siteUrl()) },
})

export default defineConfig({
  plugins: [react(), stampSiteUrl()],
})
