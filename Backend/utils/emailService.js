const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send low stock alert email
const sendLowStockAlert = async (product, supplier) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER, // Send to admin
            subject: `🚨 Low Stock Alert: ${product.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #e74c3c;">Low Stock Alert</h2>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #333;">Product Details:</h3>
                        <p><strong>Product Name:</strong> ${product.name}</p>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Current Stock:</strong> <span style="color: #e74c3c; font-weight: bold;">${product.stock_quantity}</span></p>
                        <p><strong>Minimum Threshold:</strong> ${product.min_stock}</p>
                    </div>
                    
                    ${supplier ? `
                    <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #333;">Supplier Information:</h3>
                        <p><strong>Supplier Name:</strong> ${supplier.name}</p>
                        <p><strong>Phone:</strong> ${supplier.phone}</p>
                        <p><strong>Email:</strong> ${supplier.email}</p>
                        <p><strong>Address:</strong> ${supplier.address}</p>
                    </div>
                    ` : ''}
                    
                    <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; color: #856404;">
                            <strong>Action Required:</strong> Please reorder this product to maintain adequate stock levels.
                        </p>
                    </div>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        This is an automated message from your Inventory Management System.
                    </p>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Low stock alert email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending low stock alert:', error);
        return { success: false, error: error.message };
    }
};

// Test email configuration
const testEmailConfig = async () => {
    try {
        await transporter.verify();
        console.log('Email configuration is valid');
        return true;
    } catch (error) {
        console.error('Email configuration error:', error);
        return false;
    }
};

module.exports = {
    sendLowStockAlert,
    testEmailConfig
};