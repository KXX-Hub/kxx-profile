import React from 'react';
import PageLayout from './components/layout/PageLayout';
import './css/VlogPage.css';

const VlogContent = () => (
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
        />
      </div>

      <div className="video-info">
        <h2>2025.02.22</h2>
        <p className="video-description">
          露營Vlog⛺️ | 露營真有趣🔥 | 大家爆買大花錢 | 洗碗大戰 | 攝影大集合
        </p>
        <div className="video-meta">
          <span className="video-date">2025.02.22</span>
        </div>
      </div>
    </div>
  </div>
);

const VlogPage = () => {
  return (
    <PageLayout title="Vlog" className="vlog-page">
      <VlogContent />
    </PageLayout>
  );
};

export default VlogPage; 
