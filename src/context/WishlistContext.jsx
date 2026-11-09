import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WishlistContext } from './wishlistStore.js';
import { api } from '../api/client.js';
import { useAuth } from './authStore.js';
import { readJSON, writeJSON } from '../utils/storage.js';

const KEY = 'rose-uju-wishlist-v1';
// Who the saved list on this device belongs to: '' for a guest, otherwise the account's id.
const OWNER_KEY = 'rose-uju-wishlist-owner-v1';

function readLocal() {
  const saved = readJSON(KEY, []);
  return Array.isArray(saved) ? saved.map(String) : [];
}

/**
 * Guests keep their wishlist on the device. When a guest signs in, their list is merged into the account.
 * After that the account is the source of truth: the device only keeps a copy, every change is saved to
 * the account, and a returning device takes the account's list instead of re-sending its own (which could
 * bring back something removed on another device).
 */
export function WishlistProvider({ children }) {
  const { user, ready } = useAuth();
  const userId = user?.id ?? null;
  const [ids, setIds] = useState(readLocal);
  const [owner, setOwner] = useState(() => readJSON(OWNER_KEY, ''));
  const [seen, setSeen] = useState('pending');
  const idsRef = useRef(ids);
  const ownerRef = useRef(owner);
  const syncedFor = useRef(null);

  // When it becomes clear nobody is signed in, drop a list that belongs to an account (sign-out, or an
  // expired session), so the next person on a shared device starts clean.
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

  // Keep several open tabs in step.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === KEY) setIds(readLocal());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Signed in: take the account's list, merging a guest list in first.
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
        // Offline or a server hiccup: keep what is on screen and try again next time.
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
        // The server said no: put the heart back how it was.
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
