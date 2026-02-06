import React from 'react';
import SocialLinks from '../components/common/SocialLinks';
import '../css/MainPage.css';

const Banner = () => (
  <div className="banner-section">
    <img src="/img/Banner.jpg" alt="Profile Banner" className="banner-image" />
    <div className="banner-overlay" />
  </div>
);

const MainPage = () => {
  return (
    <div className="main-page">
      <Banner />
      <section className="billboard">
        <div className="billboard-frame">
          <span className="billboard-pin pin-tl" />
          <span className="billboard-pin pin-tr" />
          <span className="billboard-pin pin-bl" />
          <span className="billboard-pin pin-br" />
          <div className="billboard-body">
            <div className="billboard-avatar">
              <img src="/img/1.jpg" alt="Profile" className="avatar-image" />
            </div>
            <div className="billboard-info">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
