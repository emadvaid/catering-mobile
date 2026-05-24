import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/navigation/BottomNav';
import { useCart } from '../context/CartContext';
import { CUSTOMIZABLE_PACKAGE, PACKAGE_CARDS } from '../data/packages';
import {
  formatList,
  getPackageImageSource,
  normalizePackages,
  pickHighlightDish,
} from '../lib/contentModels';
import { fetchPackages } from '../lib/firebase/contentService';
import { colors, radii, spacing } from '../lib/theme';

const SHOW_CUSTOM_PACKAGE = false;
const PACKAGE_HEADER_IMAGES = {
  'pkg-a': require('../assets/cards-header/card-1.jpg'),
  'pkg-b': require('../assets/cards-header/card-2.jpg'),
  'pkg-c': require('../assets/cards-header/card-3.jpg'),
  'pkg-d': require('../assets/cards-header/card-4.jpg'),
};

export default function PackagesScreen() {
  const { addItem } = useCart();

  const [guestCount, setGuestCount] = useState('');
  const [cards, setCards] = useState(() => normalizePackages(PACKAGE_CARDS));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPackages() {
      try {
        const remotePackages = await fetchPackages();

        if (!isMounted) {
          return;
        }

        if (Array.isArray(remotePackages) && remotePackages.length > 0) {
          setCards(normalizePackages(remotePackages));
        }
      } catch (error) {
        // local fallback stays active
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPackages();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedCards = useMemo(
    () => [...cards].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [cards]
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Catering Packages</Text>
        <Text style={styles.subtitle}>
          Curated spreads for large events.
        </Text>

        {SHOW_CUSTOM_PACKAGE ? (
          <View style={styles.customCard}>
            <View style={styles.customHeader}>
              <Text style={styles.customTitle}>{CUSTOMIZABLE_PACKAGE.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{CUSTOMIZABLE_PACKAGE.badge}</Text>
              </View>
            </View>

            <Text style={styles.customSubtitle}>{CUSTOMIZABLE_PACKAGE.subtitle}</Text>

            <Text style={styles.inputLabel}>Number of Guests</Text>
            <TextInput
              placeholder="e.g. 150"
              keyboardType="number-pad"
              value={guestCount}
              onChangeText={setGuestCount}
              style={styles.input}
              placeholderTextColor="#9ca3af"
            />

            <View style={styles.actionRow}>
              <Pressable
                onPress={() => router.push('/menu')}
                style={({ pressed }) => [styles.secondaryBtn, pressed ? styles.pressed : null]}
              >
                <Text style={styles.secondaryBtnText}>Add Items from Menu</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  addItem({
                    id: CUSTOMIZABLE_PACKAGE.id,
                    name:
                      guestCount.trim().length > 0
                        ? `${CUSTOMIZABLE_PACKAGE.name} (${guestCount} guests)`
                        : CUSTOMIZABLE_PACKAGE.name,
                    price: 0,
                    priceLabel: 'Custom quote',
                    type: 'package',
                  })
                }
                style={({ pressed }) => [styles.primaryBtn, pressed ? styles.pressed : null]}
              >
                <Text style={styles.primaryBtnText}>Add Custom Package</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loaderText}>Loading package list...</Text>
          </View>
        ) : (
          sortedCards.map((pkg) => (
            <View key={pkg.id} style={styles.packageCard}>
              <View style={styles.heroWrap}>
                <Image source={getPackageImageSource(pkg, PACKAGE_HEADER_IMAGES)} style={styles.heroImage} resizeMode="cover" />
                <View style={styles.heroOverlay} />
                <View style={styles.heroContent}>
                  <Text style={styles.heroKicker}>Curated Spread</Text>
                  <Text style={styles.heroDish}>{pickHighlightDish(pkg)}</Text>
                </View>
              </View>

              <View style={styles.packageHeader}>
                <View>
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <Text style={styles.packageGuests}>{pkg.guests}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pkg.badge}</Text>
                </View>
              </View>

              <View style={styles.columns}>
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Appetizers</Text>
                  {formatList(pkg.appetizers).map((item) => (
                    <Text key={`${pkg.id}-a-${item}`} style={styles.listPoint}>
                      • {item}
                    </Text>
                  ))}
                </View>

                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Main Course</Text>
                  {formatList(pkg.mains).map((item) => (
                    <Text key={`${pkg.id}-m-${item}`} style={styles.listPoint}>
                      • {item}
                    </Text>
                  ))}
                </View>
              </View>

              <View style={styles.columns}>
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Regular Dessert</Text>
                  {formatList(pkg.regularDessert).map((item) => (
                    <Text key={`${pkg.id}-r-${item}`} style={styles.listPoint}>
                      • {item}
                    </Text>
                  ))}
                </View>

                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Premium Dessert</Text>
                  {formatList(pkg.premiumDessert).map((item) => (
                    <Text key={`${pkg.id}-p-${item}`} style={styles.listPoint}>
                      • {item}
                    </Text>
                  ))}
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [styles.addBtn, pressed ? styles.pressed : null]}
                onPress={() =>
                  addItem({
                    id: pkg.id,
                    name: pkg.name,
                    price: 0,
                    priceLabel: 'Contact for pricing',
                    type: 'package',
                  })
                }
              >
                <Text style={styles.addBtnText}>Add Package to Cart</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNav activeRoute="/packages" />
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
    gap: spacing.md,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  customCard: {
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  customSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
  },
  badge: {
    backgroundColor: '#fee2e2',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  inputLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    height: 46,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    color: colors.text,
    backgroundColor: '#fafafa',
  },
  actionRow: {
    gap: spacing.sm,
  },
  secondaryBtn: {
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  primaryBtn: {
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  loaderWrap: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  loaderText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    overflow: 'hidden',
    gap: spacing.sm,
  },
  heroWrap: {
    marginHorizontal: -spacing.lg,
    marginTop: -spacing.lg,
    marginBottom: spacing.sm,
    height: 130,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,24,39,0.35)',
  },
  heroContent: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    gap: 2,
  },
  heroKicker: {
    color: '#fecaca',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroDish: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  packageName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  packageGuests: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  columns: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  column: {
    flex: 1,
    gap: 2,
  },
  columnTitle: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 4,
  },
  listPoint: {
    color: '#4b5563',
    fontSize: 13,
    lineHeight: 19,
  },
  addBtn: {
    marginTop: 6,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
