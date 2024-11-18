import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage'; // Import your MainPage component
import CodingPage from './CodingPage'; // Import your CodingPage component
import MePage from './MePage'; // Define similar for MePage
import ProducingPage from './ProducingPage'; // Define similar for ProducingPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/me" element={<MePage />} />
        <Route path="/producing" element={<ProducingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
