import { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      <Slot />

      {showSplash && (
        <View style={styles.splashOverlay}>
          <Image
            source={require('../assets/icons/icon-256.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff'
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#b30000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 140,
    height: 140
  }
});
