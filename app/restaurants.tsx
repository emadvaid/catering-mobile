import { Stack, Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import caterersData from "../data/caterers";

export default function RestaurantsScreen() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    caterersData.forEach((c) => c.categories?.forEach((cat) => set.add(cat)));
    return Array.from(set);
  }, []);

  const filtered = caterersData.filter((c) => {
    if (category !== "All" && !(c.categories || []).includes(category))
      return false;
    if (
      q &&
      !c.name.toLowerCase().includes(q.toLowerCase()) &&
      !c.desc.toLowerCase().includes(q.toLowerCase())
    )
      return false;
    return true;
  });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Stack.Screen options={{ title: "Caterers" }} />
      <SafeAreaView className="flex-1 bg-surface">
        <View className="p-4 gap-3">
          <Text className="text-3xl font-bold text-gray-900">
            Browse Caterers
          </Text>
          <View className="flex-row gap-2">
            <TextInput
              value={q}
              onChangeText={(t) => {
                setQ(t);
                setPage(1);
              }}
              placeholder="Search restaurants, cuisines, dishes"
              className="flex-1 bg-white border border-gray-200 rounded-card px-3 py-2"
            />
          </View>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((cat) => (
              <Text
                key={cat}
                onPress={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full border ${
                  category === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-800 border-gray-200"
                }`}
              >
                {cat}
              </Text>
            ))}
          </View>
          <Text className="text-sm text-gray-600">
            Showing {total} result{total === 1 ? "" : "s"}
          </Text>
        </View>

        <FlatList
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, gap: 12 }}
          data={paged}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View className="bg-white rounded-card shadow-sm overflow-hidden">
              <Image
                source={{ uri: item.image }}
                className="w-full h-44"
                resizeMode="cover"
              />
              <View className="p-4 gap-2">
                <Text className="text-xl font-semibold text-gray-900">
                  {item.name}
                </Text>
                <Text className="text-gray-600">{item.desc}</Text>
                <Text className="text-sm text-gray-500">
                  ⭐ {item.rating} • {item.distance} • Fee {item.deliveryFee}
                </Text>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-primary font-semibold mt-1"
                  >
                    View menu →
                  </Link>
                ) : null}
              </View>
            </View>
          )}
        />

        <View className="flex-row justify-center items-center gap-3 pb-4">
          <Text
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1 border rounded ${
              page <= 1 ? "opacity-50" : ""
            }`}
          >
            Prev
          </Text>
          <Text className="text-gray-700">
            Page {page} / {pages}
          </Text>
          <Text
            onPress={() => setPage((p) => Math.min(pages, p + 1))}
            className={`px-3 py-1 border rounded ${
              page >= pages ? "opacity-50" : ""
            }`}
          >
            Next
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}
