import { useEffect } from 'react';
import { useCatalog } from '../context/catalogStore.js';

/*
 * Sets the browser tab title, search description, share tags, canonical link and (optionally) search-engine
 * product data for the current page, and puts the site-wide defaults back when the page is left.
 *
 * This is what Google and the tab bar see. Link-preview bots (WhatsApp, Facebook, ...) do not run scripts, so
 * product and Journal links get their cards from the server-side functions in /api instead.
 */
const META = [
  ['name', 'description'],
  ['property', 'og:title'],
  ['property', 'og:description'],
  ['property', 'og:image'],
  ['property', 'og:url'],
  ['property', 'og:type'],
  ['name', 'twitter:title'],
  ['name', 'twitter:description'],
  ['name', 'twitter:image'],
];

function read(attr, key) {
  return document.head.querySelector(`meta[${attr}="${key}"]`)?.getAttribute('content') ?? null;
}

function write(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (content === null || content === undefined) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// The values from the page shell (index.html), captured once so they can be restored.
const DEFAULTS =
  typeof document === 'undefined'
    ? null
    : { title: document.title, meta: Object.fromEntries(META.map(([a, k]) => [k, read(a, k)])) };

function clip(text, max = 200) {
  const flat = String(text).replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

function absolute(url) {
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return '';
  }
}

function setLd(json) {
  document.getElementById('page-jsonld')?.remove();
  if (!json) return;
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.id = 'page-jsonld';
  el.textContent = json;
  document.head.appendChild(el);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

function reset() {
  document.title = DEFAULTS.title;
  META.forEach(([attr, key]) => write(attr, key, DEFAULTS.meta[key]));
  write('name', 'robots', null);
  setCanonical(null);
  setLd(null);
}

export function usePageMeta({ title, description, image, type, noindex = false, jsonLd } = {}) {
  const { settings } = useCatalog();
  const brand = settings.business_name || 'Rose Uju';
  const ld = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const fullTitle = title ? `${title} | ${brand}` : DEFAULTS.title;
    const desc = description ? clip(description) : DEFAULTS.meta.description;
    const img = image ? absolute(image) : DEFAULTS.meta['og:image'];
    const url = `${window.location.origin}${window.location.pathname}`;

    document.title = fullTitle;
    write('name', 'description', desc);
    write('property', 'og:title', fullTitle);
    write('property', 'og:description', desc);
    write('property', 'og:image', img);
    write('property', 'og:url', url);
    write('property', 'og:type', type || DEFAULTS.meta['og:type'] || 'website');
    write('name', 'twitter:title', fullTitle);
    write('name', 'twitter:description', desc);
    write('name', 'twitter:image', img);
    write('name', 'robots', noindex ? 'noindex,nofollow' : null);
    setCanonical(noindex ? null : url);
    setLd(ld);

    return reset;
  }, [title, description, image, type, noindex, ld, brand]);
}
