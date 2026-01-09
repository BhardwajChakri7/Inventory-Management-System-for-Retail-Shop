# Inventory Management System for Retail Shop

A full-stack inventory management system built with React.js frontend and Node.js backend, featuring automatic low stock email alerts and comprehensive profit reporting.

## 🚀 Features

### Product Management
- ✅ Add, update, delete, and view products
- ✅ Track purchase price, selling price, and stock quantities
- ✅ Set minimum stock thresholds
- ✅ Link products to suppliers
- ✅ Search and filter products

### Supplier Management
- ✅ Manage supplier information (name, phone, email, address)
- ✅ Track products per supplier
- ✅ Search suppliers

### Sales Management
- ✅ Record sales transactions
- ✅ Automatic stock reduction
- ✅ Prevent overselling (insufficient stock validation)
- ✅ Calculate profit per sale
- ✅ Sales history tracking

### Low Stock Email Alerts
- ✅ Automatic email notifications when stock ≤ minimum threshold
- ✅ Email contains product details and supplier information
- ✅ Uses Nodemailer with SMTP configuration
- ✅ Manual alert sending option

### Profit Reports
- ✅ Daily profit reports
- ✅ Monthly profit reports
- ✅ Overall profit summary
- ✅ Top selling products analysis
- ✅ Dashboard with key metrics

## 🛠️ Tech Stack

### Frontend
- **React.js** (Functional Components + Hooks)
- **React Router** for navigation
- **Bootstrap 5** + React Bootstrap for UI
- **Axios** for API calls
- **Bootstrap Icons** for icons

### Backend
- **Node.js** with Express.js
- **PostgreSQL** (Neon DB compatible)
- **Nodemailer** for email services
- **Express Validator** for input validation
- **CORS** for cross-origin requests

### Database
- **PostgreSQL** with proper relationships
- **Indexes** for performance optimization
- **Sample data** included

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (Neon DB account recommended)
- Email account with SMTP access (Gmail recommended)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd inventory-management-system
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create `.env` file in Backend directory:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:5432/database_name

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

1. Create a PostgreSQL database (use Neon DB for cloud hosting)
2. Run the schema file to create tables:
```bash
# Connect to your database and run:
psql -d your_database_url -f database/schema.sql
```

### 4. Frontend Setup

```bash
cd "Frontend/Inventory Management System for Retail Shop"
npm install
```

### 5. Email Configuration (Gmail Example)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

## 🏃‍♂️ Running the Application

### Start Backend Server
```bash
cd Backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend Development Server
```bash
cd "Frontend/Inventory Management System for Retail Shop"
npm run dev
# Frontend runs on http://localhost:5173
```

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/low-stock` - Get low stock products
- `POST /api/products/low-stock/alerts` - Send low stock alerts

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Record new sale
- `DELETE /api/sales/:id` - Delete sale (restores stock)

### Reports
- `GET /api/reports/dashboard` - Dashboard data
- `GET /api/reports/daily?date=YYYY-MM-DD` - Daily profit
- `GET /api/reports/monthly?year=YYYY&month=MM` - Monthly profit
- `GET /api/reports/overall` - Overall profit summary

## 🗄️ Database Schema

### Products Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    purchase_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    supplier_id INTEGER REFERENCES suppliers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Suppliers Table
```sql
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sales Table
```sql
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    quantity_sold INTEGER NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) NOT NULL
);
```

## 📧 Email Alert System

The system automatically sends email alerts when:
- Product stock falls to or below minimum threshold
- A sale is recorded that triggers low stock condition

Email includes:
- Product name and current stock
- Supplier contact information
- Professional HTML formatting

## 📊 Sample API Requests

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Dell Inspiron",
    "category": "Electronics",
    "purchase_price": 800.00,
    "selling_price": 1200.00,
    "stock_quantity": 15,
    "min_stock": 5,
    "supplier_id": 1
  }'
```

### Record Sale
```bash
curl -X POST http://localhost:5000/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity_sold": 2
  }'
```

### Get Daily Report
```bash
curl "http://localhost:5000/api/reports/daily?date=2024-01-15"
```

## 🔧 Configuration Options

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `EMAIL_HOST`: SMTP server hostname
- `EMAIL_PORT`: SMTP server port (587 for TLS)
- `EMAIL_USER`: SMTP username
- `EMAIL_PASS`: SMTP password/app password
- `EMAIL_FROM`: From email address
- `PORT`: Backend server port (default: 5000)

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Ensure database exists and is accessible
   - Check firewall settings for Neon DB

2. **Email Not Sending**
   - Verify SMTP credentials
   - Use App Password for Gmail (not regular password)
   - Check EMAIL_HOST and EMAIL_PORT settings

3. **CORS Issues**
   - Backend includes CORS middleware
   - Ensure frontend runs on http://localhost:5173
   - Check API_BASE_URL in frontend

4. **Stock Validation Errors**
   - System prevents overselling
   - Check available stock before recording sales
   - Verify product exists and has sufficient stock

## 📝 Features Walkthrough

### Dashboard
- Real-time metrics display
- Low stock alerts with email sending
- Top selling products
- Quick overview of business performance

### Product Management
- Complete CRUD operations
- Stock status indicators (Good/Medium/Low Stock)
- Supplier linking
- Search and filtering

### Sales Recording
- Real-time stock validation
- Automatic profit calculation
- Stock reduction on sale
- Sales history tracking

### Reporting
- Daily, monthly, and overall profit reports
- Top selling products analysis
- Revenue and profit tracking
- Export-ready data format

## 🎯 Business Logic

### Profit Calculation
```
Profit = (Selling Price - Purchase Price) × Quantity Sold
```

### Low Stock Detection
```
Alert Triggered When: Current Stock ≤ Minimum Stock Threshold
```

### Stock Management
- Stock automatically reduced on sale
- Prevents negative stock
- Stock restored when sale is deleted
- Real-time stock updates

## 🔐 Security Features

- Input validation on all endpoints
- SQL injection prevention
- CORS configuration
- Environment variable protection
- Error handling and logging

## 📱 Responsive Design

- Bootstrap 5 responsive grid
- Mobile-friendly interface
- Touch-friendly buttons
- Responsive tables and forms

## 🎨 UI/UX Features

- Clean, professional interface
- Bootstrap Icons throughout
- Color-coded status indicators
- Loading states and error handling
- Success/error notifications
- Intuitive navigation

This inventory management system is production-ready and suitable for small to medium retail businesses. It provides all essential features for managing inventory, tracking sales, and monitoring business performance with automated alerts and comprehensive reporting.