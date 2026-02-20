import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_DONE_KEY = '@kababhut/onboarding_done';

// Reads onboarding completion flag.
export async function hasCompletedOnboarding() {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_DONE_KEY);
    return value === 'true';
  } catch (error) {
    console.log('Error reading onboarding value:', error);
    return false;
  }
}

// Saves onboarding completion flag.
export async function markOnboardingComplete() {
  try {
    await AsyncStorage.setItem(ONBOARDING_DONE_KEY, 'true');
  } catch (error) {
    console.log('Error writing onboarding value:', error);
  }
}
