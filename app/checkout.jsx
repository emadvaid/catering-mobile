import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/navigation/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/firebase/orders';
import { getUserProfile } from '../lib/firebase/userProfiles';
import { colors, radii, spacing } from '../lib/theme';

function resolvePriceValue(item) {
  const value = Number(item.price);
  return Number.isFinite(value) ? value : 0;
}

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();

  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [notes, setNotes] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login?redirect=/checkout');
    }
  }, [user]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + resolvePriceValue(item), 0),
    [items]
  );

  async function placeOrder() {
    if (!user?.uid) {
      Alert.alert('Checkout', 'Please sign in to continue.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Checkout', 'Your cart is empty. Add items before placing an order.');
      return;
    }

    setPlacingOrder(true);

    try {
      const profile = await getUserProfile(user.uid);
      const orderId = await createOrder({
        userId: user.uid,
        userEmail: user.email || '',
        items,
        total,
        eventDate: eventDate.trim(),
        guestCount: guestCount.trim(),
        notes: notes.trim(),
        userDetails: {
          fullName: profile?.fullName || user.displayName || '',
          phone: profile?.phone || '',
          addressLine1: profile?.addressLine1 || '',
          addressLine2: profile?.addressLine2 || '',
          city: profile?.city || '',
          state: profile?.state || '',
          zipCode: profile?.zipCode || '',
        },
      });

      clearCart();
      Alert.alert('Order submitted', `Your order was placed successfully. Order ID: ${orderId}`);
      router.replace('/');
    } catch (error) {
      Alert.alert('Order failed', error.message || 'Could not place your order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  }

  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }

  function handleDateChange(event, date) {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'dismissed') {
      return;
    }

    if (date) {
      setSelectedDate(date);
      setEventDate(formatDate(date));
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>Signed in as: {user?.email || 'Unknown user'}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Details</Text>

          <Text style={styles.label}>Event Date (YYYY-MM-DD)</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={({ pressed }) => [
              styles.input,
              styles.datePickerButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={eventDate ? styles.dateText : styles.datePlaceholder}>
              {eventDate || 'Select event date'}
            </Text>
          </Pressable>
          {showDatePicker ? (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          ) : null}

          <Text style={styles.label}>Guest Count</Text>
          <TextInput
            value={guestCount}
            onChangeText={setGuestCount}
            keyboardType="number-pad"
            placeholder="150"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any delivery or dietary notes"
            placeholderTextColor="#9ca3af"
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items ({items.length})</Text>
          {items.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                {resolvePriceValue(item) > 0
                  ? `$${resolvePriceValue(item).toFixed(2)}`
                  : item.priceLabel || 'Contact for pricing'}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated total</Text>
            <Text style={styles.totalValue}>{total > 0 ? `$${total.toFixed(2)}` : 'Contact for quote'}</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            items.length === 0 || placingOrder ? styles.disabled : null,
            pressed ? styles.pressed : null,
          ]}
          onPress={placeOrder}
          disabled={items.length === 0 || placingOrder}
        >
          <Text style={styles.buttonText}>{placingOrder ? 'Placing Order...' : 'Place Order'}</Text>
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
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 4,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    height: 44,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fafafa',
    paddingHorizontal: 12,
    color: colors.text,
  },
  datePickerButton: {
    justifyContent: 'center',
  },
  dateText: {
    color: colors.text,
    fontSize: 14,
  },
  datePlaceholder: {
    color: '#9ca3af',
    fontSize: 14,
  },
  textArea: {
    height: 88,
    paddingTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingRight: 8,
  },
  itemPrice: {
    color: colors.textMuted,
    fontSize: 13,
  },
  totalRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  totalValue: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
  button: {
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
