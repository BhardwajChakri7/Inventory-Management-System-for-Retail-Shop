import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { reportsAPI, salesAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorAlert from '../components/Common/ErrorAlert';

const Reports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dailyReport, setDailyReport] = useState(null);
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [overallReport, setOverallReport] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        fetchOverallReport();
        fetchTopProducts();
    }, []);

    const fetchDailyReport = async () => {
        try {
            setLoading(true);
            const response = await reportsAPI.getDailyProfit(selectedDate);
            setDailyReport(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch daily report');
            setLoading(false);
        }
    };

    const fetchMonthlyReport = async () => {
        try {
            setLoading(true);
            const response = await reportsAPI.getMonthlyProfit(selectedYear, selectedMonth);
            setMonthlyReport(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch monthly report');
            setLoading(false);
        }
    };

    const fetchOverallReport = async () => {
        try {
            setLoading(true);
            const response = await reportsAPI.getOverallProfit();
            setOverallReport(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch overall report');
            setLoading(false);
        }
    };

    const fetchTopProducts = async () => {
        try {
            const response = await salesAPI.getTopProducts(10);
            setTopProducts(response.data.data);
        } catch (err) {
            console.error('Failed to fetch top products:', err);
        }
    };

    const formatCurrency = (amount) => {
        return `$${parseFloat(amount || 0).toFixed(2)}`;
    };

    const formatNumber = (number) => {
        return parseInt(number || 0).toLocaleString();
    };

    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1];
    };

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>
                    <i className="bi bi-graph-up me-2"></i>
                    Reports & Analytics
                </h1>
            </div>

            <ErrorAlert error={error} onClose={() => setError(null)} />

            {/* Overall Summary */}
            {overallReport && (
                <Card className="mb-4">
                    <Card.Header>
                        <h5 className="mb-0">
                            <i className="bi bi-bar-chart me-2"></i>
                            Overall Business Summary
                        </h5>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={3} className="text-center">
                                <h3 className="text-primary">{formatNumber(overallReport.total_sales)}</h3>
                                <small className="text-muted">Total Sales</small>
                            </Col>
                            <Col md={3} className="text-center">
                                <h3 className="text-info">{formatNumber(overallReport.total_quantity)}</h3>
                                <small className="text-muted">Items Sold</small>
                            </Col>
                            <Col md={3} className="text-center">
                                <h3 className="text-success">{formatCurrency(overallReport.total_revenue)}</h3>
                                <small className="text-muted">Total Revenue</small>
                            </Col>
                            <Col md={3} className="text-center">
                                <h3 className="text-warning">{formatCurrency(overallReport.total_profit)}</h3>
                                <small className="text-muted">Total Profit</small>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col className="text-center">
                                <p className="mb-0">
                                    <strong>Average Profit per Sale:</strong> {formatCurrency(overallReport.average_profit_per_sale)}
                                </p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            <Row>
                {/* Daily Report */}
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">
                                <i className="bi bi-calendar-day me-2"></i>
                                Daily Profit Report
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Select Date</Form.Label>
                                <div className="d-flex">
                                    <Form.Control
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="me-2"
                                    />
                                    <Button variant="primary" onClick={fetchDailyReport}>
                                        Generate
                                    </Button>
                                </div>
                            </Form.Group>

                            {dailyReport && (
                                <div>
                                    <h6>Report for {new Date(dailyReport.sale_date).toLocaleDateString()}</h6>
                                    <Table size="sm">
                                        <tbody>
                                            <tr>
                                                <td>Total Sales:</td>
                                                <td><strong>{formatNumber(dailyReport.total_sales)}</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Items Sold:</td>
                                                <td><strong>{formatNumber(dailyReport.total_quantity)}</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Revenue:</td>
                                                <td><strong className="text-success">{formatCurrency(dailyReport.total_revenue)}</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Profit:</td>
                                                <td><strong className="text-warning">{formatCurrency(dailyReport.total_profit)}</strong></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Monthly Report */}
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">
                                <i className="bi bi-calendar-month me-2"></i>
                                Monthly Profit Report
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Year</Form.Label>
                                        <Form.Select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        >
                                            {[2024, 2025, 2026].map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Month</Form.Label>
                                        <Form.Select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        >
                                            {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                                <option key={month} value={month}>
                                                    {getMonthName(month)}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="primary" onClick={fetchMonthlyReport} className="mb-3">
                                Generate Report
                            </Button>

                            {monthlyReport && (
                                <div>
                                    <h6>Report for {getMonthName(monthlyReport.month)} {monthlyReport.year}</h6>
                                    <Table size="sm">
                                        <tbody>
                                            <tr>
                                                <td>Total Sales:</td>
                                                <td><strong>{formatNumber(monthlyReport.total_sales)}</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Items Sold:</td>
                                                <td><strong>{formatNumber(monthlyReport.total_quantity)}</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Revenue:</td>
                                                <td><strong className="text-success">{formatCurrency(monthlyReport.total_revenue)}</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Profit:</td>
                                                <td><strong className="text-warning">{formatCurrency(monthlyReport.total_profit)}</strong></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Top Selling Products */}
            <Card>
                <Card.Header>
                    <h5 className="mb-0">
                        <i className="bi bi-trophy me-2"></i>
                        Top Selling Products
                    </h5>
                </Card.Header>
                <Card.Body>
                    {topProducts.length > 0 ? (
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Total Sold</th>
                                    <th>Revenue</th>
                                    <th>Profit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>
                                            <span className={`badge ${index < 3 ? 'bg-warning' : 'bg-secondary'}`}>
                                                #{index + 1}
                                            </span>
                                        </td>
                                        <td><strong>{product.name}</strong></td>
                                        <td>{product.category || '-'}</td>
                                        <td>{formatNumber(product.total_sold)}</td>
                                        <td className="text-success">{formatCurrency(product.total_revenue)}</td>
                                        <td className="text-warning">{formatCurrency(product.total_profit)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-4">
                            <i className="bi bi-graph-down" style={{fontSize: '3rem', color: '#ccc'}}></i>
                            <p className="mt-2 text-muted">No sales data available</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {loading && <LoadingSpinner text="Generating report..." />}
        </Container>
    );
};

export default Reports;