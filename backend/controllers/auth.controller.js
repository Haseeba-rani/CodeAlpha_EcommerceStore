// controllers/auth.controller.js
//
// With Firebase Authentication, sign-up/sign-in/sign-out/token-refresh all
// happen directly between the frontend and Firebase — this backend never
// sees a password and never issues its own tokens. The one thing the
// backend still needs to do is create the Firestore profile document (name,
// role) right after a successful signup, since Firebase Auth itself has no
// concept of "role". That's this single endpoint.

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/user.model');

// @route   POST /api/auth/sync
// @access  Private (requires a valid Firebase ID token)
// Body: { name }
const syncProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const existing = await User.findById(req.user.id);

  const profile = existing
    ? await User.updateById(req.user.id, { name: name || existing.name })
    : await User.create({ uid: req.user.id, name: name || req.user.email, email: req.user.email });

  return new ApiResponse(200, profile, 'Profile synced successfully.').send(res);
});

module.exports = { syncProfile };
