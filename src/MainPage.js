import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/MainPage.css';
import { FaCode, FaUser, FaEthereum, FaCamera, FaVideo } from 'react-icons/fa';
import SocialLinks from './components/common/SocialLinks';

/**
 * Banner component with background image and overlay
 */
const Banner = () => (
  <div className="banner-section">
    <img src="/img/Banner.jpg" alt="Profile Banner" className="banner-image" />
    <div className="banner-overlay" />
  </div>
);

/**
 * Profile images component
 */
const ProfileImages = () => (
  <div className="profile-images">
    <div className="profile-avatar">
      <img src="/img/1.jpg" alt="Profile Avatar" className="avatar-image" />
    </div>
  </div>
);

/**
 * Profile information component with user details and social links
 */
const ProfileInfo = () => (
  <div className="profile-info">
    <h1 data-text="Chih-Kai, Hung">Chih-Kai, Hung</h1>
    <p className="tagline">Software Engineer | Fullstack Developer | Blockchain | Cybersecurity | Content Creator</p>
    <div className="profile-description">
      <p>
        Dedicated to exploring and implementing blockchain and cybersecurity solutions. 
        Continuously learning and growing in software development while contributing to the tech community through knowledge sharing.
      </p>
    </div>
    <SocialLinks />
  </div>
);

/**
 * Profile section component
 */
const ProfileSection = () => (
  <div className="profile-section">
    <ProfileImages />
    <ProfileInfo />
  </div>
);

/**
 * Navigation menu component
 */
const NavigationMenu = () => {
  const navItems = [
    { 
      title: 'Me', 
      path: '/me', 
      icon: <FaUser />
    },
    { 
      title: 'Coding', 
      path: '/coding', 
      icon: <FaCode />
    },
    { 
      title: 'Photos', 
      path: '/photos', 
      icon: <FaCamera />
    },
    { 
      title: 'Videos', 
      path: '/videos', 
      icon: <FaVideo />
    },
    { 
      title: 'NFT', 
      path: '/nft', 
      icon: <FaEthereum />
    }
  ];

  const navigate = useNavigate();

  return (
    <div className="navigation-section">
      <div className="nav-content">
        {navItems.map((item, index) => (
          <button 
            key={index} 
            className="nav-button"
            onClick={() => navigate(item.path)}
          >
            <div className="nav-button-content">
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-title">{item.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Main page component
 */
const MainPage = () => {
  return (
    <div className="main-page">
      <div className="main-content">
        <Banner />
        <ProfileSection />
        <NavigationMenu />
      </div>
    </div>
  );
};

export default MainPage;
