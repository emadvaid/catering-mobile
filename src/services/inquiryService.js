import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Saves inquiry with pending status.
export async function submitInquiry(inquiry) {
  const payload = {
    ...inquiry,
    status: 'pending',
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'inquiries'), payload);
  return docRef.id;
}
