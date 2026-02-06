import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaCode, FaUser, FaGem, FaVideo, FaCamera, FaGraduationCap } from 'react-icons/fa';
import './Navigation.css';

const navItems = [
  { path: '/', icon: FaUser, label: 'Home' },
  { path: '/me', icon: FaGraduationCap, label: 'Me' },
  { path: '/coding', icon: FaCode, label: 'Coding' },
  { path: '/photos', icon: FaCamera, label: 'Photos' },
  { path: '/videos', icon: FaVideo, label: 'Videos' },
  { path: '/nft', icon: FaGem, label: 'NFT' },
];

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.includes('/dashboard');
  const isHome = location.pathname === '/';
  const isPhotos = location.pathname === '/photos';
  const isMobileView = typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches;
  const startPromptText = isMobileView ? 'Touch me to start' : 'Touch anywhere to start';
  const [showStartPrompt, setShowStartPrompt] = useState(false);

  // Find current page index for progress indicator
  const currentIndex = navItems.findIndex(item => item.path === location.pathname);
  const progress = isHome
    ? 0
    : currentIndex >= 0
    ? Math.round(((currentIndex + 1) / navItems.length) * 100)
    : 0;

  // Navigate to previous/next page
  const goToPrev = () => {
    if (currentIndex > 0) {
      navigate(navItems[currentIndex - 1].path);
    }
  };

  const goToNext = () => {
    if (currentIndex < navItems.length - 1) {
      navigate(navItems[currentIndex + 1].path);
    }
  };

  const prevPage = currentIndex > 0 ? navItems[currentIndex - 1] : null;
  const nextPage = currentIndex < navItems.length - 1 ? navItems[currentIndex + 1] : null;

  useEffect(() => {
    if (isDashboard) {
      setShowStartPrompt(false);
      return;
    }
    if (!isHome || !nextPage) {
      setShowStartPrompt(false);
      return;
    }
    if (typeof window === 'undefined') return;
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    if (isMobile) {
      setShowStartPrompt(false);
      return;
    }
    setShowStartPrompt(true);
    const handleStart = () => navigate(nextPage.path);
    document.addEventListener('pointerdown', handleStart);
    return () => document.removeEventListener('pointerdown', handleStart);
  }, [isDashboard, isHome, nextPage, navigate]);

  // Don't show on dashboard
  if (isDashboard) {
    return null;
  }

  return (
    <>
      <div className="global-nav-mirror" aria-hidden="true" />

      {/* Left Arrow - Previous Page */}
      {prevPage && !(isMobileView && isPhotos) && (
        <button className="page-nav-arrow page-nav-left" onClick={goToPrev}>
          <span className="arrow-icon">◀</span>
          <span className="arrow-label">{prevPage.label}</span>
        </button>
      )}

      {/* Right Arrow - Next Page */}
      {nextPage && !(isMobileView && isPhotos) && (
        isHome ? (
          isMobileView ? null : (
          showStartPrompt ? (
              <div className="page-nav-arrow page-nav-right start-prompt start-prompt-desktop">
                <span className="arrow-label">{startPromptText}</span>
              </div>
          ) : null
          )
        ) : (
          <button className="page-nav-arrow page-nav-right" onClick={goToNext}>
            <span className="arrow-label">{nextPage.label}</span>
            <span className="arrow-icon">▶</span>
          </button>
        )
      )}

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
    </>
  );
};

export default Navigation;
