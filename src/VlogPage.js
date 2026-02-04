import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from './components/layout/PageLayout';
import './css/VlogPage.css';

const YOUTUBE_CHANNEL_ID = process.env.REACT_APP_YOUTUBE_CHANNEL_ID || 'UCVTmN2IJY1Zc3bArF-RsUWg';
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || '';

const VlogContent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        // Get latest 3 videos
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=3`
        );
        if (res.data.items && res.data.items.length > 0) {
          setVideos(res.data.items);
        } else {
          setError('No latest videos found');
        }
      } catch (err) {
        setError('Failed to fetch videos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestVideos();
  }, []);

  if (loading) return <div className="vlog-container">Loading...</div>;
  if (error) return <div className="vlog-container">{error}</div>;
  if (!videos.length) return null;

  return (
    <div className="vlog-container">
      <div className="vlog-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {videos.map((video, idx) => {
          const videoId = video.id.videoId;
          const snippet = video.snippet;
          return (
            <div
              className="video-card"
              key={videoId || idx}
              style={{
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                borderRadius: 18,
                background: 'rgba(30,30,30,0.95)',
                padding: 24,
                margin: '0 auto',
                maxWidth: 900,
                minWidth: 300,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <iframe
                width="100%"
                height="360"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 12, maxWidth: '100%' }}
              />
               <div className="video-info" style={{ width: '100%', textAlign: 'left' }}>
                 <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: '0 0 0.5rem 0' }}>{snippet.title}</h2>
                 <div className="video-meta" style={{ color: '#4a90e2', fontSize: '1rem', marginBottom: 8 }}>
                   Update-Date: {new Date(snippet.publishedAt).toLocaleDateString()}
                 </div>
                <p className="video-description" style={{ color: '#b0b0b0', fontSize: '1rem', margin: 0 }}>
                  {snippet.description ? snippet.description.slice(0, 50) + (snippet.description.length > 50 ? '...' : '') : '—'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const VlogPage = () => {
  return (
    <PageLayout title="Vlog" className="vlog-page">
      <VlogContent />
    </PageLayout>
  );
};

export default VlogPage; 
