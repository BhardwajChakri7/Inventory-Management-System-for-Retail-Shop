-- Inventory Management System Database Schema

-- Create suppliers table
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    purchase_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sales table
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity_sold INTEGER NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_sales_product ON sales(product_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_products_stock ON products(stock_quantity);

-- Insert sample data
INSERT INTO suppliers (name, phone, email, address) VALUES
('ABC Suppliers', '+1234567890', 'contact@abcsuppliers.com', '123 Main St, City, State'),
('XYZ Distributors', '+0987654321', 'info@xyzdist.com', '456 Oak Ave, City, State'),
('Global Traders', '+1122334455', 'sales@globaltraders.com', '789 Pine Rd, City, State');

INSERT INTO products (name, category, purchase_price, selling_price, stock_quantity, min_stock, supplier_id) VALUES
('Laptop Dell Inspiron', 'Electronics', 800.00, 1200.00, 15, 5, 1),
('iPhone 15', 'Electronics', 900.00, 1300.00, 8, 3, 2),
('Office Chair', 'Furniture', 150.00, 250.00, 20, 5, 3),
('Wireless Mouse', 'Electronics', 25.00, 45.00, 50, 10, 1),
('Desk Lamp', 'Furniture', 30.00, 55.00, 12, 5, 3);