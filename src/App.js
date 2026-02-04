import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './MainPage';
import CodingPage from './CodingPage';
import MePage from './MePage';
import NFTPage from './NFTPage';
import VideosPage from './VideosPage';
import PhotosPage from './PhotosPage';
import ClickExplosion from './components/ClickExplosion';
import './App.css';

function App() {
  return (
    <Router>
      <ClickExplosion />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/me" element={<MePage />} />
        <Route path="/nft" element={<NFTPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        {/* Legacy redirects */}
        <Route path="/portfolio" element={<Navigate to="/photos" replace />} />
        <Route path="/vlog" element={<Navigate to="/videos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
