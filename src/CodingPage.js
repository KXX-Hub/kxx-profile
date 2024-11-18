import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CodingPage.css';

const CodingPage = () => {
  const content = `
Projects:
  - Remote Telemedicine consult system
  - Ethereum wallet tracker
  - Zimbra auto mail bot
  - Auto API check bot
  - Gas line notify
  - NFT
  - Solidity & smart contract`;

  return (
    <div className="coding-page">
      <h1>Coding Projects</h1>
      <pre className="coding-content">{content}</pre>
      <Link to="/" className="back-home-btn">
        Back to Home
      </Link>
    </div>
  );
};

export default CodingPage;
