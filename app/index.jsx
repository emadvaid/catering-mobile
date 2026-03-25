import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/navigation/BottomNav';
import { useCart } from '../context/CartContext';
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  resolveMenuImage,
  resolveMenuImageKey,
} from '../data/menuItems';
import { PACKAGE_CARDS } from '../data/packages';
import { fetchMenuItems, fetchPackages } from '../lib/firebase/contentService';
import { colors, radii, spacing } from '../lib/theme';

const ONBOARDING_KEY = 'hasSeenOnboarding';

const HOW_IT_WORKS = [
  {
    id: 'step-1',
    title: 'Browse Menus',
    subtitle: 'Explore dishes and packages.',
  },
  {
    id: 'step-2',
    title: 'Customize Order',
    subtitle: 'Pick menu items and guest count.',
  },
  {
    id: 'step-3',
    title: 'Confirm Details',
    subtitle: 'Review your event details.',
  },
  {
    id: 'step-4',
    title: 'Enjoy!',
    subtitle: 'We handle delivery and service.',
  },
];

function toCartItem(item) {
  return {
    id: item.id,
    name: item.name,
    price: Number.isFinite(item.price) ? item.price : 0,
    priceLabel: item.priceLabel || 'Contact for pricing',
    type: item.type || 'menu',
  };
}

function mergeMenuWithFallback(remoteItems, fallback) {
  const normalizedRemote = remoteItems.map((item, index) => {
    const itemName = item.name || item.title || `Menu Item ${index + 1}`;
    const mappedImageKey = resolveMenuImageKey({
      imageKey: item.imageKey || null,
      name: itemName,
      legacyImagePath: item.image || item.imagePath || '',
    });

    const fallbackImage =
      typeof fallback[index]?.image === 'number'
        ? fallback[index].image
        : typeof fallback[0]?.image === 'number'
          ? fallback[0].image
          : MENU_ITEMS[0]?.image;

    return {
      id: item.id || `menu-${index}`,
      name: itemName,
      imageKey: mappedImageKey,
      category: item.category || 'All',
      description: item.description || 'Contact us for more details.',
      priceLabel: item.priceLabel || 'Contact for pricing',
      price: Number.isFinite(item.price) ? item.price : 0,
      image: resolveMenuImage(
        mappedImageKey,
        itemName,
        fallbackImage
      ),
    };
  });

  const existingKeys = new Set(
    normalizedRemote.map((item) => (item.imageKey || item.name || '').toLowerCase())
  );

  const missingFallback = fallback.filter((item) => {
    const key = (item.imageKey || item.name || '').toLowerCase();
    return !existingKeys.has(key);
  });

  return [...normalizedRemote, ...missingFallback];
}

function getMenuImageSource(item) {
  if (typeof item.image === 'number') {
    return item.image;
  }

  return resolveMenuImage(item.imageKey || null, item.name || '', MENU_ITEMS[0]?.image);
}

function mergePackagesWithFallback(remotePackages, fallback) {
  const normalizedRemote = remotePackages.map((pkg, index) => ({
    id: pkg.id || `pkg-${index}`,
    order: pkg.order || index + 1,
    name: (pkg.name || `Package ${index + 1}`).trim(),
    badge: pkg.badge || 'Large events',
    guests: pkg.guests || '200+ ppl',
    appetizers: Array.isArray(pkg.appetizers) ? pkg.appetizers : [],
    mains: Array.isArray(pkg.mains) ? pkg.mains : [],
    regularDessert: Array.isArray(pkg.regularDessert) ? pkg.regularDessert : [],
    premiumDessert: Array.isArray(pkg.premiumDessert) ? pkg.premiumDessert : [],
  }));

  const dedupedRemote = [];
  const seenNames = new Set();
  normalizedRemote.forEach((pkg) => {
    const key = pkg.name.toLowerCase();
    if (seenNames.has(key)) {
      return;
    }
    seenNames.add(key);
    dedupedRemote.push(pkg);
  });

  const existingNames = new Set(dedupedRemote.map((pkg) => (pkg.name || '').toLowerCase()));
  const missingFallback = fallback.filter(
    (pkg) => !existingNames.has((pkg.name || '').toLowerCase())
  );

  return [...dedupedRemote, ...missingFallback];
}

export default function HomeScreen() {
  const { addItem, itemCount } = useCart();

  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [packageCards, setPackageCards] = useState(PACKAGE_CARDS);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        const [remoteMenu, remotePackages] = await Promise.all([
          fetchMenuItems(),
          fetchPackages(),
        ]);

        if (!isMounted) {
          return;
        }

        if (Array.isArray(remoteMenu) && remoteMenu.length > 0) {
          setMenuItems((prev) => mergeMenuWithFallback(remoteMenu, prev));
        }

        if (Array.isArray(remotePackages) && remotePackages.length > 0) {
          setPackageCards((prev) => mergePackagesWithFallback(remotePackages, prev));
        }
      } catch (error) {
        // local fallback remains in place
      } finally {
        if (isMounted) {
          setLoadingContent(false);
        }
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredItems = useMemo(() => menuItems.slice(0, 8), [menuItems]);

  async function resetOnboarding() {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.brand}>Kabab Hut Catering</Text>
          <Text style={styles.heroTitle}>South Asian Catering That Brings Big Flavor</Text>
          <Text style={styles.heroSubtitle}>
            Signature Pakistani and Indian spreads for weddings, corporate gatherings, and private
            events.
          </Text>

          <View style={styles.heroActions}>
            <Pressable
              style={({ pressed }) => [styles.heroPrimaryButton, pressed ? styles.pressed : null]}
              onPress={() => router.push('/menu')}
            >
              <Text style={styles.heroPrimaryText}>Browse Menu</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.heroGhostButton, pressed ? styles.pressed : null]}
              onPress={() => router.push('/about')}
            >
              <Text style={styles.heroGhostText}>About Us</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionSubtitle}>Simple steps to exceptional catering</Text>

          <View style={styles.stepGrid}>
            {HOW_IT_WORKS.map((step, index) => (
              <View key={step.id} style={styles.stepCard}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
              </View>
            ))}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            {MENU_CATEGORIES.filter((category) => category !== 'All').map((category) => (
              <Pressable
                key={category}
                onPress={() => router.push(`/menu?category=${encodeURIComponent(category)}`)}
                style={({ pressed }) => [styles.categoryPill, pressed ? styles.pressed : null]}
              >
                <Text style={styles.categoryPillText}>{category}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Specialties</Text>
          <Text style={styles.sectionSubtitle}>Customer favorites from our menu</Text>

          {loadingContent ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <View style={styles.specialtyGrid}>
              {featuredItems.map((item) => {
                const imageSource = getMenuImageSource(item);

                return (
                  <View key={item.id} style={styles.specialtyCard}>
                    {imageSource ? (
                      <Image source={imageSource} style={styles.specialtyImage} resizeMode="cover" />
                    ) : (
                      <View style={[styles.specialtyImage, styles.specialtyImagePlaceholder]} />
                    )}
                    <View style={styles.specialtyBody}>
                      <Text style={styles.specialtyName}>{item.name}</Text>
                      <Pressable
                        style={({ pressed }) => [styles.inlineAddButton, pressed ? styles.pressed : null]}
                        onPress={() => addItem(toCartItem(item))}
                      >
                        <Ionicons name="add-circle-outline" size={16} color="#fff" />
                        <Text style={styles.inlineAddText}>Add</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <Pressable
            style={({ pressed }) => [styles.centerButton, pressed ? styles.pressed : null]}
            onPress={() => router.push('/menu')}
          >
            <Text style={styles.centerButtonText}>View Full Menu</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catering Packages</Text>
          <Text style={styles.sectionSubtitle}>Curated options for large events</Text>

          <View style={styles.packageGrid}>
            {packageCards.slice(0, 3).map((pkg, index) => (
              <View key={pkg.id} style={styles.packageCard}>
                <View style={styles.packageHeader}>
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <Text style={styles.packageGuests}>{pkg.guests}</Text>
                </View>
                <Text style={styles.packagePoint}>• {pkg.appetizers?.[0] || 'Custom appetizers'}</Text>
                <Text style={styles.packagePoint}>• {pkg.mains?.[0] || 'Custom main course'}</Text>
                <Text style={styles.packagePoint}>• {pkg.regularDessert?.[0] || 'Dessert options'}</Text>

                <Pressable
                  style={({ pressed }) => [styles.packageButton, pressed ? styles.pressed : null]}
                  onPress={() =>
                    addItem(
                      toCartItem({
                        ...pkg,
                        type: 'package',
                        priceLabel: 'Contact for pricing',
                        price: 0,
                      })
                    )
                  }
                >
                  <Text style={styles.packageButtonText}>Add to Cart</Text>
                </Pressable>
              </View>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [styles.centerButton, pressed ? styles.pressed : null]}
            onPress={() => router.push('/packages')}
          >
            <Text style={styles.centerButtonText}>View All Packages</Text>
          </Pressable>
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>Items in cart: {itemCount}</Text>
          <Pressable
            style={({ pressed }) => [styles.resetButton, pressed ? styles.pressed : null]}
            onPress={resetOnboarding}
          >
            <Text style={styles.resetButtonText}>Reset Onboarding (Test)</Text>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNav activeRoute="/" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.xl,
  },
  brand: {
    color: '#fecaca',
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    marginTop: spacing.sm,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.6,
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    color: '#fca5a5',
    fontSize: 15,
    lineHeight: 22,
  },
  heroActions: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroPrimaryButton: {
    flex: 1,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPrimaryText: {
    color: '#1f2937',
    fontWeight: '700',
  },
  heroGhostButton: {
    flex: 1,
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#fca5a5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGhostText: {
    color: '#fff',
    fontWeight: '700',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: -4,
  },
  stepGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stepCard: {
    width: '48%',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    backgroundColor: '#fff',
    gap: 8,
  },
  stepBadge: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBadgeText: {
    color: colors.primary,
    fontWeight: '800',
  },
  stepTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  stepSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  pillRow: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  categoryPill: {
    height: 36,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  categoryPillText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  specialtyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  specialtyCard: {
    width: '48%',
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },
  specialtyImage: {
    width: '100%',
    height: 100,
  },
  specialtyImagePlaceholder: {
    backgroundColor: '#e5e7eb',
  },
  specialtyBody: {
    padding: 10,
    gap: 8,
  },
  specialtyName: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
  },
  inlineAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
  },
  inlineAddText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  centerButton: {
    marginTop: 4,
    height: 46,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  packageGrid: {
    gap: spacing.sm,
  },
  packageCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: '#fff',
    padding: spacing.md,
    gap: 8,
  },
  packageHeader: {
    gap: 2,
  },
  packageName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  packageGuests: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  packagePoint: {
    color: '#374151',
    fontSize: 13,
    lineHeight: 18,
  },
  packageButton: {
    marginTop: 4,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  footerInfo: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerText: {
    color: colors.text,
    fontWeight: '700',
  },
  resetButton: {
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
