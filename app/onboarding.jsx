import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing } from '../lib/theme';

const ONBOARDING_KEY = 'hasSeenOnboarding';

const SLIDES = [
  {
    id: 'welcome',
    title: 'Welcome to Kabab Hut Catering',
    subtitle:
      'Discover trusted catering options near you and plan your event menu with confidence.',
    heading: 'DISCOVER CATERING\nNEAR YOU',
    animation: require('../assets/lottie_Json/Food Choice.json'),
  },
  {
    id: 'menu',
    title: 'Pick Your Event Menu',
    subtitle:
      'Choose a flavorful spread from curated packages or customize trays for your guest count.',
    heading: 'CHOOSE A TASTY\nMENU',
    animation: require('../assets/lottie_Json/Food Carousel.json'),
  },
  {
    id: 'book',
    title: 'Send Your Catering Request',
    subtitle:
      'Submit your request in minutes and our team will confirm details for pickup or delivery.',
    heading: 'PICKUP OR\nDELIVERY',
    animation: require('../assets/lottie_Json/Delivery guy.json'),
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
      <View style={styles.container}>
        <View style={styles.bgPatternCircleA} />
        <View style={styles.bgPatternCircleB} />

        <Animated.View
          style={[
            styles.visualCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.topRibbon}>
            <View style={styles.topRibbonInner} />
          </View>

          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <LottieView source={currentSlide.animation} autoPlay loop style={styles.lottie} />
          </Animated.View>

          <Text style={styles.heading}>{currentSlide.heading}</Text>
          <Text style={styles.description}>{currentSlide.subtitle}</Text>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={finishOnboarding}
              style={({ pressed }) => [styles.textAction, pressed ? styles.buttonPressed : null]}
            >
              <Text style={styles.textActionLabel}>Skip</Text>
            </Pressable>

            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [styles.textAction, pressed ? styles.buttonPressed : null]}
            >
              <Text style={styles.textActionLabel}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
            </Pressable>
          </View>

          <View style={styles.dotsRow}>
            {SLIDES.map((slide, index) => (
              <View key={slide.id} style={[styles.dot, index === currentIndex ? styles.dotActive : null]} />
            ))}
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdf6f8',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgPatternCircleA: {
    position: 'absolute',
    top: 40,
    right: 24,
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: '#f3d8de',
  },
  bgPatternCircleB: {
    position: 'absolute',
    bottom: 70,
    left: 18,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#f6e3e8',
  },
  visualCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: '#f2dce3',
    backgroundColor: '#fff',
    minHeight: 620,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    paddingTop: 0,
    shadowColor: '#111827',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  topRibbon: {
    height: 72,
    alignSelf: 'stretch',
    backgroundColor: '#be123c',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    overflow: 'hidden',
    marginHorizontal: -spacing.xl,
  },
  topRibbonInner: {
    position: 'absolute',
    right: -24,
    bottom: -22,
    width: 190,
    height: 90,
    borderRadius: 80,
    backgroundColor: '#fff',
  },
  lottie: {
    width: 220,
    height: 220,
    marginTop: 8,
  },
  heading: {
    marginTop: 4,
    color: colors.text,
    fontWeight: '800',
    fontSize: 36,
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  description: {
    marginTop: spacing.md,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 2,
  },
  actionsRow: {
    width: '100%',
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  textAction: {
    height: 28,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textActionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#9ca3af',
    letterSpacing: 0.2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.sm,
  },
  dot: {
    width: 18,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: '#e5e7eb',
  },
  dotActive: {
    width: 28,
    backgroundColor: '#be123c',
  },
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.95 }],
  },
});
