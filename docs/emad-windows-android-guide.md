# Catering Mobile - Windows + Android Emulator Guide (Emad)

This guide is for running the app on **Windows** with **Android Emulator only**.

## 1) Prerequisites

Install these tools:

1. **Node.js LTS** (recommend 22.x)
2. **Git**
3. **Android Studio** (includes SDK + AVD Manager)
4. **Java 17** (if not bundled by Android Studio)

## 2) Clone + Install

```bash
git clone <repo-url>
cd catering-mobile
npm install
```

## 3) Android Studio Setup

1. Open Android Studio
2. Install SDK components (API 34+)
3. Open **AVD Manager**
4. Create emulator (example: Pixel 8, API 34)
5. Start emulator and keep it running

## 4) First Run (Dev Client)

From project root:

```bash
npx expo run:android
npx expo start --dev-client -c
```

Notes:
- `run:android` builds and installs the app on emulator
- `start --dev-client -c` starts Metro with clean cache

## 5) Daily Run (after first build)

If app already installed on emulator:

```bash
npx expo start --dev-client
```

## 6) Required Env File

Create `.env` in project root with Firebase and Google auth values.

Required keys:
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_EXPO_PROJECT_FULL_NAME`

## 7) Current App User Flow

1. App launches -> onboarding shown first time only.
2. Home page -> browse menu/packages.
3. Add menu/package items to cart.
4. Cart supports quantity (+/-).
5. Proceed to checkout.
6. If not logged in -> redirected to login/signup.
7. If profile incomplete -> blocked and redirected to profile update.
8. Place order -> order saved in Firestore.
9. Cloud Function sends admin email notification.

## 8) Important Business Rules in Current App

1. Profile is required before order:
   - full name, phone, address line 1, city, state, zip
2. If order has no package, custom menu minimum is enforced (minimum tray/item units).
3. Order email includes customer details and item quantities.

## 9) Common Commands

Run Android:
```bash
npx expo run:android
```

Start Metro:
```bash
npx expo start --dev-client -c
```

Check Firebase function logs:
```bash
firebase functions:log --only sendOrderEmailToAdmin
```

## 10) Common Issues + Fixes

1. **Emulator not detected**
- Start emulator first from Android Studio.
- Verify with `adb devices`.

2. **Build cache issues**
```bash
npx expo start --dev-client -c
```

3. **Google sign-in issues**
- Check Android OAuth client + SHA1 in Google Cloud Console.
- Ensure `.env` client IDs are correct.

4. **No order email**
- Check function logs.
- Verify SMTP secrets and app password.

## 11) What Not To Commit

Do not commit secrets/files like:
- `.env`
- `serviceAccountKey.json`

## 12) Handoff Notes

If owner asks for demo:
- Show onboarding -> menu/packages -> cart quantity -> profile completion gate -> checkout -> order email.

