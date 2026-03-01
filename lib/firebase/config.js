import { getApps, initializeApp } from 'firebase/app';

// Uses Expo public env vars. Add these to a local `.env` file later.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'REPLACE_ME',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'REPLACE_ME',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'REPLACE_ME',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'REPLACE_ME',
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'REPLACE_ME',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'REPLACE_ME',
};

export function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp(firebaseConfig);
}

export { firebaseConfig };
