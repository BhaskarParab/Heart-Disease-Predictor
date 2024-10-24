import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Box,
} from '@mui/material';

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState<{ username: string; password: string }>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/token', new URLSearchParams(formData));
      localStorage.setItem('token', response.data.access_token);
      setIsAuthenticated(true);
      navigate('/input');
    } catch (error) {
      console.error('Error:', error);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box    style={{
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
          Login
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
            sx ={{ml: 10}}
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
            sx={{mt: 12, ml: -10, width:145}}
          />
         
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2 , ml: 10}}
          >
            Login
          </Button>
          <br/>
          <div className='error'>
          {error && (
            <Box mt={4} mr={-20}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          </div>
          <Typography variant="body2" color="textSecondary" align="center" mt={-1} ml={-45} mr={-30}>
            Don't have an account? <Link href="/register">Register</Link>
          </Typography>


        </Box>
      {/* </Box> */}
    </Container>
    </Box>
  );
};

export default Login;
