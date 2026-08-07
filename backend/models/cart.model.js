// models/cart.model.js
//
// Data access layer for shopping carts, backed by Firestore. Each user has
// exactly one cart document, keyed by their userId:
//   carts/{userId} -> { items: [...], updatedAt }
// Mutations run inside a Firestore transaction so two near-simultaneous
// requests from the same user (e.g. a double-click) can't clobber each other.

const { db } = require('../config/firebase');
const Product = require('./product.model');

const COLLECTION = 'carts';

function getEmptyCart() {
  return { items: [], updatedAt: new Date().toISOString() };
}

/**
 * Returns the cart for a given user, creating an empty one (in-memory only,
 * not yet persisted) if none exists yet.
 */
async function findByUserId(userId) {
  const doc = await db.collection(COLLECTION).doc(userId).get();
  return doc.exists ? doc.data() : getEmptyCart();
}

/**
 * Adds a product to the user's cart, or increments quantity if it's already there.
 * Snapshots title/price/image at add-time so the cart still displays correctly
 * even if the product is later edited or removed by an admin.
 */
async function addItem(userId, productId, quantity = 1) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const docRef = db.collection(COLLECTION).doc(userId);

  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    const cart = doc.exists ? doc.data() : getEmptyCart();

    const existingItem = cart.items.find((item) => item.productId === String(productId));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: String(productId),
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
      });
    }

    cart.updatedAt = new Date().toISOString();
    transaction.set(docRef, cart);
    return cart;
  });
}

/**
 * Sets an exact quantity for a cart item. Removes the item if quantity <= 0.
 */
async function updateItemQuantity(userId, productId, quantity) {
  const docRef = db.collection(COLLECTION).doc(userId);

  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    const cart = doc.exists ? doc.data() : getEmptyCart();

    const itemIndex = cart.items.findIndex((item) => item.productId === String(productId));
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = new Date().toISOString();
    transaction.set(docRef, cart);
    return cart;
  });
}

async function removeItem(userId, productId) {
  const docRef = db.collection(COLLECTION).doc(userId);

  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    const cart = doc.exists ? doc.data() : getEmptyCart();

    cart.items = cart.items.filter((item) => item.productId !== String(productId));
    cart.updatedAt = new Date().toISOString();

    transaction.set(docRef, cart);
    return cart;
  });
}

async function clearCart(userId) {
  const docRef = db.collection(COLLECTION).doc(userId);
  const emptyCart = getEmptyCart();
  await docRef.set(emptyCart);
  return emptyCart;
}

module.exports = {
  findByUserId,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
};
