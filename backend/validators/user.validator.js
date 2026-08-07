// validators/user.validator.js
// Password and email changes now go through Firebase Authentication
// directly on the frontend, so this backend only ever validates `name`.

const { body } = require('express-validator');

const updateProfileValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters'),
];

module.exports = { updateProfileValidator };
