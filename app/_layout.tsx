import { Stack } from "expo-router";
import { CartProvider } from "../lib/cart-context";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack />
    </CartProvider>
  );
}
