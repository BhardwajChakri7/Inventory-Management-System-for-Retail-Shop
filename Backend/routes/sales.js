const express = require('express');
const router = express.Router();
const {
    getAllSales,
    getSaleById,
    createSale,
    deleteSale,
    getSalesByDateRange,
    getTopSellingProducts
} = require('../controllers/saleController');
const { validateSale } = require('../middleware/validation');

// GET /api/sales - Get all sales
router.get('/', getAllSales);

// GET /api/sales/date-range - Get sales by date range
router.get('/date-range', getSalesByDateRange);

// GET /api/sales/top-products - Get top selling products
router.get('/top-products', getTopSellingProducts);

// GET /api/sales/:id - Get sale by ID
router.get('/:id', getSaleById);

// POST /api/sales - Create new sale
router.post('/', validateSale, createSale);

// DELETE /api/sales/:id - Delete sale
router.delete('/:id', deleteSale);

module.exports = router;