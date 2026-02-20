import React, { useMemo } from "react";
import { Stack, Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useCart } from "../lib/cart-context";
import { getToken } from "../lib/auth";

type Layout = ReturnType<typeof buildLayout>;

export default function CartScreen() {
  const { cart, updateQuantity, removeItem, clearCart, getTotal } = useCart();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const layout = useMemo(() => buildLayout(width), [width]);

  const total = getTotal();

  const handleCheckout = async () => {
    const token = await getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    // placeholder checkout
    alert(`Checkout coming soon! Total $${total.toFixed(2)}`);
    clearCart();
    router.replace("/");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Cart" }} />
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Header layout={layout} />

          <View style={[styles.container, { maxWidth: layout.maxContent }]}>
            <Text style={styles.heading}>Shopping Cart</Text>

            {cart.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <Link href="/menu" style={styles.primaryBtn}>
                  <Text style={styles.primaryBtnText}>Browse Menu</Text>
                </Link>
              </View>
            ) : (
              <>
                <View style={styles.card}>
                  {cart.map((item) => (
                    <View key={item.id} style={styles.row}>
                      <View style={styles.thumbBox}>
                        {item.localImage ? (
                          <Image source={item.localImage} style={styles.thumb} />
                        ) : (
                          <View style={styles.thumbPlaceholder}>
                            <Text style={{ color: "white", fontSize: 20 }}>🍽️</Text>
                          </View>
                        )}
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        {item.price ? (
                          <Text style={styles.itemPrice}>${Number(item.price).toFixed(2)}</Text>
                        ) : (
                          <Text style={styles.itemMuted}>Contact for pricing</Text>
                        )}
                      </View>
                      <View style={styles.qtyBox}>
                        <Pressable
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Text>-</Text>
                        </Pressable>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <Pressable
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Text>+</Text>
                        </Pressable>
                      </View>
                      <View style={{ width: 70, alignItems: "flex-end" }}>
                        {item.price ? (
                          <Text style={styles.subtotal}>
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </Text>
                        ) : (
                          <Text style={styles.itemMuted}>TBD</Text>
                        )}
                      </View>
                      <Pressable onPress={() => removeItem(item.id)} style={{ marginLeft: 8 }}>
                        <Text style={styles.remove}>✕</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>

                <View style={styles.card}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                  </View>
                  <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
                    <Text style={styles.checkoutText}>
                      {total > 0 ? "Proceed to Checkout" : "Login to Checkout"}
                    </Text>
                  </Pressable>
                  <Pressable style={styles.clearBtn} onPress={clearCart}>
                    <Text style={styles.clearText}>Clear Cart</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>

          <Footer layout={layout} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function Header({ layout }: { layout: Layout }) {
  return (
    <LinearGradient
      colors={["#0d1222", "#7a0e0e", "#9b1111"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <View style={[styles.headerInner, { maxWidth: layout.maxContent }]}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <View style={styles.navRow}>
          {[
            { href: "/", label: "Home" },
            { href: "/packages", label: "Packages" },
            { href: "/menu", label: "Menu" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={styles.navLink}>
              <Text style={styles.navText}>{link.label}</Text>
            </Link>
          ))}
          <Text style={styles.cartIcon}>🛒</Text>
          <Link href="/login" style={styles.loginChip}>
            <Text style={styles.loginChipText}>Login</Text>
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
}

function Footer({ layout }: { layout: Layout }) {
  return (
    <LinearGradient
      colors={["#0d1222", "#0a0f1b"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.footerBand}
    >
      <View style={[styles.footerContent, { maxWidth: layout.maxContent, alignSelf: "center" }]}>
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>Kabab Hut Catering</Text>
          <Text style={styles.footerText}>World-class international cuisine for every occasion.</Text>
        </View>
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>Contact</Text>
          <Text style={styles.footerText}>Phone: (678) 826-9584</Text>
          <Text style={styles.footerText}>Email: kababhutcatering@gmail.com</Text>
          <Text style={styles.footerText}>5820 Jimmy Carter Blvd, Norcross, GA</Text>
        </View>
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>Services</Text>
          <Text style={styles.footerText}>Weddings · Corporate Events</Text>
          <Text style={styles.footerText}>Private Parties · Conferences</Text>
        </View>
      </View>
      <Text style={styles.footerNote}>© 2026 Kabab Hut Catering. All rights reserved.</Text>
    </LinearGradient>
  );
}

function buildLayout(width: number) {
  const maxContent = Math.min(1180, width - 24);
  return { maxContent };
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  header: { width: "100%", paddingVertical: 20, paddingHorizontal: 16 },
  headerInner: { width: "100%", alignSelf: "center", alignItems: "center", gap: 10 },
  logo: { width: 90, height: 90, resizeMode: "contain" },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 14,
  },
  navLink: { paddingHorizontal: 6, paddingVertical: 4 },
  navText: { color: "white", fontWeight: "700", fontSize: 13 },
  cartIcon: { color: "white", fontSize: 16, marginHorizontal: 6 },
  loginChip: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  loginChipText: { color: "#111827", fontWeight: "800" },

  container: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 12,
  },
  heading: { fontSize: 22, fontWeight: "800", color: "#111827", textAlign: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  thumbBox: { width: 70, height: 70, borderRadius: 8, overflow: "hidden" },
  thumb: { width: "100%", height: "100%" },
  thumbPlaceholder: {
    flex: 1,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: { fontSize: 15, fontWeight: "800", color: "#111827" },
  itemPrice: { color: "#b91c1c", fontWeight: "700", marginTop: 2 },
  itemMuted: { color: "#6b7280", fontSize: 12, fontStyle: "italic" },
  qtyBox: { flexDirection: "row", alignItems: "center", gap: 6 },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },
  qtyText: { width: 26, textAlign: "center", fontWeight: "700", color: "#111827" },
  subtotal: { fontWeight: "800", color: "#111827" },
  remove: { color: "#b91c1c", fontWeight: "800", fontSize: 16 },

  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 18, fontWeight: "800", color: "#111827" },
  totalValue: { fontSize: 22, fontWeight: "800", color: "#b91c1c" },
  checkoutBtn: {
    marginTop: 12,
    backgroundColor: "#b91c1c",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: { color: "white", fontWeight: "800", fontSize: 15 },
  clearBtn: {
    marginTop: 10,
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  clearText: { color: "#111827", fontWeight: "700" },

  empty: { alignItems: "center", gap: 12, paddingVertical: 20 },
  emptyText: { fontSize: 18, color: "#4b5563" },
  primaryBtn: {
    backgroundColor: "#b91c1c",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryBtnText: { color: "white", fontWeight: "800" },

  footerBand: { width: "100%", paddingVertical: 32, marginTop: 24 },
  footerContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 18,
    alignItems: "flex-start",
  },
  footerCol: { flex: 0, minWidth: 200, gap: 6, alignItems: "flex-start" },
  footerTitle: { color: "white", fontWeight: "800", fontSize: 14 },
  footerText: { color: "rgba(255,255,255,0.82)", fontSize: 12, lineHeight: 18 },
  footerNote: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 12,
  },
});
