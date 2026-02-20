import React, { useEffect, useMemo, useState } from "react";
import { Stack, Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import packagesData from "../data/packages";
import menuSeed from "../data/menu";
import { apiFetch, apiBaseUrl } from "../lib/api";

type MenuItem = (typeof menuSeed)[number];
type Package = (typeof packagesData)[number];

type Layout = ReturnType<typeof buildLayout>;

const categoryLimits: Record<
  string,
  { label: string; limit: number }
> = {
  appetizers: { label: "Appetizers", limit: 3 },
  curries: { label: "Curries / Main Course", limit: 5 },
  biryani: { label: "Biryani", limit: 2 },
  grilled: { label: "Grilled / Tandoori", limit: 3 },
  vegetarian: { label: "Vegetarian", limit: 2 },
  desserts: { label: "Desserts", limit: 2 },
};

export default function PackagesScreen() {
  const { width } = useWindowDimensions();
  const layout = useMemo(() => buildLayout(width), [width]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuSeed);
  const [loadingMenu, setLoadingMenu] = useState(true);

  const [customPkg, setCustomPkg] = useState<{
    guestCount: string;
    selectedItems: MenuItem[];
  }>({ guestCount: "", selectedItems: [] });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    headcount: "",
    packageId: packagesData[0]?.id ?? "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [errorText, setErrorText] = useState("");

  const [showPicker, setShowPicker] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiFetch<MenuItem[]>("/menu");
        if (mounted && Array.isArray(data) && data.length) setMenuItems(data);
      } catch {
        // fallback already set
      } finally {
        if (mounted) setLoadingMenu(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddItem = (item: MenuItem) => {
    const category = item.category || "uncategorized";
    const limit = categoryLimits[category]?.limit ?? 5;
    const selectedCount = customPkg.selectedItems.filter(
      (i) => (i.category || "uncategorized") === category
    ).length;

    if (selectedCount >= limit) {
      Alert.alert(
        "Category full",
        `You can only pick ${limit} items from ${categoryLimits[category]?.label || category}.`
      );
      return;
    }
    if (customPkg.selectedItems.find((i) => i.id === item.id)) return;

    setCustomPkg((prev) => ({ ...prev, selectedItems: [...prev.selectedItems, item] }));
  };

  const handleRemoveItem = (id: string) => {
    setCustomPkg((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.filter((i) => i.id !== id),
    }));
  };

  const handleConfirmCustom = () => {
    const message = `Custom Package: ${customPkg.guestCount} guests\nItems:\n${customPkg.selectedItems
      .map((i) => `- ${i.name}`)
      .join("\n")}`;
    setForm((prev) => ({
      ...prev,
      headcount: customPkg.guestCount,
      packageId: "pkg-custom",
      message,
    }));
    setShowConfirm(false);
    // scroll handled by user
  };

  const handleSubmit = async () => {
    setStatus("submitting");
    setErrorText("");
    try {
      await apiFetch("/package-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorText(err?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Packages" }} />
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Hero layout={layout} />

          <View style={[styles.container, { maxWidth: layout.maxContent }]}>
            <Text style={styles.heading}>Catering Packages</Text>
            <Text style={styles.subheading}>
              Four curated spreads (200+ ppl) with appetizers, mains, and regular/premium desserts.
            </Text>

            <View style={styles.grid}>
              {packagesData.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  layout={layout}
                  customPkg={customPkg}
                  setCustomPkg={setCustomPkg}
                  onAddFromMenu={() => setShowPicker(true)}
                  onConfirm={() => setShowConfirm(true)}
                />
              ))}
            </View>
          </View>

          <QuoteForm
            form={form}
            setForm={setForm}
            status={status}
            errorText={errorText}
            packages={packagesData}
            onSubmit={handleSubmit}
            layout={layout}
          />

          <Footer layout={layout} />
        </ScrollView>

        {showPicker && (
          <Overlay onClose={() => setShowPicker(false)}>
            <PickerSheet
              menuItems={menuItems}
              loading={loadingMenu}
              customPkg={customPkg}
              onAddItem={handleAddItem}
              onClose={() => setShowPicker(false)}
            />
          </Overlay>
        )}

        {showConfirm && (
          <Overlay onClose={() => setShowConfirm(false)}>
            <ConfirmSheet
              customPkg={customPkg}
              onClose={() => setShowConfirm(false)}
              onConfirm={handleConfirmCustom}
            />
          </Overlay>
        )}
      </SafeAreaView>
    </>
  );
}

function PackageCard({
  pkg,
  layout,
  customPkg,
  setCustomPkg,
  onAddFromMenu,
  onConfirm,
}: {
  pkg: Package;
  layout: Layout;
  customPkg: { guestCount: string; selectedItems: MenuItem[] };
  setCustomPkg: React.Dispatch<
    React.SetStateAction<{ guestCount: string; selectedItems: MenuItem[] }>
  >;
  onAddFromMenu: () => void;
  onConfirm: () => void;
}) {
  const isCustom = pkg.id === "pkg-custom";
  return (
    <View style={[styles.card, { width: layout.cardWidth }]}>
      <View style={styles.cardHead}>
        <View>
          <Text style={styles.cardTitle}>{pkg.name}</Text>
          <Text style={styles.cardSubtitle}>{pkg.priceNote || "Contact for pricing"}</Text>
        </View>
        <Text style={styles.badge}>{isCustom ? "Custom" : "Large events"}</Text>
      </View>

      {isCustom ? (
        <View style={{ gap: 10 }}>
          <View>
            <Text style={styles.label}>Number of Guests</Text>
            <TextInput
              placeholder="e.g., 150"
              value={customPkg.guestCount}
              onChangeText={(t) => setCustomPkg((p) => ({ ...p, guestCount: t }))}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>
              Selected Items ({customPkg.selectedItems.length})
            </Text>
            {customPkg.selectedItems.length === 0 ? (
              <Text style={styles.mutedSmall}>No items selected yet</Text>
            ) : (
              <View style={{ gap: 6 }}>
                {customPkg.selectedItems.map((item) => (
                  <View key={item.id} style={styles.selectedRow}>
                    <Text style={styles.selectedText}>{item.name}</Text>
                    <Pressable onPress={() => handleRemoveItemOuter(setCustomPkg, item.id)}>
                      <Text style={styles.remove}>✕</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable style={[styles.actionBtn, styles.blueBtn]} onPress={onAddFromMenu}>
              <Text style={styles.actionText}>＋ Add Items from Menu</Text>
            </Pressable>
            <Pressable
              style={[
                styles.actionBtn,
                styles.greenBtn,
                (!customPkg.guestCount || customPkg.selectedItems.length === 0) && styles.disabled,
              ]}
              disabled={!customPkg.guestCount || customPkg.selectedItems.length === 0}
              onPress={onConfirm}
            >
              <Text style={styles.actionText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <StandardPackage pkg={pkg} />
      )}
    </View>
  );
}

function StandardPackage({ pkg }: { pkg: Package }) {
  return (
    <View style={{ gap: 10 }}>
      <TwoCol title="Appetizers" items={pkg.appetizers} />
      <TwoCol title="Main Course" items={pkg.mains} />
      <TwoCol title="Regular Dessert" items={pkg.dessertsRegular} />
      <TwoCol title="Premium Dessert" items={pkg.dessertsPremium} />
      {pkg.note ? <Text style={styles.noteBox}>{pkg.note}</Text> : null}
    </View>
  );
}

function TwoCol({ title, items }: { title: string; items: string[] }) {
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{title}</Text>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          {left.map((it) => (
            <Text key={it} style={styles.listItem}>
              • {it}
            </Text>
          ))}
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          {right.map((it) => (
            <Text key={it} style={styles.listItem}>
              • {it}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function PickerSheet({
  menuItems,
  loading,
  customPkg,
  onAddItem,
  onClose,
}: {
  menuItems: MenuItem[];
  loading: boolean;
  customPkg: { guestCount: string; selectedItems: MenuItem[] };
  onAddItem: (item: MenuItem) => void;
  onClose: () => void;
}) {
  return (
    <View style={styles.sheet}>
      <View style={styles.sheetHead}>
        <Text style={styles.sheetTitle}>Select Menu Items by Category</Text>
        <Pressable onPress={onClose}>
          <Text style={styles.remove}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.limitBox}>
        <Text style={styles.limitTitle}>Pick limits by category:</Text>
        <View style={styles.limitGrid}>
          {Object.entries(categoryLimits).map(([key, { label, limit }]) => {
            const selectedCount = customPkg.selectedItems.filter(
              (i) => (i.category || "uncategorized") === key
            ).length;
            return (
              <View key={key} style={styles.limitChip}>
                <Text style={styles.limitText}>
                  {label}: {selectedCount}/{limit}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 16, gap: 16 }}>
        {loading ? (
          <Text>Loading menu…</Text>
        ) : (
          Object.entries(categoryLimits).map(([catKey, { label, limit }]) => {
            const itemsInCat = menuItems.filter(
              (item) => (item.category || "uncategorized") === catKey
            );
            const selectedCount = customPkg.selectedItems.filter(
              (i) => (i.category || "uncategorized") === catKey
            ).length;
            return (
              <View key={catKey} style={{ gap: 6 }}>
                <Text style={styles.sectionTitle}>
                  {label} ({selectedCount}/{limit})
                </Text>
                <View style={styles.itemGrid}>
                  {itemsInCat.map((item) => {
                    const isSelected = customPkg.selectedItems.find((i) => i.id === item.id);
                    const isFull = selectedCount >= limit && !isSelected;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => onAddItem(item)}
                        disabled={isFull}
                        style={[
                          styles.itemCard,
                          isSelected
                            ? styles.itemCardSelected
                            : isFull
                            ? styles.itemCardDisabled
                            : styles.itemCardDefault,
                        ]}
                      >
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Text style={styles.itemDesc}>{item.desc}</Text>
                        {isSelected ? (
                          <Text style={styles.itemSelectedText}>✓ Selected</Text>
                        ) : isFull ? (
                          <Text style={styles.itemFullText}>Category full</Text>
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Pressable style={styles.darkBtn} onPress={onClose}>
        <Text style={styles.darkBtnText}>Done</Text>
      </Pressable>
    </View>
  );
}

function ConfirmSheet({
  customPkg,
  onClose,
  onConfirm,
}: {
  customPkg: { guestCount: string; selectedItems: MenuItem[] };
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <View style={styles.sheet}>
      <Text style={styles.sheetTitle}>Confirm Your Selection</Text>
      <View style={{ gap: 10, marginTop: 8 }}>
        <View style={{ borderBottomWidth: 1, borderColor: "#e5e7eb", paddingBottom: 8 }}>
          <Text style={styles.mutedSmall}>Guests</Text>
          <Text style={styles.cardTitle}>{customPkg.guestCount || "—"}</Text>
        </View>
        <View>
          <Text style={styles.mutedSmall}>
            Selected Items ({customPkg.selectedItems.length})
          </Text>
          {customPkg.selectedItems.map((i) => (
            <Text key={i.id} style={styles.listItem}>
              • {i.name}
            </Text>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
        <Pressable style={[styles.darkBtn, { backgroundColor: "#e5e7eb" }]} onPress={onClose}>
          <Text style={[styles.darkBtnText, { color: "#111827" }]}>Edit</Text>
        </Pressable>
        <Pressable style={styles.greenBtnFull} onPress={onConfirm}>
          <Text style={styles.darkBtnText}>Confirm & Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

function QuoteForm({
  form,
  setForm,
  status,
  errorText,
  packages,
  onSubmit,
  layout,
}: {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  status: "idle" | "submitting" | "success" | "error";
  errorText: string;
  packages: Package[];
  onSubmit: () => void;
  layout: Layout;
}) {
  const setField = (key: string, value: string) =>
    setForm((prev: any) => ({ ...prev, [key]: value }));

  return (
    <View style={[styles.formWrap, { maxWidth: layout.maxContent }]} id="quote-form">
      <Text style={styles.formTitle}>Request a Quote</Text>
      <Text style={styles.formSub}>
        Complete the form below with your contact details. We'll email you a custom quote.
      </Text>

      <View style={{ gap: 10 }}>
        <Input label="Name *" value={form.name} onChangeText={(t) => setField("name", t)} />
        <Input
          label="Email *"
          value={form.email}
          keyboardType="email-address"
          onChangeText={(t) => setField("email", t)}
        />
        <Input
          label="Phone"
          value={form.phone}
          keyboardType="phone-pad"
          onChangeText={(t) => setField("phone", t)}
        />
        <Input
          label="Event Date"
          value={form.eventDate}
          placeholder="YYYY-MM-DD"
          onChangeText={(t) => setField("eventDate", t)}
        />
        <Input
          label="Headcount"
          value={form.headcount}
          keyboardType="numeric"
          onChangeText={(t) => setField("headcount", t)}
        />
        <Input
          label="Package"
          value={packages.find((p) => p.id === form.packageId)?.name || form.packageId}
          editable={false}
        />
        <Input
          label="Notes"
          value={form.message}
          multiline
          numberOfLines={4}
          onChangeText={(t) => setField("message", t)}
          placeholder="Tell us about your event, cuisine preferences, dietary needs, venue, etc."
        />

        <Pressable
          style={[styles.secondaryBtn, status === "submitting" && styles.disabled]}
          disabled={status === "submitting"}
          onPress={onSubmit}
        >
          <Text style={styles.secondaryBtnText}>
            {status === "submitting" ? "Sending..." : "Request Quote"}
          </Text>
        </Pressable>

        {status === "success" ? (
          <Text style={{ color: "#16a34a", fontSize: 12 }}>Inquiry sent! We will contact you soon.</Text>
        ) : null}
        {status === "error" ? (
          <Text style={{ color: "#b91c1c", fontSize: 12 }}>{errorText}</Text>
        ) : null}
        <Text style={{ color: "#9ca3af", fontSize: 11 }}>
          API base: {apiBaseUrl.replace(/https?:\/\//, "")}
        </Text>
      </View>
    </View>
  );
}

function Input({
  label,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText?: (t: string) => void;
  keyboardType?: any;
  placeholder?: string;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...rest} />
    </View>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <View style={styles.overlay}>
      <Pressable style={styles.overlayBg} onPress={onClose} />
      <View style={styles.overlayContent}>{children}</View>
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
      <Text style={styles.footerNote}>© 2026 Kabab Hut Catering. All rights reserved.</Text>
    </LinearGradient>
  );
}

function Hero({ layout }: { layout: Layout }) {
  return (
    <LinearGradient
      colors={["#0d1222", "#7a0e0e", "#9b1111"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.hero}
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
        <Text style={styles.heroTitle}>Catering Packages</Text>
        <Text style={styles.heroSub}>
          Pick a preset or customize everything—from appetizers to premium desserts.
        </Text>
      </View>
    </LinearGradient>
  );
}

function buildLayout(width: number) {
  const maxContent = Math.min(1180, width - 24);
  const cols = width >= 1024 ? 3 : width >= 720 ? 2 : 1;
  const cardWidth = (maxContent - (cols - 1) * 14) / cols;
  return { maxContent, cardWidth };
}

function handleRemoveItemOuter(
  setCustomPkg: React.Dispatch<
    React.SetStateAction<{ guestCount: string; selectedItems: MenuItem[] }>
  >,
  id: string
) {
  setCustomPkg((prev) => ({
    ...prev,
    selectedItems: prev.selectedItems.filter((i) => i.id !== id),
  }));
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8fafc" },
  hero: { width: "100%", paddingVertical: 32, paddingHorizontal: 20 },
  heroInner: { width: "100%", alignSelf: "center", alignItems: "center", gap: 6 },
  heroTitle: { color: "white", fontSize: 22, fontWeight: "800" },
  heroSub: { color: "rgba(255,255,255,0.88)", fontSize: 13, textAlign: "center" },
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

  container: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 12,
  },
  heading: { fontSize: 22, fontWeight: "800", color: "#111827", textAlign: "center" },
  subheading: { textAlign: "center", color: "#4b5563", fontSize: 13, marginBottom: 6 },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 14,
    rowGap: 14,
  },

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
  },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "#111827" },
  cardSubtitle: { fontSize: 12, color: "#6b7280" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "700",
  },
  label: { fontWeight: "700", color: "#111827", fontSize: 13, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    backgroundColor: "#fff",
  },
  mutedSmall: { color: "#6b7280", fontSize: 12, fontStyle: "italic" },
  selectedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedText: { color: "#111827", fontSize: 13, fontWeight: "600" },
  remove: { color: "#b91c1c", fontWeight: "800", fontSize: 16 },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: { color: "white", fontWeight: "700", fontSize: 13 },
  blueBtn: { backgroundColor: "#2563eb" },
  greenBtn: { backgroundColor: "#16a34a" },
  disabled: { opacity: 0.5 },

  listItem: { color: "#374151", fontSize: 12, lineHeight: 17 },
  noteBox: {
    color: "#4b5563",
    fontSize: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
  },

  sheet: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    maxHeight: "80%",
    width: "90%",
    maxWidth: 900,
  },
  sheetHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sheetTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },
  limitBox: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    gap: 6,
  },
  limitTitle: { fontSize: 13, fontWeight: "700", color: "#1d4ed8" },
  limitGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  limitChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  limitText: { fontSize: 12, color: "#1d4ed8" },
  itemGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  itemCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    width: "48%",
  },
  itemCardDefault: { borderColor: "#e5e7eb", backgroundColor: "#fff" },
  itemCardSelected: { borderColor: "#16a34a", backgroundColor: "#ecfdf3" },
  itemCardDisabled: { borderColor: "#e5e7eb", backgroundColor: "#f9fafb", opacity: 0.5 },
  itemTitle: { fontWeight: "700", color: "#111827", fontSize: 13 },
  itemDesc: { fontSize: 12, color: "#4b5563", marginTop: 2 },
  itemSelectedText: { fontSize: 12, color: "#15803d", marginTop: 4, fontWeight: "700" },
  itemFullText: { fontSize: 12, color: "#6b7280", marginTop: 4, fontWeight: "700" },
  darkBtn: {
    width: "100%",
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  darkBtnText: { color: "white", fontWeight: "700" },
  greenBtnFull: {
    flex: 1,
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  formWrap: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#fff",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  formTitle: { fontSize: 18, fontWeight: "800", color: "#111827", textAlign: "center" },
  formSub: { textAlign: "center", color: "#4b5563", fontSize: 12, marginVertical: 8 },
  secondaryBtn: {
    backgroundColor: "#b91c1c",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  secondaryBtnText: { color: "#fff", fontWeight: "800" },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayBg: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  overlayContent: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
  },

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
