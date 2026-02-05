import React, { useState, useEffect } from 'react';
import { FaVideo, FaYoutube } from 'react-icons/fa';
import './css/VideosPage.css';

const YOUTUBE_CHANNEL_ID = process.env.REACT_APP_YOUTUBE_CHANNEL_ID || 'UCVTmN2IJY1Zc3bArF-RsUWg';

// RSS feed URL for the channel (converts to JSON via rss2json)
const RSS_URL = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(RSS_URL);
        const data = await response.json();
        
        if (data.status === 'ok' && data.items) {
          // Extract video ID from link
          const videoList = data.items.map(item => {
            const videoId = item.link.split('v=')[1];
            return {
              id: videoId,
              title: item.title,
              pubDate: item.pubDate,
              thumbnail: item.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            };
          });
          setVideos(videoList);
        } else {
          setError('Could not load videos');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Could not load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="videos-page">
      <div className="page-header">
        <h1><FaVideo /> Videos</h1>
        <p className="subtitle">YouTube Video Collection</p>
      </div>

      <div className="videos-container">
        {/* Channel Link */}
        <div className="channel-link-container">
          <a 
            href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="channel-link"
          >
            <FaYoutube /> Visit My Channel
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-message">Loading videos...</div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-message">{error}</div>
        )}

        {/* Video Grid */}
        {!loading && !error && (
          <div className="videos-grid">
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <div key={video.id} className="video-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="video-embed">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    <span className="video-date">
                      {new Date(video.pubDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-items">
                <p>No videos found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosPage;
