import React, { useMemo, useState } from 'react';
import SocialLinks from '../components/common/SocialLinks';
import '../css/MainPage.css';

const Banner = ({ src, onError }) => (
  <div className="banner-section">
    <img src={src} alt="Profile Banner" className="banner-image" onError={onError} />
    <div className="banner-overlay" />
  </div>
);

const MainPage = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  const bannerCandidates = useMemo(() => ([
    `${publicUrl}/img/Banner.jpg`,
    './img/Banner.jpg',
    'img/Banner.jpg',
    '/img/Banner.jpg'
  ]), [publicUrl]);
  const avatarCandidates = useMemo(() => ([
    `${publicUrl}/img/1.jpg`,
    `${publicUrl}/img/2.JPG`,
    './img/1.jpg',
    './img/2.JPG',
    '/img/1.jpg',
    '/img/2.JPG'
  ]), [publicUrl]);

  const [bannerIndex, setBannerIndex] = useState(0);
  const [avatarIndex, setAvatarIndex] = useState(0);

  const handleBannerError = () => {
    setBannerIndex((prev) => (prev < bannerCandidates.length - 1 ? prev + 1 : prev));
  };

  const handleAvatarError = () => {
    setAvatarIndex((prev) => (prev < avatarCandidates.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="main-page">
      <Banner src={bannerCandidates[bannerIndex]} onError={handleBannerError} />
      <section className="billboard">
        <div className="billboard-frame">
          <span className="billboard-pin pin-tl" />
          <span className="billboard-pin pin-tr" />
          <span className="billboard-pin pin-bl" />
          <span className="billboard-pin pin-br" />
          <div className="billboard-body">
            <div className="billboard-avatar">
              <img
                src={avatarCandidates[avatarIndex]}
                alt="Profile"
                className="avatar-image"
                onError={handleAvatarError}
              />
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
