import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import menuSeed from "../data/menu";

export type CartItem = {
  id: string;
  name: string;
  price?: number | string;
  image?: string;
  localImage?: any;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "quantity">, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id: string, qty: number) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, qty) } : i))
        .filter((i) => i.quantity > 0)
    );

  const clearCart = () => setCart([]);

  const getTotal = () =>
    cart.reduce((sum, i) => sum + (Number(i.price) || 0) * i.quantity, 0);

  const value = useMemo(
    () => ({ cart, addItem, removeItem, updateQuantity, clearCart, getTotal }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// helper to seed example items if needed
export function getSampleItems() {
  return menuSeed.slice(0, 3).map((m, i) => ({
    id: m.id,
    name: m.name,
    price: typeof m.price === "number" ? m.price : 12 + i,
    image: m.image,
    localImage: m.localImage,
    quantity: 1,
  }));
}
