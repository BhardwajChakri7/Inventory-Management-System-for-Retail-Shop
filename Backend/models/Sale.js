const pool = require('../config/database');

class Sale {
    // Get all sales with product information
    static async getAll() {
        const query = `
            SELECT s.*, p.name as product_name, p.category, p.selling_price
            FROM sales s
            JOIN products p ON s.product_id = p.id
            ORDER BY s.sale_date DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    // Get sale by ID
    static async getById(id) {
        const query = `
            SELECT s.*, p.name as product_name, p.category, p.selling_price
            FROM sales s
            JOIN products p ON s.product_id = p.id
            WHERE s.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // Create new sale
    static async create(saleData) {
        const { product_id, quantity_sold } = saleData;
        
        // Get product details for calculation
        const productQuery = 'SELECT * FROM products WHERE id = $1';
        const productResult = await pool.query(productQuery, [product_id]);
        const product = productResult.rows[0];
        
        if (!product) {
            throw new Error('Product not found');
        }
        
        if (product.stock_quantity < quantity_sold) {
            throw new Error('Insufficient stock');
        }
        
        const total_amount = product.selling_price * quantity_sold;
        const profit = (product.selling_price - product.purchase_price) * quantity_sold;
        
        // Create sale record
        const saleQuery = `
            INSERT INTO sales (product_id, quantity_sold, total_amount, profit)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const saleValues = [product_id, quantity_sold, total_amount, profit];
        const saleResult = await pool.query(saleQuery, saleValues);
        
        // Update product stock
        const newStock = product.stock_quantity - quantity_sold;
        const updateStockQuery = `
            UPDATE products 
            SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
        `;
        await pool.query(updateStockQuery, [newStock, product_id]);
        
        return saleResult.rows[0];
    }

    // Get sales by date range
    static async getByDateRange(startDate, endDate) {
        const query = `
            SELECT s.*, p.name as product_name, p.category
            FROM sales s
            JOIN products p ON s.product_id = p.id
            WHERE s.sale_date >= $1 AND s.sale_date <= $2
            ORDER BY s.sale_date DESC
        `;
        const result = await pool.query(query, [startDate, endDate]);
        return result.rows;
    }

    // Get daily profit report
    static async getDailyProfit(date) {
        const query = `
            SELECT 
                DATE(sale_date) as sale_date,
                COUNT(*) as total_sales,
                SUM(quantity_sold) as total_quantity,
                SUM(total_amount) as total_revenue,
                SUM(profit) as total_profit
            FROM sales
            WHERE DATE(sale_date) = $1
            GROUP BY DATE(sale_date)
        `;
        const result = await pool.query(query, [date]);
        return result.rows[0] || {
            sale_date: date,
            total_sales: 0,
            total_quantity: 0,
            total_revenue: 0,
            total_profit: 0
        };
    }

    // Get monthly profit report
    static async getMonthlyProfit(year, month) {
        const query = `
            SELECT 
                EXTRACT(YEAR FROM sale_date) as year,
                EXTRACT(MONTH FROM sale_date) as month,
                COUNT(*) as total_sales,
                SUM(quantity_sold) as total_quantity,
                SUM(total_amount) as total_revenue,
                SUM(profit) as total_profit
            FROM sales
            WHERE EXTRACT(YEAR FROM sale_date) = $1 
            AND EXTRACT(MONTH FROM sale_date) = $2
            GROUP BY EXTRACT(YEAR FROM sale_date), EXTRACT(MONTH FROM sale_date)
        `;
        const result = await pool.query(query, [year, month]);
        return result.rows[0] || {
            year: year,
            month: month,
            total_sales: 0,
            total_quantity: 0,
            total_revenue: 0,
            total_profit: 0
        };
    }

    // Get overall profit summary
    static async getOverallProfit() {
        const query = `
            SELECT 
                COUNT(*) as total_sales,
                SUM(quantity_sold) as total_quantity,
                SUM(total_amount) as total_revenue,
                SUM(profit) as total_profit,
                AVG(profit) as average_profit_per_sale
            FROM sales
        `;
        const result = await pool.query(query);
        return result.rows[0];
    }

    // Get top selling products
    static async getTopSellingProducts(limit = 10) {
        const query = `
            SELECT 
                p.id,
                p.name,
                p.category,
                SUM(s.quantity_sold) as total_sold,
                SUM(s.total_amount) as total_revenue,
                SUM(s.profit) as total_profit
            FROM sales s
            JOIN products p ON s.product_id = p.id
            GROUP BY p.id, p.name, p.category
            ORDER BY total_sold DESC
            LIMIT $1
        `;
        const result = await pool.query(query, [limit]);
        return result.rows;
    }

    // Delete sale (for admin purposes)
    static async delete(id) {
        // First get sale details to restore stock
        const saleQuery = 'SELECT * FROM sales WHERE id = $1';
        const saleResult = await pool.query(saleQuery, [id]);
        const sale = saleResult.rows[0];
        
        if (!sale) {
            throw new Error('Sale not found');
        }
        
        // Restore stock
        const updateStockQuery = `
            UPDATE products 
            SET stock_quantity = stock_quantity + $1
            WHERE id = $2
        `;
        await pool.query(updateStockQuery, [sale.quantity_sold, sale.product_id]);
        
        // Delete sale
        const deleteQuery = 'DELETE FROM sales WHERE id = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [id]);
        return result.rows[0];
    }
}

module.exports = Sale;