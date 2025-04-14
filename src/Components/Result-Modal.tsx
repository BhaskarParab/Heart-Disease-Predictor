import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Paper, Divider
} from '@mui/material';
import { CheckCircle, Warning, Error, Info } from '@mui/icons-material';

interface ResultModalProps {
  open: boolean;
  prediction: string | null;
  formData?: {
    feature4?: string; // TrestBPS (Blood Pressure)
    feature5?: string; // Chol (Cholesterol)
    feature8?: string; // Thalch (Heart Rate)
  };
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ open, prediction, formData, onClose }) => {
  const isAtRisk = prediction === '1';
  const riskLevel = isAtRisk ? 'High' : 'Low';

  // Get input values with fallbacks
  const bloodPressure = formData?.feature4 || 'Not provided';
  const cholesterol = formData?.feature5 || 'Not provided';
  const heartRate = formData?.feature8 || 'Not provided';

  // Health recommendations based on inputs
  const getCholesterolRecommendation = (chol: string) => {
    const cholNum = parseFloat(chol);
    if (isNaN(cholNum)) return 'Maintain a balanced diet with healthy fats.';
    if (cholNum < 200) return 'Your cholesterol is optimal. Keep up the good work!';
    if (cholNum < 240) return 'Consider reducing saturated fats and increasing fiber intake.';
    return 'Consult your doctor about cholesterol management strategies.';
  };

  const getBloodPressureRecommendation = (bp: string) => {
    const bpNum = parseFloat(bp);
    if (isNaN(bpNum)) return 'Monitor your blood pressure regularly.';
    if (bpNum < 120) return 'Your blood pressure is normal. Maintain healthy habits.';
    if (bpNum < 140) return 'Consider reducing sodium intake and increasing physical activity.';
    return 'Consult your doctor about blood pressure management.';
  };

  const getHeartRateRecommendation = (hr: string) => {
    const hrNum = parseFloat(hr);
    if (isNaN(hrNum)) return 'Regular exercise can help maintain a healthy heart rate.';
    if (hrNum < 60) return 'Your resting heart rate is excellent for cardiovascular health.';
    if (hrNum < 100) return 'Your heart rate is normal. Consider cardio exercises to improve it further.';
    return 'Consult your doctor about your elevated heart rate.';
  };

  const getGeneralRecommendations = () => {
    const base = [
      'Maintain a balanced diet rich in fruits and vegetables',
      'Engage in at least 150 minutes of moderate exercise weekly',
      'Avoid smoking and limit alcohol consumption',
      'Manage stress through meditation or relaxation techniques'
    ];
    
    if (isAtRisk) {
      base.unshift('Consult with a cardiologist for a comprehensive evaluation');
      base.push('Monitor your vital signs regularly');
    }
    
    return base;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', py: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center">
          {isAtRisk ? (
            <Error color="error" sx={{ fontSize: 40, mr: 2 }} />
          ) : (
            <CheckCircle color="success" sx={{ fontSize: 40, mr: 2 }} />
          )}
          <Typography variant="h4" component="span">
            {isAtRisk ? 'Potential Heart Disease Risk Detected' : 'Low Risk of Heart Disease'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Your Health Summary
          </Typography>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <Paper elevation={3} sx={{ p: 2, mb: 2, width: { xs: '100%', sm: '48%' } }}>
              <Typography variant="subtitle1" color="text.secondary">Risk Level</Typography>
              <Typography variant="h4" color={isAtRisk ? 'error.main' : 'success.main'}>
                {riskLevel}
              </Typography>
            </Paper>
            <Paper elevation={3} sx={{ p: 2, mb: 2, width: { xs: '100%', sm: '48%' } }}>
              <Typography variant="subtitle1" color="text.secondary">Blood Pressure</Typography>
              <Typography variant="h4">{bloodPressure} mmHg</Typography>
              <Typography variant="caption" color="text.secondary">
                {getBloodPressureRecommendation(bloodPressure)}
              </Typography>
            </Paper>
            <Paper elevation={3} sx={{ p: 2, mb: 2, width: { xs: '100%', sm: '48%' } }}>
              <Typography variant="subtitle1" color="text.secondary">Cholesterol</Typography>
              <Typography variant="h4">{cholesterol} mg/dL</Typography>
              <Typography variant="caption" color="text.secondary">
                {getCholesterolRecommendation(cholesterol)}
              </Typography>
            </Paper>
            <Paper elevation={3} sx={{ p: 2, mb: 2, width: { xs: '100%', sm: '48%' } }}>
              <Typography variant="subtitle1" color="text.secondary">Heart Rate</Typography>
              <Typography variant="h4">{heartRate} bpm</Typography>
              <Typography variant="caption" color="text.secondary">
                {getHeartRateRecommendation(heartRate)}
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Personalized Recommendations
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            {getGeneralRecommendations().map((rec, index) => (
              <Box component="li" key={index} sx={{ mb: 1 }}>
                <Typography variant="body1">
                  {rec}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {isAtRisk && (
          <Box mt={3} p={2} bgcolor="error.light" borderRadius={1}>
            <Box display="flex" alignItems="center">
              <Warning color="error" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" color="error.dark">
                Important: This assessment suggests potential heart disease risk. Please consult with a healthcare professional for proper evaluation and guidance.
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 5 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultModal;