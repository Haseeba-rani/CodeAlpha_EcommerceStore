// validators/order.validator.js
// express-validator rule chains for checkout/order routes. Field names
// mirror the frontend's checkout.html form exactly (Contact Information,
// Shipping Address, Payment Method sections).

const { body, param } = require('express-validator');

const createOrderValidator = [
  // Contact Information
  body('contact.firstName').trim().notEmpty().withMessage('First name is required'),
  body('contact.lastName').trim().notEmpty().withMessage('Last name is required'),
  body('contact.email').trim().isEmail().withMessage('A valid email is required'),
  body('contact.phone').trim().notEmpty().withMessage('Phone number is required'),

  // Shipping Address
  body('shippingAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State/Province is required'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),

  // Payment Method — matches the two radio options on the checkout page
  body('paymentMethod')
    .trim()
    .notEmpty().withMessage('Payment method is required')
    .isIn(['card', 'cod']).withMessage('Payment method must be either "card" or "cod"'),
];

const updateOrderStatusValidator = [
  param('id').notEmpty().withMessage('Order id is required'),
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
];

const orderIdParamValidator = [
  param('id').notEmpty().withMessage('Order id is required'),
];

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator,
  orderIdParamValidator,
};
