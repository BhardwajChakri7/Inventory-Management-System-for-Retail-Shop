import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    return (
        <div className="loading-container">
            <div className="custom-spinner"></div>
            <p className="mt-3 text-muted fw-bold">{text}</p>
        </div>
    );
};

export default LoadingSpinner;