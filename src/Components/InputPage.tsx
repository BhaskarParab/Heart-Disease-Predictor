import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { getAuth, getIdToken } from 'firebase/auth';
import ResultModal from './ResultModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featureLabels = [
    'Age', 'Gender', 'CP', 'TrestBPS', 'Chol', 'FBS', 'RestECG',
    'Thalch', 'Exang', 'Oldpeak', 'Slope', 'CA', 'Thal'
  ];

  const featureIcons = [
    'person', 'wc', 'monitor_heart', 'favorite', 'cardiology', 'health_metrics',
    'medication', 'ecg', 'heart_plus', 'healing', 'medical_services', 'local_hospital', 'psychology'
  ];

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
    sessionStorage.setItem('formData', JSON.stringify(updatedData));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    sessionStorage.setItem('formData', JSON.stringify(updatedData));
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    const updatedData = { ...formData, [name]: numericValue };
    setFormData(updatedData);
    sessionStorage.setItem('formData', JSON.stringify(updatedData));
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
      const authInstance = getAuth();
      const user = authInstance.currentUser;
      if (!user) {
        setError('No user found. Please log in again.');
        return;
      }

      const token = await getIdToken(user);
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
    setIsModalOpen(false);
  };

  return (
    <div id="webcrumbs">
      <div className="w-full max-w-[90%] lg:max-w-[1000px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-2xl p-6 md:p-8">
        <header className="text-center mb-12">
          <p className="text-lg mt-4 text-gray-600">Advanced Heart Health Analysis System</p>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300">
            HeartView AI Prediction
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="grid grid-cols-3 gap-6">
              {Object.keys(formData).map((feature, index) => (
                <div key={feature} className="relative group">
                  {feature === 'feature2' ? (
                    <FormControl fullWidth>
                      <InputLabel id={`label-${feature}`}>Gender</InputLabel>
                      <Select
                        labelId={`label-${feature}`}
                        name={feature}
                        value={formData[feature as keyof FormData]}
                        onChange={handleSelectChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                      >
                        <MenuItem value="M">Male</MenuItem>
                        <MenuItem value="F">Female</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      type="text"
                      name={feature}
                      label={featureLabels[index]}
                      value={formData[feature as keyof FormData]}
                      onChange={handleTextFieldChange}
                      onInput={handleInput}
                      fullWidth
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                    />
                  )}
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
                    {featureIcons[index]}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-4 gap-6">
            {["Accuracy", "Security", "Real-time", "AI Powered"].map((feature, index) => (
              <div key={feature} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <span className="material-symbols-outlined text-4xl text-blue-500 mb-4">
                  {["precision_manufacturing", "security", "speed", "smart_toy"][index]}
                </span>
                <h3 className="font-semibold mb-2">{feature}</h3>
                <p className="text-sm text-gray-600">Advanced healthcare analysis feature</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="text-red-600 text-center p-4 rounded-lg bg-red-50">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="contained"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span className="material-symbols-outlined">medical_services</span>
            <span>Analyze Heart Health</span>
          </Button>
        </form>
      </div>

      <ResultModal
        open={isModalOpen}
        prediction={prediction}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default InputPage;