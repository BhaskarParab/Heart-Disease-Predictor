import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Lottie from 'react-lottie';
import happyheart from '../Animations/happyheart.json';
import sadheart from '../Animations/sadheart.json';

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
    }
    return 'Prediction unavailable.';
  };

  const getAnimation = () => prediction === '0' ? happyheart : sadheart;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: getAnimation(),
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
          width: 700,
          height: 500,
          bgcolor: 'background.paper',
          borderRadius: '16px',
          boxShadow: 24,
          p: 4,
          overflow: 'hidden',
          '&:focus': {
            outline: 'none'
          }
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            bgcolor: 'grey.100',
            '&:hover': {
              bgcolor: 'grey.200',
              transform: 'rotate(90deg) scale(1.1)',
            },
            transition: 'all 0.3s ease-in-out',
            p: 1,
          }}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            px: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              backgroundImage: 'linear-gradient(to right, #2563eb, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Result
          </Typography>

          <Box
            sx={{
              width: 400,
              height: 320,
              my: 2,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <Lottie options={defaultOptions} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              py: 1,
              px: 3,
              borderRadius: '28px',
              fontWeight: 600,
              ...(prediction === '0' ? {
                bgcolor: 'success.light',
                color: 'success.dark'
              } : prediction === '1' ? {
                bgcolor: 'error.light',
                color: 'error.dark'
              } : {
                bgcolor: 'grey.100',
                color: 'grey.700'
              }),
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: 1
              }
            }}
          >
            {getMessage()}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default ResultModal;