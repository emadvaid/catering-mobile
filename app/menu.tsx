import { Stack, Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import menuSeed, { MenuItem } from "../data/menu";
import { apiFetch } from "../lib/api";
import { useCart } from "../lib/cart-context";

const { width } = Dimensions.get("window");
const cardWidth = 260;
const maxWidth = 980;

export default function MenuScreen() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const { cart, addItem, removeItem } = useCart();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiFetch<MenuItem[]>("/menu");
        if (mounted) setItems(res);
      } catch {
        if (mounted) setItems(menuSeed);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(["all"]);
    items.forEach((i) => set.add(i.category || "uncategorized"));
    return Array.from(set);
  }, [items]);

  const filtered =
    category === "all"
      ? items
      : items.filter((i) => (i.category || "uncategorized") === category);

  const toggleCart = (item: MenuItem) => {
    const inCart = !!cart.find((i) => i.id === item.id);
    if (inCart) removeItem(item.id);
    else addItem({ id: item.id, name: item.name, price: item.price, image: item.image, localImage: item.localImage }, 1);
  };

  const renderCard = ({ item }: { item: MenuItem }) => {
    const inCart = !!cart.find((c) => c.id === item.id);
    const source =
      item.localImage ||
      (item.image?.startsWith("http")
        ? { uri: item.image }
        : item.image
        ? { uri: item.image }
        : null);

    return (
      <View style={styles.card}>
        {source ? <Image source={source} style={styles.cardImg} resizeMode="cover" /> : null}
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDesc}>{item.desc}</Text>
          <Text style={styles.cardPrice}>
            {item.price ? `$${item.price}` : "Contact for pricing"}
          </Text>
          <Pressable
            onPress={() => toggleCart(item)}
            style={[styles.cartBtn, inCart ? styles.cartBtnSecondary : styles.cartBtnPrimary]}
          >
            <Text style={styles.cartBtnText}>
              {inCart ? "Remove from Cart" : "Add to Cart"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "Menu" }} />
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Our Menu</Text>
          <Link href="/cart" style={styles.cartLink}>
            <Text style={styles.cartLinkText}>Cart ({cart.length})</Text>
          </Link>
        </View>

        <View style={styles.filters}>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.filterChip, category === cat && styles.filterChipActive]}
            >
              <Text
                style={[
                  styles.filterText,
                  category === cat ? styles.filterTextActive : undefined,
                ]}
              >
                {cat.replace(/-/g, " ")}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#b91c1c" />
            <Text style={styles.loaderText}>Loading menu…</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.grid}
            data={filtered}
            keyExtractor={(i) => i.id}
            renderItem={renderCard}
            numColumns={Math.floor(Math.min(maxWidth, width) / cardWidth)}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8fafc" },
  header: { alignItems: "center", paddingVertical: 16 },
  title: { fontSize: 22, fontWeight: "800", color: "#111827" },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignSelf: "center",
    maxWidth,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  filterChipActive: {
    backgroundColor: "#b91c1c",
    borderColor: "#b91c1c",
  },
  filterText: { fontWeight: "700", color: "#111827", fontSize: 13 },
  filterTextActive: { color: "#fff" },

  grid: {
    alignItems: "center",
    paddingBottom: 24,
    rowGap: 14,
    columnGap: 14,
    paddingHorizontal: 10,
  },
  cartLink: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#111827", borderRadius: 10 },
  cartLinkText: { color: "white", fontWeight: "800" },
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImg: { width: "100%", height: 150 },
  cardBody: { padding: 12, gap: 6 },
  cardTitle: { fontWeight: "800", color: "#111827", fontSize: 14 },
  cardDesc: { fontSize: 11, color: "#4b5563" },
  cardPrice: { fontSize: 12, color: "#b91c1c", fontWeight: "700" },
  cartBtn: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  cartBtnPrimary: { backgroundColor: "#b91c1c" },
  cartBtnSecondary: { backgroundColor: "#111827" },
  cartBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },

  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  loaderText: { marginTop: 8, color: "#4b5563" },
});
