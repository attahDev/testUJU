import { siteBase } from './_shared.js';

const PRIVATE = ['/admin', '/account', '/cart', '/checkout', '/order/', '/wishlist', '/track-order', '/reset-password', '/verify-email'];

export default function handler(req, res) {
  const site = siteBase(req);
  const lines = ['User-agent: *', ...PRIVATE.map((p) => `Disallow: ${p}`), 'Allow: /', '', ...(site ? [`Sitemap: ${site}/sitemap.xml`] : [])];
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600');
  res.status(200).send(lines.join('\n') + '\n');
}
