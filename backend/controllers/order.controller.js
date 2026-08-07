// controllers/order.controller.js
// Handles checkout (order creation from the user's current cart), order
// history, and single order lookup. Placing an order snapshots cart items,
// decrements product stock, and clears the cart — all in one flow.

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { calculateTotals } = require('./cart.controller');

// @route   POST /api/orders
// @access  Private
// Body: { contact, shippingAddress, paymentMethod } — matches checkout.html form sections
const createOrder = asyncHandler(async (req, res) => {
  const { contact, shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findByUserId(req.user.id);
  if (!cart.items || cart.items.length === 0) {
    throw ApiError.badRequest('Your cart is empty. Add items before checking out.');
  }

  // Verify stock availability for every item before committing anything.
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw ApiError.badRequest(`Product "${item.title}" is no longer available.`);
    }
    if (product.stockQuantity < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for "${product.title}".`);
    }
  }

  const { subtotal, shipping, tax, total } = calculateTotals(cart.items);

  const order = await Order.create({
    userId: req.user.id,
    items: cart.items,
    contact,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingCost: shipping,
    tax,
    total,
  });

  // Decrement stock for each purchased item.
  for (const item of cart.items) {
    await Product.decrementStock(item.productId, item.quantity);
  }

  // Empty the cart now that the order has been placed.
  await Cart.clearCart(req.user.id);

  return new ApiResponse(201, order, 'Order placed successfully.').send(res);
});

// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findByUserId(req.user.id);
  return new ApiResponse(200, orders, 'Orders fetched successfully.').send(res);
});

// @route   GET /api/orders/:id
// @access  Private (owner or admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw ApiError.notFound('Order not found.');
  }

  const isOwner = order.userId === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw ApiError.forbidden('You do not have access to this order.');
  }

  return new ApiResponse(200, order, 'Order fetched successfully.').send(res);
});

module.exports = { createOrder, getMyOrders, getOrderById };
