const Sale = require('../models/Sale');

// Get daily profit report
const getDailyProfit = async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required (YYYY-MM-DD format)'
            });
        }
        
        const report = await Sale.getDailyProfit(date);
        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error generating daily profit report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating daily profit report',
            error: error.message
        });
    }
};

// Get monthly profit report
const getMonthlyProfit = async (req, res) => {
    try {
        const { year, month } = req.query;
        
        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: 'Year and month are required'
            });
        }
        
        const report = await Sale.getMonthlyProfit(parseInt(year), parseInt(month));
        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error generating monthly profit report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating monthly profit report',
            error: error.message
        });
    }
};

// Get overall profit summary
const getOverallProfit = async (req, res) => {
    try {
        const report = await Sale.getOverallProfit();
        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error generating overall profit report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating overall profit report',
            error: error.message
        });
    }
};

// Get comprehensive dashboard data
const getDashboardData = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        
        const [dailyProfit, monthlyProfit, overallProfit, topProducts] = await Promise.all([
            Sale.getDailyProfit(today),
            Sale.getMonthlyProfit(currentYear, currentMonth),
            Sale.getOverallProfit(),
            Sale.getTopSellingProducts(5)
        ]);
        
        res.json({
            success: true,
            data: {
                today: dailyProfit,
                thisMonth: monthlyProfit,
                overall: overallProfit,
                topProducts: topProducts
            }
        });
    } catch (error) {
        console.error('Error generating dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating dashboard data',
            error: error.message
        });
    }
};

module.exports = {
    getDailyProfit,
    getMonthlyProfit,
    getOverallProfit,
    getDashboardData
};