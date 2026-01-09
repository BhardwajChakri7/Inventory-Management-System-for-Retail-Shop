const Sale = require('../models/Sale');
const Product = require('../models/Product');
const { sendLowStockAlert } = require('../utils/emailService');
const { validationResult } = require('express-validator');

// Get all sales
const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.getAll();
        res.json({
            success: true,
            data: sales
        });
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sales',
            error: error.message
        });
    }
};

// Get sale by ID
const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await Sale.getById(id);
        
        if (!sale) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found'
            });
        }
        
        res.json({
            success: true,
            data: sale
        });
    } catch (error) {
        console.error('Error fetching sale:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sale',
            error: error.message
        });
    }
};

// Create new sale
const createSale = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const sale = await Sale.create(req.body);
        
        // Check if product is now low stock and send alert
        const product = await Product.getById(req.body.product_id);
        if (product && product.stock_quantity <= product.min_stock) {
            // Get supplier info if available
            const supplier = product.supplier_id ? {
                name: product.supplier_name,
                phone: product.supplier_phone,
                email: product.supplier_email,
                address: product.supplier_address
            } : null;
            
            // Send low stock alert (don't wait for it)
            sendLowStockAlert(product, supplier).catch(error => {
                console.error('Failed to send low stock alert:', error);
            });
        }
        
        res.status(201).json({
            success: true,
            message: 'Sale recorded successfully',
            data: sale
        });
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating sale',
            error: error.message
        });
    }
};

// Delete sale
const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await Sale.delete(id);
        
        if (!sale) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Sale deleted successfully',
            data: sale
        });
    } catch (error) {
        console.error('Error deleting sale:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting sale',
            error: error.message
        });
    }
};

// Get sales by date range
const getSalesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }
        
        const sales = await Sale.getByDateRange(startDate, endDate);
        res.json({
            success: true,
            data: sales
        });
    } catch (error) {
        console.error('Error fetching sales by date range:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sales by date range',
            error: error.message
        });
    }
};

// Get top selling products
const getTopSellingProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const products = await Sale.getTopSellingProducts(parseInt(limit));
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching top selling products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching top selling products',
            error: error.message
        });
    }
};

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    deleteSale,
    getSalesByDateRange,
    getTopSellingProducts
};