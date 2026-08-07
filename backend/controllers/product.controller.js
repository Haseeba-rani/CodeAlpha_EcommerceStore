// controllers/product.controller.js
// Public product browsing (list with filters/pagination, single product) and
// admin-only product management (create, update, delete).

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Product = require('../models/product.model');

// @route   GET /api/products
// @access  Public
// Query params: category, search, minPrice, maxPrice, sort, page, limit
const getAllProducts = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, sort, page, limit } = req.query;

  const result = await Product.findAll({
    category,
    search,
    minPrice,
    maxPrice,
    sort,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 12,
  });

  return new ApiResponse(200, result, 'Products fetched successfully.').send(res);
});

// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw ApiError.notFound('Product not found.');
  }

  return new ApiResponse(200, product, 'Product fetched successfully.').send(res);
});

// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  return new ApiResponse(201, product, 'Product created successfully.').send(res);
});

// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const updated = await Product.updateById(req.params.id, req.body);

  if (!updated) {
    throw ApiError.notFound('Product not found.');
  }

  return new ApiResponse(200, updated, 'Product updated successfully.').send(res);
});

// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const deleted = await Product.deleteById(req.params.id);

  if (!deleted) {
    throw ApiError.notFound('Product not found.');
  }

  return new ApiResponse(200, null, 'Product deleted successfully.').send(res);
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
