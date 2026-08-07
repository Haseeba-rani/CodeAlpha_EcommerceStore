// routes/admin.routes.js
const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} = require('../controllers/admin.controller');

const { updateOrderStatusValidator } = require('../validators/order.validator');
const validate = require('../middlewares/validate.middleware');
const verifyFirebaseAuth = require('../middlewares/auth.middleware');
const requireAdmin = require('../middlewares/admin.middleware');

// All admin routes require authentication AND the 'admin' role.
router.use(verifyFirebaseAuth, requireAdmin);

router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatusValidator, validate, updateOrderStatus);
router.get('/stats', getDashboardStats);

module.exports = router;
