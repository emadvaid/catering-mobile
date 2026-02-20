import React, { useMemo, useState } from "react";
import { Stack, Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { apiFetch } from "../lib/api";
import { saveToken } from "../lib/auth";

type Layout = ReturnType<typeof buildLayout>;

export default function LoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const layout = useMemo(() => buildLayout(width), [width]);

  const [email, setEmail] = useState("owner-1@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ token?: string; role?: string }>("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res?.token) {
        await saveToken(res.token);
        // simple role-based redirect if provided
        if (res.role === "root") router.replace("/dashboard/root");
        else if (res.role === "owner") router.replace("/dashboard/owner");
        else if (res.role === "customer") router.replace("/dashboard/customer");
        else router.replace("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Header layout={layout} />

          <View style={[styles.formWrap, { maxWidth: layout.maxContent }]}>
            <Text style={styles.pageTitle}>Login</Text>
            <View style={styles.formCard}>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                  placeholder="you@example.com"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                  placeholder="••••••••"
                />
              </View>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Pressable
                disabled={loading}
                onPress={handleLogin}
                style={[styles.loginBtn, loading && styles.disabled]}
              >
                <Text style={styles.loginBtnText}>{loading ? "Signing in..." : "Login"}</Text>
              </Pressable>
            </View>
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

  formWrap: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 12,
    alignItems: "center",
  },
  pageTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },
  formCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 10,
  },
  field: { gap: 6 },
  label: { color: "#111827", fontWeight: "700", fontSize: 13 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    backgroundColor: "#fff",
  },
  error: { color: "#b91c1c", fontSize: 12, marginTop: 4 },
  loginBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  loginBtnText: { color: "white", fontWeight: "800" },
  disabled: { opacity: 0.6 },

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
