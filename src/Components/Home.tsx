import type React from "react";
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
  CardMedia,
  Button,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { styled } from "@mui/material/styles"
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety"
import TimelineIcon from "@mui/icons-material/Timeline"
import SecurityIcon from "@mui/icons-material/Security"
import PersonIcon from "@mui/icons-material/Person"

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
}))

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  borderRadius: "8px !important",
  "&:before": {
    display: "none",
  },
}))

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: "#2196f3",
  color: "#ffffff",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#1976d2",
  },
}))

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
  },
}))

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  backgroundSize: "contain",
})

// const GradientTypography = styled(Typography)(({ theme }) => ({
//   background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
//   WebkitBackgroundClip: "text",
//   WebkitTextFillColor: "transparent",
//   fontWeight: "bold",
// }))

const Home: React.FC = () => {
  const navigate = useNavigate();
  const inputs = [
    {
      title: "CP (Chest Pain Type)",
      description: "Chest pain type: 0 = Typical angina, 1 = Atypical angina, 2 = Non-anginal pain, 3 = Asymptomatic.",
    },
    {
      title: "TrestBPS (Resting Blood Pressure)",
      description: "Resting blood pressure in mm/Hg when admitted to the hospital.",
    },
    { title: "Chol (Serum Cholesterol)", description: "The patient's cholesterol level in mg/dl." },
    {
      title: "FBS (Fasting Blood Sugar)",
      description:
        "Indicates whether the patient's fasting blood sugar categorized as above 120 mg/dl (1 = true, 0 = false).",
    },
    {
      title: "RestECG (Resting Electrocardiographic Results)",
      description:
        "Results of the patient's resting electrocardiogram: 0 = Normal, 1 = ST-T wave abnormality, 2 = Showing probable or definite left ventricular hypertrophy.",
    },
    {
      title: "Thalach (Maximum Heart Rate Achieved)",
      description: "The patient's maximum recorded heart rate during physical activity.",
    },
    {
      title: "Exang (Exercise-Induced Angina)",
      description: "Indicates whether the patient experiences angina as a result of exercise (1 = yes, 0 = no).",
    },
    { title: "Oldpeak", description: "ST depression induced by exercise relative to rest." },
    { title: "Slope", description: "Slope of the peak exercise ST segment: 0 = Upsloping, 1 = Flat, 2 = Downsloping." },
    { title: "CA (Number of Major Vessels)", description: "Number of major vessels (0–3) colored by fluoroscopy." },
    {
      title: "Thal (Thalassemia)",
      description:
        "A blood disorder used as a diagnostic input: 0 = Normal, 1 = Fixed defect, 2 = Reversible defect, 3 = Not described.",
    },
  ]

  const features = [
    {
      title: "Easy Data Input",
      description: "User-friendly interface for inputting health data.",
      icon: <HealthAndSafetyIcon sx={{ fontSize: 60, color: "#4caf50" }} />,
    },
    {
      title: "Secure Storage",
      description: "End-to-end encryption for user information.",
      icon: <SecurityIcon sx={{ fontSize: 60, color: "#f44336" }} />,
    },
    {
      title: "Prediction History",
      description: "Track and monitor heart health trends over time.",
      icon: <TimelineIcon sx={{ fontSize: 60, color: "#2196f3" }} />,
    },
    {
      title: "Profile Management",
      description: "Access and update your information anytime.",
      icon: <PersonIcon sx={{ fontSize: 60, color: "#ff9800" }} />,
    },
  ]

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* <GradientTypography variant="h2" color="blue" gutterBottom align="center">
          Welcome to Heartview
        </GradientTypography> */}

        <StyledPaper elevation={3}>
          <Typography variant="h4" gutterBottom color="primary">
            About This Project
          </Typography>
          <Typography variant="body1" paragraph>
            Heartview is a cutting-edge application that harnesses the power of Machine Learning (ML) to predict the
            likelihood of heart disease. By analyzing a comprehensive set of medical parameters, our advanced model
            provides you with a probability assessment of heart disease presence.
          </Typography>
          <Typography variant="body1" paragraph>
            Our goal is to empower you with knowledge about your heart health, enabling early awareness and proactive
            healthcare decisions. However, it's crucial to understand that this tool is designed for preliminary
            screening and should not replace professional medical advice.
          </Typography>
          <Typography variant="body1" paragraph fontWeight="bold" color="error">
            Important: While our prediction model is highly sophisticated, it is not infallible. We strongly recommend
            consulting with a qualified healthcare professional for an accurate diagnosis and personalized medical
            advice.
          </Typography>
        </StyledPaper>

        <StyledPaper elevation={3}>
          <Typography variant="h4" gutterBottom color="primary">
            Required Inputs
          </Typography>
          <Typography variant="body1" paragraph>
            To generate an accurate prediction, we need specific medical data. Each of these inputs plays a crucial role
            in our ML model's analysis. Expand each item to learn more about what's required and why it's important.
          </Typography>
          {inputs.map((input, index) => (
            <StyledAccordion key={index}>
              <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">{input.title}</Typography>
              </StyledAccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">{input.description}</Typography>
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </StyledPaper>

        <StyledPaper elevation={3}>
          <Typography variant="h4" gutterBottom color="primary">
            How It Works
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                1. Register or log in to access our state-of-the-art prediction tool.
              </Typography>
              <Typography variant="body1" paragraph>
                2. Navigate to the input page and provide your medical details. Don't worry, we guide you through each
                step!
              </Typography>
              <Typography variant="body1" paragraph>
                3. Submit your data to our ML model, which processes the information using advanced algorithms.
              </Typography>
              <Typography variant="body1" paragraph>
                4. Receive your heart health prediction instantly, presented in an easy-to-understand format.
              </Typography>
              <Typography variant="body1" paragraph>
                5. Access your prediction history to monitor changes and trends in your heart health over time.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCardMedia image="/placeholder.svg?height=300&width=400" title="How It Works" />
            </Grid>
          </Grid>
        </StyledPaper>

        <Typography variant="h4" gutterBottom color="primary" align="center" sx={{ mt: 4 }}>
          Features of Heartview
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h6" component="div" align="center">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <div onClick={() => navigate('/input')} style={{ cursor: 'pointer' }}>
          <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 28, px: 4 }}>
            Get Started Now
          </Button>
          </div>
        </Box>

        <StyledPaper elevation={3} sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Why Choose Heartview?
          </Typography>
          <Typography variant="body1" paragraph>
            Heartview stands at the forefront of preventive healthcare technology. Our application combines the latest
            advancements in machine learning with a user-friendly interface to provide you with valuable insights into
            your heart health.
          </Typography>
          <Typography variant="body1" paragraph>
            By using Heartview, you're taking a proactive step towards understanding and managing your cardiovascular
            health. Early awareness of potential heart issues can lead to timely interventions and lifestyle changes,
            potentially improving your overall health outcomes.
          </Typography>
          <Typography variant="body1" paragraph>
            Remember, knowledge is power when it comes to your health. Start your journey towards a healthier heart with
            Heartview today!
          </Typography>
        </StyledPaper>
      </Box>
    </Container>
  )
}

export default Home

