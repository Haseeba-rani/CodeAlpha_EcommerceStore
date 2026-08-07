// validators/product.validator.js
// express-validator rule chains for admin product management routes.

const { body, param } = require('express-validator');

const createProductValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('image').trim().notEmpty().withMessage('Image URL is required'),
  body('description').optional().isString(),
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  body('variants').optional().isArray().withMessage('Variants must be an array'),
  body('specs').optional().isArray().withMessage('Specs must be an array'),
];

const updateProductValidator = [
  param('id').notEmpty().withMessage('Product id is required'),
  body('price')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  body('variants').optional().isArray().withMessage('Variants must be an array'),
  body('specs').optional().isArray().withMessage('Specs must be an array'),
];

const productIdParamValidator = [
  param('id').notEmpty().withMessage('Product id is required'),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  productIdParamValidator,
};
