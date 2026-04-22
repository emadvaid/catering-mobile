import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
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

const REQUIRED_PROFILE_FIELDS = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'addressLine1', label: 'Address Line 1' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'zipCode', label: 'ZIP Code' },
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

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
  const [eventState, setEventState] = useState('GA');
  const [showStatePicker, setShowStatePicker] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login?redirect=/checkout');
    }
  }, [user]);

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        const quantity = Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1;
        return sum + resolvePriceValue(item) * quantity;
      }, 0),
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

    try {
      const profile = await getUserProfile(user.uid);
      const missingFields = REQUIRED_PROFILE_FIELDS
        .filter(({ key }) => !(profile?.[key] || '').toString().trim())
        .map(({ label }) => label);

      if (missingFields.length > 0) {
        Alert.alert(
          'Complete Profile First',
          `Please update these fields before placing an order:\n\n${missingFields.join(', ')}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Profile', onPress: () => router.push('/profile') },
          ]
        );
        return;
      }

      const hasPackage = items.some((item) => item.type === 'package');
      const totalCustomUnits = items
        .filter((item) => item.type !== 'package')
        .reduce((sum, item) => {
          const quantity = Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1;
          return sum + quantity;
        }, 0);

      if (!hasPackage && totalCustomUnits < 4) {
        Alert.alert(
          'Minimum Custom Order',
          'For custom menu catering, please select at least 4 tray items or choose a package.'
        );
        return;
      }

      if (eventState !== 'GA') {
        Alert.alert(
          'Service Area Notice',
          'Our operations are not currently available in other states at the moment. Please select GA to place your order.'
        );
        return;
      }

      setPlacingOrder(true);

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
          state: eventState || profile?.state || '',
          zipCode: profile?.zipCode || '',
        },
      });

      clearCart();
      Alert.alert(
        'Order submitted',
        `Your order was placed successfully. Order ID: ${orderId}\n\nYou will be contacted by the Kabab Hut team shortly.`
      );
      router.replace('/');
    } catch (error) {
      Alert.alert('Order failed', error.message || 'Could not place your order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

          <Text style={styles.label}>Event State</Text>
          <Pressable
            onPress={() => setShowStatePicker(true)}
            style={({ pressed }) => [
              styles.input,
              styles.selectInput,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.selectInputText}>{eventState}</Text>
            <Text style={styles.selectInputChevron}>▼</Text>
          </Pressable>

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
            <View key={item.cartKey || `${item.id}-${index}`} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                {resolvePriceValue(item) > 0
                  ? `${Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1} × $${resolvePriceValue(item).toFixed(2)}`
                  : `${Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1} × ${item.priceLabel || 'Contact for pricing'}`}
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

      <Modal transparent visible={showStatePicker} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State</Text>
              <Pressable
                onPress={() => setShowStatePicker(false)}
                style={({ pressed }) => [styles.modalClose, pressed ? styles.pressed : null]}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.stateList} showsVerticalScrollIndicator={false}>
              {US_STATES.map((stateCode) => (
                <Pressable
                  key={stateCode}
                  onPress={() => {
                    setEventState(stateCode);
                    setShowStatePicker(false);
                  }}
                  style={({ pressed }) => [
                    styles.stateOption,
                    stateCode === eventState ? styles.stateOptionActive : null,
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.stateOptionText,
                      stateCode === eventState ? styles.stateOptionTextActive : null,
                    ]}
                  >
                    {stateCode}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectInputText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  selectInputChevron: {
    color: colors.textMuted,
    fontSize: 12,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  modalClose: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
  },
  modalCloseText: {
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 12,
  },
  stateList: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  stateOption: {
    borderRadius: radii.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },
  stateOptionActive: {
    borderColor: colors.primary,
    backgroundColor: '#fef2f2',
  },
  stateOptionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  stateOptionTextActive: {
    color: colors.primary,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
