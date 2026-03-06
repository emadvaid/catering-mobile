import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing } from '../lib/theme';

const ONBOARDING_KEY = 'hasSeenOnboarding';

const SLIDES = [
  {
    id: 'welcome',
    title: 'Welcome to Kabab Hut Catering',
    subtitle: 'Authentic South Asian catering for events that deserve bold flavor.',
    icon: 'restaurant-outline',
    iconBg: '#fee2e2',
  },
  {
    id: 'menu',
    title: 'Browse Menu and Packages',
    subtitle: 'Explore appetizers, grills, curries, desserts, and event packages.',
    icon: 'book-outline',
    iconBg: '#ffedd5',
  },
  {
    id: 'book',
    title: 'Checkout in Minutes',
    subtitle: 'Add items, confirm details, and start your catering request quickly.',
    icon: 'checkmark-done-circle-outline',
    iconBg: '#dcfce7',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const currentSlide = SLIDES[currentIndex];
  const isLastSlide = currentIndex === SLIDES.length - 1;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 8,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [currentIndex, fadeAnim, slideAnim]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  async function finishOnboarding() {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      // Keep moving even if storage fails in development.
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
      <View style={styles.hero}>
        <Text style={styles.stepText}>Step {currentIndex + 1} of {SLIDES.length}</Text>
        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
      </View>

      <View style={styles.container}>
        <Animated.View
          style={[
            styles.visualCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.iconCircle,
              { backgroundColor: currentSlide.iconBg, transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Ionicons name={currentSlide.icon} size={72} color={colors.primaryDark} />
          </Animated.View>
          <Text style={styles.visualHeading}>Plan. Customize. Celebrate.</Text>
          <Text style={styles.visualSubheading}>
            Built for catering orders with clear menus, curated packages, and fast checkout.
          </Text>
        </Animated.View>

        <View style={styles.bottomSection}>
          <View style={styles.dotsRow}>
            {SLIDES.map((slide, index) => (
              <View key={slide.id} style={[styles.dot, index === currentIndex ? styles.dotActive : null]} />
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
              <Text style={styles.nextText}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
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
    backgroundColor: colors.bg,
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: colors.primaryDark,
  },
  stepText: {
    color: '#fecaca',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    marginTop: spacing.sm,
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 15,
    color: '#fee2e2',
    lineHeight: 22,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    justifyContent: 'space-between',
  },
  visualCard: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff',
    minHeight: 340,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconCircle: {
    width: 170,
    height: 170,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualHeading: {
    marginTop: spacing.lg,
    color: colors.text,
    fontWeight: '800',
    fontSize: 23,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  visualSubheading: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSection: {
    gap: spacing.md,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: '#d1d5db',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  skipButton: {
    flex: 1,
    height: 50,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  skipText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  nextButton: {
    flex: 1,
    height: 50,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  nextText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
