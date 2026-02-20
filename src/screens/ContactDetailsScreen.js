import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Step 5 placeholder with simple next action.
export default function ContactDetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Details</Text>
      <Text style={styles.text}>Name, phone, email, event date, and address form goes here.</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Confirmation')}>
        <Text style={styles.buttonText}>Submit & Go to Confirmation</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 10, color: '#2C1A13' },
  text: { fontSize: 16, color: '#5B433A', marginBottom: 20 },
  button: { backgroundColor: '#C35224', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
