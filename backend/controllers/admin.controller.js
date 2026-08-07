// controllers/admin.controller.js
// Admin-only operations: view all users, view all orders, update order
// status, and a basic dashboard stats summary. All routes here are already
// protected by verifyJWT + requireAdmin in the router.

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/user.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');

// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = (await User.getAll()).map(User.toPublicJSON);
  return new ApiResponse(200, users, 'Users fetched successfully.').send(res);
});

// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = (await Order.getAll()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return new ApiResponse(200, orders, 'Orders fetched successfully.').send(res);
});

// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const updatedOrder = await Order.updateStatus(req.params.id, status);
  if (!updatedOrder) {
    throw ApiError.notFound('Order not found.');
  }

  return new ApiResponse(200, updatedOrder, 'Order status updated successfully.').send(res);
});

// @route   GET /api/admin/stats
// @access  Private/Admin
// Basic dashboard summary: totals for users, products, orders, and revenue.
const getDashboardStats = asyncHandler(async (req, res) => {
  const users = await User.getAll();
  const products = await Product.getAll();
  const orders = await Order.getAll();

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const ordersByStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    ordersByStatus,
    lowStockProducts: products.filter((p) => p.stockQuantity <= 5).length,
  };

  return new ApiResponse(200, stats, 'Dashboard stats fetched successfully.').send(res);
});

module.exports = { getAllUsers, getAllOrders, updateOrderStatus, getDashboardStats };
