import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hasCompletedOnboarding } from '../utils/storage';

// Simple app splash that routes user on startup.
export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    let isMounted = true;

    async function bootstrapApp() {
      const completed = await hasCompletedOnboarding();

      setTimeout(() => {
        if (!isMounted) return;
        onFinish(completed ? 'Home' : 'Onboarding');
      }, 1000);
    }

    bootstrapApp();

    return () => {
      isMounted = false;
    };
  }, [onFinish]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.brand}>Kabab Hut</Text>
      <Text style={styles.sub}>Catering App</Text>
      <ActivityIndicator size="large" color="#C35224" style={styles.loader} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  brand: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2C1A13',
  },
  sub: {
    marginTop: 6,
    fontSize: 18,
    color: '#6C4C40',
  },
  loader: {
    marginTop: 22,
  },
});
