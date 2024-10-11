import React from 'react';
import logo from './kxx_logo.png';
import './PersonalPage.css';

function PersonalPage() {
  return (
    <div className="personal-page">
      <header>
        <img src={logo} alt="KXX Logo" className="logo" />
        <h1>Welcome To My Digital Gallery</h1>
      </header>

      <div className="container">
        <div className="bio">
          <h2>Hong Chih Kai</h2>
          <p>Hello! I am Kai, a passionate developer.</p>
        </div>

        <div className="social-links">
          <a href="https://github.com/KXX-Hub" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/hong-zhi-kai-0b1b3b1b1/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </div>
  );
}

export default PersonalPage;