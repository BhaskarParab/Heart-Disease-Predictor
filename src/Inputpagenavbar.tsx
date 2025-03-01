import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import './Inputpagenavbar.css';

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

  const handleSignIn = () => {
    navigate('/Login');
  };


  const isHistoryPage = location.pathname === '/history';
  const isInputPage = location.pathname === '/input';

  return (
    <div id="webcrumbs">
      {/* <div className="w-full bg-gradient-to-br from-slate-50 to-indigo-50 p-6"> */}
        <nav className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <img
                  src="/healthcare.png"
                  alt="HeartView"
                  className="w-8 h-8 transform hover:rotate-12 transition-transform duration-300"
                />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  HeartView
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 group"
                    onClick={() => navigate('/')} // Navigate to Home
                  >
                    <span className="material-symbols-outlined text-gray-600 group-hover:text-indigo-600">
                      home
                    </span>
                    <span>Home</span>
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 group"
                    onClick={() => navigate('/Input')} // Navigate to Inputpage
                  >
                    <span className="material-symbols-outlined text-gray-600 group-hover:text-indigo-600">
                      Input
                    </span>
                    <span>Prediction</span>
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 group"
                    onClick={() => navigate('/history')} // Navigate to History
                  >
                    <span className="material-symbols-outlined text-gray-600 group-hover:text-indigo-600">
                      history
                    </span>
                    <span>History</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
              <button
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
                onClick={handleLogout}
              >
                Logout
              </button>
              <details className="relative">
                <summary className="list-none cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                    {isGoogleUser && user?.photoURL ? (
                      <Avatar
                        src={user.photoURL}
                        alt="Profile"
                        sx={{ width: 40, height: 40 }}
                        onClick={() => navigate('/myaccount')}
                      />
                    ) : (
                      <AccountCircleIcon
                        sx={{ width: 40, height: 40, color: 'gray' }}
                        onClick={() => navigate('/myaccount')}
                      />
                    )}
                  </div>
                </summary>
                </details>
                </>
              ) : (
              <button
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            )}
                
              {/* </details> */}
            </div>
          </div>
        </nav>
      </div>
    // </div>
  );
};

export default InputPageNavbar;