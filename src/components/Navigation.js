import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaCode, FaUser, FaGem, FaVideo, FaCamera, FaGraduationCap } from 'react-icons/fa';
import './Navigation.css';

const navItems = [
  { path: '/', icon: FaUser },           // Me (main page)
  { path: '/me', icon: FaGraduationCap }, // Experience
  { path: '/coding', icon: FaCode },
  { path: '/photos', icon: FaCamera },
  { path: '/videos', icon: FaVideo },
  { path: '/nft', icon: FaGem },
];

const Navigation = () => {
  const location = useLocation();
  
  // Don't show on dashboard
  if (location.pathname.includes('/dashboard')) {
    return null;
  }

  // Find current page index for progress indicator
  const currentIndex = navItems.findIndex(item => item.path === location.pathname);
  const progress = currentIndex >= 0 ? Math.round(((currentIndex + 1) / navItems.length) * 100) : 0;

  return (
    <nav className="global-nav">
      {/* Pixel Progress Bar */}
      <div className="pixel-progress-container">
        <div className="pixel-progress-bar">
          <div className="pixel-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="pixel-progress-text">{progress}%</span>
      </div>
      
      {/* Nav Items */}
      <div className="nav-items">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isPast = currentIndex > index;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
            >
              <Icon />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
