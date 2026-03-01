import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

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
    label: 'Cart',
    route: '/cart',
    activeIcon: 'cart',
    inactiveIcon: 'cart-outline',
  },
  {
    label: 'Profile',
    route: '/profile',
    activeIcon: 'person',
    inactiveIcon: 'person-outline',
  },
];

export default function BottomNav({ activeRoute = '/' }) {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeRoute === item.route;

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
            <Ionicons
              name={isActive ? item.activeIcon : item.inactiveIcon}
              size={22}
              color={isActive ? '#b30000' : '#4b5563'}
            />
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
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 8,
  },
  navItem: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: '#fee2e2',
  },
  navItemPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.96 }],
  },
});
