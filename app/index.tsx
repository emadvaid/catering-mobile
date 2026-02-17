import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import menu from "../data/menu";
import packages from "../data/packages";

const { width } = Dimensions.get("window");
const maxWidth = 1100;

const quickLinks = [
  { href: "/menu", label: "Browse Menu" },
  { href: "/contact", label: "Contact Us" },
];

const specialties = menu.slice(0, 6);

export default function Home() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Hero />

        <Section title="How It Works" subtitle="Simple steps to exceptional catering">
          <View style={styles.stepsRow}>
            {[
              { num: "1", title: "Browse Menu", text: "Explore diverse cuisines" },
              { num: "2", title: "Customize Order", text: "Pick dishes & portions" },
              { num: "3", title: "Confirm Details", text: "Review & schedule" },
              { num: "4", title: "Enjoy!", text: "We deliver with full service" },
            ].map((step) => (
              <View key={step.num} style={styles.stepCard}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNum}>{step.num}</Text>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Our Specialties" subtitle="Authentic Pakistani and International Cuisine">
          <View style={styles.specialtiesRow}>
            {specialties.map((item) => (
              <View key={item.id} style={styles.specialCard}>
                {item.localImage ? (
                  <Image source={item.localImage} style={styles.specialImg} resizeMode="cover" />
                ) : null}
                <View style={styles.specialBody}>
                  <Text numberOfLines={1} style={styles.specialTitle}>
                    {item.name}
                  </Text>
                  <Text numberOfLines={2} style={styles.specialDesc}>
                    {item.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <Link href="/menu" style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>View All Menu</Text>
          </Link>
        </Section>

        <GradientBand colors={["#fff7e6", "#fff7f2"]}>
          <Section title="Catering Packages" subtitle="Pre-designed or fully customizable">
            <View style={styles.packagesRow}>
              {packages.slice(0, 3).map((pkg) => (
                <View key={pkg.id} style={styles.packageCard}>
                  <Text style={styles.packageTitle}>{pkg.name}</Text>
                  <Text style={styles.packageNote}>{pkg.priceNote}</Text>
                  <Text style={styles.packageText}>Appetizers: {pkg.appetizers[0]}</Text>
                  <Text style={styles.packageText}>
                    Mains: {pkg.mains.slice(0, 3).join(", ")}...
                  </Text>
                  <Link href="/packages" style={styles.linkText}>
                    Explore Package
                  </Link>
                </View>
              ))}
            </View>
          </Section>
        </GradientBand>

        <Section title="Why Choose Kabab Hut Catering?">
          <View style={styles.reasonsRow}>
            {[
              { title: "Global Cuisine Experts", text: "Chefs across Middle Eastern, Turkish, American BBQ, Asian fusion." },
              { title: "Premium Quality", text: "Fresh, halal-focused sourcing and rigorous prep standards." },
              { title: "Professional Service", text: "Setup, service, cleanup—full event support." },
            ].map((item) => (
              <View key={item.title} style={styles.reasonCard}>
                <Text style={styles.reasonTitle}>{item.title}</Text>
                <Text style={styles.reasonText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </Section>

        <GradientBand colors={["#fff6f6", "#fffdf9"]}>
          <Section title="What Our Clients Say">
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
                <View key={t.name} style={styles.testimonialCard}>
                  <Text style={styles.testimonialQuote}>“{t.quote}”</Text>
                  <Text style={styles.testimonialName}>{t.name}</Text>
                  <Text style={styles.testimonialRole}>{t.role}</Text>
                </View>
              ))}
            </View>
          </Section>
        </GradientBand>
      </ScrollView>
    </SafeAreaView>
  );
}

function Hero() {
  return (
    <View style={{ width: "100%" }}>
      <LinearGradient
        colors={["#1f0303", "#7a0e0e", "#0c0b0b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBg}
      >
        <View style={styles.heroInner}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.heroTitle}>South Asian Catering That Shouts Flavor</Text>
          <Text style={styles.heroSub}>
            Signature Pakistani & Indian spreads with big-night energy—plus Middle Eastern, Turkish,
            American, or any cuisine you want. We’ll craft it loud and unforgettable.
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
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.section, { maxWidth }]}>
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
  children: React.ReactNode;
}) {
  return (
    <LinearGradient colors={colors} style={styles.band}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  scroll: { alignItems: "center", paddingBottom: 32, width: "100%" },
  heroBg: { width: "100%", paddingVertical: 56, paddingHorizontal: 20 },
  heroInner: {
    width: "100%",
    maxWidth,
    alignSelf: "center",
    alignItems: "center",
    gap: 10,
  },
  logo: { width: 82, height: 82, borderRadius: 14, marginBottom: 6 },
  heroTitle: {
    color: "white",
    fontSize: width > 1024 ? 30 : 26,
    fontWeight: "800",
    textAlign: "center",
  },
  heroSub: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    textAlign: "center",
    maxWidth: 780,
    lineHeight: 20,
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
    paddingVertical: 20,
    gap: 16,
  },
  sectionHead: { alignItems: "center", gap: 4 },
  sectionTitle: { fontSize: 24, fontWeight: "800", color: "#111827" },
  sectionSubtitle: { fontSize: 15, color: "#4b5563", textAlign: "center" },

  stepsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
  stepCard: {
    width: (maxWidth - 3 * 12) / 4,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  stepCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  stepNum: { fontSize: 18, fontWeight: "800", color: "#b91c1c" },
  stepTitle: { fontWeight: "700", color: "#111827" },
  stepText: { fontSize: 12, color: "#4b5563", textAlign: "center", marginTop: 4 },

  specialtiesRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
  specialCard: {
    width: 170,
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
  specialImg: { width: "100%", height: 110 },
  specialBody: { padding: 10 },
  specialTitle: { fontWeight: "700", color: "#111827", fontSize: 14 },
  specialDesc: { fontSize: 11, color: "#4b5563", marginTop: 2 },

  primaryBtn: {
    marginTop: 12,
    alignSelf: "center",
    backgroundColor: "#b91c1c",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryBtnText: { color: "white", fontWeight: "700" },

  packagesRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
  packageCard: {
    width: 240,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  packageTitle: { fontWeight: "800", color: "#111827", fontSize: 16 },
  packageNote: { color: "#b91c1c", fontWeight: "700", marginVertical: 4 },
  packageText: { fontSize: 12, color: "#4b5563" },
  linkText: { color: "#2563eb", fontWeight: "700", marginTop: 8 },

  reasonsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
  reasonCard: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  reasonTitle: { fontWeight: "800", color: "#111827", fontSize: 15 },
  reasonText: { fontSize: 12, color: "#4b5563", marginTop: 4 },

  testimonialsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
  testimonialCard: {
    width: 240,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  testimonialQuote: { fontSize: 12, color: "#4b5563", marginBottom: 6 },
  testimonialName: { fontWeight: "800", color: "#111827" },
  testimonialRole: { fontSize: 11, color: "#6b7280" },

  band: { width: "100%" },
});
