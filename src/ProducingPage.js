import React from 'react';
import { Link } from 'react-router-dom';
import './ProducingPage.css'; // Import the ProducingPage styles

const ProducingPage = () => {
  const content = `
Production:
  - Music Album: KXX | XXXXXX
  - Total Song: 3
Experience: 5 years:
  - Music Producer
  - Piano Teacher
  - Composer`;

  return (
    <div className="producing-page">
      <h1>Production</h1>
      <pre className="coding-content">{content}</pre>
      <Link to="/" className="back-home-btn">Back to Home</Link>
    </div>
  );
};

export default ProducingPage;
