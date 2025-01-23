import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import InputPage from "./Components/InputPage";
import HistoryPage from "./Components/HistoryPage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import MyAccount from "./MyAccount";
import Navbar from "./Inputpagenavbar";
import "./App.css"; // Global styles
import Home from "./Components/Home";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar title="Heartview" onLogout={isAuthenticated ? handleLogout : undefined} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/input" element={isAuthenticated ? <InputPage onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/history" element={isAuthenticated ? <HistoryPage /> : <Navigate to="/login" />} />
        <Route path="/myaccount" element={isAuthenticated ? <MyAccount /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
