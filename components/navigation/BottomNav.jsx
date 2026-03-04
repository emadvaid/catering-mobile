import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { colors, radii, spacing } from '../../lib/theme';

const NAV_ITEMS = [
  {
    label: 'Home',
    route: '/',
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
  },
  {
    label: 'Menu',
    route: '/menu',
    activeIcon: 'restaurant',
    inactiveIcon: 'restaurant-outline',
  },
  {
    label: 'Packages',
    route: '/packages',
    activeIcon: 'briefcase',
    inactiveIcon: 'briefcase-outline',
  },
  {
    label: 'About',
    route: '/about',
    activeIcon: 'information-circle',
    inactiveIcon: 'information-circle-outline',
  },
  {
    label: 'Profile',
    route: '/profile',
    activeIcon: 'person-circle',
    inactiveIcon: 'person-circle-outline',
  },
  {
    label: 'Cart',
    route: '/cart',
    activeIcon: 'cart',
    inactiveIcon: 'cart-outline',
  },
];

export default function BottomNav({ activeRoute = '/' }) {
  const { itemCount } = useCart();

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeRoute === item.route;
        const isCart = item.route === '/cart';

        return (
          <Pressable
            key={item.route}
            onPress={() => router.push(item.route)}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={({ pressed }) => [
              styles.navItem,
              isActive ? styles.navItemActive : null,
              pressed ? styles.navItemPressed : null,
            ]}
          >
            <View style={styles.iconWrap}>
              <Ionicons
                name={isActive ? item.activeIcon : item.inactiveIcon}
                size={20}
                color={isActive ? colors.primary : '#4b5563'}
              />
              {isCart && itemCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, isActive ? styles.labelActive : null]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 4,
  },
  navItem: {
    flex: 1,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    gap: 2,
  },
  navItemActive: {
    backgroundColor: '#fee2e2',
  },
  iconWrap: {
    position: 'relative',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
  },
  labelActive: {
    color: colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  navItemPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.96 }],
  },
});
