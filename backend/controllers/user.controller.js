// controllers/user.controller.js
//
// Handles the logged-in user's own profile. Email and password are now
// owned entirely by Firebase Authentication (changed via the Firebase
// client SDK on the frontend), so this only covers the app-specific
// profile fields (currently just `name`) that live in Firestore.

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/user.model');

// @route   GET /api/users/me
// @access  Private
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw ApiError.notFound('User profile not found.');
  }

  return new ApiResponse(200, User.toPublicJSON(user), 'Profile fetched successfully.').send(res);
});

// @route   PUT /api/users/me
// @access  Private
// Body: { name } — email changes must go through Firebase Auth on the frontend.
const updateMyProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const updatedUser = await User.updateById(req.user.id, { name });
  if (!updatedUser) {
    throw ApiError.notFound('User profile not found.');
  }

  return new ApiResponse(200, User.toPublicJSON(updatedUser), 'Profile updated successfully.').send(res);
});

module.exports = { getMyProfile, updateMyProfile };
