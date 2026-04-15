import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

export default function OAuthRedirectScreen() {
  const router = useRouter();

  useEffect(() => {
    // Completes pending auth-session and forwards away from callback route.
    WebBrowser.maybeCompleteAuthSession();
    router.replace('/auth/login');
  }, [router]);

  return null;
}

