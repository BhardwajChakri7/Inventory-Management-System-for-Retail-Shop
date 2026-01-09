// Simple LinkContainer component for react-router-bootstrap compatibility
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LinkContainer = ({ to, children, ...props }) => {
    const navigate = useNavigate();
    
    const handleClick = (e) => {
        e.preventDefault();
        navigate(to);
    };
    
    return React.cloneElement(children, {
        ...props,
        onClick: handleClick,
        style: { cursor: 'pointer' }
    });
};