# Kabab Hut Catering Mobile

Beginner-friendly React Native app built with Expo.

## Current MVP Skeleton
- Splash screen
- Onboarding (first launch only via AsyncStorage)
- Home screen
- Catering flow placeholders:
  - Event Type -> Guest Count -> Menu -> Cart -> Contact Details -> Confirmation
- Login and Signup placeholders (not first screen)
- Firebase service files prepared (config placeholders)

## Run
```bash
npm install
npm start
```

## Project Structure
```text
src/
  screens/
    SplashScreen.js
    onboarding/OnboardingScreen.js
    HomeScreen.js
    EventTypeScreen.js
    GuestCountScreen.js
    MenuScreen.js
    CartScreen.js
    ContactDetailsScreen.js
    ConfirmationScreen.js
    ProfileScreen.js
    auth/LoginScreen.js
    auth/SignupScreen.js
  navigation/RootNavigator.js
  services/firebaseConfig.js
  services/cateringService.js
  services/inquiryService.js
  context/CartContext.js
  utils/storage.js
```
