import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/navigation/BottomNav';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>{user ? `Signed in: ${user.email}` : 'Not signed in'}</Text>

        {user ? (
          <Pressable
            style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
        )}
      </View>

      <BottomNav activeRoute="/profile" />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#b30000',
    height: 46,
    minWidth: 150,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});
