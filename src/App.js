import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import CodingPage from './CodingPage';
import MePage from './MePage';
import NFTPage from './NFTPage';
import VlogPage from './VlogPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/me" element={<MePage />} />
        <Route path="/nft" element={<NFTPage />} />
        <Route path="/vlog" element={<VlogPage />} />
      </Routes>
    </Router>
  );
}

export default App;
