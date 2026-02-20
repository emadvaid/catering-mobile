import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { markOnboardingComplete } from '../../utils/storage';

// First-launch onboarding screen.
export default function OnboardingScreen({ navigation }) {
  const onGetStarted = async () => {
    await markOnboardingComplete();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Kabab Hut Catering</Text>
        <Text style={styles.text}>
          Browse dishes, build your order, and send a catering inquiry in a few simple steps.
        </Text>

        <Pressable style={styles.primaryButton} onPress={onGetStarted}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F1',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F2E3D7',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2C1A13',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5B433A',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#C35224',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
