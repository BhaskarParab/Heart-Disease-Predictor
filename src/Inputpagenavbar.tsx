import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Inputpagenavbar.css';

interface NavbarProps {
  title: string;
  onLogout?: () => void;
}

const InputPageNavbar: React.FC<NavbarProps> = ({ title, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    navigate('/input'); // Replace with the actual path of your input page
  };

  const isHistoryPage = location.pathname === '/history';

  return (
    <div className="navbar">
      <div className="left-section">
        {isHistoryPage ? (
          <>
            <ArrowBackIcon onClick={handleBackClick} className="back-icon" />
            <h1>Prediction History</h1>
          </>
        ) : (
          <>
            <h1>{title}</h1>
            <HistoryIcon onClick={() => navigate('/history')} className="history-icon" />
          </>
        )}
      </div>
      {onLogout && (
        <div className="right-section">
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default InputPageNavbar;
