import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/navigation/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login?redirect=/checkout');
    }
  }, [user]);

  function placeOrder() {
    clearCart();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>
          Signed in as: {user?.email || 'Unknown user'}
        </Text>
        <Text style={styles.subtitle}>Items: {items.length}</Text>

        <Pressable
          style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
          onPress={placeOrder}
        >
          <Text style={styles.buttonText}>Place Order</Text>
        </Pressable>
      </View>

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
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 15,
  },
  button: {
    marginTop: 12,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#b30000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});
