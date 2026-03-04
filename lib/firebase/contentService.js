import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
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
  const snapshot = await getDocs(query(ref, orderBy('name')));
  return mapSnapshot(snapshot);
}

export async function fetchPackages() {
  const ref = collection(db, 'packages');
  const snapshot = await getDocs(query(ref, orderBy('order')));
  return mapSnapshot(snapshot);
}
