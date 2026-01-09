const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const { sendLowStockAlert } = require('../utils/emailService');
const { validationResult } = require('express-validator');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Create new product
const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
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
        const product = await Product.update(id, req.body);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.delete(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product deleted successfully',
            data: product
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// Get low stock products
const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.getLowStockProducts();
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching low stock products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching low stock products',
            error: error.message
        });
    }
};

// Send low stock alerts
const sendLowStockAlerts = async (req, res) => {
    try {
        const lowStockProducts = await Product.getLowStockProducts();
        const results = [];
        
        for (const product of lowStockProducts) {
            const supplier = product.supplier_id ? {
                name: product.supplier_name,
                phone: product.supplier_phone,
                email: product.supplier_email,
                address: product.supplier_address
            } : null;
            
            const emailResult = await sendLowStockAlert(product, supplier);
            results.push({
                product: product.name,
                emailSent: emailResult.success,
                error: emailResult.error || null
            });
        }
        
        res.json({
            success: true,
            message: `Processed ${lowStockProducts.length} low stock products`,
            data: results
        });
    } catch (error) {
        console.error('Error sending low stock alerts:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending low stock alerts',
            error: error.message
        });
    }
};

// Search products
const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }
        
        const products = await Product.search(q);
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching products',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    sendLowStockAlerts,
    searchProducts
};