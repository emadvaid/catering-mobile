import { createContext, useContext, useEffect, useState } from 'react';
import {
  observeAuthState,
  signInWithEmail,
  signInWithGoogle,
  signInWithGoogleIdToken,
  signOutUser,
  signUpWithEmail,
} from '../lib/firebase/auth';
import { upsertUserProfile } from '../lib/firebase/userProfiles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observeAuthState((nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(email, password) {
    const result = await signInWithEmail(email.trim(), password);
    await upsertUserProfile(result.user);
    return result.user;
  }

  async function signup(email, password) {
    const result = await signUpWithEmail(email.trim(), password);
    await upsertUserProfile(result.user);
    return result.user;
  }

  async function loginWithGoogle() {
    const result = await signInWithGoogle();
    await upsertUserProfile(result.user);
    return result.user;
  }

  async function loginWithGoogleIdToken(idToken) {
    const result = await signInWithGoogleIdToken(idToken);
    await upsertUserProfile(result.user);
    return result.user;
  }

  async function logout() {
    await signOutUser();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        signup,
        loginWithGoogle,
        loginWithGoogleIdToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}
