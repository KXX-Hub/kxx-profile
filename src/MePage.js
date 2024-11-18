import React from 'react';
import { Link } from 'react-router-dom';
import './MePage.css'; // Import the MePage styles

const MePage = () => {
  const content = `
About Me:
  - Software Developer
  - Cybersecurity Engineer Intern
  - IEEE author`;

  return (
    <div className="me-page">
      <h1>About Me</h1>
      <pre className="coding-content">{content}</pre>
      <Link to="/" className="back-home-btn">Back to Home</Link>
    </div>
  );
};

export default MePage;
