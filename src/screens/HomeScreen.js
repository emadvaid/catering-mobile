import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const sampleDishes = ['Chicken Biryani', 'Seekh Kabab', 'Chicken Karahi', 'Naan', 'Kheer'];

// Basic visible home UI to browse and start inquiry flow.
export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Explore Catering Dishes</Text>
        <Text style={styles.subheading}>Guest checkout is available. No login required.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Popular Picks</Text>
          {sampleDishes.map((dish) => (
            <Text key={dish} style={styles.itemText}>
              • {dish}
            </Text>
          ))}
        </View>

        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('EventType')}>
          <Text style={styles.primaryButtonText}>Start Catering Inquiry</Text>
        </Pressable>

        <View style={styles.row}>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.secondaryButtonText}>Login</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.secondaryButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C1A13',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: '#654B41',
    marginBottom: 18,
  },
  card: {
    borderWidth: 1,
    borderColor: '#EEDBCF',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFF8F1',
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#2C1A13',
  },
  itemText: {
    fontSize: 15,
    color: '#4F3A33',
    marginBottom: 6,
  },
  primaryButton: {
    backgroundColor: '#C35224',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#C35224',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#C35224',
    fontWeight: '700',
  },
});
