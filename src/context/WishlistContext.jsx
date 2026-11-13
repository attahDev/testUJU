import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WishlistContext } from './wishlistStore.js';
import { api } from '../api/client.js';
import { useAuth } from './authStore.js';
import { readJSON, writeJSON } from '../utils/storage.js';

const KEY = 'rose-uju-wishlist-v1';
const OWNER_KEY = 'rose-uju-wishlist-owner-v1';

function readLocal() {
  const saved = readJSON(KEY, []);
  return Array.isArray(saved) ? saved.map(String) : [];
}

export function WishlistProvider({ children }) {
  const { user, ready } = useAuth();
  const userId = user?.id ?? null;
  const [ids, setIds] = useState(readLocal);
  const [owner, setOwner] = useState(() => readJSON(OWNER_KEY, ''));
  const [seen, setSeen] = useState('pending');
  const idsRef = useRef(ids);
  const ownerRef = useRef(owner);
  const syncedFor = useRef(null);

  const identity = !ready ? 'pending' : userId === null ? 'guest' : String(userId);
  if (seen !== identity) {
    setSeen(identity);
    if (identity === 'guest' && owner !== '') {
      setIds([]);
      setOwner('');
    }
  }

  useEffect(() => {
    idsRef.current = ids;
    ownerRef.current = owner;
    writeJSON(KEY, ids);
    writeJSON(OWNER_KEY, owner);
  }, [ids, owner]);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === KEY) setIds(readLocal());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!ready || userId === null) {
      if (ready) syncedFor.current = null;
      return undefined;
    }
    if (syncedFor.current === userId) return undefined;
    syncedFor.current = userId;
    let cancelled = false;
    const guestList = ownerRef.current === '';
    const request = guestList
      ? api('/api/wishlist/merge', { method: 'POST', body: { product_ids: idsRef.current.map(Number).filter(Number.isFinite) } })
      : api('/api/wishlist');
    request
      .then((res) => {
        if (cancelled) return;
        setOwner(userId);
        setIds(res.product_ids.map(String));
      })
      .catch(() => {
        if (!cancelled) syncedFor.current = null;
      });
    return () => {
      cancelled = true;
    };
  }, [userId, ready]);

  const toggle = useCallback(
    (id) => {
      const key = String(id);
      const wasSaved = idsRef.current.includes(key);
      setIds((prev) => (prev.includes(key) ? prev.filter((i) => i !== key) : [key, ...prev]));
      if (userId === null) return;
      api(`/api/wishlist/${key}`, { method: wasSaved ? 'DELETE' : 'PUT' }).catch(() => {
        setIds((prev) => (wasSaved ? (prev.includes(key) ? prev : [key, ...prev]) : prev.filter((i) => i !== key)));
      });
    },
    [userId]
  );

  const remove = useCallback(
    (id) => {
      if (idsRef.current.includes(String(id))) toggle(id);
    },
    [toggle]
  );

  const value = useMemo(
    () => ({ ids, count: ids.length, has: (id) => ids.includes(String(id)), toggle, remove, synced: userId !== null }),
    [ids, toggle, remove, userId]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
