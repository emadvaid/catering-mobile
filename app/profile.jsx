import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/navigation/BottomNav';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfileDetails } from '../lib/firebase/userProfiles';
import { colors, radii, spacing } from '../lib/theme';

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
};

const PRIVACY_POLICY_URL = 'https://kababhutatl.com/privacy-policy';
const ACCOUNT_DELETION_URL = 'https://kababhutatl.com/account-deletion';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!user?.uid) {
        setForm(EMPTY_FORM);
        return;
      }

      setLoadingProfile(true);
      try {
        const profile = await getUserProfile(user.uid);
        if (!mounted) {
          return;
        }

        setForm({
          fullName: profile?.fullName || user.displayName || '',
          phone: profile?.phone || '',
          addressLine1: profile?.addressLine1 || '',
          addressLine2: profile?.addressLine2 || '',
          city: profile?.city || '',
          state: profile?.state || '',
          zipCode: profile?.zipCode || '',
        });
      } catch (error) {
        if (mounted) {
          Alert.alert('Profile', 'Could not load profile details.');
        }
      } finally {
        if (mounted) {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSave() {
    if (!user?.uid) {
      Alert.alert('Profile', 'Please sign in first.');
      return;
    }

    setSaving(true);
    try {
      await updateUserProfileDetails(user.uid, {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zipCode: form.zipCode.trim(),
      });

      Alert.alert('Profile Updated', 'Your details were saved successfully.');
    } catch (error) {
      Alert.alert('Profile', error.message || 'Failed to save profile details.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  }

  async function openExternalUrl(url) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert('Cannot open link', 'Please try again later.');
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Cannot open link', 'Please try again later.');
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.avatarWrap}>
            <Ionicons name="person" size={30} color="#fff" />
          </View>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subtitle}>
            {user ? `Signed in as ${user.email}` : 'You are not signed in yet.'}
          </Text>
        </View>

        {user ? (
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Contact Details</Text>

            {loadingProfile ? <Text style={styles.loadingText}>Loading profile...</Text> : null}

            <Text style={styles.label}>Email (read-only)</Text>
            <TextInput value={user.email || ''} editable={false} style={[styles.input, styles.readOnlyInput]} />

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={form.fullName}
              onChangeText={(value) => updateField('fullName', value)}
              placeholder="Your full name"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={form.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="(404) 555-0000"
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            <Text style={styles.label}>Address Line 1</Text>
            <TextInput
              value={form.addressLine1}
              onChangeText={(value) => updateField('addressLine1', value)}
              placeholder="Street address"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              value={form.addressLine2}
              onChangeText={(value) => updateField('addressLine2', value)}
              placeholder="Apartment / Suite (optional)"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            <View style={styles.row}>
              <View style={styles.flexCol}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  value={form.city}
                  onChangeText={(value) => updateField('city', value)}
                  placeholder="City"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                />
              </View>

              <View style={styles.stateCol}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  value={form.state}
                  onChangeText={(value) => updateField('state', value)}
                  placeholder="GA"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  autoCapitalize="characters"
                  maxLength={3}
                />
              </View>
            </View>

            <Text style={styles.label}>ZIP Code</Text>
            <TextInput
              value={form.zipCode}
              onChangeText={(value) => updateField('zipCode', value)}
              placeholder="30080"
              keyboardType="number-pad"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : 'Save Details'}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}
              onPress={handleLogout}
            >
              <Text style={styles.secondaryButtonText}>Sign Out</Text>
            </Pressable>

            <View style={styles.legalBox}>
              <Text style={styles.legalTitle}>Privacy & Account Controls</Text>
              <Text style={styles.legalText}>
                Review our privacy policy or request account deletion from here.
              </Text>

              <Pressable
                style={({ pressed }) => [styles.inlineLink, pressed ? styles.pressed : null]}
                onPress={() => openExternalUrl(PRIVACY_POLICY_URL)}
              >
                <Text style={styles.inlineLinkText}>Open Privacy Policy</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.warnLinkButton,
                  pressed ? styles.pressed : null,
                ]}
                onPress={() => openExternalUrl(ACCOUNT_DELETION_URL)}
              >
                <Text style={styles.warnLinkButtonText}>Open Account Deletion Page</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.actionsCard}>
            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}
              onPress={() => router.push('/auth/signup')}
            >
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </Pressable>

            <View style={styles.legalBox}>
              <Text style={styles.legalTitle}>Privacy</Text>
              <Pressable
                style={({ pressed }) => [styles.inlineLink, pressed ? styles.pressed : null]}
                onPress={() => openExternalUrl(PRIVACY_POLICY_URL)}
              >
                <Text style={styles.inlineLinkText}>Open Privacy Policy</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNav activeRoute="/profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  subtitle: {
    textAlign: 'center',
    color: '#fecaca',
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    height: 46,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    color: colors.text,
    backgroundColor: '#fafafa',
    marginBottom: 2,
  },
  readOnlyInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flexCol: {
    flex: 1,
    gap: spacing.sm,
  },
  stateCol: {
    width: 86,
    gap: spacing.sm,
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  primaryButton: {
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  legalBox: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: '#fff',
  },
  legalTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  legalText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 2,
  },
  inlineLink: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  inlineLinkText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  warnLinkButton: {
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff1f2',
  },
  warnLinkButtonText: {
    color: '#991b1b',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
