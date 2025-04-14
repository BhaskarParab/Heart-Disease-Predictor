"use client"

import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material"
import { Close, ArrowForward } from "@mui/icons-material"
import DoctorConsultation from "./Doctor-consultation"
import HealthRecommendations from "./Health-recommendations"

interface HealthData {
  cholesterol: number;
  bloodPressure: number;
  heartRate: number;
  riskLevel: number;
}

interface ResultModalProps {
  open: boolean;
  prediction: string | null;
  formData: {
    feature4: string;
    feature5: string;
    feature8: string;
  };
  onClose: () => void;
  // healthData?: HealthData;
}
const ResultModalEnhanced: React.FC<ResultModalProps> = ({
  open,
  prediction,
  formData,
  onClose,
}) => {
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  if (!open) return null

  const isHeartDisease = Number(prediction) === 1

   // Convert form data strings to numbers
   const healthData = {
    cholesterol: parseFloat(formData.feature5) || 0,
    bloodPressure: parseFloat(formData.feature4) || 0,
    heartRate: parseFloat(formData.feature8) || 0,
    riskLevel: isHeartDisease ? 80 : 20 // Set risk level based on prediction
  }

    // // Ensure healthData uses the latest formData values
    // const currentHealthData = {
    //   cholesterol: parseFloat(formData.feature5) || healthData.cholesterol,
    //   bloodPressure: parseFloat(formData.feature4) || healthData.bloodPressure,
    //   heartRate: parseFloat(formData.feature8) || healthData.heartRate,
    //   riskLevel: healthData.riskLevel
    // }
  

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: isHeartDisease ? "error.main" : "success.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          Heart Health Assessment Results
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 4, bgcolor: isHeartDisease ? "error.light" : "success.light", color: "white" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            {isHeartDisease ? "Heart Disease Risk Detected" : "Heart Disease Risk Not Detected"}
          </Typography>
          <Typography variant="body1">
            {isHeartDisease
              ? "Our AI model has detected potential indicators of heart disease based on your input parameters. This is not a diagnosis, but we recommend consulting with a healthcare professional."
              : "Based on the parameters you provided, our AI model did not detect significant indicators of heart disease. However, regular check-ups are still recommended for preventive care."}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Recommendations" />
            <Tab label="Find a Doctor" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <HealthRecommendations healthData={healthData} />
          )}
          {tabValue === 1 && <DoctorConsultation riskLevel={healthData.riskLevel} />}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          variant="contained"
          color={isHeartDisease ? "error" : "primary"}
          endIcon={<ArrowForward />}
          onClick={() => (window.location.href = "/history")}
          sx={{
            borderRadius: 2,
            background: isHeartDisease
              ? "linear-gradient(45deg, #d32f2f 30%, #f44336 90%)"
              : "linear-gradient(45deg, #4F46E5 30%, #9333EA 90%)",
          }}
        >
          View History
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ResultModalEnhanced

