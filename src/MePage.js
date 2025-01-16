import React from 'react';
import { Link } from 'react-router-dom';
import './css/MePage.css'; // Import the MePage styles

const MePage = () => {
  const linkedinUrl = 'https://www.linkedin.com/in/kai-hung-0xkxx/'; // Replace with your GitHub URL
  const githubUrl = 'https://github.com/KXX-Hub'; // Replace with your LinkedIn URL

  return (
    <div className="me-page">
      <h1>About Me</h1>
      <div className="profile-links">
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          <img
            src="img/Github.png"
            alt="GitHub"
            className="icon"
          />
        </a>
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
          <img
            src="img/LinkedIn.png"
            alt="LinkedIn"
            className="icon"
          />
        </a>
      </div>
      <Link to="/" className="back-home-btn">Back to Home</Link>
    </div>
  );
};

export default MePage;
