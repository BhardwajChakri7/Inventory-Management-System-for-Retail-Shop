import React from 'react';
import { Alert } from 'react-bootstrap';

const SuccessAlert = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <Alert variant="success" dismissible onClose={onClose}>
            <i className="bi bi-check-circle me-2"></i>
            {message}
        </Alert>
    );
};

export default SuccessAlert;