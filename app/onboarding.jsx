import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const ONBOARDING_KEY = 'hasSeenOnboarding';

const SLIDES = [
  {
    id: 'welcome',
    title: 'Welcome to Kabab Hut Catering',
    subtitle: 'Book catering in a few simple steps.',
  },
  {
    id: 'menu',
    title: 'Browse Menu & Packages',
    subtitle: 'Explore dishes and choose what fits your event.',
  },
  {
    id: 'book',
    title: 'Send Your Catering Request',
    subtitle: 'Share your event details and get started quickly.',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = SLIDES[currentIndex];
  const isLastSlide = currentIndex === SLIDES.length - 1;

  async function finishOnboarding() {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      // Keep moving to the app even if storage fails in development.
    }

    router.replace('/');
  }

  function handleNext() {
    if (isLastSlide) {
      finishOnboarding();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
        </View>

        <View style={styles.imageSection}>
          <View style={styles.imageCard}>
            <Image
              source={require('../assets/icons/icon-256.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.dotsRow}>
            {SLIDES.map((slide, index) => (
              <View
                key={slide.id}
                style={[
                  styles.dot,
                  index === currentIndex ? styles.dotActive : null,
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              onPress={finishOnboarding}
              style={({ pressed }) => [styles.skipButton, pressed ? styles.pressed : null]}
            >
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>

            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [styles.nextButton, pressed ? styles.pressed : null]}
            >
              <Text style={styles.nextText}>
                {isLastSlide ? 'Get Started' : 'Next'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  topSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCard: {
    width: 240,
    height: 240,
    borderRadius: 28,
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fecaca',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
  bottomSection: {
    paddingBottom: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#d1d5db',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#b30000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b30000',
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});
