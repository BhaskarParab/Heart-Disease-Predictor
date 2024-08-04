import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import './InputPage.css';

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

  const handleTextFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    setFormData(prevState => ({ ...prevState, [name]: numericValue }));
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
      const token = localStorage.getItem('token');
      const response = await axios.post<PredictionResponse>(
        'http://127.0.0.1:8000/predict',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrediction(response.data.prediction);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch prediction. Please try again later.');
    }
  };

  return (
    <div className="input-page">
      {/* <Navbar title="Heart Disease Predictor" onLogout={onLogout} /> */}
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
                {/* <MenuItem value="" disabled>Select Gender</MenuItem> */}
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
       
      </form>
      <div className='Submit'>
      <Button type="submit" variant="contained" color="primary">Submit</Button>
      </div>
      {prediction !== null && <Typography variant="h5" color="textSecondary" className="prediction-result">Prediction: {prediction}</Typography>}
      {error && <Typography variant="body1" color="error" className="error-message">{error}</Typography>}
    </div>
  );
}

export default InputPage;
