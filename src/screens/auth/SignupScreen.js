import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Future auth signup screen.
export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Signup screen placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18 },
});
