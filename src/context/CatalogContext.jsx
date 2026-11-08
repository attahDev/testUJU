import { useCallback, useEffect, useMemo, useState } from 'react';
import { CatalogContext } from './catalogStore.js';
import { api } from '../api/client.js';
import { toArticle, toProduct } from '../api/mappers.js';
import { makeMoney } from '../api/money.js';

async function fetchCatalog() {
  const [products, articles, config] = await Promise.all([
    api('/api/products', { auth: false }),
    api('/api/articles', { auth: false }),
    api('/api/config', { auth: false }),
  ]);
  return {
    products: products.map(toProduct),
    articles: articles.map(toArticle),
    config: {
      currency: config.currency,
      paymentBypass: config.payment_bypass,
      aiPreview: Boolean(config.ai_preview),
      shipping: config.shipping.map((s) => ({ ...s, price: s.pence / 100 })),
      customBase: config.custom_base_pence,
      finishFee: Object.fromEntries(Object.entries(config.finish_pence).map(([key, pence]) => [key, pence / 100])),
    },
    status: 'ready',
  };
}

export function CatalogProvider({ children }) {
  const [state, setState] = useState({ products: [], articles: [], config: null, status: 'loading' });

  const load = useCallback(
    () =>
      fetchCatalog()
        .then(setState)
        .catch(() => setState((prev) => ({ ...prev, status: 'error' }))),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({
      ...state,
      ...makeMoney(state.config?.currency || 'GBP'),
      collections: [...new Set(state.products.map((p) => p.collection))],
      refresh: load,
      getProduct: (id) => state.products.find((p) => String(p.id) === String(id)),
      getArticle: (id) => state.articles.find((a) => a.id === id),
    }),
    [state, load]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
