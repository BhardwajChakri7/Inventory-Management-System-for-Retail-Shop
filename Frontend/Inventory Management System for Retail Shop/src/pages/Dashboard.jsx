import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
import { reportsAPI, productsAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorAlert from '../components/Common/ErrorAlert';
import SuccessAlert from '../components/Common/SuccessAlert';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchDashboardData();
        fetchLowStockProducts();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await reportsAPI.getDashboard();
            setDashboardData(response.data.data);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error(err);
        }
    };

    const fetchLowStockProducts = async () => {
        try {
            const response = await productsAPI.getLowStock();
            setLowStockProducts(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch low stock products');
            setLoading(false);
        }
    };

    const handleSendAlerts = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.sendLowStockAlerts();
            setSuccess(`Low stock alerts sent for ${response.data.data.length} products`);
            setLoading(false);
        } catch (err) {
            setError('Failed to send low stock alerts');
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading dashboard..." />;

    return (
        <div style={{paddingTop: '100px', minHeight: '100vh'}}>
            <Container className="fade-in">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="display-4 fw-bold text-dark mb-2">
                            <i className="bi bi-speedometer2 me-3 text-primary"></i>
                            Dashboard
                        </h1>
                        <p className="lead text-muted">Welcome to your Inventory Management System</p>
                    </div>
                </div>

                <ErrorAlert error={error} onClose={() => setError(null)} />
                <SuccessAlert message={success} onClose={() => setSuccess(null)} />

                {dashboardData && (
                    <>
                        {/* Summary Cards */}
                        <Row className="mb-5">
                            <Col lg={3} md={6} className="mb-4">
                                <Card className="dashboard-card primary h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="mb-3">
                                            <i className="bi bi-calendar-day" style={{fontSize: '3rem', opacity: 0.8}}></i>
                                        </div>
                                        <h2 className="display-6 fw-bold mb-2">{dashboardData.today.total_sales || 0}</h2>
                                        <h5 className="mb-2">Today's Sales</h5>
                                        <p className="mb-0 opacity-75">
                                            Revenue: ${parseFloat(dashboardData.today.total_revenue || 0).toFixed(2)}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col lg={3} md={6} className="mb-4">
                                <Card className="dashboard-card success h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="mb-3">
                                            <i className="bi bi-calendar-month" style={{fontSize: '3rem', opacity: 0.8}}></i>
                                        </div>
                                        <h2 className="display-6 fw-bold mb-2">{dashboardData.thisMonth.total_sales || 0}</h2>
                                        <h5 className="mb-2">This Month</h5>
                                        <p className="mb-0 opacity-75">
                                            Revenue: ${parseFloat(dashboardData.thisMonth.total_revenue || 0).toFixed(2)}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col lg={3} md={6} className="mb-4">
                                <Card className="dashboard-card warning h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="mb-3">
                                            <i className="bi bi-graph-up" style={{fontSize: '3rem', opacity: 0.8}}></i>
                                        </div>
                                        <h2 className="display-6 fw-bold mb-2">
                                            ${parseFloat(dashboardData.overall.total_profit || 0).toFixed(0)}
                                        </h2>
                                        <h5 className="mb-2">Total Profit</h5>
                                        <p className="mb-0 opacity-75">All time earnings</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col lg={3} md={6} className="mb-4">
                                <Card className="dashboard-card danger h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="mb-3">
                                            <i className="bi bi-exclamation-triangle" style={{fontSize: '3rem', opacity: 0.8}}></i>
                                        </div>
                                        <h2 className="display-6 fw-bold mb-2">{lowStockProducts.length}</h2>
                                        <h5 className="mb-2">Low Stock Items</h5>
                                        <p className="mb-0 opacity-75">Need attention</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Content Cards */}
                        <Row>
                            {/* Top Products */}
                            <Col lg={6} className="mb-4">
                                <Card className="custom-card h-100">
                                    <Card.Header className="bg-gradient text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                                        <h5 className="mb-0 d-flex align-items-center">
                                            <i className="bi bi-trophy me-2"></i>
                                            Top Selling Products
                                        </h5>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        {dashboardData.topProducts.length > 0 ? (
                                            <Table className="custom-table mb-0" hover>
                                                <thead>
                                                    <tr>
                                                        <th className="border-0">Rank</th>
                                                        <th className="border-0">Product</th>
                                                        <th className="border-0">Sold</th>
                                                        <th className="border-0">Revenue</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dashboardData.topProducts.map((product, index) => (
                                                        <tr key={product.id}>
                                                            <td>
                                                                <Badge 
                                                                    bg={index < 3 ? 'warning' : 'secondary'} 
                                                                    className="badge"
                                                                >
                                                                    #{index + 1}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <strong>{product.name}</strong>
                                                                <br />
                                                                <small className="text-muted">{product.category}</small>
                                                            </td>
                                                            <td>
                                                                <Badge bg="info" className="badge">
                                                                    {product.total_sold}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <strong className="text-success">
                                                                    ${parseFloat(product.total_revenue).toFixed(2)}
                                                                </strong>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <div className="text-center py-5">
                                                <i className="bi bi-graph-down text-muted" style={{fontSize: '3rem'}}></i>
                                                <p className="mt-3 text-muted">No sales data available</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Low Stock Products */}
                            <Col lg={6} className="mb-4">
                                <Card className="custom-card h-100">
                                    <Card.Header className="d-flex justify-content-between align-items-center bg-gradient text-white" style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'}}>
                                        <h5 className="mb-0 d-flex align-items-center">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            Low Stock Alert
                                        </h5>
                                        {lowStockProducts.length > 0 && (
                                            <Button 
                                                variant="light" 
                                                size="sm"
                                                className="btn-custom"
                                                onClick={handleSendAlerts}
                                            >
                                                <i className="bi bi-envelope me-1"></i>
                                                Send Alerts
                                            </Button>
                                        )}
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        {lowStockProducts.length > 0 ? (
                                            <Table className="custom-table mb-0" hover>
                                                <thead>
                                                    <tr>
                                                        <th className="border-0">Product</th>
                                                        <th className="border-0">Stock</th>
                                                        <th className="border-0">Min</th>
                                                        <th className="border-0">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {lowStockProducts.slice(0, 5).map((product) => (
                                                        <tr key={product.id}>
                                                            <td>
                                                                <strong>{product.name}</strong>
                                                                <br />
                                                                <small className="text-muted">{product.category}</small>
                                                            </td>
                                                            <td>
                                                                <Badge bg="danger" className="badge">
                                                                    {product.stock_quantity}
                                                                </Badge>
                                                            </td>
                                                            <td>{product.min_stock}</td>
                                                            <td>
                                                                <span className="status-indicator status-low"></span>
                                                                Critical
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <div className="text-center py-5">
                                                <i className="bi bi-check-circle text-success" style={{fontSize: '3rem'}}></i>
                                                <h5 className="mt-3 text-success">All Good!</h5>
                                                <p className="text-muted">All products are well stocked</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </div>
    );
};

export default Dashboard;