// routes/order.routes.js
const express = require('express');
const router = express.Router();

const { createOrder, getMyOrders, getOrderById } = require('../controllers/order.controller');
const { createOrderValidator, orderIdParamValidator } = require('../validators/order.validator');
const validate = require('../middlewares/validate.middleware');
const verifyFirebaseAuth = require('../middlewares/auth.middleware');

// All order routes require authentication.
router.use(verifyFirebaseAuth);

router.post('/', createOrderValidator, validate, createOrder);
router.get('/my', getMyOrders);
router.get('/:id', orderIdParamValidator, validate, getOrderById);

module.exports = router;
