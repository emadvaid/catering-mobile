import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { getFirebaseApp } from './config';

const db = getFirestore(getFirebaseApp());

function normalizeOrderItems(items) {
  return items.map((item) => ({
    id: item.id || 'unknown-item',
    name: item.name || 'Unnamed item',
    type: item.type || 'menu',
    price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
    priceLabel: item.priceLabel || 'Contact for pricing',
  }));
}

export async function createOrder({
  userId,
  userEmail,
  items,
  total,
  eventDate,
  guestCount,
  notes,
}) {
  if (!userId) {
    throw new Error('Missing user id for order.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cannot create an order with empty items.');
  }

  const payload = {
    userId,
    userEmail: userEmail || null,
    status: 'pending',
    total: Number.isFinite(Number(total)) ? Number(total) : 0,
    items: normalizeOrderItems(items),
    eventDate: eventDate || '',
    guestCount: Number.isFinite(Number(guestCount)) ? Number(guestCount) : 0,
    notes: notes || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const result = await addDoc(collection(db, 'orders'), payload);

  return result.id;
}
