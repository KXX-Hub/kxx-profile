import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Button = ({ 
  to, 
  onClick, 
  children, 
  className = '', 
  variant = 'primary',
  isLink = false 
}) => {
  const baseClass = `button button-${variant} ${className}`;

  if (isLink && to) {
    return (
      <Link to={to} className={baseClass}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {children}
    </button>
  );
};

Button.propTypes = {
  to: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  isLink: PropTypes.bool
};

export default Button; 
