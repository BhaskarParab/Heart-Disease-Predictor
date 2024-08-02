import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import HistoryIcon from '@mui/icons-material/History';
import './Historypagenavbar.css';

const HistoryPageNavbar: React.FC = () => {
  // const navigate = useNavigate();

  return (
    <div className="navbar2">
      <h1>Prediction History</h1>
      {/* <HistoryIcon onClick={() => navigate('/')} className="history-button" /> */}
    </div>
  );
}

export default HistoryPageNavbar;
