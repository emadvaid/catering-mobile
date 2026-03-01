import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

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
      <View style={styles.container}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [styles.backButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Create an account to continue checkout.</Text>

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
          onPress={handleSignup}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed ? styles.pressed : null,
          ]}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>{loading ? 'Please wait...' : 'Create Account'}</Text>
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
