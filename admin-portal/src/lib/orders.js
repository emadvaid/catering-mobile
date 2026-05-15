import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'completed',
  'cancelled',
  'archived',
];

export function listenToOrders({ onData, onError }) {
  const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      const orders = snapshot.docs.map((orderDoc) => ({
        id: orderDoc.id,
        ...orderDoc.data(),
      }));

      onData(orders);
    },
    onError
  );
}

export async function updateOrderStatus(orderId, status) {
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error('Invalid order status.');
  }

  await updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}
