// routes/product.routes.js
const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const {
  createProductValidator,
  updateProductValidator,
  productIdParamValidator,
} = require('../validators/product.validator');

const validate = require('../middlewares/validate.middleware');
const verifyFirebaseAuth = require('../middlewares/auth.middleware');
const requireAdmin = require('../middlewares/admin.middleware');

// Public routes — anyone can browse products.
router.get('/', getAllProducts);
router.get('/:id', productIdParamValidator, validate, getProductById);

// Admin-only routes — manage the product catalog.
router.post('/', verifyFirebaseAuth, requireAdmin, createProductValidator, validate, createProduct);
router.put('/:id', verifyFirebaseAuth, requireAdmin, updateProductValidator, validate, updateProduct);
router.delete('/:id', verifyFirebaseAuth, requireAdmin, productIdParamValidator, validate, deleteProduct);

module.exports = router;
