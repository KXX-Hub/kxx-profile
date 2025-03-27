import React from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from '../common/SocialLinks';

const PageLayout = ({ 
  title, 
  children, 
  showBackButton = true,
  className = ''
}) => {
  return (
    <div className={`page ${className}`}>
      <div className="profile-header">
        <h1>{title}</h1>
        <SocialLinks />
      </div>

      {children}

      {showBackButton && (
        <div className="button-container">
          <Link to="/" className="back-home-btn">
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default PageLayout; 
