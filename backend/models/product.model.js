// models/product.model.js
//
// Data access layer for Products, backed by Firestore. Same exported
// function names/signatures as the previous JSON-file version. The
// collection is small enough that filtering/search/sort/pagination are
// still done in-memory after a single collection fetch — this preserves
// the exact same filtering behavior (case-insensitive category/search)
// as before without needing composite Firestore indexes.

const { db } = require('../config/firebase');

const COLLECTION = 'products';

function docToProduct(doc) {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function getAll() {
  const snapshot = await db.collection(COLLECTION).get();
  return snapshot.docs.map(docToProduct);
}

async function findById(id) {
  const doc = await db.collection(COLLECTION).doc(String(id)).get();
  return docToProduct(doc);
}

/**
 * Returns products filtered by category/search term and paginated.
 * @param {{ category?: string, search?: string, minPrice?: number, maxPrice?: number, sort?: string, page?: number, limit?: number }} query
 */
async function findAll({ category, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = {}) {
  let products = await getAll();

  if (category && category.toLowerCase() !== 'all') {
    products = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const term = search.toLowerCase();
    products = products.filter((p) => p.title.toLowerCase().includes(term));
  }

  if (minPrice !== undefined) {
    products = products.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice !== undefined) {
    products = products.filter((p) => p.price <= Number(maxPrice));
  }

  switch (sort) {
    case 'price_asc':
      products = [...products].sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      products = [...products].sort((a, b) => b.price - a.price);
      break;
    case 'rating_desc':
      products = [...products].sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      products = [...products].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      break;
    default:
      break; // 'featured' / default — keep original order
  }

  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const currentPage = Math.min(Math.max(1, Number(page)), totalPages);
  const start = (currentPage - 1) * limit;
  const paginated = products.slice(start, start + Number(limit));

  return {
    items: paginated,
    pagination: {
      totalItems,
      totalPages,
      currentPage,
      limit: Number(limit),
    },
  };
}

async function create(productData) {
  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(); // auto-generated id

  const newProduct = {
    title: productData.title,
    category: productData.category,
    price: productData.price,
    originalPrice: productData.originalPrice ?? null,
    rating: productData.rating ?? 0,
    reviewsCount: productData.reviewsCount ?? 0,
    image: productData.image,
    variants: productData.variants ?? [{ filter: 'none', colorName: 'Default' }],
    badge: productData.badge ?? null,
    description: productData.description ?? '',
    specs: productData.specs ?? [],
    inStock: productData.inStock ?? true,
    stockQuantity: productData.stockQuantity ?? 0,
    createdAt: now,
    updatedAt: now,
  };

  await docRef.set(newProduct);
  return { id: docRef.id, ...newProduct };
}

async function updateById(id, patch) {
  const docRef = db.collection(COLLECTION).doc(String(id));
  const existing = await docRef.get();
  if (!existing.exists) return null;

  const updatedFields = { ...patch, updatedAt: new Date().toISOString() };
  await docRef.update(updatedFields);

  const updated = await docRef.get();
  return docToProduct(updated);
}

async function deleteById(id) {
  const docRef = db.collection(COLLECTION).doc(String(id));
  const existing = await docRef.get();
  if (!existing.exists) return false;

  await docRef.delete();
  return true;
}

/**
 * Decrements stock for a product after an order is placed. Uses a Firestore
 * transaction so concurrent orders can never oversell the same product.
 * Throws if insufficient stock is available.
 */
async function decrementStock(id, quantity) {
  const docRef = db.collection(COLLECTION).doc(String(id));

  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    if (!doc.exists) {
      throw new Error(`Product ${id} not found`);
    }

    const product = doc.data();
    if (product.stockQuantity < quantity) {
      throw new Error(`Insufficient stock for product "${product.title}"`);
    }

    const newStock = product.stockQuantity - quantity;
    const updatedFields = {
      stockQuantity: newStock,
      inStock: newStock > 0,
      updatedAt: new Date().toISOString(),
    };

    transaction.update(docRef, updatedFields);
    return { id: doc.id, ...product, ...updatedFields };
  });
}

module.exports = {
  getAll,
  findById,
  findAll,
  create,
  updateById,
  deleteById,
  decrementStock,
};
