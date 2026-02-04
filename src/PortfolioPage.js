import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCamera, FaTimes, FaList, FaVideo } from 'react-icons/fa';
import MediaCard from './components/MediaCard';
import './css/PortfolioPage.css';

const YOUTUBE_CHANNEL_ID = process.env.REACT_APP_YOUTUBE_CHANNEL_ID || 'UCVTmN2IJY1Zc3bArF-RsUWg';
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || '';

const FilterButton = ({ active, onClick, children, category }) => (
  <button 
    className={`filter-btn ${active ? 'active' : ''}`}
    onClick={onClick}
    data-category={category}
  >
    {children}
  </button>
);

const PortfolioPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const photoItems = [
    {
      type: 'photo',
      title: 'Photography Collection',
      description: 'Capturing moments and stories through the lens',
      thumbnail: '/img/1.jpg',
      link: '/img/1.jpg',
      aspectRatio: '4/3'
    },
    {
      type: 'photo',
      title: 'Profile Photo',
      description: 'Professional portrait photography',
      thumbnail: '/img/2.JPG',
      link: '/img/2.JPG',
      aspectRatio: '4/3'
    }
  ];

  useEffect(() => {
    const fetchLatestVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=6`
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

  const allMediaItems = [...photoItems, ...videoItems];

  const filteredItems = allMediaItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'photos') return item.type === 'photo';
    if (activeFilter === 'videos') return item.type === 'video';
    return true;
  });

  const handleFilter = (category) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveFilter(category);
      setIsTransitioning(false);
    }, 200);
  };

  const clearFilter = () => {
    handleFilter('all');
  };

  return (
    <div className="portfolio-page">
      <div className="profile-header">
        <h1>Media & Creation</h1>
        <p className="subtitle">Visual Media Portfolio - Photography & Video Content</p>
      </div>

      <div className="filter-section">
        <div className="filter-buttons">
          <FilterButton
            active={activeFilter === 'all'}
            onClick={() => handleFilter('all')}
            category="all"
          >
            <FaList /> All
          </FilterButton>
          <FilterButton
            active={activeFilter === 'photos'}
            onClick={() => handleFilter('photos')}
            category="photos"
          >
            <FaCamera /> Photography
          </FilterButton>
          <FilterButton
            active={activeFilter === 'videos'}
            onClick={() => handleFilter('videos')}
            category="videos"
          >
            <FaVideo /> Videos
          </FilterButton>
          <button className="clear-filter" onClick={clearFilter} title="Clear Filter">
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="portfolio-container">
        {loading && videos.length === 0 ? (
          <div className="loading-message">Loading videos...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className={`media-grid ${isTransitioning ? 'transitioning' : ''}`}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <MediaCard
                  key={`${item.type}-${index}`}
                  {...item}
                />
              ))
            ) : (
              <div className="no-items">
                <p>No content in this category</p>
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

export default PortfolioPage;
