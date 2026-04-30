import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getFirebaseApp } from './config';

const app = getFirebaseApp();
let auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    auth = getAuth(app);
  }
}

export function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export function signUpWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOutUser() {
  return signOut(auth);
}

export async function signInWithGoogle() {
  if (Platform.OS !== 'web') {
    throw new Error(
      'Google sign-in for native requires Expo Auth Session setup (iOS/Android client IDs).'
    );
  }

  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function signInWithGoogleCredential({ idToken, accessToken }) {
  if (!idToken && !accessToken) {
    throw new Error('Google Sign-In did not provide a usable token.');
  }

  const credential = GoogleAuthProvider.credential(idToken ?? null, accessToken ?? null);
  return signInWithCredential(auth, credential);
}

export function signInWithAppleCredential({ idToken, rawNonce }) {
  if (!idToken) {
    throw new Error('Apple Sign-In did not provide an identity token.');
  }

  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({
    idToken,
    rawNonce: rawNonce || undefined,
  });

  return signInWithCredential(auth, credential);
}
