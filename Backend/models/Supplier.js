const pool = require('../config/database');

class Supplier {
    // Get all suppliers
    static async getAll() {
        const query = 'SELECT * FROM suppliers ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }

    // Get supplier by ID
    static async getById(id) {
        const query = 'SELECT * FROM suppliers WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // Create new supplier
    static async create(supplierData) {
        const { name, phone, email, address } = supplierData;
        const query = `
            INSERT INTO suppliers (name, phone, email, address)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [name, phone, email, address];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Update supplier
    static async update(id, supplierData) {
        const { name, phone, email, address } = supplierData;
        const query = `
            UPDATE suppliers 
            SET name = $1, phone = $2, email = $3, address = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `;
        const values = [name, phone, email, address, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Delete supplier
    static async delete(id) {
        const query = 'DELETE FROM suppliers WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // Get supplier with products count
    static async getWithProductsCount() {
        const query = `
            SELECT s.*, COUNT(p.id) as products_count
            FROM suppliers s
            LEFT JOIN products p ON s.id = p.supplier_id
            GROUP BY s.id
            ORDER BY s.created_at DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    // Search suppliers
    static async search(searchTerm) {
        const query = `
            SELECT * FROM suppliers
            WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
            ORDER BY name
        `;
        const result = await pool.query(query, [`%${searchTerm}%`]);
        return result.rows;
    }
}

module.exports = Supplier;