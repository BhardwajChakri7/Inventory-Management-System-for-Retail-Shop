const express = require('express');
const router = express.Router();
const {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers
} = require('../controllers/supplierController');
const { validateSupplier } = require('../middleware/validation');

// GET /api/suppliers - Get all suppliers
router.get('/', getAllSuppliers);

// GET /api/suppliers/search - Search suppliers
router.get('/search', searchSuppliers);

// GET /api/suppliers/:id - Get supplier by ID
router.get('/:id', getSupplierById);

// POST /api/suppliers - Create new supplier
router.post('/', validateSupplier, createSupplier);

// PUT /api/suppliers/:id - Update supplier
router.put('/:id', validateSupplier, updateSupplier);

// DELETE /api/suppliers/:id - Delete supplier
router.delete('/:id', deleteSupplier);

module.exports = router;