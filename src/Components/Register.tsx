import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link as MuiLink,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    email: string;
    gender: string;
    dob: string;
  }>({
    username: '',
    password: '',
    email: '',
    gender: '',
    dob: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    
    if (name === 'email') {
      setTouched(true);
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched(true);

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      console.log('Submitting data:', formData);
      const response = await axios.post('http://127.0.0.1:8000/register', formData);
      console.log('Response:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Box
      style={{
        backgroundImage: 'url(/bgimage.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container
        maxWidth="xs"
        style={{
          backgroundColor: 'rgba(255, 255, 255)',
          padding: '2rem',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            helperText={touched && !validateEmail(formData.email) ? "Please enter a valid email address." : ""}
            error={touched && !validateEmail(formData.email)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleSelectChange}
              label="Gender"
              required
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="dob"
            label="Date of Birth"
            type="date"
            id="dob"
            InputLabelProps={{ shrink: true }}
            value={formData.dob}
            onChange={handleChange}
          />
          <Box mt={2} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ ml: 9, mb: 3, mt: 2 }}
          >
            Register
          </Button>
          <br />
          <div className='login'>
             <Typography variant="body2" color="textSecondary" align="center" mr={-19} mt={-2}>
              Already have an account? <span><MuiLink href="/">Login</MuiLink></span>
            </Typography>
            {error && <Alert severity="error" sx={{ mt: 2, mr: -20 }}>{error}</Alert>}
           
          </div>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
