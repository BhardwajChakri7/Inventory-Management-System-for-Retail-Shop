const Supplier = require('../models/Supplier');
const { validationResult } = require('express-validator');

// Get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.getWithProductsCount();
        res.json({
            success: true,
            data: suppliers
        });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching suppliers',
            error: error.message
        });
    }
};

// Get supplier by ID
const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.getById(id);
        
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }
        
        res.json({
            success: true,
            data: supplier
        });
    } catch (error) {
        console.error('Error fetching supplier:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching supplier',
            error: error.message
        });
    }
};

// Create new supplier
const createSupplier = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const supplier = await Supplier.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Supplier created successfully',
            data: supplier
        });
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating supplier',
            error: error.message
        });
    }
};

// Update supplier
const updateSupplier = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const supplier = await Supplier.update(id, req.body);
        
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Supplier updated successfully',
            data: supplier
        });
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating supplier',
            error: error.message
        });
    }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.delete(id);
        
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Supplier deleted successfully',
            data: supplier
        });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting supplier',
            error: error.message
        });
    }
};

// Search suppliers
const searchSuppliers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }
        
        const suppliers = await Supplier.search(q);
        res.json({
            success: true,
            data: suppliers
        });
    } catch (error) {
        console.error('Error searching suppliers:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching suppliers',
            error: error.message
        });
    }
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers
};