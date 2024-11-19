import React from 'react';
import { Link } from 'react-router-dom';
import './CodingPage.css';

const CodingPage = () => {
  return (
    <div className="coding-page">
      <h1 className="coding-title">Welcome to My Coding Space</h1>
      <div className="content-container">
        <div className="left-panel">
          <div className="coding-box">
            <p>Projects</p>
          </div>
        </div>
        <div className="right-panel">
          <ul className="project-list">
            <li><Link to="https://github.com/HappyGroupHub/TelemedicConsult-Backend-LineBot">Telemedicine Consult System</Link></li>
            <li><Link to="https://github.com/HappyGroupHub/Ethereum-Wallet-Tracker">Ethereum Wallet Tracker</Link></li>
            <li><Link to="https://github.com/KXX-Hub/Zimbra_Auto_Mail_Bot">Zimbra Auto Mail Bot</Link></li>
            <li><Link to="https://github.com/KXX-Hub/Auto_API_Check_Bot">Auto API Check Bot</Link></li>
            <li><Link to="https://github.com/KXX-Hub/Line_Gas_Notify">Gas Line Notify</Link></li>
            <li><Link to="https://github.com/KXX-Hub/IThome">Solidity, NFT & Smart Contract</Link></li>
          </ul>
        </div>
      </div>
      <Link to="/" className="back-home-btn">Back to Home</Link>
    </div>
  );
};

export default CodingPage;
