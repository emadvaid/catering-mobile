import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function PlaceholderScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Placeholder' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Placeholder</Text>
        <Text style={styles.body}>
          Replace this screen with migrated pages from the Next.js app.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  body: {
    fontSize: 16,
    color: '#334155',
  },
});
