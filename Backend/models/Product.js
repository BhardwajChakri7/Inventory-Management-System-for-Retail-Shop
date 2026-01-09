const pool = require('../config/database');

class Product {
    // Get all products with supplier information
    static async getAll() {
        const query = `
            SELECT p.*, s.name as supplier_name, s.phone as supplier_phone, s.email as supplier_email
            FROM products p
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            ORDER BY p.created_at DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    // Get product by ID
    static async getById(id) {
        const query = `
            SELECT p.*, s.name as supplier_name, s.phone as supplier_phone, s.email as supplier_email
            FROM products p
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // Create new product
    static async create(productData) {
        const { name, category, purchase_price, selling_price, stock_quantity, min_stock, supplier_id } = productData;
        const query = `
            INSERT INTO products (name, category, purchase_price, selling_price, stock_quantity, min_stock, supplier_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const values = [name, category, purchase_price, selling_price, stock_quantity, min_stock, supplier_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Update product
    static async update(id, productData) {
        const { name, category, purchase_price, selling_price, stock_quantity, min_stock, supplier_id } = productData;
        const query = `
            UPDATE products 
            SET name = $1, category = $2, purchase_price = $3, selling_price = $4, 
                stock_quantity = $5, min_stock = $6, supplier_id = $7, updated_at = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING *
        `;
        const values = [name, category, purchase_price, selling_price, stock_quantity, min_stock, supplier_id, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Delete product
    static async delete(id) {
        const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // Update stock quantity
    static async updateStock(id, newQuantity) {
        const query = `
            UPDATE products 
            SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [newQuantity, id]);
        return result.rows[0];
    }

    // Get low stock products
    static async getLowStockProducts() {
        const query = `
            SELECT p.*, s.name as supplier_name, s.phone as supplier_phone, 
                   s.email as supplier_email, s.address as supplier_address
            FROM products p
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.stock_quantity <= p.min_stock
            ORDER BY p.stock_quantity ASC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    // Search products
    static async search(searchTerm) {
        const query = `
            SELECT p.*, s.name as supplier_name
            FROM products p
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.name ILIKE $1 OR p.category ILIKE $1
            ORDER BY p.name
        `;
        const result = await pool.query(query, [`%${searchTerm}%`]);
        return result.rows;
    }
}

module.exports = Product;