import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage'; // Import your MainPage component

// Page components for each section
const CodingPage = () => {
  return (
    <div>
      <h1>Coding Projects</h1>
      <p>Details about your coding projects...</p>
    </div>
  );
};

const MePage = () => {
  return (
    <div>
      <h1>About Me</h1>
      <p>Details about you...</p>
    </div>
  );
};

const ProducingPage = () => {
  return (
    <div>
      <h1>Music Production</h1>
      <p>Details about your music production...</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/me" element={<MePage />} />
        <Route path="/producing" element={<ProducingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
