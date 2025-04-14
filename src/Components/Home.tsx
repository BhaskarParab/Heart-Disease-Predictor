import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  useTheme,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import {
  // Favorite,
  // ShowChart,
  Security,
  Timeline,
  Info,
  // FavoriteBorder,
} from "@mui/icons-material";
import {
  MonitorHeart,      // For CP
  Favorite,          // For TrestBPS
  Medication,        // For Chol
  HealthAndSafety,   // For FBS
  ShowChart,         // For RestECG
  AddCircleOutline,  // For Thalach (ecg)
  MedicalServices,   // For Oldpeak
  LocalHospital,     // For CP alternative
  Psychology         // For Thal
} from "@mui/icons-material";
import './Home.css';
import InputPageNavbar from "../Inputpagenavbar";

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledInputCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[8],
  },
  border: `1px solid ${theme.palette.primary.light}`,
}));

const FlipCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '81%',
  height: '268px',
  transition: 'transform 0.4s',
  borderRadius: theme.shape.borderRadius * 7,
  transformStyle: 'preserve-3d',
  cursor: 'pointer',
  '&.flipped': {
    transform: 'rotateY(180deg)',
  },
}));

const CardFace = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 7,
  boxShadow: theme.shadows[2],
}));

const FrontFace = styled(CardFace)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.primary.main}`,
}));

const BackFace = styled(CardFace)(({ theme }) => ({
  background: 'linear-gradient(135deg,rgb(122, 170, 219) 0%,rgb(155, 126, 227) 100%)',
  color: '#ffffff',
  backgroundColor: theme.palette.primary.light,
  transform: 'rotateY(180deg)',
  justifyContent: 'flex-start',
}));

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const healthParams = [
    {
      param: "CP (Chest Pain Type)",
      icon: <MonitorHeart fontSize="large" color="error" />,
      description: "Type of chest pain experienced",
      importance: "Helps identify angina (reduced blood flow to heart)",
      example: "0: Asymptomatic, 1: Typical angina, 2: Atypical angina, 3: Non-anginal pain",
    },
    {
      param: "TrestBPS (Resting Blood Pressure)",
      icon: <Favorite fontSize="large" color="primary" />,
      description: "Resting blood pressure in mm Hg",
      importance: "High values indicate hypertension risk",
      normalRange: "90-120 mm Hg (adults)",
      example: "Normal: 120/80 mm Hg",
    },
    {
      param: "Chol (Cholesterol)",
      icon: <Medication fontSize="large" color="secondary" />,
      description: "Serum cholesterol in mg/dl",
      importance: "High cholesterol increases heart disease risk",
      normalRange: "< 200 mg/dL (healthy adults)",
      example: "Borderline high: 200-239 mg/dL",
    },
    {
      param: "FBS (Fasting Blood Sugar)",
      icon: <HealthAndSafety fontSize="large" color="action" />,
      description: "Fasting blood sugar > 120 mg/dl",
      importance: "Indicates diabetes risk",
      normalRange: "70-100 mg/dL (fasting)",
      example: "Diabetes threshold: ≥ 126 mg/dL",
    },
    {
      param: "RestECG (Resting ECG)",
      icon: <ShowChart fontSize="large" color="success" />,
      description: "Resting electrocardiogram results",
      importance: "Detects heart rhythm abnormalities",
      example: "0: Normal, 1: ST-T wave abnormality, 2: Left ventricular hypertrophy",
    },
    {
      param: "Thalach (Max Heart Rate)",
      icon: <AddCircleOutline fontSize="large" color="error" />,
      description: "Maximum heart rate achieved",
      importance: "Lower values may indicate heart issues",
      normalRange: "60-100 bpm (resting)",
      example: "Exercise-induced: 150-170 bpm (varies by age)",
    },
    {
      param: "Exang (Exercise Induced Angina)",
      icon: <AddCircleOutline fontSize="large" color="primary" />,
      description: "Chest pain during exercise",
      importance: "Indicates coronary artery disease",
      example: "0: No, 1: Yes",
    },
    {
      param: "Oldpeak (ST Depression)",
      icon: <MedicalServices fontSize="large" color="secondary" />,
      description: "ST depression induced by exercise",
      importance: "Measures heart stress during exercise",
      normalRange: "0-1 mm (normal)",
      example: "Depression > 2mm indicates ischemia",
    },
    {
      param: "Slope (ST Segment Slope)",
      icon: <MedicalServices fontSize="large" color="action" />,
      description: "Slope of peak exercise ST segment",
      importance: "Indicates coronary artery disease severity",
      example: "1: Upsloping, 2: Flat, 3: Downsloping",
    },
    {
      param: "CA (Major Vessels)",
      icon: <LocalHospital fontSize="large" color="success" />,
      description: "Number of major vessels colored by fluoroscopy",
      importance: "More vessels may indicate severe blockage",
      normalRange: "0 (healthy)",
      example: "0-3 vessels visible",
    },
    {
      param: "Thal (Thalassemia)",
      icon: <Psychology fontSize="large" color="action" />,
      description: "Blood disorder affecting hemoglobin",
      importance: "Abnormalities can stress cardiovascular system",
      example: "3: Normal, 6: Fixed defect, 7: Reversible defect",
    }
  ];

  const [flippedCards, setFlippedCards] = useState<boolean[]>(
    new Array(healthParams.length).fill(false)
  );

  const features = [
    {
      icon: <Favorite fontSize="large" color="error" />,
      title: "AI-Powered Predictions",
      desc: "Advanced machine learning algorithms for accurate heart health assessment"
    },
    {
      icon: <ShowChart fontSize="large" color="success" />,
      title: "Comprehensive Analysis",
      desc: "Detailed breakdown of key health indicators and their impacts"
    },
    {
      icon: <Security fontSize="large" color="info" />,
      title: "Secure Data Handling",
      desc: "Military-grade encryption for all your health data"
    },
    {
      icon: <Timeline fontSize="large" color="warning" />,
      title: "Progress Tracking",
      desc: "Monitor your heart health trends over time"
    },
  ];



  const faqs = [
    { q: "Why do you need all these inputs?", a: "Each input provides crucial information that helps our AI model assess your heart health accurately." },
    { q: "What if I don't know all the values?", a: "Consult with your healthcare provider to get accurate values." },
    { q: "Is my data secure?", a: "We use state-of-the-art encryption and security measures." }
  ];

  const handleCardClick = (index: number) => {
    const newFlippedCards = [...flippedCards];
    newFlippedCards[index] = !newFlippedCards[index];
    setFlippedCards(newFlippedCards);
  };


  return (
    <Box sx={{ background: 'linear-gradient(135deg, #f8fbff 0%, #fcf4ff 100%)' }}>
      <InputPageNavbar title="HeartView" />
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" py={8}>
          <GradientText variant="h2" gutterBottom>
            Welcome to HeartView
          </GradientText>
          <Typography variant="h5" color="textSecondary" paragraph>
            Empowering you with AI-driven heart health predictions
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/input')}
            sx={{ mt: 3, borderRadius: 20, px: 6, py: 2 }}
          >
            Start Your Heart Health Journey
          </Button>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        {/* Health Parameters Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{
            fontWeight: 'bold',
            fontSize: '43px',
            mb: 3,
            background: 'linear-gradient(45deg, #4F46E5 30%, #9333EA 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Health Parameters We Analyze
          </Typography>
          <Grid container spacing={2}>
            {healthParams.map((item, index) => (
              <Grid item xs={12} md={6} lg={3} key={index} sx={{ mb: 2 }}>
                <FlipCard
                  className={flippedCards[index] ? 'flipped' : ''}
                  onClick={() => handleCardClick(index)}
                  sx={{
                    height: '280px',  // Reduced height from 300px
                    margin: '0 auto'  // Center the cards
                  }}
                >
                  <FrontFace sx={{ p: 2 }}>
                    <Box sx={{ color: 'primary.main', fontSize: '2rem', mb: 1 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" component="h3" sx={{
                      mt: 2,
                      fontWeight: 600,
                      textAlign: 'center'
                    }}>
                      {item.param}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{
                      mt: 1,
                      textAlign: 'center'
                    }}>
                      Click to learn more
                    </Typography>
                  </FrontFace>

                  <BackFace sx={{ p: 2 }}>
                    <Typography variant="h6" component="h3" sx={{
                      fontWeight: 600,
                      color: 'common.white',
                      mb: 2
                    }}>
                      {item.param}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'common.white', mb: 1 }}>
                      <strong>What it measures:</strong> {item.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'common.white', mb: 1 }}>
                      <strong>Why it matters:</strong> {item.importance}
                    </Typography>
                    {item.normalRange && (
                      <Typography variant="body2" sx={{ color: 'common.white', mb: 1 }}>
                        <strong>Healthy Range:</strong> {item.normalRange}
                      </Typography>
                    )}
                    {item.example && (
                      <Typography variant="body2" sx={{ color: 'common.white' }}>
                        <strong>Example:</strong> {item.example}
                      </Typography>
                    )}
                  </BackFace>
                </FlipCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Paper sx={{ p: 4, mb: 8, borderRadius: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Frequently Asked Questions
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ my: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 500 }}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="textSecondary">{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>

        {/* CTA Section */}
        <Box textAlign="center" py={6}>
          <Typography variant="h4" gutterBottom color="primary">
            Ready to Take Control of Your Heart Health?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/input')}
            sx={{ borderRadius: 20, px: 6, py: 2, mt: 3 }}
          >
            Get Your Prediction Now
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 4, mt: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" align="center">
            © 2024 HeartView. All rights reserved.
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
            Disclaimer: This tool is for informational purposes only and should not replace professional medical advice.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;