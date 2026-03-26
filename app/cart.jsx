import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/navigation/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { colors, radii, spacing } from '../lib/theme';

function resolvePriceValue(item) {
  const value = Number(item.price);
  return Number.isFinite(value) ? value : 0;
}

export default function CartScreen() {
  const { user } = useAuth();
  const { items, removeItem, clearCart, increaseItem, decreaseItem } = useCart();

  const total = items.reduce((sum, item) => {
    const quantity = Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1;
    return sum + resolvePriceValue(item) * quantity;
  }, 0);

  function proceedToCheckout() {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    router.push('/checkout');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Cart</Text>
        <Text style={styles.subtitle}>Review selected menu items and packages before checkout.</Text>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.empty}>Your cart is empty.</Text>
            <Pressable
              style={({ pressed }) => [styles.emptyButton, pressed ? styles.pressed : null]}
              onPress={() => router.push('/menu')}
            >
              <Text style={styles.emptyButtonText}>Browse Menu</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {items.map((item, index) => {
              const priceValue = resolvePriceValue(item);
              const quantity = Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1;

              return (
                <View key={item.cartKey || `${item.id}-${index}`} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>Qty: {quantity}</Text>
                    <Text style={styles.itemPrice}>
                      {priceValue > 0
                        ? `$${priceValue.toFixed(2)} each${quantity > 1 ? ` • $${(priceValue * quantity).toFixed(2)} total` : ''}`
                        : item.priceLabel || 'Contact for pricing'}
                    </Text>
                  </View>
                  <View style={styles.controlsCol}>
                    <View style={styles.qtyRow}>
                      <Pressable
                        onPress={() => decreaseItem(item.cartKey || item.id)}
                        style={({ pressed }) => [
                          styles.qtyButton,
                          styles.qtyButtonMinus,
                          pressed ? styles.pressed : null,
                        ]}
                      >
                        <Text style={[styles.qtyButtonText, styles.qtyButtonTextDark]}>-</Text>
                      </Pressable>
                      <Text style={styles.qtyValue}>{quantity}</Text>
                      <Pressable
                        onPress={() => increaseItem(item.cartKey || item.id)}
                        style={({ pressed }) => [
                          styles.qtyButton,
                          styles.qtyButtonPlus,
                          pressed ? styles.pressed : null,
                        ]}
                      >
                        <Text style={styles.qtyButtonText}>+</Text>
                      </Pressable>
                    </View>

                    <Pressable
                      onPress={() => removeItem(item.cartKey || item.id)}
                      style={({ pressed }) => [styles.removeButton, pressed ? styles.pressed : null]}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Estimated total:</Text>
          <Text style={styles.totalValue}>{total > 0 ? `$${total.toFixed(2)}` : 'Contact for quote'}</Text>
        </View>

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
    backgroundColor: colors.bg,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
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
  emptyCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: '#fff',
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 15,
  },
  emptyButton: {
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  list: {
    gap: spacing.sm,
  },
  itemRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 10,
    gap: 3,
  },
  itemName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  itemPrice: {
    color: colors.textMuted,
    fontSize: 13,
  },
  itemMeta: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
  },
  controlsCol: {
    gap: 8,
    alignItems: 'flex-end',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonMinus: {
    backgroundColor: '#fde68a',
  },
  qtyButtonPlus: {
    backgroundColor: colors.primary,
  },
  qtyButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 18,
  },
  qtyButtonTextDark: {
    color: '#7c2d12',
  },
  qtyValue: {
    minWidth: 20,
    textAlign: 'center',
    color: colors.text,
    fontWeight: '700',
  },
  removeButton: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.sm,
  },
  removeButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  totalRow: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: '#fff',
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  totalValue: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
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
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
