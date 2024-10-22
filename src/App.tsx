// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import InputPage from './Components/InputPage';
import HistoryPage from './Components/HistoryPage';
import Login from './Components/Login';
import Register from './Components/Register';
import MyAccount from '../src/MyAccount'
import Navbar from './Inputpagenavbar';
import './App.css'; // Global styles

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && <Navbar title="Heart Disease Predictor" onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/input" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/input" element={isAuthenticated ? <InputPage onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/history" element={isAuthenticated ? <HistoryPage /> : <Navigate to="/" />} />
        <Route path="/myaccount" element={isAuthenticated ? <MyAccount /> : <Navigate to="/" />} /> {/* Add MyAccount route */}
      </Routes>
    </Router>
  );
}

export default App;
