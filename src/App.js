import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import CodingPage from './CodingPage';
import MePage from './MePage';
import NFTPage from './NFTPage'; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/me" element={<MePage />} />
        <Route path="/nft" element={<NFTPage />} />
      </Routes>
    </Router>
  );
}

export default App;
