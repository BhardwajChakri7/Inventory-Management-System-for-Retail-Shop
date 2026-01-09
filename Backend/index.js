const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const productRoutes = require('./routes/products');
const supplierRoutes = require('./routes/suppliers');
const saleRoutes = require('./routes/sales');
const reportRoutes = require('./routes/reports');

// Import utilities
const { testEmailConfig } = require('./utils/emailService');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Inventory Management System API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Test email configuration endpoint
app.get('/api/test-email', async (req, res) => {
    try {
        const isValid = await testEmailConfig();
        res.json({
            success: true,
            emailConfigValid: isValid,
            message: isValid ? 'Email configuration is valid' : 'Email configuration has issues'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error testing email configuration',
            error: error.message
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        path: req.originalUrl
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Inventory Management System API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📧 Email test: http://localhost:${PORT}/api/test-email`);
    
    // Test email configuration on startup
    testEmailConfig().then(isValid => {
        if (isValid) {
            console.log('✅ Email configuration is valid');
        } else {
            console.log('⚠️  Email configuration needs attention');
        }
    });
});

module.exports = app;