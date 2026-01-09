const express = require('express');
const router = express.Router();
const {
    getDailyProfit,
    getMonthlyProfit,
    getOverallProfit,
    getDashboardData
} = require('../controllers/reportController');

// GET /api/reports/dashboard - Get dashboard data
router.get('/dashboard', getDashboardData);

// GET /api/reports/daily - Get daily profit report
router.get('/daily', getDailyProfit);

// GET /api/reports/monthly - Get monthly profit report
router.get('/monthly', getMonthlyProfit);

// GET /api/reports/overall - Get overall profit summary
router.get('/overall', getOverallProfit);

module.exports = router;