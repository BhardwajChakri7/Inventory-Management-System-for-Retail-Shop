const pool = require('../config/database');

const initializeDatabase = async () => {
    try {
        console.log('🚀 Starting database initialization...');

        // Drop existing tables if they exist (for clean setup)
        console.log('📋 Dropping existing tables...');
        await pool.query('DROP TABLE IF EXISTS sales CASCADE');
        await pool.query('DROP TABLE IF EXISTS products CASCADE');
        await pool.query('DROP TABLE IF EXISTS suppliers CASCADE');

        // Create suppliers table
        console.log('📦 Creating suppliers table...');
        await pool.query(`
            CREATE TABLE suppliers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                email VARCHAR(255),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create products table
        console.log('📦 Creating products table...');
        await pool.query(`
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
            )
        `);

        // Create sales table
        console.log('📦 Creating sales table...');
        await pool.query(`
            CREATE TABLE sales (
                id SERIAL PRIMARY KEY,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                quantity_sold INTEGER NOT NULL,
                sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                total_amount DECIMAL(10,2) NOT NULL,
                profit DECIMAL(10,2) NOT NULL
            )
        `);

        // Create indexes for better performance
        console.log('📦 Creating indexes...');
        await pool.query('CREATE INDEX idx_products_supplier ON products(supplier_id)');
        await pool.query('CREATE INDEX idx_sales_product ON sales(product_id)');
        await pool.query('CREATE INDEX idx_sales_date ON sales(sale_date)');
        await pool.query('CREATE INDEX idx_products_stock ON products(stock_quantity)');

        // Insert sample suppliers
        console.log('📋 Inserting sample suppliers...');
        const suppliersResult = await pool.query(`
            INSERT INTO suppliers (name, phone, email, address) VALUES
            ('ABC Electronics Suppliers', '+1-555-0101', 'contact@abcelectronics.com', '123 Tech Street, Silicon Valley, CA 94000'),
            ('XYZ Furniture Distributors', '+1-555-0202', 'info@xyzfurniture.com', '456 Oak Avenue, Furniture District, NY 10001'),
            ('Global Tech Traders', '+1-555-0303', 'sales@globaltechtraders.com', '789 Pine Road, Tech Hub, TX 75001'),
            ('Premium Office Solutions', '+1-555-0404', 'orders@premiumoffice.com', '321 Business Blvd, Corporate Center, FL 33101'),
            ('Smart Home Distributors', '+1-555-0505', 'support@smarthome.com', '654 Innovation Drive, Smart City, WA 98001')
            RETURNING id
        `);

        // Insert sample products
        console.log('📋 Inserting sample products...');
        await pool.query(`
            INSERT INTO products (name, category, purchase_price, selling_price, stock_quantity, min_stock, supplier_id) VALUES
            ('Dell Inspiron 15 Laptop', 'Electronics', 650.00, 999.99, 25, 5, 1),
            ('iPhone 15 Pro', 'Electronics', 850.00, 1199.99, 12, 3, 1),
            ('Samsung 4K Smart TV 55"', 'Electronics', 400.00, 699.99, 8, 2, 3),
            ('MacBook Air M2', 'Electronics', 950.00, 1399.99, 6, 2, 1),
            ('Sony WH-1000XM5 Headphones', 'Electronics', 280.00, 399.99, 15, 5, 3),
            
            ('Executive Office Chair', 'Furniture', 120.00, 249.99, 18, 4, 2),
            ('Standing Desk Adjustable', 'Furniture', 200.00, 399.99, 10, 3, 2),
            ('Conference Table 8-Seater', 'Furniture', 350.00, 699.99, 5, 1, 2),
            ('Ergonomic Desk Chair', 'Furniture', 80.00, 159.99, 22, 6, 4),
            ('Office Bookshelf', 'Furniture', 60.00, 129.99, 12, 3, 2),
            
            ('Wireless Mouse Logitech', 'Accessories', 15.00, 29.99, 45, 10, 1),
            ('Mechanical Keyboard RGB', 'Accessories', 45.00, 89.99, 20, 5, 3),
            ('USB-C Hub 7-in-1', 'Accessories', 25.00, 49.99, 30, 8, 3),
            ('Desk Lamp LED', 'Accessories', 20.00, 39.99, 35, 8, 4),
            ('Webcam 1080p HD', 'Accessories', 35.00, 69.99, 18, 5, 1),
            
            ('Smart Thermostat', 'Smart Home', 120.00, 199.99, 14, 4, 5),
            ('Smart Door Lock', 'Smart Home', 80.00, 149.99, 9, 2, 5),
            ('Security Camera Set', 'Smart Home', 150.00, 299.99, 7, 2, 5),
            ('Smart Light Bulbs 4-Pack', 'Smart Home', 25.00, 49.99, 28, 8, 5),
            ('Voice Assistant Speaker', 'Smart Home', 60.00, 99.99, 16, 4, 5)
        `);

        // Insert sample sales data
        console.log('📋 Inserting sample sales data...');
        await pool.query(`
            INSERT INTO sales (product_id, quantity_sold, total_amount, profit, sale_date) VALUES
            (1, 2, 1999.98, 699.98, NOW() - INTERVAL '5 days'),
            (11, 5, 149.95, 74.95, NOW() - INTERVAL '4 days'),
            (6, 1, 249.99, 129.99, NOW() - INTERVAL '3 days'),
            (2, 1, 1199.99, 349.99, NOW() - INTERVAL '2 days'),
            (14, 3, 119.97, 59.97, NOW() - INTERVAL '1 day'),
            (19, 2, 99.98, 49.98, NOW() - INTERVAL '6 hours'),
            (12, 1, 89.99, 44.99, NOW() - INTERVAL '3 hours'),
            (16, 1, 199.99, 79.99, NOW() - INTERVAL '1 hour')
        `);

        // Update stock quantities after sales
        console.log('📋 Updating stock quantities after sales...');
        await pool.query('UPDATE products SET stock_quantity = stock_quantity - 2 WHERE id = 1');
        await pool.query('UPDATE products SET stock_quantity = stock_quantity - 5 WHERE id = 11');
        await pool.query('UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = 6');
        await pool.query('UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = 2');
        await pool.query('UPDATE products SET stock_quantity = stock_quantity - 3 WHERE id = 14');
        await pool.query('UPDATE products SET stock_quantity = stock_quantity - 2 WHERE id = 19');
        await pool.query('UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = 12');
        await pool.query('UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = 16');

        // Create some low stock items for testing alerts
        console.log('📋 Creating low stock scenarios for testing...');
        await pool.query('UPDATE products SET stock_quantity = 1 WHERE id = 8'); // Conference Table (min: 1)
        await pool.query('UPDATE products SET stock_quantity = 2 WHERE id = 17'); // Smart Door Lock (min: 2)
        await pool.query('UPDATE products SET stock_quantity = 1 WHERE id = 18'); // Security Camera (min: 2)

        console.log('✅ Database initialization completed successfully!');
        console.log('📊 Summary:');
        
        const supplierCount = await pool.query('SELECT COUNT(*) FROM suppliers');
        const productCount = await pool.query('SELECT COUNT(*) FROM products');
        const salesCount = await pool.query('SELECT COUNT(*) FROM sales');
        const lowStockCount = await pool.query('SELECT COUNT(*) FROM products WHERE stock_quantity <= min_stock');
        
        console.log(`   - Suppliers: ${supplierCount.rows[0].count}`);
        console.log(`   - Products: ${productCount.rows[0].count}`);
        console.log(`   - Sales Records: ${salesCount.rows[0].count}`);
        console.log(`   - Low Stock Items: ${lowStockCount.rows[0].count}`);
        
        console.log('\n🎉 Your inventory system is ready to use!');
        console.log('🌐 Frontend: http://localhost:5173');
        console.log('🔧 Backend API: http://localhost:5000');
        
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    }
};

// Run initialization if this file is executed directly
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('Database initialization completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Database initialization failed:', error);
            process.exit(1);
        });
}

module.exports = { initializeDatabase };