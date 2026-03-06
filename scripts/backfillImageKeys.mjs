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

const imageKeyByName = {
  'chicken biryani': 'chicken_biryani',
  'beef biryani': 'beef_biryani',
  'mutton karhai': 'mutton_karhai',
  'chicken karhai': 'chicken_karhai',
  'beef nihari': 'beef_nihari',
  'chicken seekh kabab': 'chicken_seekh_kabab',
  'beef seekh kabab': 'beef_seekh_kabab',
  'chicken tikka': 'chicken_tikka',
  'paneer tikka': 'paneer_tikka',
  'aloo paratha': 'aloo_paratha',
  samosa: 'samosa',
  'spring rolls': 'spring_rolls',
  'pani puri shots': 'pani_puri_shots',
  'chicken 65': 'chicken_65',
  'gulab jamun': 'gulab_jamun',
  'gajar halwa': 'gajar_halwa',
};

async function run() {
  const snapshot = await db.collection('menuItems').get();
  if (snapshot.empty) {
    console.log('No menuItems documents found.');
    return;
  }

  const batch = db.batch();
  let matched = 0;
  let skipped = 0;

  snapshot.forEach((doc) => {
    const data = doc.data() || {};
    const rawName = typeof data.name === 'string' ? data.name : '';
    const normalizedName = rawName.trim().toLowerCase();
    const imageKey = imageKeyByName[normalizedName];

    if (imageKey) {
      batch.update(doc.ref, { imageKey });
      matched += 1;
      console.log(`update ${doc.id}: "${rawName}" -> ${imageKey}`);
      return;
    }

    skipped += 1;
    console.log(`skip   ${doc.id}: "${rawName}" (no key match)`);
  });

  if (matched > 0) {
    await batch.commit();
  }

  console.log(`Done. updated=${matched}, skipped=${skipped}`);
}

run().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});
