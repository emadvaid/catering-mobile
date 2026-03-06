import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, radii, spacing } from '../../lib/theme';

export default function SignupScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams();
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const nextRoute = typeof redirect === 'string' ? redirect : '/';

  function handleBack() {
    if (typeof redirect === 'string' && redirect.length > 0) {
      router.replace(redirect);
      return;
    }

    router.replace('/cart');
  }

  async function handleSignup() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Enter both email and password.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password should be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
      router.replace(nextRoute);
    } catch (error) {
      Alert.alert('Signup failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
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

        <Text style={styles.heroTitle}>Create Account</Text>
        <Text style={styles.heroSubtitle}>Set up your account to continue with checkout.</Text>
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
          placeholder="Minimum 6 characters"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />

        <Pressable
          onPress={handleSignup}
          style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Text>
        </Pressable>

        <Link href={`/auth/login?redirect=${encodeURIComponent(nextRoute)}`} style={styles.link}>
          Already have an account? Sign in
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
