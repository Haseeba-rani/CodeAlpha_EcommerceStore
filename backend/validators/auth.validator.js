// validators/auth.validator.js
// express-validator rule chain for the profile-sync endpoint. Identity
// (email/password) validation is now entirely Firebase Auth's job on the
// frontend — this backend only ever validates the small profile payload.

const { body } = require('express-validator');

const syncProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters'),
];

module.exports = { syncProfileValidator };
