// controllers/cart.controller.js
// Handles the logged-in user's shopping cart. All routes are private —
// carts belong to a specific authenticated user (req.user.id).

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Cart = require('../models/cart.model');

/**
 * Computes order-summary totals for a cart, matching the frontend's
 * cart.html / checkout.html math: subtotal, flat shipping, 10% tax, total.
 */
function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 10.0 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findByUserId(req.user.id);
  const totals = calculateTotals(cart.items);

  return new ApiResponse(200, { ...cart, ...totals }, 'Cart fetched successfully.').send(res);
});

// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  let cart;
  try {
    cart = await Cart.addItem(req.user.id, productId, Number(quantity));
  } catch (err) {
    throw ApiError.notFound(err.message);
  }
  const totals = calculateTotals(cart.items);

  return new ApiResponse(200, { ...cart, ...totals }, 'Item added to cart.').send(res);
});

// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  let cart;
  try {
    cart = await Cart.updateItemQuantity(req.user.id, productId, Number(quantity));
  } catch (err) {
    throw ApiError.notFound(err.message);
  }

  const totals = calculateTotals(cart.items);
  return new ApiResponse(200, { ...cart, ...totals }, 'Cart updated successfully.').send(res);
});

// @route   DELETE /api/cart/:productId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.removeItem(req.user.id, productId);
  const totals = calculateTotals(cart.items);

  return new ApiResponse(200, { ...cart, ...totals }, 'Item removed from cart.').send(res);
});

// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.clearCart(req.user.id);
  const totals = calculateTotals(cart.items);

  return new ApiResponse(200, { ...cart, ...totals }, 'Cart cleared successfully.').send(res);
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart, calculateTotals };
