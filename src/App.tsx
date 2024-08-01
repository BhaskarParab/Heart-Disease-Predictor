import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InputPage from './InputPage';
import HistoryPage from './HistoryPage';
import './App.css'; // Global styles

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
