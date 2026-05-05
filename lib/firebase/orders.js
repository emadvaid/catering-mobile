import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { getFirebaseApp } from './config';

const db = getFirestore(getFirebaseApp());
const MAX_GUEST_COUNT = 500;

function normalizeOrderItems(items) {
  return items.map((item) => ({
    id: item.id || 'unknown-item',
    name: item.name || 'Unnamed item',
    type: item.type || 'menu',
    quantity: Number.isFinite(Number(item.quantity)) ? Math.max(1, Number(item.quantity)) : 1,
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
  userDetails,
}) {
  if (!userId) {
    throw new Error('Missing user id for order.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cannot create an order with empty items.');
  }

  const guestCountValue = Number(guestCount);
  if (!Number.isInteger(guestCountValue) || guestCountValue < 1) {
    throw new Error('Please enter a valid guest count using numbers only.');
  }

  if (guestCountValue > MAX_GUEST_COUNT) {
    throw new Error(`Catering requests through the app are limited to ${MAX_GUEST_COUNT} guests.`);
  }

  const payload = {
    userId,
    userEmail: userEmail || null,
    userDetails: {
      fullName: userDetails?.fullName || '',
      phone: userDetails?.phone || '',
      addressLine1: userDetails?.addressLine1 || '',
      addressLine2: userDetails?.addressLine2 || '',
      city: userDetails?.city || '',
      state: userDetails?.state || '',
      zipCode: userDetails?.zipCode || '',
    },
    status: 'pending',
    total: Number.isFinite(Number(total)) ? Number(total) : 0,
    items: normalizeOrderItems(items),
    eventDate: eventDate || '',
    guestCount: guestCountValue,
    notes: notes || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const result = await addDoc(collection(db, 'orders'), payload);

  return result.id;
}
