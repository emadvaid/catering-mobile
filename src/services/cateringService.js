import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Gets catering menu docs.
export async function fetchCateringItems() {
  const snapshot = await getDocs(collection(db, 'catering_items'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
