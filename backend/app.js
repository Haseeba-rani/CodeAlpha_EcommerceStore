// app.js
// Configures the Express application: security middleware, logging, body
// parsing, CORS, route mounting, and centralized error handling.
// Kept separate from server.js so the app can be imported in tests without
// actually binding to a port.

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const env = require('./config/env');
const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/error.middleware');

// Route modules
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// --- Security & core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
  })
);
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Hapyshop API is running.' });
});

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// --- 404 + centralized error handling (must be registered last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
