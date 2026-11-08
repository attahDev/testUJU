import { useCallback, useEffect, useMemo, useState } from 'react';
import { WishlistContext } from './wishlistStore.js';
import { readJSON, writeJSON } from '../utils/storage.js';

const KEY = 'rose-uju-wishlist-v1';

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    const saved = readJSON(KEY, []);
    return Array.isArray(saved) ? saved.map(String) : [];
  });

  useEffect(() => {
    writeJSON(KEY, ids);
  }, [ids]);

  // Keep several open tabs in step.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === KEY) setIds(readJSON(KEY, []).map(String));
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback((id) => {
    const key = String(id);
    setIds((prev) => (prev.includes(key) ? prev.filter((i) => i !== key) : [key, ...prev]));
  }, []);

  const remove = useCallback((id) => setIds((prev) => prev.filter((i) => i !== String(id))), []);

  const value = useMemo(
    () => ({ ids, count: ids.length, has: (id) => ids.includes(String(id)), toggle, remove }),
    [ids, toggle, remove]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
