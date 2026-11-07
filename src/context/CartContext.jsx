import { useEffect, useMemo, useState } from 'react';
import { CartContext } from './cartStore.js';
import { readJSON, writeJSON } from '../utils/storage.js';

const KEY = 'rose-uju-cart-v2';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readJSON(KEY, []));

  useEffect(() => {
    writeJSON(KEY, items);
  }, [items]);

  function addItem(product, options = {}) {
    const qty = options.qty || 1;
    const key = `${product.id}-${options.color || ''}-${options.size || ''}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          collection: product.collection,
          custom: product.custom,
          color: options.color,
          size: options.size,
          qty,
        },
      ];
    });
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function setQty(key, qty) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    return { items, addItem, removeItem, setQty, clearCart, count, subtotal };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
