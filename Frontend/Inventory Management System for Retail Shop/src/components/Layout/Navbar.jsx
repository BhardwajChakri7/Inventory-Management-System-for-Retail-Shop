import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from './react-router-bootstrap';

const AppNavbar = () => {
    return (
        <Navbar className="navbar-custom" variant="dark" expand="lg" fixed="top">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand className="d-flex align-items-center">
                        <i className="bi bi-box-seam me-3" style={{fontSize: '1.8rem'}}></i>
                        <span>Inventory Pro</span>
                    </Navbar.Brand>
                </LinkContainer>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <LinkContainer to="/">
                            <Nav.Link className="nav-link-custom">
                                <i className="bi bi-speedometer2 me-2"></i>
                                Dashboard
                            </Nav.Link>
                        </LinkContainer>
                        
                        <LinkContainer to="/products">
                            <Nav.Link className="nav-link-custom">
                                <i className="bi bi-box me-2"></i>
                                Products
                            </Nav.Link>
                        </LinkContainer>
                        
                        <LinkContainer to="/suppliers">
                            <Nav.Link className="nav-link-custom">
                                <i className="bi bi-truck me-2"></i>
                                Suppliers
                            </Nav.Link>
                        </LinkContainer>
                        
                        <LinkContainer to="/sales">
                            <Nav.Link className="nav-link-custom">
                                <i className="bi bi-cart-check me-2"></i>
                                Sales
                            </Nav.Link>
                        </LinkContainer>
                        
                        <LinkContainer to="/reports">
                            <Nav.Link className="nav-link-custom">
                                <i className="bi bi-graph-up me-2"></i>
                                Reports
                            </Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;