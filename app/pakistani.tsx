import { Stack, Link } from "expo-router";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";

const pakistaniMenu = [
  { id: 1, name: "Chicken Biryani", desc: "Aromatic rice layered with spiced chicken.", price: "$13.50" },
  { id: 2, name: "Beef Karahi", desc: "Wok-style beef with tomatoes and spices.", price: "$14.00" },
  { id: 3, name: "Seekh Kebab", desc: "Skewered spiced ground meat, grilled.", price: "$3.50" },
  { id: 4, name: "Naan Basket", desc: "Assorted traditional breads.", price: "$2.50" },
  { id: 5, name: "Raita", desc: "Yogurt with cucumber and spices.", price: "$1.50" },
];

export default function PakistaniScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Pakistani Catering" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1604908177079-3a79b4f0c9d6?w=1200&q=80&auto=format&fit=crop",
            }}
            className="w-full h-52 rounded-card"
            resizeMode="cover"
          />
          <Text className="text-3xl font-bold text-gray-900">
            Karahi & Kebab Pakistani Catering
          </Text>
          <Text className="text-gray-700">
            Authentic Pakistani flavors prepared with traditional spices and halal protein options — perfect for weddings,
            corporate events, and family gatherings.
          </Text>

          <View className="bg-white rounded-card p-4 shadow-sm">
            <Text className="text-2xl font-semibold text-gray-900 mb-3">Menu</Text>
            {pakistaniMenu.map((it) => (
              <View key={it.id} className="flex-row justify-between py-2 border-b border-gray-100">
                <View className="flex-1 pr-2">
                  <Text className="font-semibold text-gray-900">{it.name}</Text>
                  <Text className="text-gray-600 text-sm">{it.desc}</Text>
                </View>
                <Text className="font-semibold text-gray-800">{it.price}</Text>
              </View>
            ))}
          </View>

          <View className="bg-white rounded-card p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">Details</Text>
            <Text className="text-gray-700 mt-2">Rating: ★ 4.9</Text>
            <Text className="text-gray-700">Minimum order: $150</Text>
            <Text className="text-gray-700">Delivery fee: $30+</Text>
            <Link
              href="/contact"
              className="mt-4 bg-green-600 text-white text-center px-4 py-3 rounded-card font-semibold"
            >
              Request Quote
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
