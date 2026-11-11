// Run with: npm run test:seo
// Exercises the serverless functions in /api against a fake backend, plus the bot matching in vercel.json.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import og from '../api/og.js';
import sitemap from '../api/sitemap.js';
import robots from '../api/robots.js';

process.env.API_URL = 'https://api.test';
delete process.env.SITE_URL;
delete process.env.VITE_SITE_URL;

let calls = [];
let apiDown = false;
const NASTY = 'Scarf "A" <script>alert(1)</script> & co';
const routes = {
  '/api/site-settings': { business_name: 'Rose Uju' },
  '/api/config': { currency: 'gbp' },
  '/api/site-images': {},
  '/api/products/7': { id: 7, name: NASTY, description: 'Hand-finished silk.\n\n' + 'Lovely. '.repeat(80), price_pence: 14500, image_url: '/media/scarf.webp' },
  '/api/articles/heritage-story': { slug: 'heritage-story', title: 'Our Heritage', excerpt: 'Where it all began.', image_url: 'https://cdn.test/h.jpg' },
  '/api/looks': [
    { slug: 'evening-wrap', name: 'The Evening Wrap', description: 'Silk and gold.', image_url: '', products: [{ name: 'Silk Scarf', image_url: '/media/scarf.webp' }, { name: 'Coat', image_url: '/media/coat.webp' }] },
    { slug: 'dusk', name: 'Dusk', description: '', image_url: 'https://cdn.test/dusk-ai.webp', products: [{ name: 'Wrap', image_url: '/media/w.webp' }, { name: 'Hoops', image_url: '/media/h.webp' }] },
  ],
  '/api/products': [{ id: 7 }, { id: 8 }],
  '/api/articles': [{ slug: 'heritage-story' }, { slug: 'bad slug/../x' }],
};
globalThis.fetch = async (url) => {
  const path = new URL(url).pathname;
  calls.push(path);
  if (apiDown) throw new Error('network down');
  if (!(path in routes)) return { ok: false, status: 404, json: async () => ({}) };
  return { ok: true, status: 200, json: async () => routes[path] };
};

function run(handler, query = {}, headers = { host: 'shop.test', 'x-forwarded-proto': 'https' }) {
  return new Promise((resolve, reject) => {
    const out = { headers: {}, status: 0, body: '' };
    const res = {
      setHeader: (k, v) => (out.headers[k.toLowerCase()] = v),
      status(code) { out.status = code; return this; },
      send(body) { out.body = body; resolve(out); },
    };
    Promise.resolve(handler({ query, headers }, res)).catch(reject);
  });
}
const tests = [];
const test = (name, fn) => tests.push([name, fn]);
const reset = () => { calls = []; apiDown = false; routes['/api/site-images'] = {}; };

test('product card has the right tags, absolute image, price and canonical link', async () => {
  const r = await run(og, { type: 'product', id: '7' });
  assert.equal(r.status, 200);
  assert.match(r.body, /property="og:image" content="https:\/\/api\.test\/media\/scarf\.webp"/);
  assert.match(r.body, /property="og:url" content="https:\/\/shop\.test\/product\/7"/);
  assert.match(r.body, /property="og:type" content="product"/);
  assert.match(r.body, /product:price:amount" content="145\.00"/);
  assert.match(r.body, /product:price:currency" content="GBP"/);
  assert.match(r.headers['content-type'], /text\/html/);
  assert.match(r.headers['cache-control'], /s-maxage/);
});

test('a hostile product name cannot inject markup', async () => {
  const r = await run(og, { type: 'product', id: '7' });
  assert.ok(!r.body.includes('<script>'), 'raw <script> must never appear');
  assert.ok(r.body.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(!/content="[^"]*"[^>]*onerror/i.test(r.body));
});

test('long descriptions are shortened for the card', async () => {
  const r = await run(og, { type: 'product', id: '7' });
  const desc = r.body.match(/property="og:description" content="([^"]*)"/)[1];
  assert.ok(desc.length <= 205 && desc.endsWith('…'), `description was ${desc.length} chars`);
});

test('article card uses the article type and its own image', async () => {
  const r = await run(og, { type: 'article', id: 'heritage-story' });
  assert.match(r.body, /property="og:type" content="article"/);
  assert.match(r.body, /og:image" content="https:\/\/cdn\.test\/h\.jpg"/);
  assert.match(r.body, /og:url" content="https:\/\/shop\.test\/journal\/heritage-story"/);
});

test('a look without a photo is shown with its first product, and lists the pieces when it has no description', async () => {
  const r = await run(og, { type: 'look', id: 'dusk' });
  assert.match(r.body, /og:image" content="https:\/\/cdn\.test\/dusk-ai\.webp"/, 'the look photo wins when there is one');
  assert.match(r.body, /og:description" content="Shop the full look: Wrap, Hoops\./);
  assert.match(r.body, /og:url" content="https:\/\/shop\.test\/looks\/dusk"/);
  const plain = await run(og, { type: 'look', id: 'evening-wrap' });
  assert.match(plain.body, /og:image" content="https:\/\/api\.test\/media\/scarf\.webp"/, 'falls back to the first product photo');
  assert.match(plain.body, /og:title" content="The Evening Wrap \| Rose Uju"/);
});

test('an unknown look gives a 404, and a down API still gives a brand card', async () => {
  assert.equal((await run(og, { type: 'look', id: 'nope' })).status, 404);
  apiDown = true;
  const r = await run(og, { type: 'look', id: 'dusk' });
  assert.equal(r.status, 200);
  assert.match(r.body, /og:title" content="Rose Uju \| Cultivated Beauty, Worn Well"/);
});

test('unknown product gives a 404 and is not cached', async () => {
  const r = await run(og, { type: 'product', id: '999' });
  assert.equal(r.status, 404);
  assert.equal(r.headers['cache-control'], 'no-store');
});

test('unsafe ids are refused without ever calling the API', async () => {
  for (const id of ['../../etc/passwd', '7?x=1', '<b>', 'a'.repeat(200), '']) {
    calls = [];
    const r = await run(og, { type: 'product', id });
    assert.equal(r.status, 404, `id ${JSON.stringify(id).slice(0, 30)}`);
    assert.ok(!calls.some((c) => c.startsWith('/api/products/')), 'API must not be asked about an unsafe id');
  }
});

test('when the API is down a share still gets a brand card, not an error', async () => {
  apiDown = true;
  const r = await run(og, { type: 'product', id: '7' });
  assert.equal(r.status, 200);
  assert.match(r.body, /og:title" content="Rose Uju \| Cultivated Beauty, Worn Well"/);
  assert.match(r.body, /og:image" content="https:\/\/shop\.test\/og-default\.jpg"/);
});

test('the home card uses the owner\'s hero photo once one is uploaded', async () => {
  routes['/api/site-images'] = { hero: 'https://cdn.test/my-hero.webp' };
  const r = await run(og, { type: 'home' });
  assert.match(r.body, /og:image" content="https:\/\/cdn\.test\/my-hero\.webp"/);
});

test('SITE_URL overrides the request host', async () => {
  process.env.SITE_URL = 'https://roseuju.com/';
  const r = await run(og, { type: 'product', id: '7' });
  delete process.env.SITE_URL;
  assert.match(r.body, /og:url" content="https:\/\/roseuju\.com\/product\/7"/);
});

test('sitemap lists pages, products and safe journal slugs, as valid escaped XML', async () => {
  const r = await run(sitemap);
  assert.match(r.headers['content-type'], /xml/);
  for (const loc of ['https://shop.test/', 'https://shop.test/shop', 'https://shop.test/product/7', 'https://shop.test/product/8', 'https://shop.test/journal/heritage-story', 'https://shop.test/looks/evening-wrap', 'https://shop.test/looks/dusk']) {
    assert.ok(r.body.includes(`<loc>${loc}</loc>`), loc);
  }
  assert.ok(!r.body.includes('bad slug'), 'unsafe slugs are left out');
  assert.ok(!/\/(admin|cart|checkout|account)</.test(r.body), 'private pages are not listed');
});

test('robots keeps private pages out and points to the sitemap', async () => {
  const r = await run(robots);
  for (const p of ['/admin', '/account', '/cart', '/checkout', '/order/', '/wishlist', '/track-order']) assert.ok(r.body.includes(`Disallow: ${p}`), p);
  assert.ok(r.body.includes('Sitemap: https://shop.test/sitemap.xml'));
  assert.ok(!/Disallow: \/\s*$/m.test(r.body), 'must not block the whole site');
});

test('vercel.json sends only link-preview bots to the card functions', async () => {
  const cfg = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url)));
  const rules = cfg.rewrites;
  assert.equal(rules.at(-1).destination, '/index.html', 'catch-all must stay last');
  const botRules = rules.filter((r) => r.has);
  assert.equal(botRules.length, 4);
  assert.ok(botRules.some((r) => r.source === '/looks/:slug' && r.destination === '/api/og?type=look&id=:slug'));
  const re = new RegExp(`^${botRules[0].has[0].value}$`);
  const bots = [
    'WhatsApp/2.23.20.0 A', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'Facebot',
    'Twitterbot/1.0', 'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)', 'TelegramBot (like TwitterBot)',
    'LinkedInBot/1.0 (compatible; Mozilla/5.0)', 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
    'Pinterest/0.2 (+http://www.pinterest.com/bot.html)',
  ];
  const people = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  ];
  for (const ua of bots) assert.ok(re.test(ua), `should serve a card to: ${ua}`);
  for (const ua of people) assert.ok(!re.test(ua), `must NOT divert: ${ua}`);
});

let failed = 0;
for (const [name, fn] of tests) {
  reset();
  try {
    await fn();
    console.log(`  ok   ${name}`);
  } catch (err) {
    failed++;
    console.log(`  FAIL ${name}\n       ${err.message.split('\n')[0]}`);
  }
}
console.log(`\n${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
