import admin from 'firebase-admin';
import fs from 'fs';

const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`Missing ${SERVICE_ACCOUNT_PATH}. Download it from Firebase Console -> Project settings -> Service accounts.`);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const packages = [
  {
    id: 'pkg-a',
    order: 1,
    name: 'Package A',
    badge: 'Large events',
    guests: '200+ ppl',
    appetizers: ['Punjabi Samosa', 'Papri Chaat', 'Chicken 65'],
    mains: [
      'Chicken Biryani',
      'Goat Bhuna',
      'Beef Nihari',
      'Palak Paneer',
      'Tandoori Chicken + Chicken Seekh Kabab',
      'Tandoori Naan',
      'Salad',
      'Raita',
      'Chutney',
    ],
    regularDessert: ['Kheer'],
    premiumDessert: ['Shahi Tukray'],
  },
  {
    id: 'pkg-b',
    order: 2,
    name: 'Package B',
    badge: 'Large events',
    guests: '200+ ppl',
    appetizers: ['Pani Puri Shots', 'Papri Chaat', 'Chilli Chicken'],
    mains: [
      'Goat Pulao',
      'Chicken Tikka Masala',
      'Beef Karhai',
      'Bagare Baigan',
      'Chicken 65',
      'Tandoori Naan',
      'Salad',
      'Raita',
      'Chutney',
    ],
    regularDessert: ['Fruit Custard'],
    premiumDessert: ['Rasmalai'],
  },
  {
    id: 'pkg-c',
    order: 3,
    name: 'Package C',
    badge: 'Large events',
    guests: '200+ ppl',
    appetizers: ['Veg Spring Rolls', 'Dahi Baray', 'Shami Bun Kabab'],
    mains: [
      'Beef Pulao',
      'Chicken Achari',
      'Goat Karhai',
      'Karhai Pakora',
      'Chatpata Tikka + Beef Seekh Kabab',
      'Tandoori Naan',
      'Salad',
      'Raita',
      'Chutney',
    ],
    regularDessert: ['Gulab Jamun'],
    premiumDessert: ['Gajar Halwa'],
  },
  {
    id: 'pkg-d',
    order: 4,
    name: 'Package D',
    badge: 'Large events',
    guests: '200+ ppl',
    appetizers: ['Papri Chaat', 'Aloo Tikki Bun Kabab', 'Chicken Manchurian'],
    mains: [
      'Goat Biryani',
      'Chicken Karhai',
      'Beef Korma',
      'Paneer Tikka Masala',
      'Tandoori Chicken + Beef Chapli Kabab',
      'Tandoori Naan',
      'Salad',
      'Raita',
      'Chutney',
    ],
    regularDessert: ['Sevaiyan'],
    premiumDessert: ['Zarda'],
  },
];

async function run() {
  const batch = db.batch();

  packages.forEach((item) => {
    const ref = db.collection('packages').doc(item.id);
    batch.set(ref, item, { merge: true });
  });

  await batch.commit();
  console.log(`Seeded ${packages.length} packages.`);
}

run().catch((error) => {
  console.error('Package seed failed:', error);
  process.exit(1);
});
