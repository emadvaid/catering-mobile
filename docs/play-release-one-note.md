# Android Release One-Note (Terminal + Certs + OAuth)

This is your single reference to publish Android safely.

## Why this note exists

Publishing needs multiple systems to match:

- Your app build/signing
- Play Console app signing
- Google OAuth client
- Firebase Android app SHA fingerprints

If one value does not match (especially SHA-1), Google Sign-In fails in release.

---

## A) Build terms in simple words

- **AAB (Android App Bundle):** The Play Store upload file format (`.aab`).  
  Google uses this file to generate optimized APKs per device.
- **APK:** Install file used directly on device. Not the preferred upload format for new Play releases.
- **SHA-1 fingerprint:** Certificate identity. Google Sign-In checks this to trust your app.

---

## B) Local signing setup (already done)

Your release keystore file:

`android/app/upload-keystore.jks`

Your local machine should have these in `~/.gradle/gradle.properties`:

```properties
MYAPP_UPLOAD_STORE_FILE=/absolute/path/to/catering-mobile/android/app/upload-keystore.jks
MYAPP_UPLOAD_KEY_ALIAS=upload
MYAPP_UPLOAD_STORE_PASSWORD=...
MYAPP_UPLOAD_KEY_PASSWORD=...
```

---

## C) Build commands

From project root:

```bash
cd /Users/jawwadabbasi/kabab-hut-atl/catering-mobile/android
./gradlew bundleRelease
```

Output:

`android/app/build/outputs/bundle/release/app-release.aab`

---

## D) OAuth environment keys

In `.env` keep both Android client IDs:

```properties
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID_DEBUG=<debug-android-client-id>
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID_RELEASE=<release-android-client-id>
```

Code is already set to use:

- debug key during dev builds
- release key during release builds

---

## E) Exact release sequence after Play verification is approved

1. Create app in Play Console (if not already created)
2. Upload first internal testing AAB
3. Open Play Console -> App integrity
4. Copy **App signing certificate SHA-1**
5. In Google Auth Platform, create Android OAuth client with:
   - package: `com.kababhutatl.catering`
   - SHA-1: Play App Signing SHA-1
6. Add same Play SHA-1 in Firebase Android app settings
7. Put new release Android client ID in `.env`
8. Rebuild `bundleRelease`
9. Upload second AAB to internal testing
10. Install from Play internal link and test Google Sign-In

---

## F) Quick troubleshooting

If Google Sign-In fails in release:

1. Check package name is exactly `com.kababhutatl.catering`
2. Check OAuth Android client SHA-1 = Play App signing SHA-1
3. Check Firebase Android app contains same Play SHA-1
4. Rebuild AAB after `.env` changes
5. Wait 5-15 minutes for Google config propagation and retest

