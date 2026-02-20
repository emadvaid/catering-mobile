import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Future auth login screen.
export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login screen placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18 },
});
