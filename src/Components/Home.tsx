import React from "react";
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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

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

  const healthParams = [
    { 
      param: "CP (Chest Pain Type)",
      icon: <MonitorHeart fontSize="large" color="error" />
    },
    { 
      param: "TrestBPS",
      icon: <Favorite fontSize="large" color="primary" />
    },
    { 
      param: "Chol",
      icon: <Medication fontSize="large" color="secondary" />
    },
    { 
      param: "FBS",
      icon: <HealthAndSafety fontSize="large" color="action" />
    },
    { 
      param: "RestECG",
      icon: <ShowChart fontSize="large" color="success" />
    },
    { 
      param: "Thalach",
      icon: <AddCircleOutline fontSize="large" color="error" />
    },
    { 
      param: "Exang",
      icon: <AddCircleOutline fontSize="large" color="primary" />
    },
    { 
      param: "Oldpeak",
      icon: <MedicalServices fontSize="large" color="secondary" />
    },
    { 
      param: "Slope",
      icon: <MedicalServices fontSize="large" color="action" />
    },
    { 
      param: "CA",
      icon: <LocalHospital fontSize="large" color="success" />
    },
    { 
      param: "Thal",
      icon: <Psychology fontSize="large" color="action" />
    }
  ];

  const faqs = [
    { q: "Why do you need all these inputs?", a: "Each input provides crucial information that helps our AI model assess your heart health accurately." },
    { q: "What if I don't know all the values?", a: "Consult with your healthcare provider to get accurate values." },
    { q: "Is my data secure?", a: "We use state-of-the-art encryption and security measures." }
  ];

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
     <Box sx={{ mb: 8 }}>
  <Typography variant="h4" gutterBottom align="center" sx={{ 
    fontWeight: 'bold', 
    mb: 6,
    background: 'linear-gradient(45deg, #4F46E5 30%, #9333EA 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}>
    Health Parameters We Analyze
  </Typography>
  <Grid container spacing={4}>
    {healthParams.map((item, index) => (
      <Grid item xs={12} md={6} lg={4} key={index}>
        <Paper
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 4,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: 3,
              transform: 'translateY(-4px)'
            },
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{
            color: 'primary.main',
            mb: 2,
            fontSize: '2.5rem',
            borderRadius: '50%',
            p: 0.5,
          }}>
            {item.icon}
          </Box>
          <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
            {item.param}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive analysis of your {item.param.toLowerCase()} levels
          </Typography>
        </Paper>
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