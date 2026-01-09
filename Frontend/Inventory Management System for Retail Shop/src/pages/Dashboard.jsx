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
        <div style={{paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
            <Container className="fade-in">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title">
                        <i className="bi bi-speedometer2 me-3 text-gradient"></i>
                        Dashboard
                    </h1>
                    <p className="page-subtitle">Welcome to your Inventory Management System</p>
                </div>

                <ErrorAlert error={error} onClose={() => setError(null)} />
                <SuccessAlert message={success} onClose={() => setSuccess(null)} />

                {dashboardData && (
                    <>
                        {/* Summary Cards */}
                        <Row className="mb-4">
                            <Col xl={3} lg={6} md={6} className="mb-4">
                                <Card className="dashboard-card primary h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="mb-3">
                                            <i className="bi bi-calendar-day" style={{fontSize: '2.5rem', opacity: 0.9}}></i>
                                        </div>
                                        <h2 className="display-6 fw-bold mb-2">{dashboardData.today.total_sales || 0}</h2>
                                        <h6 className="mb-2 text-uppercase fw-bold">Today's Sales</h6>
                                        <p className="mb-0 opacity-75 small">
                                            Revenue: ${parseFloat(dashboardData.today.total_revenue || 0).toFixed(2)}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col xl={3} lg={6} md={6} className="mb-4">
                                <Card className="dashboard-card success h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="mb-3">
                                            <i className="bi bi-calendar-month" style={{fontSize: '2.5rem', opacity: 0.9}}></i>
                                        </div>
                                        <h2 className="display-6 fw-bold mb-2">{dashboardData.thisMonth.total_sales || 0}</h2>
                                        <h6 className="mb-2 text-uppercase fw-bold">This Month</h6>
                                        <p className="mb-0 opacity-75 small">
                                            Revenue: ${parseFloat(dashboardData.thisMonth.total_revenue || 0).toFixed(2)}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col xl={3} lg={6} md={6} className="mb-4">
                                <Card className="dashboard-card warning h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="mb-3">
                                            <i className="bi bi-graph-up" style={{fontSize: '2.5rem', opacity: 0.9}}></i>
                                        </div>
                                        <h2 className="display-6 fw-bold mb-2">
                                            ${parseFloat(dashboardData.overall.total_profit || 0).toFixed(0)}
                                        </h2>
                                        <h6 className="mb-2 text-uppercase fw-bold">Total Profit</h6>
                                        <p className="mb-0 opacity-75 small">All time earnings</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col xl={3} lg={6} md={6} className="mb-4">
                                <Card className="dashboard-card danger h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="mb-3">
                                            <i className="bi bi-exclamation-triangle" style={{fontSize: '2.5rem', opacity: 0.9}}></i>
                                        </div>
                                        <h2 className="display-6 fw-bold mb-2">{lowStockProducts.length}</h2>
                                        <h6 className="mb-2 text-uppercase fw-bold">Low Stock Items</h6>
                                        <p className="mb-0 opacity-75 small">Need attention</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Content Cards */}
                        <Row>
                            {/* Top Products */}
                            <Col lg={6} className="mb-4">
                                <Card className="custom-card h-100">
                                    <Card.Header className="card-header-custom">
                                        <h5 className="mb-0 d-flex align-items-center">
                                            <i className="bi bi-trophy me-2"></i>
                                            Top Selling Products
                                        </h5>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        {dashboardData.topProducts.length > 0 ? (
                                            <div className="table-responsive">
                                                <Table className="custom-table mb-0" hover>
                                                    <thead>
                                                        <tr>
                                                            <th>Rank</th>
                                                            <th>Product</th>
                                                            <th>Sold</th>
                                                            <th>Revenue</th>
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
                                                                    <div>
                                                                        <strong className="d-block">{product.name}</strong>
                                                                        <small className="text-muted">{product.category}</small>
                                                                    </div>
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
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <i className="bi bi-graph-down text-muted" style={{fontSize: '3rem'}}></i>
                                                <p className="mt-3 text-muted mb-0">No sales data available</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Low Stock Products */}
                            <Col lg={6} className="mb-4">
                                <Card className="custom-card h-100">
                                    <Card.Header className="d-flex justify-content-between align-items-center" style={{background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)', color: 'white', padding: '15px 20px', fontWeight: 600}}>
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
                                            <div className="table-responsive">
                                                <Table className="custom-table mb-0" hover>
                                                    <thead style={{background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)', color: 'white'}}>
                                                        <tr>
                                                            <th>Product</th>
                                                            <th>Stock</th>
                                                            <th>Min</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lowStockProducts.slice(0, 5).map((product) => (
                                                            <tr key={product.id}>
                                                                <td>
                                                                    <div>
                                                                        <strong className="d-block">{product.name}</strong>
                                                                        <small className="text-muted">{product.category}</small>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <Badge bg="danger" className="badge">
                                                                        {product.stock_quantity}
                                                                    </Badge>
                                                                </td>
                                                                <td>{product.min_stock}</td>
                                                                <td>
                                                                    <span className="status-indicator status-low"></span>
                                                                    <small className="text-danger fw-bold">Critical</small>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <i className="bi bi-check-circle text-success" style={{fontSize: '3rem'}}></i>
                                                <h5 className="mt-3 text-success">All Good!</h5>
                                                <p className="text-muted mb-0">All products are well stocked</p>
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