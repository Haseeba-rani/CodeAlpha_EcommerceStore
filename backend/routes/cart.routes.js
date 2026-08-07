// routes/cart.routes.js
const express = require('express');
const router = express.Router();

const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cart.controller');
const {
  addCartItemValidator,
  updateCartItemValidator,
  cartItemParamValidator,
} = require('../validators/cart.validator');
const validate = require('../middlewares/validate.middleware');
const verifyFirebaseAuth = require('../middlewares/auth.middleware');

// All cart routes require an authenticated user — carts are per-user.
router.use(verifyFirebaseAuth);

router.get('/', getCart);
router.post('/', addCartItemValidator, validate, addToCart);
router.put('/:productId', updateCartItemValidator, validate, updateCartItem);
router.delete('/:productId', cartItemParamValidator, validate, removeCartItem);
router.delete('/', clearCart);

module.exports = router;
