import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/navigation/BottomNav';
import { colors, radii, spacing } from '../lib/theme';

const HIGHLIGHTS = [
  {
    id: 'h1',
    icon: 'restaurant-outline',
    title: 'Authentic South Asian Cuisine',
    text: 'Pakistani and Indian catering menus with regional specialties and live flavors.',
  },
  {
    id: 'h2',
    icon: 'people-outline',
    title: 'Events of Any Size',
    text: 'From family gatherings to high-volume corporate and wedding catering events.',
  },
  {
    id: 'h3',
    icon: 'checkmark-done-circle-outline',
    title: 'Professional Service',
    text: 'Reliable planning, clear communication, and smooth event-day execution.',
  },
];

const STORE_PHONE = '(770) 925-4440';
const STORE_PHONE_LINK = 'tel:+17709254440';
const STORE_ADDRESS = '880 Indian Trail Lilburn Rd NW, Lilburn, GA 30047';
const DIRECTIONS_LINK =
  'https://www.google.com/maps/search/?api=1&query=880%20Indian%20Trail%20Lilburn%20Rd%20NW%2C%20Lilburn%2C%20GA%2030047';
const WEBSITE_LINK = 'https://kababhutatl.com/';
const PRIVACY_POLICY_LINK = 'https://kababhutatl.com/privacy-policy';
const ACCOUNT_DELETION_LINK = 'https://kababhutatl.com/account-deletion';

export default function AboutScreen() {
  async function openUrl(url, label) {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      return;
    }

    await Linking.openURL(url);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>About Kabab Hut Catering</Text>
          <Text style={styles.title}>Flavor-first catering made for memorable events</Text>
          <Text style={styles.heroText}>
            We specialize in bold South Asian menus with customizable spreads, vegetarian options,
            and full-service support for your event.
          </Text>
        </View>

        <View style={styles.section}>
          {HIGHLIGHTS.map((item) => (
            <View key={item.id} style={styles.highlightCard}>
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.highlightBody}>
                <Text style={styles.highlightTitle}>{item.title}</Text>
                <Text style={styles.highlightText}>{item.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.section, styles.visitSection]}>
          <Text style={[styles.sectionTitle, styles.visitSectionTitle]}>Hungry? Visit Kabab Hut</Text>
          <Text style={styles.visitSectionText}>
            Stop by our store, call us directly, or check our full catering website for more
            options and event photos.
          </Text>

          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={18} color={colors.accent} />
              <Text style={styles.contactText}>{STORE_PHONE}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={18} color={colors.accent} />
              <Text style={styles.contactText}>{STORE_ADDRESS}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="globe-outline" size={18} color={colors.accent} />
              <Text style={styles.contactText}>kababhutatl.com</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              styles.websiteButton,
              pressed ? styles.pressed : null,
            ]}
            onPress={() => openUrl(WEBSITE_LINK, 'Website')}
          >
            <Text style={styles.websiteButtonText}>Hungry? Check Out Our Website</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              styles.visitActionButton,
              styles.callButton,
              pressed ? styles.pressed : null,
            ]}
            onPress={() => openUrl(STORE_PHONE_LINK, 'Phone')}
          >
            <Text style={styles.coloredButtonText}>Call Store</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              styles.visitActionButton,
              styles.directionsButton,
              pressed ? styles.pressed : null,
            ]}
            onPress={() => openUrl(DIRECTIONS_LINK, 'Directions')}
          >
            <Text style={styles.coloredButtonText}>Get Directions</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need a custom quote?</Text>
          <Text style={styles.sectionText}>
            Tell us your headcount, event date, and cuisine preferences. We will suggest a package
            and menu plan that fits your event.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
            onPress={() => router.push('/packages')}
          >
            <Text style={styles.primaryButtonText}>View Packages</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}
            onPress={() => router.push('/menu')}
          >
            <Text style={styles.secondaryButtonText}>Browse Full Menu</Text>
          </Pressable>
        </View>

        <View style={[styles.section, styles.complianceSection]}>
          <Text style={styles.sectionTitle}>Privacy & Account Controls</Text>
          <Text style={styles.sectionText}>
            Review how data is handled and how to request account deletion.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, styles.complianceButton, pressed ? styles.pressed : null]}
            onPress={() => openUrl(PRIVACY_POLICY_LINK, 'Privacy Policy')}
          >
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
            <Text style={styles.complianceButtonText}>Privacy Policy</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, styles.complianceButton, pressed ? styles.pressed : null]}
            onPress={() => openUrl(ACCOUNT_DELETION_LINK, 'Account Deletion')}
          >
            <Ionicons name="trash-outline" size={16} color={colors.primary} />
            <Text style={styles.complianceButtonText}>Account Deletion</Text>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNav activeRoute="/about" />
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.xl,
  },
  eyebrow: {
    color: '#fecaca',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  title: {
    color: '#fff',
    marginTop: spacing.sm,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroText: {
    marginTop: spacing.sm,
    color: '#fca5a5',
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  visitSection: {
    backgroundColor: colors.primaryDark,
    borderColor: '#7f1d1d',
    shadowColor: '#450a0a',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  visitSectionText: {
    color: '#fecaca',
    fontSize: 14,
    lineHeight: 20,
  },
  contactCard: {
    borderWidth: 1,
    borderColor: '#991b1b',
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: '#7f1d1d',
    shadowColor: '#450a0a',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    color: '#fee2e2',
    fontSize: 14,
    flex: 1,
    fontWeight: '600',
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: radii.md,
    padding: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightBody: {
    flex: 1,
  },
  highlightTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  highlightText: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 24,
    letterSpacing: -0.3,
  },
  visitSectionTitle: {
    color: '#fff',
  },
  sectionText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  complianceSection: {
    borderColor: '#fecaca',
    backgroundColor: '#fff7f7',
  },
  primaryButton: {
    marginTop: spacing.sm,
    height: 46,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  websiteButton: {
    backgroundColor: '#fbbf24',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  websiteButtonText: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    height: 46,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitActionButton: {
    borderWidth: 0,
  },
  callButton: {
    backgroundColor: '#991b1b',
  },
  directionsButton: {
    backgroundColor: '#991b1b',
  },
  coloredButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  complianceButton: {
    flexDirection: 'row',
    gap: 8,
    borderColor: '#fecaca',
    backgroundColor: '#fff',
  },
  complianceButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
