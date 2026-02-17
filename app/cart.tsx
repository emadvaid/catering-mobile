import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import menu from "../data/menu";

type CartItem = {
  id: string;
  name: string;
  price?: number;
  qty: number;
};

export default function CartScreen() {
  const [items, setItems] = useState<CartItem[]>(() =>
    menu.slice(0, 3).map((m, i) => ({
      id: m.id,
      name: m.name,
      price: typeof m.price === "number" ? m.price : 12 + i,
      qty: 1,
    }))
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 0), 0),
    [items]
  );

  const adjust = (id: string, delta: number) => {
    setItems((cur) =>
      cur
        .map((it) =>
          it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
        )
        .filter((it) => it.qty > 0)
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "Cart" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <Text className="text-3xl font-bold text-gray-900">Cart</Text>

          {items.map((it) => (
            <View
              key={it.id}
              className="bg-white rounded-card p-4 shadow-sm flex-row justify-between items-center"
            >
              <View className="flex-1 pr-3">
                <Text className="font-semibold text-gray-900">{it.name}</Text>
                <Text className="text-gray-600">
                  ${((it.price || 0) * it.qty).toFixed(2)}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => adjust(it.id, -1)}
                  className="px-3 py-1 bg-gray-100 rounded"
                >
                  <Text className="text-lg">-</Text>
                </Pressable>
                <Text className="w-8 text-center font-semibold">
                  {it.qty}
                </Text>
                <Pressable
                  onPress={() => adjust(it.id, 1)}
                  className="px-3 py-1 bg-gray-100 rounded"
                >
                  <Text className="text-lg">+</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <View className="bg-white rounded-card p-4 shadow-sm">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700">Subtotal</Text>
              <Text className="font-semibold text-gray-900">
                ${subtotal.toFixed(2)}
              </Text>
            </View>
            <Pressable className="mt-3 bg-primary rounded-card py-3 items-center">
              <Text className="text-white font-semibold">Checkout</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
