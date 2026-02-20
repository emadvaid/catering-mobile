import React, { useMemo } from "react";
import { Stack, Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { apiBaseUrl } from "../lib/api";

type Layout = ReturnType<typeof buildLayout>;

export default function AboutScreen() {
  const { width } = useWindowDimensions();
  const layout = useMemo(() => buildLayout(width), [width]);

  return (
    <>
      <Stack.Screen options={{ title: "About Kabab Hut" }} />
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Header layout={layout} />

          <View style={[styles.content, { maxWidth: layout.maxContent }]}>
            <Text style={styles.pageTitle}>About Kabab Hut Catering</Text>
            <Text style={styles.lead}>
              Kabab Hut Catering is a premier full-service catering company specializing in
              international cuisine. We bring together master chefs from around the world to deliver
              authentic flavors from Middle Eastern, Turkish, Mediterranean, American, Asian, and
              European culinary traditions.
            </Text>

            <Section title="Our Mission">
              <Text style={styles.body}>
                To provide exceptional catering experiences that celebrate global diversity through
                food. Every event deserves world-class cuisine, professional service, and attention
                to detail—whether it's an intimate gathering of 20 or a grand celebration of 1000+
                guests.
              </Text>
            </Section>

            <Section title="What We Offer">
              <Bullet text="Diverse International Menus: Middle Eastern, Turkish, Mediterranean, American BBQ, Asian fusion, and more" />
              <Bullet text="Dietary Accommodations: Halal, kosher, vegan, vegetarian, gluten-free, and allergy-conscious options" />
              <Bullet text="Premium Ingredients: Fresh, high-quality ingredients from certified suppliers" />
              <Bullet text="Professional Service: Experienced staff for setup, service, and cleanup" />
              <Bullet text="Custom Packages: Tailored menus for weddings, corporate events, conferences, and private parties" />
            </Section>

            <Section title="Our Promise">
              <Text style={styles.body}>
                Punctual delivery, exceptional taste, and elegant presentation. We work closely with
                you to understand your vision and dietary requirements, ensuring every guest enjoys
                a memorable culinary experience. Your satisfaction is our top priority.
              </Text>
            </Section>
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
          <Link href="/login" style={styles.loginBtn}>
            <Text style={styles.loginText}>Login</Text>
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ gap: 8 }}>{children}</View>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.body}>{text}</Text>
    </View>
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
      <Text style={styles.footerNote}>© 2026 Kabab Hut Catering. All rights reserved. API: {apiBaseUrl.replace(/https?:\/\//, "")}</Text>
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
  loginBtn: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  loginText: { color: "#111827", fontWeight: "800" },

  content: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 14,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: "#111827" },
  lead: { fontSize: 15, color: "#374151", lineHeight: 22 },
  body: { fontSize: 14, color: "#374151", lineHeight: 21 },

  section: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  bulletDot: { color: "#b91c1c", fontSize: 16, lineHeight: 20 },

  footerBand: { width: "100%", paddingVertical: 32, marginTop: 12 },
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
