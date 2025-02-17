import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Inputpagenavbar.css';
import heartIcon from './Animations/healthcare.png';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';

interface NavbarProps {
  title: string;
  onLogout?: () => void;
}

const InputPageNavbar: React.FC<NavbarProps> = ({ title, onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isGoogleUser, setIsGoogleUser] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to refresh user data
  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload(); // Refresh user data
      setUser(auth.currentUser); // Update state
      console.log('User refreshed:', auth.currentUser); // Debugging log
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        setIsGoogleUser(user.providerData.some((provider) => provider.providerId === 'google.com'));
        await refreshUser(); // Ensure latest user data is fetched
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIsGoogleUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleBackClick = () => {
    navigate('/input');
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setIsAuthenticated(false);
      setUser(null);
      setIsGoogleUser(false);
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
            <div className="navbar-title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <img src={heartIcon} alt="Heartview Icon" className="navbar-favicon" />
              <h1>{title || 'Heartview'}</h1>
            </div>
            {!isAuthenticated ? (
              <>
                <ArrowBackIcon onClick={() => navigate('/')} className="back-icon" />
                <button onClick={() => navigate('/login')} className="nav-button">Login</button>
              </>
            ) : (
              <>
                <ArrowBackIcon onClick={() => navigate('/')} className="back-icon" />
                <ArrowForwardIcon onClick={() => navigate('/input')} className="back-icon" />
                <HistoryIcon onClick={() => navigate('/history')} className="history-icon" />
              </>
            )}
          </>
        )}
      </div>

      {isAuthenticated && (
        <div className="right-section">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          {isGoogleUser ? (
            user?.photoURL && (
              <Avatar
                src={user.photoURL}
                alt="Profile"
                sx={{ width: 40, height: 40, marginLeft: '10px', cursor: 'pointer' }}
                onClick={() => navigate('/myaccount')}
              />
            )
          ) : (
            <AccountCircleIcon
              sx={{ width: 40, height: 40, marginLeft: '10px', cursor: 'pointer', color: 'gray' }}
              onClick={() => navigate('/myaccount')}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default InputPageNavbar;
