import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The address the site is served from. Link previews (WhatsApp, Facebook, ...) need absolute image URLs, so the
// page shell is stamped with it at build time. Set VITE_SITE_URL to your real domain; on Vercel it falls back to
// the project's production address automatically.
function siteUrl() {
  const explicit = process.env.VITE_SITE_URL
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  return (explicit || (vercel ? `https://${vercel}` : '')).replace(/\/+$/, '')
}

const stampSiteUrl = () => ({
  name: 'stamp-site-url',
  transformIndexHtml: { order: 'pre', handler: (html) => html.replaceAll('%SITE_URL%', siteUrl()) },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), stampSiteUrl()],
})
