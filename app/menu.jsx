import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/navigation/BottomNav';
import { useCart } from '../context/CartContext';
import { PACKAGES } from '../data/packages';

export default function MenuScreen() {
  const { addItem } = useCart();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>Tap any package to add it to your cart.</Text>

        {PACKAGES.map((pkg) => (
          <View key={pkg.id} style={styles.card}>
            <Text style={styles.cardTitle}>{pkg.name}</Text>
            <Text style={styles.cardMeta}>
              {pkg.guests} • ${pkg.price}
            </Text>
            <Pressable
              style={({ pressed }) => [styles.addButton, pressed ? styles.pressed : null]}
              onPress={() => addItem(pkg)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <BottomNav activeRoute="/menu" />
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
    gap: 12,
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
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardMeta: {
    color: '#4b5563',
    fontSize: 14,
  },
  addButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#b30000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});
