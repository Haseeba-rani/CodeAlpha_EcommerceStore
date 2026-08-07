// models/order.model.js
//
// Data access layer for Orders, backed by Firestore. Same exported function
// names/signatures as the previous JSON-file version.

const { db } = require('../config/firebase');

const COLLECTION = 'orders';
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function docToOrder(doc) {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function getAll() {
  const snapshot = await db.collection(COLLECTION).get();
  return snapshot.docs.map(docToOrder);
}

async function findById(id) {
  const doc = await db.collection(COLLECTION).doc(id).get();
  return docToOrder(doc);
}

async function findByUserId(userId) {
  const snapshot = await db.collection(COLLECTION).where('userId', '==', userId).get();
  return snapshot.docs
    .map(docToOrder)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Creates a new order from checkout data.
 * @param {{
 *   userId: string,
 *   items: Array<{ productId: string, title: string, price: number, image: string, quantity: number }>,
 *   contact: { firstName: string, lastName: string, email: string, phone: string },
 *   shippingAddress: { street: string, city: string, state: string, postalCode: string, country: string },
 *   paymentMethod: string,
 *   subtotal: number,
 *   shippingCost: number,
 *   tax: number,
 *   total: number
 * }} orderData
 */
async function create(orderData) {
  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(); // auto-generated id

  const newOrder = {
    userId: orderData.userId,
    items: orderData.items,
    contact: orderData.contact,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    subtotal: orderData.subtotal,
    shippingCost: orderData.shippingCost,
    tax: orderData.tax,
    total: orderData.total,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  await docRef.set(newOrder);
  return { id: docRef.id, ...newOrder };
}

async function updateStatus(id, status) {
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error(`Invalid order status: ${status}`);
  }

  const docRef = db.collection(COLLECTION).doc(id);
  const existing = await docRef.get();
  if (!existing.exists) return null;

  const updatedFields = { status, updatedAt: new Date().toISOString() };
  await docRef.update(updatedFields);

  const updated = await docRef.get();
  return docToOrder(updated);
}

module.exports = {
  getAll,
  findById,
  findByUserId,
  create,
  updateStatus,
  ORDER_STATUSES,
};
