import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorAlert = ({ error, onClose }) => {
    if (!error) return null;

    return (
        <Alert variant="danger" dismissible onClose={onClose}>
            <Alert.Heading>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Error
            </Alert.Heading>
            <p className="mb-0">
                {typeof error === 'string' ? error : error.message || 'An unexpected error occurred'}
            </p>
        </Alert>
    );
};

export default ErrorAlert;