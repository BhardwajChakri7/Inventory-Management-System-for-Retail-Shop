import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import AppNavbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Sales from './pages/Sales';
import Reports from './pages/Reports';

function App() {
    return (
        <Router>
            <div className="App">
                <AppNavbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/suppliers" element={<Suppliers />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/reports" element={<Reports />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
