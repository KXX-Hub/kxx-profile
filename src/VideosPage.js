import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaVideo } from 'react-icons/fa';
import MediaCard from './components/MediaCard';
import './css/VideosPage.css';

const YOUTUBE_CHANNEL_ID = process.env.REACT_APP_YOUTUBE_CHANNEL_ID || 'UCVTmN2IJY1Zc3bArF-RsUWg';
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || '';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=12`
        );
        if (res.data.items && res.data.items.length > 0) {
          setVideos(res.data.items.filter(item => item.id.videoId));
        }
      } catch (err) {
        setError('Failed to load videos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestVideos();
  }, []);

  const videoItems = videos.map(video => ({
    type: 'video',
    title: video.snippet.title,
    description: video.snippet.description 
      ? video.snippet.description.slice(0, 100) + (video.snippet.description.length > 100 ? '...' : '')
      : 'No description available',
    thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
    link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    aspectRatio: '16/9'
  }));

  return (
    <div className="videos-page">
      <div className="page-header">
        <h1><FaVideo /> Videos</h1>
        <p className="subtitle">YouTube Video Collection</p>
      </div>

      <div className="videos-container">
        {loading ? (
          <div className="loading-message">Loading videos...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="videos-grid">
            {videoItems.length > 0 ? (
              videoItems.map((item, index) => (
                <MediaCard
                  key={`video-${index}`}
                  {...item}
                />
              ))
            ) : (
              <div className="no-items">
                <p>No videos available</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="button-container">
        <Link to="/" className="back-home-btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default VideosPage;
