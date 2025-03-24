import React from 'react';
import { Link } from 'react-router-dom';
import './css/VlogPage.css';

const VlogPage = () => {
  return (
    <div className="vlog-page">
      <div className="profile-header">
        <h1>Vlog</h1>
        <div className="profile-links">
          <a href="https://github.com/KXX-Hub" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaGithub />
          </a>
          <a href="https://www.instagram.com/kxx_hub/" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaInstagram />
          </a>
          <a href="https://discord.gg/your-discord" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaDiscord />
          </a>
        </div>
      </div>
      <div className="button-container">
        <Link to="/" className="back-home-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default VlogPage; 
