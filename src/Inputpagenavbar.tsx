import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
  const isMyAccountPage = location.pathname === '/myaccount';

  return (
    <div className="navbar">
      <div className="left-section">
        {isHistoryPage || isMyAccountPage ? (
          <>
            <ArrowBackIcon onClick={handleBackClick} className="back-icon" />
            <h1>{isHistoryPage ? 'Prediction History' : 'Profile'}</h1>
            {/* <AccountCircleIcon onClick={() => navigate('/myaccount')} className="account-icon" sx={{ml: 123}}/> */}
          </>
        ) : (
          <>
            <h1>{title}</h1>
            <HistoryIcon onClick={() => navigate('/history')} className="history-icon" />
            <AccountCircleIcon onClick={() => navigate('/myaccount')} className="account-icon" sx={{paddingLeft: 2}}/>
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
