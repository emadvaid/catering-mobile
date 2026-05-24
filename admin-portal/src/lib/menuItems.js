import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';

const MENU_COLLECTION = 'menuItems';
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function parseNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function sortMenuItems(a, b) {
  const orderDiff = parseNumber(a.order, 999) - parseNumber(b.order, 999);
  if (orderDiff !== 0) {
    return orderDiff;
  }

  return cleanString(a.name).localeCompare(cleanString(b.name));
}

function normalizeMenuPayload(values) {
  return {
    name: cleanString(values.name),
    category: cleanString(values.category) || 'All',
    description: cleanString(values.description),
    price: parseNumber(values.price, 0),
    priceLabel: cleanString(values.priceLabel) || 'Contact for pricing',
    imageKey: cleanString(values.imageKey) || null,
    imageUrl: cleanString(values.imageUrl) || null,
    order: parseNumber(values.order, 999),
    active: values.active !== false,
    updatedAt: serverTimestamp(),
  };
}

function validateImageFile(file) {
  if (!file) {
    return;
  }

  if (!file.type?.startsWith('image/')) {
    throw new Error('Please upload a valid image file.');
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image must be smaller than 5 MB.');
  }
}

function getImageExtension(file) {
  const fromName = cleanString(file?.name).split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  const fromType = cleanString(file?.type).split('/').pop()?.toLowerCase();
  return fromType || 'jpg';
}

async function uploadMenuItemImage(itemId, file) {
  validateImageFile(file);

  const extension = getImageExtension(file);
  const imageRef = ref(storage, `menu-items/${itemId}/image-${Date.now()}.${extension}`);
  const snapshot = await uploadBytes(imageRef, file, {
    contentType: file.type || 'image/jpeg',
  });

  return getDownloadURL(snapshot.ref);
}

export function listenToMenuItems({ onData, onError }) {
  const menuRef = collection(db, MENU_COLLECTION);

  return onSnapshot(
    menuRef,
    (snapshot) => {
      const items = snapshot.docs
        .map((menuDoc) => ({
          id: menuDoc.id,
          ...menuDoc.data(),
        }))
        .sort(sortMenuItems);

      onData(items);
    },
    onError
  );
}

export async function createMenuItem(values, imageFile = null) {
  const payload = normalizeMenuPayload(values);
  if (!payload.name) {
    throw new Error('Menu item name is required.');
  }

  validateImageFile(imageFile);

  const docRef = await addDoc(collection(db, MENU_COLLECTION), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  if (imageFile) {
    const imageUrl = await uploadMenuItemImage(docRef.id, imageFile);
    await updateDoc(docRef, {
      imageUrl,
      updatedAt: serverTimestamp(),
    });
  }

  return docRef.id;
}

export async function updateMenuItem(itemId, values, imageFile = null) {
  const payload = normalizeMenuPayload(values);
  if (!payload.name) {
    throw new Error('Menu item name is required.');
  }

  validateImageFile(imageFile);

  const itemRef = doc(db, MENU_COLLECTION, itemId);
  if (imageFile) {
    payload.imageUrl = await uploadMenuItemImage(itemId, imageFile);
    payload.imageKey = null;
  }

  await updateDoc(itemRef, payload);
}

export async function archiveMenuItem(itemId) {
  await updateDoc(doc(db, MENU_COLLECTION, itemId), {
    active: false,
    updatedAt: serverTimestamp(),
  });
}

export async function restoreMenuItem(itemId) {
  await updateDoc(doc(db, MENU_COLLECTION, itemId), {
    active: true,
    updatedAt: serverTimestamp(),
  });
}
