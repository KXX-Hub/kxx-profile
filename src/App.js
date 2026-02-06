import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CodingPage from './CodingPage';
import MePage from './MePage';
import NFTPage from './NFTPage';
import VideosPage from './VideosPage';
import PhotosPage from './PhotosPage';
import PhotoDashboardPage from './PhotoDashboardPage';
import ClickExplosion from './components/ClickExplosion';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  // Get basename for GitHub Pages deployment
  // If homepage is ".", use undefined (root domain, no basename needed)
  // If homepage is "/repo-name", use "/repo-name"
  // PUBLIC_URL is set by react-scripts based on homepage in package.json
  const getBasename = () => {
    const publicUrl = process.env.PUBLIC_URL;
    if (!publicUrl || publicUrl === '.') {
      return undefined; // Root domain, no basename needed
    }
    // Remove trailing slash if present
    return publicUrl.replace(/\/$/, '');
  };
  
  const basename = getBasename();
  
  // Handle GitHub Pages 404 redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('p');
    if (redirectPath) {
      const [path, search, hash] = redirectPath.split(/([?#])/);
      const newPath = path + (search || '') + (hash || '');
      window.history.replaceState({}, '', newPath);
    }
  }, []);
  
  return (
    <Router basename={basename}>
      <ClickExplosion />
      <Navigation />
      <Routes>
        <Route path="/" element={<MePage />} />
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/me" element={<Navigate to="/" replace />} />
        <Route path="/nft" element={<NFTPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/photos/dashboard" element={<PhotoDashboardPage />} />
        {/* Legacy redirects */}
        {/* <Route path="/portfolio" element={<Navigate to="/photos" replace />} /> */}
        <Route path="/portfolio" element={<Navigate to="/" replace />} />
        <Route path="/vlog" element={<Navigate to="/videos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
