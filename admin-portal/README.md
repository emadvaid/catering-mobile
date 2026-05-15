# Kabab Hut Admin Portal

Separate React/Vite web portal for Kabab Hut staff. It uses the same Firebase project as the
mobile app, but it checks admin access through a separate Firestore collection.

## Admin access document

Create one Firebase Auth user first, then create this Firestore document:

```text
admins/{uid}
```

Example fields:

```json
{
  "email": "kababhutatlanta@gmail.com",
  "name": "Kabab Hut Atlanta",
  "role": "owner",
  "active": true
}
```

The document ID must be the Firebase Auth UID for that email. The login page only allows access
when the signed-in user's UID has an `admins/{uid}` document, `active` is `true`, and the document
email matches the Firebase Auth email.

## Commands

```bash
npm install
npm run dev
npm run build
```

The portal reads the existing root `.env` Firebase values through Vite.
