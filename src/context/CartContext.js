import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

// Simple cart context for MVP flow.
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (item) => setItems((prev) => [...prev, item]);
  const removeItem = (id) => setItems((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearCart,
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
