import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InputPage.css';
import Navbar from './Inputpagenavbar';

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

const InputPage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: FormData) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    setFormData((prevState: FormData) => ({
      ...prevState,
      [name]: numericValue,
    }));
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
      const response = await axios.post<PredictionResponse>('http://127.0.0.1:8000/predict', data);
      setPrediction(response.data.prediction);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch prediction. Please try again later.');
    }
  };

  return (
    <div className="input-page">
      <Navbar title="Heart Disease Predictor" />
      <form onSubmit={handleSubmit} className="input-form">
        {Object.keys(formData).map((feature, index) => (
          feature === 'feature2' ? (
            <select
              key={index}
              name={feature}
              value={formData[feature as keyof FormData]}
              onChange={handleChange}
              required
              className="input-select"
            >
              <option value="" disabled>Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          ) : (
            <input
              key={index}
              type="text"
              name={feature}
              placeholder={placeholders[feature as keyof FormData] || feature}
              value={formData[feature as keyof FormData]}
              onChange={handleChange}
              onInput={handleInput}
              required
              className="input-field"
            />
          )
        ))}
        <button type="submit" className="submit-button">Submit</button>
      </form>
      {prediction !== null && <h2 className="prediction-result">Prediction: {prediction}</h2>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default InputPage;
