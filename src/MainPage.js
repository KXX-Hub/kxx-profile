import React from 'react';
import './css/MainPage.css';
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
 * Main page component
 */
const MainPage = () => {
  return (
    <div className="main-page">
      <div className="main-content">
        <Banner />
        <ProfileSection />
      </div>
    </div>
  );
};

export default MainPage;
