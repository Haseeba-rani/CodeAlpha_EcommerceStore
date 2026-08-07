// validators/cart.validator.js
// express-validator rule chains for cart routes.

const { body, param } = require('express-validator');

const addCartItemValidator = [
  body('productId').notEmpty().withMessage('productId is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

const updateCartItemValidator = [
  param('productId').notEmpty().withMessage('productId is required'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 0 }).withMessage('Quantity must be zero or a positive integer'),
];

const cartItemParamValidator = [
  param('productId').notEmpty().withMessage('productId is required'),
];

module.exports = {
  addCartItemValidator,
  updateCartItemValidator,
  cartItemParamValidator,
};
