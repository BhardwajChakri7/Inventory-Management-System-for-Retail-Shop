import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Badge, InputGroup } from 'react-bootstrap';
import { productsAPI, suppliersAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorAlert from '../components/Common/ErrorAlert';
import SuccessAlert from '../components/Common/SuccessAlert';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        purchase_price: '',
        selling_price: '',
        stock_quantity: '',
        min_stock: '',
        supplier_id: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getAll();
            setProducts(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await suppliersAPI.getAll();
            setSuppliers(response.data.data);
        } catch (err) {
            console.error('Failed to fetch suppliers:', err);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchProducts();
            return;
        }
        
        try {
            setLoading(true);
            const response = await productsAPI.search(searchTerm);
            setProducts(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to search products');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            const productData = {
                ...formData,
                purchase_price: parseFloat(formData.purchase_price),
                selling_price: parseFloat(formData.selling_price),
                stock_quantity: parseInt(formData.stock_quantity),
                min_stock: parseInt(formData.min_stock),
                supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : null
            };

            if (editingProduct) {
                await productsAPI.update(editingProduct.id, productData);
                setSuccess('Product updated successfully');
            } else {
                await productsAPI.create(productData);
                setSuccess('Product created successfully');
            }
            
            setShowModal(false);
            resetForm();
            fetchProducts();
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category || '',
            purchase_price: product.purchase_price,
            selling_price: product.selling_price,
            stock_quantity: product.stock_quantity,
            min_stock: product.min_stock,
            supplier_id: product.supplier_id || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            setLoading(true);
            await productsAPI.delete(id);
            setSuccess('Product deleted successfully');
            fetchProducts();
            setLoading(false);
        } catch (err) {
            setError('Failed to delete product');
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            purchase_price: '',
            selling_price: '',
            stock_quantity: '',
            min_stock: '',
            supplier_id: ''
        });
        setEditingProduct(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const getStockBadge = (product) => {
        if (product.stock_quantity <= product.min_stock) {
            return <Badge bg="danger" className="badge">Low Stock</Badge>;
        } else if (product.stock_quantity <= product.min_stock * 2) {
            return <Badge bg="warning" className="badge">Medium</Badge>;
        } else {
            return <Badge bg="success" className="badge">Good</Badge>;
        }
    };

    if (loading && products.length === 0) return <LoadingSpinner text="Loading products..." />;

    return (
        <div style={{paddingTop: '100px', minHeight: '100vh'}}>
            <Container className="fade-in">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="display-4 fw-bold text-dark mb-2">
                            <i className="bi bi-box me-3 text-primary"></i>
                            Products
                        </h1>
                        <p className="lead text-muted">Manage your product inventory</p>
                    </div>
                    <Button 
                        className="btn-custom" 
                        style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none'}}
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Product
                    </Button>
                </div>

                <ErrorAlert error={error} onClose={() => setError(null)} />
                <SuccessAlert message={success} onClose={() => setSuccess(null)} />

                {/* Search */}
                <Card className="custom-card mb-4">
                    <Card.Body>
                        <Row>
                            <Col md={8}>
                                <div className="search-container">
                                    <i className="bi bi-search search-icon"></i>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search products by name or category..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </Col>
                            <Col md={2}>
                                <Button 
                                    className="btn-custom w-100" 
                                    style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none'}}
                                    onClick={handleSearch}
                                >
                                    <i className="bi bi-search me-1"></i>
                                    Search
                                </Button>
                            </Col>
                            <Col md={2}>
                                <Button 
                                    variant="outline-secondary" 
                                    className="btn-custom w-100"
                                    onClick={fetchProducts}
                                >
                                    <i className="bi bi-arrow-clockwise me-1"></i>
                                    Refresh
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Products Table */}
                <Card className="custom-card">
                    <Card.Header className="bg-gradient text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                        <h5 className="mb-0 d-flex align-items-center">
                            <i className="bi bi-list-ul me-2"></i>
                            Products List ({products.length})
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {products.length > 0 ? (
                            <Table className="custom-table mb-0" hover responsive>
                                <thead>
                                    <tr>
                                        <th className="border-0">Product</th>
                                        <th className="border-0">Category</th>
                                        <th className="border-0">Pricing</th>
                                        <th className="border-0">Stock</th>
                                        <th className="border-0">Status</th>
                                        <th className="border-0">Supplier</th>
                                        <th className="border-0">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <div>
                                                    <strong className="text-dark">{product.name}</strong>
                                                    <br />
                                                    <small className="text-muted">ID: #{product.id}</small>
                                                </div>
                                            </td>
                                            <td>
                                                <Badge bg="info" className="badge">
                                                    {product.category || 'Uncategorized'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div>
                                                    <small className="text-muted">Purchase:</small> <strong>${parseFloat(product.purchase_price).toFixed(2)}</strong>
                                                    <br />
                                                    <small className="text-muted">Selling:</small> <strong className="text-success">${parseFloat(product.selling_price).toFixed(2)}</strong>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-center">
                                                    <Badge bg="primary" className="badge d-block mb-1">
                                                        {product.stock_quantity}
                                                    </Badge>
                                                    <small className="text-muted">Min: {product.min_stock}</small>
                                                </div>
                                            </td>
                                            <td>{getStockBadge(product)}</td>
                                            <td>
                                                {product.supplier_name ? (
                                                    <div>
                                                        <strong>{product.supplier_name}</strong>
                                                        <br />
                                                        <small className="text-muted">{product.supplier_phone}</small>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">No supplier</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="btn-custom"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        className="btn-custom"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center py-5">
                                <i className="bi bi-box text-muted" style={{fontSize: '4rem'}}></i>
                                <h4 className="mt-3 text-muted">No products found</h4>
                                <p className="text-muted">Start by adding your first product</p>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Add/Edit Product Modal */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                    <Modal.Header closeButton className="bg-gradient text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                        <Modal.Title>
                            <i className="bi bi-box me-2"></i>
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body className="p-4">
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Product Name *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required
                                            placeholder="Enter product name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Category</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            placeholder="Enter category"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Purchase Price *</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>$</InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                value={formData.purchase_price}
                                                onChange={(e) => setFormData({...formData, purchase_price: e.target.value})}
                                                required
                                                placeholder="0.00"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Selling Price *</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>$</InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                value={formData.selling_price}
                                                onChange={(e) => setFormData({...formData, selling_price: e.target.value})}
                                                required
                                                placeholder="0.00"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Stock Quantity *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.stock_quantity}
                                            onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                                            required
                                            placeholder="0"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Minimum Stock *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.min_stock}
                                            onChange={(e) => setFormData({...formData, min_stock: e.target.value})}
                                            required
                                            placeholder="0"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Supplier</Form.Label>
                                        <Form.Select
                                            value={formData.supplier_id}
                                            onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.map((supplier) => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal} className="btn-custom">
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="btn-custom"
                                style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none'}}
                            >
                                {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </div>
    );
};

export default Products;