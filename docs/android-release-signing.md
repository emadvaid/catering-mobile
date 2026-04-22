# Android Release Signing (Play Store)

This project is now configured to use release signing if Gradle properties are provided.

## 1) Generate upload keystore

Run from project root:

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

Keep these values safe:
- keystore password
- key password
- alias (`upload`)

## 2) Add signing properties (local machine only)

Open/create `~/.gradle/gradle.properties` and add:

```properties
MYAPP_UPLOAD_STORE_FILE=/Users/<your-user>/.../catering-mobile/android/app/upload-keystore.jks
MYAPP_UPLOAD_KEY_ALIAS=upload
MYAPP_UPLOAD_STORE_PASSWORD=<your-keystore-password>
MYAPP_UPLOAD_KEY_PASSWORD=<your-key-password>
```

Do not commit these secrets to git.

## 3) Build release AAB for Play Store

```bash
cd /Users/jawwadabbasi/kabab-hut-atl/catering-mobile/android
./gradlew clean
./gradlew bundleRelease
```

Output bundle:

`android/app/build/outputs/bundle/release/app-release.aab`

## 4) Verify signing used

If `MYAPP_UPLOAD_*` is not set, Gradle prints:

`WARNING: Release build is using debug signing...`

Do not upload to Play Store if you see that warning.

## 5) Next step after first Play upload

After uploading to Play (Closed testing):
- Go to Play Console -> App Integrity
- Copy App Signing SHA-1
- Add it to Firebase Android app + Google OAuth Android client
- Rebuild and retest Google Sign-In in release

## 6) Google Sign-In release certificate setup (Step 4)

### A) Create two Android OAuth clients in Google Auth Platform

Use package name:

`com.kababhutatl.catering`

Create/keep:
- **Debug Android client** with debug SHA-1 (for emulator/dev build)
- **Release Android client** with Play App Signing SHA-1 (for Play release)

Do not remove debug client; keep both.

### B) Put both client IDs in `.env`

```properties
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID_DEBUG=<android-debug-client-id>
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID_RELEASE=<android-release-client-id>
```

This app is configured to pick:
- debug ID in dev builds
- release ID in release builds

### C) Add SHA-1 in Firebase

Firebase Console -> Project Settings -> Your apps -> Android (`com.kababhutatl.catering`)
- add debug SHA-1 (if missing)
- add Play App Signing SHA-1

### D) Verify redirect scheme is present in AndroidManifest

Release client ID prefix becomes redirect scheme:

`com.googleusercontent.apps.<release-client-id-prefix>:/oauthredirect`

The app derives this automatically from the Android client ID used at build time.

### E) Build and test release

```bash
cd android
./gradlew bundleRelease
```

Install/internal test via Play Console and verify Google Sign-In works in that signed release build.
