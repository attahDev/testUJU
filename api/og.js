import { TAGLINE, absoluteUrl, apiBase, cardHtml, clip, getJson, safeId, sendHtml, siteBase } from './_shared.js';

/*
 * Link-preview cards for WhatsApp, Facebook, Slack, Telegram and similar. vercel.json sends only those bots here;
 * people and search engines get the normal site. Any failure falls back to the generic brand card so a share never breaks.
 */
export default async function handler(req, res) {
  const type = Array.isArray(req.query?.type) ? req.query.type[0] : req.query?.type || 'home';
  const id = safeId(req.query?.id);
  const site = siteBase(req);
  const api = apiBase();

  const [settings, config, images] = await Promise.all([
    getJson('/api/site-settings'),
    getJson('/api/config'),
    getJson('/api/site-images'),
  ]);
  const siteName = settings.data?.business_name || 'Rose Uju';
  const defaultImage = absoluteUrl(images.data?.hero, api) || `${site}/og-default.jpg`;
  const home = {
    title: `${siteName} | Cultivated Beauty, Worn Well`,
    description: TAGLINE,
    image: defaultImage,
    url: `${site}/`,
    siteName,
  };

  if ((type === 'product' || type === 'article') && !id) return sendHtml(res, 404, cardHtml(home), 'no-store');

  if (type === 'product') {
    const found = await getJson(`/api/products/${id}`);
    if (found.status === 404) return sendHtml(res, 404, cardHtml(home), 'no-store');
    const p = found.data;
    if (!p) return sendHtml(res, 200, cardHtml(home), 'public, s-maxage=30');
    const currency = (config.data?.currency || 'gbp').toUpperCase();
    const price = Number.isFinite(p.price_pence) ? (p.price_pence / 100).toFixed(2) : '';
    return sendHtml(
      res,
      200,
      cardHtml({
        title: `${p.name} | ${siteName}`,
        description: clip(p.description) || TAGLINE,
        image: absoluteUrl(p.image_url, api) || defaultImage,
        url: `${site}/product/${p.id}`,
        type: 'product',
        siteName,
        extra: price ? `<meta property="product:price:amount" content="${price}">\n<meta property="product:price:currency" content="${currency}">` : '',
      })
    );
  }

  if (type === 'article') {
    const found = await getJson(`/api/articles/${id}`);
    if (found.status === 404) return sendHtml(res, 404, cardHtml(home), 'no-store');
    const a = found.data;
    if (!a) return sendHtml(res, 200, cardHtml(home), 'public, s-maxage=30');
    return sendHtml(
      res,
      200,
      cardHtml({
        title: `${a.title} | ${siteName}`,
        description: clip(a.excerpt) || TAGLINE,
        image: absoluteUrl(a.image_url, api) || defaultImage,
        url: `${site}/journal/${a.slug}`,
        type: 'article',
        siteName,
      })
    );
  }

  return sendHtml(res, 200, cardHtml(home));
}
