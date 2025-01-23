import React from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './Home.css'; // Import the custom CSS file

const Home: React.FC = () => {
  const inputs = [
    { title: "CP (Chest Pain Type)", description: "Chest pain type: 0 = Typical angina, 1 = Atypical angina, 2 = Non-anginal pain, 3 = Asymptomatic." },
    { title: "TrestBPS (Resting Blood Pressure)", description: "Resting blood pressure in mm/Hg when admitted to the hospital." },
    { title: "Chol (Serum Cholesterol)", description: "The patient’s cholesterol level in mg/dl." },
    { title: "FBS (Fasting Blood Sugar)", description: "Indicates whether the patient’s fasting blood sugar categorized as above 120 mg/dl (1 = true, 0 = false)." },
    { title: "RestECG (Resting Electrocardiographic Results)", description: "Results of the patient’s resting electrocardiogram: 0 = Normal, 1 = ST-T wave abnormality, 2 = Showing probable or definite left ventricular hypertrophy." },
    { title: "Thalach (Maximum Heart Rate Achieved)", description: "The patient’s maximum recorded heart rate during physical activity." },
    { title: "Exang (Exercise-Induced Angina)", description: "Indicates whether the patient experiences angina as a result of exercise (1 = yes, 0 = no)." },
    { title: "Oldpeak", description: "ST depression induced by exercise relative to rest." },
    { title: "Slope", description: "Slope of the peak exercise ST segment: 0 = Upsloping, 1 = Flat, 2 = Downsloping." },
    { title: "CA (Number of Major Vessels)", description: "Number of major vessels (0–3) colored by fluoroscopy." },
    { title: "Thal (Thalassemia)", description: "A blood disorder used as a diagnostic input: 0 = Normal, 1 = Fixed defect, 2 = Reversible defect, 3 = Not described." },
  ];

  return (
    <Box className="home-container">
      <Paper className="paper-container">
        <Typography className="title" variant="h3" component="h1" gutterBottom>
          Welcome to the Heartview
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography className="section-header" variant="h5" gutterBottom>
            About This Project
          </Typography>
          <Typography className="section-description" variant="h5" gutterBottom>
            This application utilizes a trained Machine Learning (ML) model to predict the likelihood of heart disease based on several medical parameters. By analyzing the data you provide, the model gives a probability of heart disease presence. This tool is meant for preliminary awareness and should not replace professional medical advice.
          </Typography>
          <Typography className="section-description" variant="h5" gutterBottom>
            <strong>Important:</strong> This prediction is not 100% accurate. Please consult a qualified healthcare professional for an accurate diagnosis and advice.
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography className="section-header" variant="h5" gutterBottom>
            Required Inputs and Descriptions
          </Typography>
          {inputs.map((input, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="accordion-summary" variant="h6">{input.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className="accordion-details" variant="h6">{input.description}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography className="section-header" variant="h5" gutterBottom>
            How It Works
          </Typography>
          <Typography className="section-description" variant="h5" gutterBottom>
            1. Register or log in to access the prediction tool.
          </Typography>
          <Typography className="section-description" variant="h5" gutterBottom>
            2. Navigate to the input page and provide the required medical details such as age, blood pressure, cholesterol levels, and other health parameters.
          </Typography>
          <Typography className="section-description" variant="h5" gutterBottom>
            3. Submit your data to receive a prediction about your heart health.
          </Typography>
          <Typography className="section-description" variant="h5" gutterBottom>
            4. View your prediction history and monitor changes over time.
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography className="section-header" variant="h5" gutterBottom>
            Features of This Application
          </Typography>
          <Typography className="section-description" variant="h5" gutterBottom>
            - Easy-to-use interface for inputting health data.
          </Typography>
          <Typography className="section-description" variant="h5" gutterBottom>
            - Secure storage of user information with end-to-end encryption.
          </Typography>
          <Typography className="section-description" variant="h5" gutterBottom>
            - Ability to track prediction history for better monitoring of heart health trends.
          </Typography>
          <Typography className="section-description" variant="h5" gutterBottom>
            - Access your profile and update information anytime.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
