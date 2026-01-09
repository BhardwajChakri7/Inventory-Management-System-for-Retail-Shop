const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    sendLowStockAlerts,
    searchProducts
} = require('../controllers/productController');
const { validateProduct } = require('../middleware/validation');

// GET /api/products - Get all products
router.get('/', getAllProducts);

// GET /api/products/search - Search products
router.get('/search', searchProducts);

// GET /api/products/low-stock - Get low stock products
router.get('/low-stock', getLowStockProducts);

// POST /api/products/low-stock/alerts - Send low stock alerts
router.post('/low-stock/alerts', sendLowStockAlerts);

// GET /api/products/:id - Get product by ID
router.get('/:id', getProductById);

// POST /api/products - Create new product
router.post('/', validateProduct, createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', validateProduct, updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', deleteProduct);

module.exports = router;