import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Lottie from 'react-lottie'; // Import Lottie
import happyheart from '../Animations/happyheart.json'; // Path to happy animation
import sadheart from '../Animations/sadheart.json'; // Path to sad animation

interface ResultModalProps {
  open: boolean;
  prediction: string | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ open, prediction, onClose }) => {
  const getMessage = () => {
    if (prediction === '0') {
      return 'You do not have heart disease.';
    } else if (prediction === '1') {
      return 'You have heart disease. Please consult your doctor.';
    } else {
      return 'Prediction unavailable.';
    }
  };

  const getAnimation = () => {
    // Return the happy or sad animation based on prediction
    return prediction === '0' ? happyheart : sadheart;
  };

  // Lottie options
  const defaultOptions = {
    loop: true,
    autoplay: true, // Animation will autoplay
    animationData: getAnimation(), // Dynamically set animation
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: 500,
          width: 700,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: 'center', // Center text and icon
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Result
        </Typography>

        {/* Lottie Animation */}
        <div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '400px',
  width: '400px',
  margin: '0 auto', // Centering the animation within its container
}}>
          <Lottie options={defaultOptions} />
        </div>

        <Typography variant="h6">{getMessage()}</Typography>
      </Box>
    </Modal>
  );
};

export default ResultModal;
