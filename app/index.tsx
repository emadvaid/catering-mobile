import type { ReactNode } from "react";
import { useMemo } from "react";
import { Link } from "expo-router";
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
import menu from "../data/menu";
import packages from "../data/packages";

const specialties = menu.slice(0, 8);

const cuisineCategories = [
  { name: "Appetizers", icon: "🥟", link: "/menu" },
  { name: "Curries", icon: "🍛", link: "/menu" },
  { name: "Biryani", icon: "🍚", link: "/menu" },
  { name: "Grilled", icon: "🍢", link: "/menu" },
  { name: "Vegetarian", icon: "🥗", link: "/menu" },
  { name: "Desserts", icon: "🍰", link: "/menu" },
  { name: "More", icon: "•••", link: "/menu" },
];

const howIcons = [
  "🥗",
  "🍛",
  "🍚",
  "🍢",
  "🥗",
  "🍰",
  "☕",
  "🥤",
  "🍽️",
];

type Layout = ReturnType<typeof buildLayout>;

export default function Home() {
  const { width } = useWindowDimensions();
  const layout = useMemo(() => buildLayout(width), [width]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Hero layout={layout} />

        <ColorSection color="#fff">
          <Section
            title="How It Works"
            subtitle="Simple steps to exceptional catering"
            maxContent={layout.maxContent}
          >
            <View style={styles.stepsRow}>
              {[
                { num: "1", title: "Browse Menu", text: "Explore diverse cuisines" },
                { num: "2", title: "Customize Order", text: "Pick dishes & portions" },
                { num: "3", title: "Confirm Details", text: "Review & schedule" },
                { num: "4", title: "Enjoy!", text: "We deliver with full service" },
              ].map((step) => (
                <View key={step.num} style={[styles.stepCard, { width: layout.stepWidth }]}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNum}>{step.num}</Text>
                  </View>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.iconRow}>
              {howIcons.map((ic, idx) => (
                <View key={idx} style={styles.iconDot}>
                  <Text style={styles.iconEmoji}>{ic}</Text>
                </View>
              ))}
            </View>
          </Section>
        </ColorSection>

        <CategoryRibbon maxContent={layout.maxContent} />

        <ColorSection color="#f7f9fb">
          <Section
            title="Our Specialties"
            subtitle="Authentic Pakistani and International Cuisine"
            maxContent={layout.maxContent}
          >
            <View style={styles.specialtiesRow}>
              {specialties.map((item) => (
                <View key={item.id} style={[styles.specialCard, { width: layout.specialWidth }]}>
                  {item.localImage ? (
                    <Image source={item.localImage} style={styles.specialImg} resizeMode="cover" />
                  ) : null}
                  <View style={styles.specialBody}>
                    <Text numberOfLines={1} style={styles.specialTitle}>
                      {item.name}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <Link href="/menu" style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>View Full Menu</Text>
            </Link>
          </Section>
        </ColorSection>

        <GradientBand colors={["#fff7e6", "#fff1d6"]}>
          <Section
            title="Catering Packages"
            subtitle="Pre-designed packages or build your own"
            maxContent={layout.maxContent}
          >
            <View style={styles.packagesRow}>
              {packages.slice(0, 3).map((pkg, idx) => {
                const headerColors =
                  idx === 0
                    ? ["#b91c1c", "#ef4444"]
                    : idx === 1
                    ? ["#2563eb", "#1d4ed8"]
                    : ["#16a34a", "#15803d"];
                return (
                  <View key={pkg.id} style={[styles.packageCard, { width: layout.packageWidth }]}>
                    <LinearGradient
                      colors={headerColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.packageHeader}
                    >
                      <Text style={styles.packageHeaderText}>{pkg.name}</Text>
                      <Text style={styles.packageHeaderSub}>{pkg.priceNote}</Text>
                    </LinearGradient>
                    <Text style={styles.packageText}>Appetizers: {pkg.appetizers[0]}</Text>
                    <Text style={styles.packageText}>
                      Mains: {pkg.mains.slice(0, 3).join(", ")}...
                    </Text>
                    <Text style={styles.packageText}>
                      Desserts: {pkg.dessertsPremium?.[0] || pkg.dessertsRegular?.[0] || "Included"}
                    </Text>
                    <Link href="/packages" style={styles.linkText}>
                      Explore Package
                    </Link>
                  </View>
                );
              })}
            </View>
          </Section>
        </GradientBand>

        <ColorSection color="#fff">
          <Section title="Why Choose Kabab Hut Catering?" maxContent={layout.maxContent}>
            <View style={styles.reasonsRow}>
              {[
                { title: "Global Cuisine Experts", text: "Chefs across Middle Eastern, Turkish, American BBQ, Asian fusion.", color: "#22c55e" },
                { title: "Premium Quality", text: "Fresh, halal-focused sourcing and rigorous prep standards.", color: "#3b82f6" },
                { title: "Professional Service", text: "Setup, service, cleanup—full event support.", color: "#a855f7" },
              ].map((item) => (
                <View key={item.title} style={[styles.reasonCard, { width: layout.reasonWidth }]}>
                  <View style={[styles.reasonIcon, { backgroundColor: item.color }]}>
                    <Text style={styles.reasonIconText}>✓</Text>
                  </View>
                  <Text style={styles.reasonTitle}>{item.title}</Text>
                  <Text style={styles.reasonText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </Section>
        </ColorSection>

        <GradientBand colors={["#fff6f6", "#fffdf9"]}>
          <Section title="What Our Clients Say" maxContent={layout.maxContent}>
            <View style={styles.testimonialsRow}>
              {[
                {
                  name: "Sophia M.",
                  role: "Bride",
                  quote:
                    "They nailed our 300-guest wedding—service was seamless and food was unforgettable.",
                },
                {
                  name: "Rahul S.",
                  role: "Corporate Event",
                  quote: "Flawless delivery for our executive summit. Guests raved about the biryani.",
                },
                {
                  name: "Ayesha K.",
                  role: "Family Reunion",
                  quote: "From appetizers to desserts, everything tasted home-cooked yet premium.",
                },
              ].map((t) => (
                <View
                  key={t.name}
                  style={[styles.testimonialCard, { width: layout.testimonialWidth }]}
                >
                  <Text style={styles.testimonialQuote}>“{t.quote}”</Text>
                  <Text style={styles.testimonialName}>{t.name}</Text>
                  <Text style={styles.testimonialRole}>{t.role}</Text>
                </View>
              ))}
            </View>
          </Section>
        </GradientBand>

        <CTASection layout={layout} />

        <Footer layout={layout} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Hero({ layout }: { layout: Layout }) {
  return (
    <View style={{ width: "100%" }}>
      <LinearGradient
        colors={["#1f0303", "#7a0e0e", "#0c0b0b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBg}
      >
        <View style={[styles.heroInner, { maxWidth: layout.maxContent }]}>
          <View style={styles.navRow}>
            {[
              { href: "/", label: "Home" },
              { href: "/packages", label: "Packages" },
              { href: "/menu", label: "Menu" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={styles.navLink}>
                <Text style={styles.navLinkText}>{link.label}</Text>
              </Link>
            ))}
            <Text style={styles.cartIcon}>🛒</Text>
            <Link href="/login" style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>Login</Text>
            </Link>
          </View>

          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text
            style={[
              styles.heroTitle,
              { fontSize: layout.isDesktop ? 40 : layout.isTablet ? 32 : 26 },
            ]}
          >
            South Asian Catering That Shouts Flavor
          </Text>
          <Text style={styles.heroSub}>
            Signature Pakistani & Indian spreads with big-night energy—want Middle Eastern, Turkish,
            American, or any cuisine? Ask and we'll craft it loud and unforgettable.
          </Text>
          <View style={styles.heroButtons}>
            <Link href="/menu" style={styles.ctaPrimary}>
              <Text style={styles.ctaPrimaryText}>Browse Menu</Text>
            </Link>
            <Link href="/contact" style={styles.ctaGhost}>
              <Text style={styles.ctaGhostText}>Contact Us</Text>
            </Link>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function Section({
  title,
  subtitle,
  children,
  maxContent,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxContent: number;
}) {
  return (
    <View style={[styles.section, { maxWidth: maxContent }]}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function GradientBand({
  colors,
  children,
}: {
  colors: string[];
  children: ReactNode;
}) {
  return (
    <LinearGradient colors={colors} style={styles.band}>
      {children}
    </LinearGradient>
  );
}

function ColorSection({ color, children }: { color: string; children: ReactNode }) {
  return <View style={[styles.colorBand, { backgroundColor: color }]}>{children}</View>;
}

function CategoryRibbon({ maxContent }: { maxContent: number }) {
  return (
    <View style={[styles.ribbonSection, { maxWidth: maxContent }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.ribbonScroll}
      >
        {cuisineCategories.map((cat) => (
          <Link key={cat.name} href={cat.link} style={styles.ribbonChip}>
            <View style={styles.ribbonIcon}>
              <Text style={styles.ribbonIconText}>{cat.icon}</Text>
            </View>
            <Text style={styles.ribbonLabel}>{cat.name}</Text>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}

function CTASection({ layout }: { layout: Layout }) {
  return (
    <LinearGradient
      colors={["#111827", "#7a0e0e", "#a30f0f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.ctaBand}
    >
      <View style={[styles.section, { maxWidth: layout.maxContent, paddingBottom: 40 }]}>
        <Text style={[styles.sectionTitle, { color: "white", fontSize: 28 }]}>
          Ready to Elevate Your Event?
        </Text>
        <Text style={[styles.sectionSubtitle, { color: "rgba(255,255,255,0.9)" }]}>
          Experience world-class catering for weddings, corporate events, and celebrations.
        </Text>
        <View style={styles.heroButtons}>
          <Link href="/menu" style={styles.ctaPrimary}>
            <Text style={styles.ctaPrimaryText}>Browse Menu</Text>
          </Link>
          <Link href="/contact" style={styles.ctaGhost}>
            <Text style={styles.ctaGhostText}>Contact Us</Text>
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
  const maxContent = Math.min(1240, width - 24);

  const colWidth = (cols: number) => (maxContent - (cols - 1) * 12) / cols;

  const stepCols = width >= 1024 ? 4 : width >= 700 ? 2 : 1;
  const specialCols = width >= 1180 ? 4 : width >= 960 ? 3 : 2;
  const packageCols = width >= 1100 ? 3 : width >= 780 ? 2 : 1;
  const testimonialCols = width >= 1100 ? 3 : width >= 780 ? 2 : 1;
  const reasonCols = width >= 1024 ? 3 : width >= 700 ? 2 : 1;

  return {
    maxContent,
    isTablet: width >= 700,
    isDesktop: width >= 1024,
    stepWidth: colWidth(stepCols),
    specialWidth: colWidth(specialCols),
    packageWidth: colWidth(packageCols),
    testimonialWidth: colWidth(testimonialCols),
    reasonWidth: colWidth(reasonCols),
  };
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  scroll: { alignItems: "center", paddingBottom: 32, width: "100%" },

  heroBg: { width: "100%", paddingVertical: 72, paddingHorizontal: 20 },
  heroInner: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    gap: 10,
  },
  navRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 8,
  },
  navLink: { paddingHorizontal: 6, paddingVertical: 4 },
  navLinkText: { color: "white", fontWeight: "700", fontSize: 13 },
  cartIcon: { color: "white", fontSize: 16, marginHorizontal: 6 },
  loginBtn: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  loginBtnText: { color: "#111827", fontWeight: "800" },
  logo: { width: 90, height: 90, borderRadius: 16, marginBottom: 8 },
  heroTitle: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
  },
  heroSub: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    textAlign: "center",
    maxWidth: 820,
    lineHeight: 22,
  },
  heroButtons: { flexDirection: "row", gap: 12, marginTop: 10 },
  ctaPrimary: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaPrimaryText: { color: "#111827", fontWeight: "700" },
  ctaGhost: {
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaGhostText: { color: "white", fontWeight: "700" },

  section: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 36,
    gap: 16,
    alignSelf: "center",
  },
  sectionHead: { alignItems: "center", gap: 6 },
  sectionTitle: { fontSize: 24, fontWeight: "800", color: "#111827" },
  sectionSubtitle: { fontSize: 15, color: "#4b5563", textAlign: "center", maxWidth: 720 },

  stepsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  stepCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  stepNum: { fontSize: 20, fontWeight: "800", color: "#b91c1c" },
  stepTitle: { fontWeight: "700", color: "#111827", fontSize: 15 },
  stepText: { fontSize: 13, color: "#4b5563", textAlign: "center", marginTop: 6 },

  ribbonSection: { width: "100%", paddingVertical: 10, alignItems: "center" },
  ribbonScroll: { gap: 12, paddingHorizontal: 12 },
  ribbonChip: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    gap: 6,
    flexDirection: "row",
  },
  ribbonIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff7f2",
    alignItems: "center",
    justifyContent: "center",
  },
  ribbonIconText: { fontSize: 18 },
  ribbonLabel: { fontWeight: "700", color: "#111827" },

  specialtiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    alignSelf: "center",
  },
  specialCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  specialImg: { width: "100%", height: 130 },
  specialBody: { padding: 12 },
  specialTitle: { fontWeight: "700", color: "#111827", fontSize: 15 },
  specialDesc: { fontSize: 12, color: "#4b5563", marginTop: 4 },

  primaryBtn: {
    marginTop: 12,
    alignSelf: "center",
    backgroundColor: "#b91c1c",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryBtnText: { color: "white", fontWeight: "700", fontSize: 15 },

  packagesRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
  packageCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  packageHeader: { padding: 12 },
  packageHeaderText: { color: "#fff", fontWeight: "800", fontSize: 17 },
  packageHeaderSub: { color: "rgba(255,255,255,0.9)", marginTop: 2, fontSize: 13 },
  packageText: { fontSize: 13, color: "#4b5563", paddingHorizontal: 14, paddingTop: 10 },
  linkText: { color: "#2563eb", fontWeight: "700", marginTop: 12, padding: 14 },

  reasonsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
  reasonCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  reasonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  reasonIconText: { color: "#fff", fontWeight: "800", fontSize: 22 },
  reasonTitle: { fontWeight: "800", color: "#111827", fontSize: 16 },
  reasonText: { fontSize: 13, color: "#4b5563", marginTop: 6 },

  testimonialsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
  testimonialCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  testimonialQuote: { fontSize: 13, color: "#4b5563", marginBottom: 8, fontStyle: "italic" },
  testimonialName: { fontWeight: "800", color: "#111827" },
  testimonialRole: { fontSize: 12, color: "#6b7280" },

  band: { width: "100%" },
  ctaBand: { width: "100%", marginTop: 12 },
  colorBand: { width: "100%" },

  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  iconDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff7e6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f3d9a6",
  },
  iconEmoji: { fontSize: 18 },

  footerBand: { width: "100%", paddingVertical: 32 },
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
