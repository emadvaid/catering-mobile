import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from './config';

const db = getFirestore(getFirebaseApp());

function mapSnapshot(snapshot) {
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function fetchMenuItems() {
  const ref = collection(db, 'menuItems');
  const snapshot = await getDocs(ref);
  return mapSnapshot(snapshot);
}

export async function fetchPackages() {
  const ref = collection(db, 'packages');
  const snapshot = await getDocs(ref);
  return mapSnapshot(snapshot);
}
