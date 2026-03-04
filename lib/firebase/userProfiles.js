import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
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

export async function getUserProfile(uid) {
  if (!uid) {
    return null;
  }

  const snapshot = await getDoc(doc(db, 'users', uid));
  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function updateUserProfileDetails(uid, payload) {
  if (!uid) {
    throw new Error('Missing user id');
  }

  await setDoc(
    doc(db, 'users', uid),
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
