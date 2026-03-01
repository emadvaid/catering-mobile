import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseApp } from './config';

const db = getFirestore(getFirebaseApp());

export async function upsertUserProfile(user) {
  if (!user?.uid) {
    return;
  }

  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}
