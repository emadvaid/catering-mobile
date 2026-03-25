import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function normalizeQuantity(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 1) {
      return 1;
    }
    return Math.floor(parsed);
  }

  function getItemKey(item) {
    return `${item.type || 'menu'}:${item.id || 'unknown'}:${item.name || 'Unnamed item'}`;
  }

  function addItem(item) {
    const normalized = {
      ...item,
      quantity: normalizeQuantity(item.quantity || 1),
      cartKey: item.cartKey || getItemKey(item),
    };

    setItems((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.cartKey === normalized.cartKey);
      if (existingIndex === -1) {
        return [...prev, normalized];
      }

      return prev.map((entry, idx) =>
        idx === existingIndex
          ? { ...entry, quantity: normalizeQuantity(entry.quantity) + normalized.quantity }
          : entry
      );
    });
  }

  function setItemQuantity(cartKey, quantity) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: normalizeQuantity(quantity) } : item
        )
        .filter((item) => normalizeQuantity(item.quantity) > 0)
    );
  }

  function increaseItem(cartKey) {
    setItems((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey
          ? { ...item, quantity: normalizeQuantity(item.quantity) + 1 }
          : item
      )
    );
  }

  function decreaseItem(cartKey) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: Math.max(0, normalizeQuantity(item.quantity) - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(itemOrIndex) {
    if (typeof itemOrIndex === 'number') {
      setItems((prev) => prev.filter((_, i) => i !== itemOrIndex));
      return;
    }

    setItems((prev) =>
      prev.filter((item) => item.cartKey !== itemOrIndex && item.id !== itemOrIndex)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const value = {
    items,
    addItem,
    setItemQuantity,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
    itemCount: items.reduce((sum, item) => sum + normalizeQuantity(item.quantity), 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }

  return ctx;
}
