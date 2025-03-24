import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaInstagram, FaDiscord } from 'react-icons/fa';
import './css/VlogPage.css';

const VlogPage = () => {
    return (
        <div className="vlog-page">
            <div className="profile-header">
                <h1>Vlog</h1>
                <div className="profile-links">
                    <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaGithub />
                    </a>
                    <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaInstagram />
                    </a>
                    <a href="https://discord.gg/yourusername" target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaDiscord />
                    </a>
                </div>
            </div>
s
            <div className="vlog-container">
                <div className="vlog-content">
                    <div className="video-section">
                        <iframe
                            width="100%"
                            height="500"
                            src="https://www.youtube.com/embed/DdOK0MIA8kE"
                            title="Vlog Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div className="video-info">
                        <h2>2025.02.22</h2>
                        <p className="video-description">
                          露營Vlog⛺️| 露營真有趣🔥 | 大家爆買大花錢 | 洗碗大戰 | 攝影大集合
                        </p>
                        <div className="video-meta">
                            <span className="video-date">2025.02.22</span>
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    <Link to="/" className="back-home-btn">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VlogPage; 
