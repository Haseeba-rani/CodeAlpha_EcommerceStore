// middlewares/auth.middleware.js
// Verifies a Firebase Authentication ID token and attaches the
// authenticated user's { id, role, email, name } to req.user.
//
// The frontend signs in directly against Firebase Auth (client SDK) and
// sends the resulting ID token on every request as:
//   Authorization: Bearer <idToken>
// This middleware verifies that token server-side via the Firebase Admin
// SDK, then looks up (or lazily creates) the matching profile document in
// Firestore — Firebase Auth itself doesn't store app-specific fields like
// "role", so those live in our own `users` collection, keyed by the
// Firebase uid.

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { admin } = require('../config/firebase');
const User = require('../models/user.model');

const verifyFirebaseAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const idToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!idToken) {
    throw ApiError.unauthorized('Authentication required. Please log in.');
  }

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired session. Please log in again.');
  }

  // Look up our app-specific profile (role, etc.) for this Firebase user.
  let profile = await User.findById(decoded.uid);

  // Defensive fallback: if a Firebase Auth user somehow has no profile doc
  // yet (e.g. created directly in the Firebase console, or the frontend's
  // post-signup sync call was interrupted), create a sensible default one
  // now rather than failing the request.
  if (!profile) {
    profile = await User.create({
      uid: decoded.uid,
      name: decoded.name || decoded.email?.split('@')[0] || 'User',
      email: decoded.email || '',
      role: 'user',
    });
  }

  req.user = { id: decoded.uid, role: profile.role, email: profile.email, name: profile.name };
  next();
});

module.exports = verifyFirebaseAuth;
