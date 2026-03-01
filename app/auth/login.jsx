import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams();
  const { login, loginWithGoogle, loginWithGoogleIdToken } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const nextRoute = typeof redirect === 'string' ? redirect : '/';
  const isExpoGo =
    Constants.appOwnership === 'expo' ||
    Constants.executionEnvironment === 'storeClient';

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId:
      process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
      process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    androidClientId:
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
      process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    async function handleGoogleResponse() {
      if (response?.type !== 'success') {
        return;
      }

      const idToken = response.authentication?.idToken;
      if (!idToken) {
        Alert.alert(
          'Google Sign-In',
          'No idToken returned. Check OAuth client IDs in your .env file.'
        );
        setGoogleLoading(false);
        return;
      }

      try {
        await loginWithGoogleIdToken(idToken);
        router.replace(nextRoute);
      } catch (error) {
        Alert.alert('Google Sign-In', error.message || 'Could not sign in with Google.');
      } finally {
        setGoogleLoading(false);
      }
    }

    handleGoogleResponse();
  }, [response, loginWithGoogleIdToken, nextRoute, router]);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace(nextRoute);
    } catch (error) {
      Alert.alert('Login failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    if (isExpoGo) {
      Alert.alert(
        'Google Sign-In Setup',
        'Google sign-in requires a dev build on this project. Open the development build app, not Expo Go.'
      );
      return;
    }

    if (request) {
      setGoogleLoading(true);
      await promptAsync();
      return;
    }

    // Web popup fallback
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.replace(nextRoute);
    } catch (error) {
      Alert.alert(
        'Google Sign-In',
        error.message ||
          'For native iOS/Android, configure Expo Auth Session Google client IDs next.'
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  function handleBack() {
    if (typeof redirect === 'string' && redirect.length > 0) {
      router.replace(redirect);
      return;
    }

    router.replace('/cart');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [styles.backButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Sign in to continue checkout.</Text>

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed ? styles.pressed : null,
          ]}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>{loading ? 'Please wait...' : 'Sign In'}</Text>
        </Pressable>

        <Pressable
          onPress={handleGoogleLogin}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed ? styles.pressed : null,
          ]}
          disabled={loading || googleLoading}
        >
          <Text style={styles.secondaryButtonText}>
            {googleLoading ? 'Connecting Google...' : 'Continue with Google'}
          </Text>
        </Pressable>

        <Link href={`/auth/signup?redirect=${encodeURIComponent(nextRoute)}`} style={styles.link}>
          Create an account
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginBottom: 10,
  },
  backButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  primaryButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#b30000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
  link: {
    marginTop: 12,
    color: '#b30000',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});
