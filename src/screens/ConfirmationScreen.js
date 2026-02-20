import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Final step placeholder.
export default function ConfirmationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inquiry Submitted</Text>
      <Text style={styles.text}>Thanks. We will contact you soon from Kabab Hut.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 10, color: '#2C1A13' },
  text: { fontSize: 16, color: '#5B433A', textAlign: 'center' },
});
