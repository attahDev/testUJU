export const TAGLINE = 'Afro-Caribbean luxury translating heritage into modern elegance.';

export function apiBase() {
  return (process.env.API_URL || process.env.VITE_API_URL || '').replace(/\/+$/, '');
}

export function siteBase(req) {
  const explicit = process.env.SITE_URL || process.env.VITE_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const host = req.headers?.['x-forwarded-host'] || req.headers?.host || '';
  const proto = req.headers?.['x-forwarded-proto'] || 'https';
  return host ? `${proto}://${host}` : '';
}

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function clip(text, max = 200) {
  const flat = String(text ?? '').replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

export function safeId(value) {
  const id = Array.isArray(value) ? value[0] : value;
  return typeof id === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(id) ? id : '';
}

export function absoluteUrl(url, base) {
  if (!url) return '';
  try {
    return new URL(url, base || undefined).href;
  } catch {
    return '';
  }
}

export async function getJson(path) {
  const base = apiBase();
  if (!base) return { ok: false, status: 0, data: null };
  try {
    const res = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(4000), headers: { accept: 'application/json' } });
    if (!res.ok) return { ok: false, status: res.status, data: null };
    return { ok: true, status: res.status, data: await res.json() };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

export function cardHtml({ title, description, image, url, type = 'website', siteName, extra = '' }) {
  const t = esc(title);
  const d = esc(description);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:site_name" content="${esc(siteName)}">
<meta property="og:type" content="${esc(type)}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${esc(url)}">
${image ? `<meta property="og:image" content="${esc(image)}">\n<meta name="twitter:image" content="${esc(image)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
${extra}
</head>
<body><h1>${t}</h1><p>${d}</p><p><a href="${esc(url)}">Continue to ${esc(siteName)}</a></p></body>
</html>`;
}

export function sendHtml(res, status, html, cache = 'public, s-maxage=300, stale-while-revalidate=3600') {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', cache);
  res.status(status).send(html);
}
