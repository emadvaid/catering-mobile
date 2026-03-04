# Firestore Setup (Menu + Packages)

## 1. Collections to create

Create these collections in Firestore:

- `menuItems`
- `packages`

## 2. `menuItems` document shape

Each document should contain:

- `name` (string)
- `category` (string)
- `description` (string)
- `price` (number, optional; use `0` if quote-only)
- `priceLabel` (string, recommended: `Contact for pricing`)

Example document:

```json
{
  "name": "Chicken Biryani",
  "category": "Biryani",
  "description": "Fragrant basmati rice layered with spiced chicken.",
  "price": 0,
  "priceLabel": "Contact for pricing"
}
```

## 3. `packages` document shape

Each document should contain:

- `order` (number)
- `name` (string)
- `badge` (string)
- `guests` (string)
- `appetizers` (array of strings)
- `mains` (array of strings)
- `regularDessert` (array of strings)
- `premiumDessert` (array of strings)

Example document:

```json
{
  "order": 1,
  "name": "Package A",
  "badge": "Large events",
  "guests": "200+ ppl",
  "appetizers": ["Punjabi Samosa", "Papri Chaat", "Chicken 65"],
  "mains": ["Chicken Biryani", "Goat Bhuna", "Beef Nihari"],
  "regularDessert": ["Kheer"],
  "premiumDessert": ["Shahi Tukray"]
}
```

## 4. Add data in Firebase console

1. Open Firebase Console.
2. Go to `Firestore Database`.
3. Create collection `menuItems`.
4. Add documents manually using the shape above.
5. Create collection `packages`.
6. Add package docs with `order` values `1,2,3...`.

The app reads Firestore first. If Firestore has no data, it falls back to local data in:

- `data/menuItems.js`
- `data/packages.js`

## 5. Minimal rules for early testing (not production)

Use temporary test rules while building admin panel:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Replace with proper auth-based rules before launch.

## 6. Budget-friendly strategy

- Keep menu and package data mostly static in Firestore.
- Fetch once at app open and cache locally (AsyncStorage) for repeat visits.
- Avoid real-time listeners for menu/packages; use one-time reads (`getDocs`) as currently implemented.
- Keep images bundled in app or on low-cost CDN; avoid large binary uploads to Firestore.
- Keep Spark plan until read/write volume grows; monitor Firestore usage dashboard weekly.
