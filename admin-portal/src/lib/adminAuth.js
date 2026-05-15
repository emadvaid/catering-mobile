import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';

export async function getAdminProfile(user) {
  if (!user?.uid) {
    return null;
  }

  const snapshot = await getDoc(doc(db, 'admins', user.uid));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export function isActiveAdmin(user, adminProfile) {
  if (!user || !adminProfile) {
    return false;
  }

  const profileEmail = (adminProfile.email || '').toLowerCase().trim();
  const authEmail = (user.email || '').toLowerCase().trim();

  return adminProfile.active === true && profileEmail === authEmail;
}

export async function signOutAdmin() {
  await signOut(auth);
}
