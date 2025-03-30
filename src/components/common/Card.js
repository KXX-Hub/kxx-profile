import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  title, 
  children, 
  className = '', 
  icon,
  onClick,
  hoverEffect = true 
}) => {
  const cardClass = `card ${hoverEffect ? 'card-hover' : ''} ${className}`;

  return (
    <div className={cardClass} onClick={onClick}>
      {icon && <div className="card-icon">{icon}</div>}
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  hoverEffect: PropTypes.bool
};

export default Card; 
