import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { exchangeCodeAsync, makeRedirectUri } from 'expo-auth-session';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, radii, spacing } from '../../lib/theme';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams();
  const { login, loginWithGoogleTokens } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const nextRoute = typeof redirect === 'string' ? redirect : '/';
  const isExpoGo =
    Constants.appOwnership === 'expo' ||
    Constants.executionEnvironment === 'storeClient';
  const isAndroid = Platform.OS === 'android';
  const androidClientId = useMemo(() => {
    if (__DEV__) {
      return (
        process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID_DEBUG ||
        process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
      );
    }

    return (
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID_RELEASE ||
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
    );
  }, []);
  const androidNativeRedirectUri = useMemo(() => {
    if (!androidClientId) {
      return undefined;
    }

    const clientIdPrefix = androidClientId.replace('.apps.googleusercontent.com', '');
    return `com.googleusercontent.apps.${clientIdPrefix}:/oauthredirect`;
  }, [androidClientId]);

  const authConfig = useMemo(
    () => {
      const config = {
        iosClientId:
          process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
          process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
        androidClientId,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        selectAccount: true,
      };

      if (isAndroid && androidNativeRedirectUri) {
        config.redirectUri = makeRedirectUri({
          native: androidNativeRedirectUri,
        });
      }

      if (isExpoGo) {
        config.expoClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID;
      }

      return config;
    },
    [androidClientId, androidNativeRedirectUri, isAndroid, isExpoGo]
  );

  const [request, , promptAsync] = Google.useAuthRequest(authConfig);
  const googleDiscovery = useMemo(
    () => ({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    }),
    []
  );

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
        'Open the development build app for Google sign-in. Expo Go does not support this flow.'
      );
      return;
    }

    if (!request) {
      Alert.alert('Google Sign-In', 'Google request is not ready. Try again in a moment.');
      return;
    }

    setGoogleLoading(true);

    try {
      const result = await promptAsync({
        useProxy: false,
      });

      if (result?.type !== 'success') {
        setGoogleLoading(false);
        return;
      }

      let idToken =
        result.authentication?.idToken ||
        result.params?.id_token ||
        result.params?.idToken;
      let accessToken =
        result.authentication?.accessToken ||
        result.params?.access_token ||
        result.params?.accessToken;

      const authorizationCode = result.params?.code;
      if (!idToken && authorizationCode && request?.codeVerifier) {
        const tokenResponse = await exchangeCodeAsync(
          {
            clientId: androidClientId,
            code: authorizationCode,
            redirectUri: authConfig.redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
          },
          googleDiscovery
        );

        idToken = tokenResponse.idToken || idToken;
        accessToken = tokenResponse.accessToken || accessToken;
      }

      if (!idToken && !accessToken) {
        setGoogleLoading(false);
        Alert.alert('Google Sign-In', 'Google did not return valid auth tokens. Please retry.');
        return;
      }

      await loginWithGoogleTokens({ idToken, accessToken });
      router.replace(nextRoute);
      setGoogleLoading(false);
    } catch (error) {
      setGoogleLoading(false);
      Alert.alert('Google Sign-In', error.message || 'Could not start Google sign-in.');
    }
  }

  useEffect(() => {
    if (!isAndroid || !request) {
      return;
    }

    // no-op effect keeps request initialized before first press on some Android emulators
    // where the first auth attempt can otherwise drop redirect state.
  }, [isAndroid, request]);

  function handleBack() {
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.hero}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [styles.backChip, pressed ? styles.pressed : null]}
        >
          <Ionicons name="chevron-back" size={16} color="#fff" />
          <Text style={styles.backChipText}>Back</Text>
        </Pressable>

        <Text style={styles.heroTitle}>Welcome Back</Text>
        <Text style={styles.heroSubtitle}>Sign in to continue with your catering order.</Text>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Your password"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </Pressable>

        <Pressable
          onPress={handleGoogleLogin}
          style={({ pressed }) => [styles.googleButton, pressed ? styles.pressed : null]}
          disabled={loading || googleLoading}
        >
          <View style={styles.googleIconBubble}>
            <FontAwesome name="google" size={16} color="#ea4335" />
          </View>
          <Text style={styles.googleButtonText}>
            {googleLoading ? 'Connecting Google...' : 'Continue with Google'}
          </Text>
        </Pressable>

        <Link href={`/auth/signup?redirect=${encodeURIComponent(nextRoute)}`} style={styles.link}>
          No account yet? Create one
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 54,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: colors.primaryDark,
  },
  backChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    marginBottom: spacing.lg,
  },
  backChipText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    color: '#fee2e2',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
  },
  sheet: {
    marginTop: -30,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: '#111827',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
  },
  primaryButton: {
    marginTop: spacing.sm,
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  googleButton: {
    marginTop: 4,
    height: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
  },
  googleIconBubble: {
    width: 26,
    height: 26,
    borderRadius: radii.pill,
    backgroundColor: '#fff5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  link: {
    marginTop: spacing.xs,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
