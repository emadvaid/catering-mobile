import { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

const ONBOARDING_KEY = 'hasSeenOnboarding';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [showSplash, setShowSplash] = useState(true);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadOnboardingFlag() {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (isMounted) {
          setHasSeenOnboarding(value === 'true');
        }
      } catch (error) {
        if (isMounted) {
          setHasSeenOnboarding(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingOnboarding(false);
        }
      }
    }

    loadOnboardingFlag();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (showSplash || isCheckingOnboarding) {
      return;
    }

    let isMounted = true;

    async function syncAndRoute() {
      let seenFlag = hasSeenOnboarding;

      // Re-read storage on route changes so finishing onboarding immediately
      // updates routing without needing an app restart.
      if (!hasSeenOnboarding) {
        try {
          const value = await AsyncStorage.getItem(ONBOARDING_KEY);
          seenFlag = value === 'true';
        } catch (error) {
          seenFlag = false;
        }
      }

      if (!isMounted) {
        return;
      }

      if (seenFlag !== hasSeenOnboarding) {
        setHasSeenOnboarding(seenFlag);
      }

      const isOnboardingRoute = segments[0] === 'onboarding';

      if (!seenFlag && !isOnboardingRoute) {
        router.replace('/onboarding');
        return;
      }

      if (seenFlag && isOnboardingRoute) {
        router.replace('/');
      }
    }

    syncAndRoute();

    return () => {
      isMounted = false;
    };
  }, [showSplash, isCheckingOnboarding, hasSeenOnboarding, segments, router]);

  return (
    <AuthProvider>
      <CartProvider>
        <View style={styles.root}>
          <Slot />

          {(showSplash || isCheckingOnboarding) && (
            <View style={styles.splashOverlay}>
              <Image
                source={require('../assets/icons/icon-256.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#b30000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
  },
});
