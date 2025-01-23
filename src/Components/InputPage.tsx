import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { getAuth, getIdToken } from 'firebase/auth'; // Import necessary Firebase functions
import './InputPage.css';
import ResultModal from './ResultModal';

interface FormData {
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
  feature5: string;
  feature6: string;
  feature7: string;
  feature8: string;
  feature9: string;
  feature10: string;
  feature11: string;
  feature12: string;
  feature13: string;
}

interface PredictionResponse {
  prediction: string;
}

interface InputPageProps {
  onLogout: () => void;
}

const InputPage: React.FC<InputPageProps> = ({ onLogout }) => {
  const [formData, setFormData] = useState<FormData>({
    feature1: '',
    feature2: '',
    feature3: '',
    feature4: '',
    feature5: '',
    feature6: '',
    feature7: '',
    feature8: '',
    feature9: '',
    feature10: '',
    feature11: '',
    feature12: '',
    feature13: '',
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const placeholders: { [key in keyof FormData]: string } = {
    feature1: 'Age',
    feature2: 'Gender (M/F)',
    feature3: 'CP',
    feature4: 'TrestBPS',
    feature5: 'Chol',
    feature6: 'FBS',
    feature7: 'RestECG',
    feature8: 'Thalch',
    feature9: 'Exang',
    feature10: 'Oldpeak',
    feature11: 'Slope',
    feature12: 'CA',
    feature13: 'Thal',
  };

  // Load form data from sessionStorage if available
  useEffect(() => {
    const savedData = sessionStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleTextFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    sessionStorage.setItem('formData', JSON.stringify(updatedData)); // Save to sessionStorage
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    sessionStorage.setItem('formData', JSON.stringify(updatedData)); // Save to sessionStorage
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    const updatedData = { ...formData, [name]: numericValue };
    setFormData(updatedData);
    sessionStorage.setItem('formData', JSON.stringify(updatedData)); // Save to sessionStorage
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      ...formData,
      feature1: parseFloat(formData.feature1),
      feature2: formData.feature2,
      feature3: parseFloat(formData.feature3),
      feature4: parseFloat(formData.feature4),
      feature5: parseFloat(formData.feature5),
      feature6: parseFloat(formData.feature6),
      feature7: parseFloat(formData.feature7),
      feature8: parseFloat(formData.feature8),
      feature9: parseFloat(formData.feature9),
      feature10: parseFloat(formData.feature10),
      feature11: parseFloat(formData.feature11),
      feature12: parseFloat(formData.feature12),
      feature13: parseFloat(formData.feature13),
    };

    const areFieldsValid = Object.entries(data).every(([key, value]) => {
      if (key === 'feature2') {
        return value === 'M' || value === 'F';
      } else {
        return !isNaN(value as number) && value !== '';
      }
    });

    if (!areFieldsValid) {
      setError('Please fill all fields with valid numbers and valid gender (M/F).');
      return;
    }

    try {
      const authInstance = getAuth(); // Initialize Firebase Auth
      const user = authInstance.currentUser;
      if (!user) {
        setError('No user found. Please log in again.');
        return;
      }

      const token = await getIdToken(user); // Get the Firebase ID token
      const response = await axios.post<PredictionResponse>(
        'http://127.0.0.1:8000/predict',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrediction(String(response.data.prediction));
      setIsModalOpen(true);
      setError(null);

      // Reset form data and sessionStorage after successful submission
      setFormData({
        feature1: '',
        feature2: '',
        feature3: '',
        feature4: '',
        feature5: '',
        feature6: '',
        feature7: '',
        feature8: '',
        feature9: '',
        feature10: '',
        feature11: '',
        feature12: '',
        feature13: '',
      });
      sessionStorage.removeItem('formData');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch prediction. Please try again later.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="input-page">
      <form onSubmit={handleSubmit} className="input-form">
        {Object.keys(formData).map((feature, index) => (
          feature === 'feature2' ? (
            <FormControl key={index} fullWidth margin="normal">
              <InputLabel id={`label-${feature}`}>Gender</InputLabel>
              <Select
                labelId={`label-${feature}`}
                name={feature}
                value={formData[feature as keyof FormData]}
                onChange={handleSelectChange}
                required
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <TextField
              key={index}
              type="text"
              name={feature}
              label={placeholders[feature as keyof FormData] || feature}
              value={formData[feature as keyof FormData]}
              onChange={handleTextFieldChange}
              onInput={handleInput}
              required
              fullWidth
              margin="normal"
            />
          )
        ))}
        <div className="Submit">
          <Button type="submit" variant="contained" color="primary">Submit</Button>
        </div>
      </form>

      {error && <Typography variant="body1" color="error">{error}</Typography>}

      <ResultModal
        open={isModalOpen}
        prediction={prediction}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default InputPage;
