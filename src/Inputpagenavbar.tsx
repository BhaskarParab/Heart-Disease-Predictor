import React from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import './Inputpagenavbar.css';

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <h1>{title}</h1>
      <HistoryIcon onClick={() => navigate('/history')} className="history-icon" />
    </div>
  );
};

export default Navbar;
