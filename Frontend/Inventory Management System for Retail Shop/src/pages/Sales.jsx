import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Badge } from 'react-bootstrap';
import { salesAPI, productsAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorAlert from '../components/Common/ErrorAlert';
import SuccessAlert from '../components/Common/SuccessAlert';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        product_id: '',
        quantity_sold: ''
    });

    useEffect(() => {
        fetchSales();
        fetchProducts();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await salesAPI.getAll();
            setSales(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch sales');
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getAll();
            setProducts(response.data.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            const saleData = {
                product_id: parseInt(formData.product_id),
                quantity_sold: parseInt(formData.quantity_sold)
            };

            await salesAPI.create(saleData);
            setSuccess('Sale recorded successfully');
            
            setShowModal(false);
            resetForm();
            fetchSales();
            fetchProducts(); // Refresh to get updated stock
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to record sale');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sale? This will restore the stock.')) return;
        
        try {
            setLoading(true);
            await salesAPI.delete(id);
            setSuccess('Sale deleted successfully');
            fetchSales();
            fetchProducts(); // Refresh to get updated stock
            setLoading(false);
        } catch (err) {
            setError('Failed to delete sale');
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            product_id: '',
            quantity_sold: ''
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const getSelectedProduct = () => {
        return products.find(p => p.id === parseInt(formData.product_id));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading && sales.length === 0) return <LoadingSpinner text="Loading sales..." />;

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>
                    <i className="bi bi-cart-check me-2"></i>
                    Sales
                </h1>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-circle me-1"></i>
                    Record Sale
                </Button>
            </div>

            <ErrorAlert error={error} onClose={() => setError(null)} />
            <SuccessAlert message={success} onClose={() => setSuccess(null)} />

            {/* Sales Summary Cards */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <h4 className="text-primary">{sales.length}</h4>
                            <small className="text-muted">Total Sales</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <h4 className="text-success">
                                ${sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0).toFixed(2)}
                            </h4>
                            <small className="text-muted">Total Revenue</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <h4 className="text-warning">
                                ${sales.reduce((sum, sale) => sum + parseFloat(sale.profit || 0), 0).toFixed(2)}
                            </h4>
                            <small className="text-muted">Total Profit</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <h4 className="text-info">
                                {sales.reduce((sum, sale) => sum + parseInt(sale.quantity_sold || 0), 0)}
                            </h4>
                            <small className="text-muted">Items Sold</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Sales Table */}
            <Card>
                <Card.Header>
                    <h5 className="mb-0">Sales History ({sales.length})</h5>
                </Card.Header>
                <Card.Body>
                    {sales.length > 0 ? (
                        <Table striped hover responsive>
                            <thead>
                                <tr>
                                    <th>Sale ID</th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total Amount</th>
                                    <th>Profit</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((sale) => (
                                    <tr key={sale.id}>
                                        <td>
                                            <Badge bg="secondary">#{sale.id}</Badge>
                                        </td>
                                        <td>
                                            <strong>{sale.product_name}</strong>
                                        </td>
                                        <td>{sale.category || '-'}</td>
                                        <td>
                                            <Badge bg="info">{sale.quantity_sold}</Badge>
                                        </td>
                                        <td>${parseFloat(sale.selling_price).toFixed(2)}</td>
                                        <td>
                                            <strong>${parseFloat(sale.total_amount).toFixed(2)}</strong>
                                        </td>
                                        <td>
                                            <span className={`text-${parseFloat(sale.profit) > 0 ? 'success' : 'danger'}`}>
                                                ${parseFloat(sale.profit).toFixed(2)}
                                            </span>
                                        </td>
                                        <td>
                                            <small>{formatDate(sale.sale_date)}</small>
                                        </td>
                                        <td>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(sale.id)}
                                                title="Delete sale and restore stock"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-4">
                            <i className="bi bi-cart-x" style={{fontSize: '3rem', color: '#ccc'}}></i>
                            <p className="mt-2 text-muted">No sales recorded yet</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Record Sale Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Record New Sale</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Product *</Form.Label>
                            <Form.Select
                                value={formData.product_id}
                                onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                                required
                            >
                                <option value="">Select Product</option>
                                {products
                                    .filter(product => product.stock_quantity > 0)
                                    .map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - Stock: {product.stock_quantity} - ${parseFloat(product.selling_price).toFixed(2)}
                                    </option>
                                ))}
                            </Form.Select>
                            {products.filter(p => p.stock_quantity > 0).length === 0 && (
                                <Form.Text className="text-danger">
                                    No products with available stock
                                </Form.Text>
                            )}
                        </Form.Group>

                        {getSelectedProduct() && (
                            <Card className="mb-3 bg-light">
                                <Card.Body className="py-2">
                                    <Row>
                                        <Col>
                                            <small><strong>Available Stock:</strong> {getSelectedProduct().stock_quantity}</small>
                                        </Col>
                                        <Col>
                                            <small><strong>Unit Price:</strong> ${parseFloat(getSelectedProduct().selling_price).toFixed(2)}</small>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Quantity to Sell *</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max={getSelectedProduct()?.stock_quantity || 1}
                                value={formData.quantity_sold}
                                onChange={(e) => setFormData({...formData, quantity_sold: e.target.value})}
                                required
                            />
                            {getSelectedProduct() && (
                                <Form.Text className="text-muted">
                                    Maximum available: {getSelectedProduct().stock_quantity}
                                </Form.Text>
                            )}
                        </Form.Group>

                        {getSelectedProduct() && formData.quantity_sold && (
                            <Card className="bg-success text-white">
                                <Card.Body className="py-2">
                                    <Row>
                                        <Col>
                                            <small><strong>Total Amount:</strong> ${(parseFloat(getSelectedProduct().selling_price) * parseInt(formData.quantity_sold || 0)).toFixed(2)}</small>
                                        </Col>
                                        <Col>
                                            <small><strong>Profit:</strong> ${((parseFloat(getSelectedProduct().selling_price) - parseFloat(getSelectedProduct().purchase_price)) * parseInt(formData.quantity_sold || 0)).toFixed(2)}</small>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading || !formData.product_id || !formData.quantity_sold}
                        >
                            {loading ? 'Recording...' : 'Record Sale'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Sales;