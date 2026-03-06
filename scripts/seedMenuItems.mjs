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

const menuItems = [
  {
    id: 'menu_chicken_biryani',
    name: 'Chicken Biryani',
    imageKey: 'chicken_biryani',
    category: 'Biryani',
    description: 'Fragrant basmati rice layered with spiced chicken.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_beef_biryani',
    name: 'Beef Biryani',
    imageKey: 'beef_biryani',
    category: 'Biryani',
    description: 'Aromatic beef biryani with bold South Asian spices.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_mutton_karhai',
    name: 'Mutton Karhai',
    imageKey: 'mutton_karhai',
    category: 'Curries',
    description: 'Traditional wok-cooked mutton curry with rich gravy.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_chicken_karhai',
    name: 'Chicken Karhai',
    imageKey: 'chicken_karhai',
    category: 'Curries',
    description: 'Classic karhai made with tomatoes, ginger, and chilies.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_beef_nihari',
    name: 'Beef Nihari',
    imageKey: 'beef_nihari',
    category: 'Curries',
    description: 'Slow-cooked beef stew with deep, aromatic flavor.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_chicken_seekh_kabab',
    name: 'Chicken Seekh Kabab',
    imageKey: 'chicken_seekh_kabab',
    category: 'Grilled',
    description: 'Ground chicken kababs grilled over open flame.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_beef_seekh_kabab',
    name: 'Beef Seekh Kabab',
    imageKey: 'beef_seekh_kabab',
    category: 'Grilled',
    description: 'Juicy beef skewers with authentic spice blend.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_chicken_tikka',
    name: 'Chicken Tikka',
    imageKey: 'chicken_tikka',
    category: 'Grilled',
    description: 'Smoky, marinated chicken grilled to charred perfection.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_paneer_tikka',
    name: 'Paneer Tikka',
    imageKey: 'paneer_tikka',
    category: 'Vegetarian',
    description: 'Spiced paneer cubes grilled with peppers and onions.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_aloo_paratha',
    name: 'Aloo Paratha',
    imageKey: 'aloo_paratha',
    category: 'Vegetarian',
    description: 'Stuffed flatbread served with yogurt and chutney.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_samosa',
    name: 'Samosa',
    imageKey: 'samosa',
    category: 'Appetizers',
    description: 'Crispy pastry pockets with spiced potato filling.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_spring_rolls',
    name: 'Spring Rolls',
    imageKey: 'spring_rolls',
    category: 'Appetizers',
    description: 'Crunchy rolls with savory vegetable stuffing.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_pani_puri_shots',
    name: 'Pani Puri Shots',
    imageKey: 'pani_puri_shots',
    category: 'Appetizers',
    description: 'Street-style pani puri served as bite-size shots.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_chicken_65',
    name: 'Chicken 65',
    imageKey: 'chicken_65',
    category: 'Appetizers',
    description: 'Spicy and crispy fried chicken with curry leaf aroma.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_gulab_jamun',
    name: 'Gulab Jamun',
    imageKey: 'gulab_jamun',
    category: 'Desserts',
    description: 'Soft milk dumplings soaked in cardamom syrup.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
  {
    id: 'menu_gajar_halwa',
    name: 'Gajar Halwa',
    imageKey: 'gajar_halwa',
    category: 'Desserts',
    description: 'Rich carrot pudding with nuts and khoya.',
    price: 0,
    priceLabel: 'Contact for pricing',
  },
];

async function run() {
  const batch = db.batch();

  menuItems.forEach((item) => {
    const ref = db.collection('menuItems').doc(item.id);
    batch.set(ref, item, { merge: true });
  });

  await batch.commit();
  console.log(`Seeded ${menuItems.length} menu items.`);
}

run().catch((error) => {
  console.error('Menu seed failed:', error);
  process.exit(1);
});
