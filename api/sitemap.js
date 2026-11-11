import { esc, getJson, safeId, siteBase } from './_shared.js';

const PAGES = ['/', '/shop', '/collections', '/looks', '/customise', '/about', '/journal', '/returns', '/privacy', '/terms'];

export default async function handler(req, res) {
  const site = siteBase(req);
  const [products, articles, looks] = await Promise.all([getJson('/api/products'), getJson('/api/articles'), getJson('/api/looks')]);
  const urls = [
    ...PAGES,
    ...(products.data || []).map((p) => `/product/${p.id}`),
    ...(looks.data || []).filter((l) => safeId(l.slug)).map((l) => `/looks/${l.slug}`),
    ...(articles.data || []).filter((a) => safeId(a.slug)).map((a) => `/journal/${a.slug}`),
  ];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((path) => `  <url><loc>${esc(site + path)}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
