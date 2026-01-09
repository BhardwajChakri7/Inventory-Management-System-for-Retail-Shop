const { body } = require('express-validator');

// Product validation rules
const validateProduct = [
    body('name')
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Product name must be between 2 and 255 characters'),
    
    body('category')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Category must not exceed 100 characters'),
    
    body('purchase_price')
        .isFloat({ min: 0 })
        .withMessage('Purchase price must be a positive number'),
    
    body('selling_price')
        .isFloat({ min: 0 })
        .withMessage('Selling price must be a positive number')
        .custom((value, { req }) => {
            if (parseFloat(value) < parseFloat(req.body.purchase_price)) {
                throw new Error('Selling price should be greater than or equal to purchase price');
            }
            return true;
        }),
    
    body('stock_quantity')
        .isInt({ min: 0 })
        .withMessage('Stock quantity must be a non-negative integer'),
    
    body('min_stock')
        .isInt({ min: 0 })
        .withMessage('Minimum stock must be a non-negative integer'),
    
    body('supplier_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Supplier ID must be a positive integer')
];

// Supplier validation rules
const validateSupplier = [
    body('name')
        .notEmpty()
        .withMessage('Supplier name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Supplier name must be between 2 and 255 characters'),
    
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    
    body('address')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Address must not exceed 500 characters')
];

// Sale validation rules
const validateSale = [
    body('product_id')
        .isInt({ min: 1 })
        .withMessage('Product ID is required and must be a positive integer'),
    
    body('quantity_sold')
        .isInt({ min: 1 })
        .withMessage('Quantity sold must be a positive integer')
];

module.exports = {
    validateProduct,
    validateSupplier,
    validateSale
};