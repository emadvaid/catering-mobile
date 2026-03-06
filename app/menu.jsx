import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
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
import { fetchMenuItems } from '../lib/firebase/contentService';
import { colors, radii, spacing } from '../lib/theme';

const FAVORITES_KEY = 'menuFavoriteIds';

function normalizeRemoteItems(remoteItems, fallback) {
  return remoteItems.map((item, index) => {
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
}

function getMenuImageSource(item) {
  if (typeof item.image === 'number') {
    return item.image;
  }

  return resolveMenuImage(item.imageKey || null, item.name || '', MENU_ITEMS[0]?.image);
}

function mergeMenuWithFallback(remoteItems, fallback) {
  const normalizedRemote = normalizeRemoteItems(remoteItems, fallback);
  const existingKeys = new Set(
    normalizedRemote.map((item) => (item.imageKey || item.name || '').toLowerCase())
  );

  const missingFallback = fallback.filter((item) => {
    const key = (item.imageKey || item.name || '').toLowerCase();
    return !existingKeys.has(key);
  });

  return [...normalizedRemote, ...missingFallback];
}

export default function MenuScreen() {
  const { category } = useLocalSearchParams();
  const { addItem } = useCart();

  const [activeCategory, setActiveCategory] = useState(
    typeof category === 'string' && MENU_CATEGORIES.includes(category) ? category : 'All'
  );
  const [items, setItems] = useState(MENU_ITEMS);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    if (typeof category === 'string' && MENU_CATEGORIES.includes(category)) {
      setActiveCategory(category);
    }
  }, [category]);

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      try {
        const raw = await AsyncStorage.getItem(FAVORITES_KEY);
        const ids = raw ? JSON.parse(raw) : [];
        if (!isMounted || !Array.isArray(ids)) {
          return;
        }

        const mapped = ids.reduce((acc, id) => {
          acc[id] = true;
          return acc;
        }, {});

        setFavorites(mapped);
      } catch (error) {
        // ignore persistence errors in dev
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    async function persistFavorites() {
      try {
        const ids = Object.keys(favorites).filter((id) => favorites[id]);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
      } catch (error) {
        // ignore persistence errors in dev
      }
    }

    persistFavorites();
  }, [favorites]);

  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      try {
        const remoteMenu = await fetchMenuItems();

        if (!isMounted) {
          return;
        }

        if (Array.isArray(remoteMenu) && remoteMenu.length > 0) {
          setItems(mergeMenuWithFallback(remoteMenu, MENU_ITEMS));
        }
      } catch (error) {
        // local fallback stays active
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') {
      return items;
    }

    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  function toggleFavorite(itemId) {
    setFavorites((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Our Menu</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {MENU_CATEGORIES.map((label) => {
            const isActive = activeCategory === label;

            return (
              <Pressable
                key={label}
                style={({ pressed }) => [
                  styles.filterChip,
                  isActive ? styles.filterChipActive : null,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() => setActiveCategory(label)}
              >
                <Text style={[styles.filterText, isActive ? styles.filterTextActive : null]}>{label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loaderText}>Loading menu...</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredItems.map((item) => {
              const imageSource = getMenuImageSource(item);

              return (
                <View key={item.id} style={styles.card}>
                  <View>
                    {imageSource ? (
                      <Image source={imageSource} style={styles.image} resizeMode="cover" />
                    ) : (
                      <View style={[styles.image, styles.imagePlaceholder]} />
                    )}
                  <Pressable
                    style={({ pressed }) => [styles.favoriteBtn, pressed ? styles.pressed : null]}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <Ionicons
                      name={favorites[item.id] ? 'heart' : 'heart-outline'}
                      size={18}
                      color={favorites[item.id] ? '#ef4444' : '#6b7280'}
                    />
                  </Pressable>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardDesc}>{item.description}</Text>
                    <Text style={styles.cardPrice}>{item.priceLabel || 'Contact for pricing'}</Text>

                    <Pressable
                      style={({ pressed }) => [styles.addBtn, pressed ? styles.pressed : null]}
                      onPress={() =>
                        addItem({
                          id: item.id,
                          name: item.name,
                          price: Number.isFinite(item.price) ? item.price : 0,
                          priceLabel: item.priceLabel || 'Contact for pricing',
                          type: 'menu',
                        })
                      }
                    >
                      <Text style={styles.addBtnText}>Add to Cart</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <BottomNav activeRoute="/menu" />
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
  filterRow: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  filterChip: {
    height: 36,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  filterTextActive: {
    color: '#fff',
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
  grid: {
    gap: spacing.md,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  imagePlaceholder: {
    backgroundColor: '#e5e7eb',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardBody: {
    padding: spacing.md,
    gap: 8,
  },
  cardTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 19,
  },
  cardDesc: {
    color: '#374151',
    fontSize: 13,
    lineHeight: 18,
  },
  cardPrice: {
    color: colors.textMuted,
    fontStyle: 'italic',
    fontSize: 15,
  },
  addBtn: {
    marginTop: 4,
    height: 42,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
