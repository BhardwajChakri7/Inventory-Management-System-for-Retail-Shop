# 🚀 Complete Setup Instructions

## Step-by-Step Setup Guide

### 1. Prerequisites Installation

#### Install Node.js
- Download from https://nodejs.org/ (v16 or higher)
- Verify installation: `node --version` and `npm --version`

#### Create Neon Database Account
1. Go to https://neon.tech/
2. Sign up for free account
3. Create a new project
4. Note down the connection string

### 2. Project Setup

#### Clone and Navigate
```bash
git clone <your-repository>
cd inventory-management-system
```

### 3. Backend Configuration

#### Install Dependencies
```bash
cd Backend
npm install
```

#### Environment Configuration
Create `.env` file in Backend directory:
```env
# Database Configuration (Replace with your Neon DB details)
DATABASE_URL=postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Gmail App Password Setup
1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account → Security → 2-Step Verification
3. Click "App passwords"
4. Select "Mail" and generate password
5. Use this 16-character password in EMAIL_PASS

#### Database Setup
1. Copy the SQL from `Backend/database/schema.sql`
2. Go to your Neon dashboard
3. Open SQL Editor
4. Paste and execute the schema
5. Verify tables are created

### 4. Frontend Configuration

#### Install Dependencies
```bash
cd "Frontend/Inventory Management System for Retail Shop"
npm install
```

### 5. Running the Application

#### Terminal 1 - Backend
```bash
cd Backend
npm run dev
```
Should show:
```
🚀 Inventory Management System API running on port 5000
📊 Health check: http://localhost:5000/api/health
📧 Email test: http://localhost:5000/api/test-email
✅ Email configuration is valid
Connected to PostgreSQL database
```

#### Terminal 2 - Frontend
```bash
cd "Frontend/Inventory Management System for Retail Shop"
npm run dev
```
Should show:
```
  VITE v7.2.4  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 6. Verification Steps

#### Test Backend API
Visit: http://localhost:5000/api/health
Should return:
```json
{
  "success": true,
  "message": "Inventory Management System API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

#### Test Email Configuration
Visit: http://localhost:5000/api/test-email
Should return:
```json
{
  "success": true,
  "emailConfigValid": true,
  "message": "Email configuration is valid"
}
```

#### Test Frontend
Visit: http://localhost:5173/
Should show the dashboard with navigation menu

### 7. Initial Data Setup

The database schema includes sample data:
- 3 suppliers
- 5 products with different stock levels
- Ready for testing

### 8. Testing the System

#### Test Product Management
1. Go to Products page
2. Add a new product
3. Edit existing product
4. Check low stock indicators

#### Test Sales Recording
1. Go to Sales page
2. Record a sale
3. Verify stock reduction
4. Check if low stock alert is triggered

#### Test Email Alerts
1. Create/edit a product with stock ≤ minimum
2. Go to Dashboard
3. Click "Send Alerts" button
4. Check your email for alert

#### Test Reports
1. Go to Reports page
2. Generate daily report for today
3. Generate monthly report for current month
4. View overall summary

### 9. Common Issues & Solutions

#### Database Connection Issues
```bash
# Test connection
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'YOUR_DATABASE_URL' });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  pool.end();
});
"
```

#### Email Issues
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled
- Ensure EMAIL_HOST=smtp.gmail.com and EMAIL_PORT=587

#### CORS Issues
- Ensure backend runs on port 5000
- Ensure frontend runs on port 5173
- Check API_BASE_URL in frontend/src/services/api.js

#### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 5173
npx kill-port 5173
```

### 10. Production Deployment

#### Backend (Heroku/Railway/Render)
1. Set environment variables in hosting platform
2. Ensure DATABASE_URL points to production database
3. Set NODE_ENV=production

#### Frontend (Netlify/Vercel)
1. Update API_BASE_URL to production backend URL
2. Build: `npm run build`
3. Deploy dist folder

### 11. Sample Environment Files

#### Backend/.env (Development)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/inventory_db
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=test@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM=test@gmail.com
PORT=5000
NODE_ENV=development
```

#### Backend/.env (Production)
```env
DATABASE_URL=postgresql://user:pass@prod-host:5432/inventory_db?sslmode=require
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=production@company.com
EMAIL_PASS=prod-app-password
EMAIL_FROM=production@company.com
PORT=5000
NODE_ENV=production
```

### 12. Folder Structure Verification

Ensure your structure looks like:
```
inventory-management-system/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── index.js
│   └── package.json
├── Frontend/
│   └── Inventory Management System for Retail Shop/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.js
└── README.md
```

### 13. Success Indicators

✅ Backend starts without errors
✅ Database connection successful
✅ Email configuration valid
✅ Frontend loads dashboard
✅ Can create/edit products
✅ Can record sales
✅ Stock updates automatically
✅ Reports generate correctly
✅ Email alerts work

### 14. Next Steps

After successful setup:
1. Customize email templates in `Backend/utils/emailService.js`
2. Add your company branding
3. Configure additional email recipients
4. Set up automated backups
5. Monitor system performance
6. Add additional features as needed

### 15. Support

If you encounter issues:
1. Check console logs in both terminals
2. Verify all environment variables
3. Test database connection separately
4. Test email configuration separately
5. Check network connectivity
6. Ensure all dependencies are installed

The system should now be fully functional with all features working correctly!