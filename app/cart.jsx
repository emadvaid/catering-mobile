import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/navigation/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const { user } = useAuth();
  const { items, removeItem, clearCart } = useCart();
  const total = items.reduce((sum, item) => sum + item.price, 0);

  function proceedToCheckout() {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    router.push('/checkout');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cart</Text>
        <Text style={styles.subtitle}>Review items before checkout.</Text>

        {items.length === 0 ? (
          <Text style={styles.empty}>Your cart is empty.</Text>
        ) : (
          <View style={styles.list}>
            {items.map((item, index) => (
              <View key={`${item.id}-${index}`} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>
                <Pressable
                  onPress={() => removeItem(index)}
                  style={({ pressed }) => [styles.removeButton, pressed ? styles.pressed : null]}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.total}>Total: ${total}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            items.length === 0 ? styles.disabledButton : null,
            pressed ? styles.pressed : null,
          ]}
          onPress={proceedToCheckout}
          disabled={items.length === 0}
        >
          <Text style={styles.primaryButtonText}>Proceed to Checkout</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            items.length === 0 ? styles.disabledButton : null,
            pressed ? styles.pressed : null,
          ]}
          onPress={clearCart}
          disabled={items.length === 0}
        >
          <Text style={styles.secondaryButtonText}>Clear Cart</Text>
        </Pressable>
      </ScrollView>

      <BottomNav activeRoute="/cart" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'left',
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  empty: {
    color: '#6b7280',
    fontSize: 15,
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  itemRow: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },
  itemPrice: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 13,
  },
  removeButton: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#b30000',
    fontWeight: '700',
    fontSize: 12,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#b30000',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});
