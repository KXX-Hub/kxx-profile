import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/MainPage.css';
import { FaCode, FaUser, FaEthereum, FaYoutube, FaGithub, FaInstagram, FaDiscord } from 'react-icons/fa';
import NFTPage from './NFTPage';

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
 * Social links component
 */
const SocialLinks = () => {
  const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/KXX-HUB', label: 'GitHub' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/0xkxx_prod/', label: 'Instagram Production' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/0x_kxx/', label: 'Instagram Personal' },
    { icon: <FaDiscord />, url: '#', label: '0x_kxx' },
  ];

  return (
    <div className="social-links">
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

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
    <h1 data-text="KXX">KXX</h1>
    <p className="tagline">Full Stack Developer | Content Creator</p>
    <div className="profile-description">
      <p>
        Passionate about creating innovative solutions and sharing knowledge through content creation. 
        Specializing in web development, blockchain technology, and digital content production.
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
 * Navigation box component
 */
const NavigationBox = ({ title, path, icon, onClick }) => (
  <div className="box" onClick={() => onClick(path)}>
    <span className="box-icon">{icon}</span>
    <h2 className="box-title">{title}</h2>
  </div>
);

/**
 * Navigation menu component
 */
const NavigationMenu = () => {
  const navItems = [
    { title: 'Coding', path: '/coding', icon: <FaCode /> },
    { title: 'Me', path: '/me', icon: <FaUser /> },
    { title: 'NFT', path: '/nft', icon: <FaEthereum /> },
    { title: 'Vlog', path: '/vlog', icon: <FaYoutube /> }
  ];

  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="box-container">
      {navItems.map((item, index) => (
        <div key={index} className="box-wrapper">
          <NavigationBox {...item} onClick={handleCardClick} />
        </div>
      ))}
    </div>
  );
};

/**
 * Main page component
 */
const MainPage = () => {
  return (
    <div className="main-page">
      <Banner />
      <ProfileSection />
      <NavigationMenu />
    </div>
  );
};

export default MainPage;
