// models/user.model.js
//
// Data access layer for user PROFILES. Identity (email, password) now lives
// entirely in Firebase Authentication — this collection only stores the
// app-specific fields Firebase Auth doesn't know about (name, role),
// keyed by the Firebase uid so the two stay in sync by construction.

const { db } = require('../config/firebase');

const COLLECTION = 'users';

function docToUser(doc) {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function getAll() {
  const snapshot = await db.collection(COLLECTION).get();
  return snapshot.docs.map(docToUser);
}

async function findById(uid) {
  const doc = await db.collection(COLLECTION).doc(uid).get();
  return docToUser(doc);
}

/**
 * Creates (or overwrites) the profile document for a Firebase Auth user.
 * Called right after signup on the frontend, and defensively by the auth
 * middleware if a profile is ever missing.
 * @param {{ uid: string, name: string, email: string, role?: string }} userData
 */
async function create({ uid, name, email, role = 'user' }) {
  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(uid);

  const profile = {
    name,
    email: email.toLowerCase().trim(),
    role, // 'user' | 'admin'
    createdAt: now,
    updatedAt: now,
  };

  await docRef.set(profile, { merge: true });
  return { id: uid, ...profile };
}

/**
 * Updates an existing profile by uid with a partial patch object.
 * Returns the updated profile, or null if not found.
 */
async function updateById(uid, patch) {
  const docRef = db.collection(COLLECTION).doc(uid);
  const existing = await docRef.get();
  if (!existing.exists) return null;

  const updatedFields = { ...patch, updatedAt: new Date().toISOString() };
  await docRef.update(updatedFields);

  const updated = await docRef.get();
  return docToUser(updated);
}

/**
 * Kept for symmetry with the previous JWT-based version — there's no
 * password field to strip anymore, but this keeps controller code that
 * calls User.toPublicJSON(profile) working unchanged.
 */
function toPublicJSON(user) {
  if (!user) return null;
  return { ...user };
}

module.exports = {
  getAll,
  findById,
  create,
  updateById,
  toPublicJSON,
};
