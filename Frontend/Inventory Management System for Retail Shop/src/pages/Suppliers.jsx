import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, InputGroup } from 'react-bootstrap';
import { suppliersAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorAlert from '../components/Common/ErrorAlert';
import SuccessAlert from '../components/Common/SuccessAlert';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await suppliersAPI.getAll();
            setSuppliers(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch suppliers');
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchSuppliers();
            return;
        }
        
        try {
            setLoading(true);
            const response = await suppliersAPI.search(searchTerm);
            setSuppliers(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to search suppliers');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            if (editingSupplier) {
                await suppliersAPI.update(editingSupplier.id, formData);
                setSuccess('Supplier updated successfully');
            } else {
                await suppliersAPI.create(formData);
                setSuccess('Supplier created successfully');
            }
            
            setShowModal(false);
            resetForm();
            fetchSuppliers();
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save supplier');
            setLoading(false);
        }
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            phone: supplier.phone || '',
            email: supplier.email || '',
            address: supplier.address || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this supplier?')) return;
        
        try {
            setLoading(true);
            await suppliersAPI.delete(id);
            setSuccess('Supplier deleted successfully');
            fetchSuppliers();
            setLoading(false);
        } catch (err) {
            setError('Failed to delete supplier');
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            address: ''
        });
        setEditingSupplier(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    if (loading && suppliers.length === 0) return <LoadingSpinner text="Loading suppliers..." />;

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>
                    <i className="bi bi-truck me-2"></i>
                    Suppliers
                </h1>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-circle me-1"></i>
                    Add Supplier
                </Button>
            </div>

            <ErrorAlert error={error} onClose={() => setError(null)} />
            <SuccessAlert message={success} onClose={() => setSuccess(null)} />

            {/* Search */}
            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={8}>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Search suppliers by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Button variant="outline-secondary" onClick={handleSearch}>
                                    <i className="bi bi-search"></i>
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <Button 
                                variant="outline-primary" 
                                className="w-100"
                                onClick={fetchSuppliers}
                            >
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                Refresh
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Suppliers Table */}
            <Card>
                <Card.Header>
                    <h5 className="mb-0">Suppliers List ({suppliers.length})</h5>
                </Card.Header>
                <Card.Body>
                    {suppliers.length > 0 ? (
                        <Table striped hover responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Products</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map((supplier) => (
                                    <tr key={supplier.id}>
                                        <td>
                                            <strong>{supplier.name}</strong>
                                        </td>
                                        <td>
                                            {supplier.phone ? (
                                                <a href={`tel:${supplier.phone}`} className="text-decoration-none">
                                                    <i className="bi bi-telephone me-1"></i>
                                                    {supplier.phone}
                                                </a>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            {supplier.email ? (
                                                <a href={`mailto:${supplier.email}`} className="text-decoration-none">
                                                    <i className="bi bi-envelope me-1"></i>
                                                    {supplier.email}
                                                </a>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            {supplier.address ? (
                                                <small>{supplier.address}</small>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            <span className="badge bg-info">
                                                {supplier.products_count || 0} products
                                            </span>
                                        </td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-1"
                                                onClick={() => handleEdit(supplier)}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(supplier.id)}
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
                            <i className="bi bi-truck" style={{fontSize: '3rem', color: '#ccc'}}></i>
                            <p className="mt-2 text-muted">No suppliers found</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Add/Edit Supplier Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Supplier Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (editingSupplier ? 'Update' : 'Create')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Suppliers;