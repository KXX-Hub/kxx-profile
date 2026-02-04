import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import SocialLinks from '../components/common/SocialLinks';
import useWindowSize from '../hooks/useWindowSize';
import { NAVIGATION_ITEMS } from '../config/constants';
import '../css/MainPage.css';

const Banner = () => (
  <div className="banner-section">
    <img src="/img/Banner.jpg" alt="Profile Banner" className="banner-image" />
    <div className="banner-overlay" />
  </div>
);

const ProfileInfo = () => (
  <div className="profile-info">
    <h1 data-text="KXX">KXX</h1>
    <p className="tagline">Software Engineer | Blockchain | Cybersecurity | Content Creator</p>
    <div className="profile-description">
      <p>
        💻 Fullstack Developer: Dedicated to exploring and implementing blockchain and cybersecurity solutions. 
        Continuously learning and growing in software development while contributing to the tech community through knowledge sharing.
      </p>
    </div>
    <SocialLinks />
  </div>
);

const NavigationMenu = () => {
  const navigate = useNavigate();
  const { isTablet } = useWindowSize();

  return (
    <div className="navigation-grid">
      {NAVIGATION_ITEMS.map((item, index) => (
        <Card
          key={index}
          title={item.title}
          icon={<item.icon />}
          onClick={() => navigate(item.path)}
          className={`navigation-card ${isTablet ? 'compact' : ''}`}
        >
          <p className="navigation-description">{item.description}</p>
        </Card>
      ))}
    </div>
  );
};

const MainPage = () => {
  return (
    <div className="main-page">
      <Banner />
      <div className="profile-section">
        <div className="profile-avatar">
          <img src="/img/1.jpg" alt="Profile" className="avatar-image" />
        </div>
        <ProfileInfo />
      </div>
      <NavigationMenu />
    </div>
  );
};

export default MainPage; 
