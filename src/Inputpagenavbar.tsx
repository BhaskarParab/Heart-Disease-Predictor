import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Inputpagenavbar.css';
import heartIcon from './Animations/favicon-32x32.png'; // Add the path to your favicon image
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Import Firebase Auth methods

interface NavbarProps {
  title: string;
  onLogout?: () => void;
}

const InputPageNavbar: React.FC<NavbarProps> = ({ title, onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false); // User is not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleBackClick = () => {
    navigate('/input');
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setIsAuthenticated(false);
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout Error:', error);
    }
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
          </>
        ) : (
          <>
            <div className="navbar-title">
              <img src={heartIcon} alt="Heartview Icon" className="navbar-favicon" />
              <h1>{title || 'Heartview'}</h1>
            </div>
            {!isAuthenticated ? (
              <>
                <ArrowBackIcon onClick={() => navigate('/')} className="back-icon" />
                {/* <button onClick={() => navigate('/register')} className="nav-button">Register</button> */}
                <button onClick={() => navigate('/login')} className="nav-button">Login</button>
              </>
            ) : (
              <>
                <ArrowBackIcon onClick={() => navigate('/')} className="back-icon" />
                <ArrowForwardIcon onClick={() => navigate('/input')} className="back-icon" />
                <HistoryIcon onClick={() => navigate('/history')} className="history-icon" />
                <AccountCircleIcon onClick={() => navigate('/myaccount')} className="account-icon" />
              </>
            )}
          </>
        )}
      </div>
      {isAuthenticated && onLogout && (
        <div className="right-section">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default InputPageNavbar;
