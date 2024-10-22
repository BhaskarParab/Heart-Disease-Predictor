import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, Paper } from '@mui/material';
import { AccountCircle, Email, Wc, Cake } from '@mui/icons-material'; // Import Material-UI icons

interface User {
  username: string;
  email: string;
  gender: string;
  dob: string;
}

const MyAccount: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<User>('http://127.0.0.1:8000/myaccount', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again later.');
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <hr/> 
        {user && (
          <>
            <Typography variant="body2">
              <AccountCircle style={{ marginRight: '8px', verticalAlign: 'middle', color: 'grey' }} />
              <strong style={{color: 'black'}}>Username:</strong> <span style={{ color: 'black' }}>{user.username}</span>
            </Typography>
            <br/>
            <Typography variant="body1">
              <Email style={{ marginRight: '8px', verticalAlign: 'middle', color: 'grey' }} />
              <strong style={{color: 'black'}}>Email:</strong> <span style={{ color: 'black' }}>{user.email}</span>
            </Typography>
            <br/>
            <Typography variant="body1">
              <Wc style={{ marginRight: '8px', verticalAlign: 'middle', color: 'grey'}} />
              <strong style={{color: 'black'}}>Gender:</strong> <span style={{ color: 'black' }}>{user.gender}</span>
            </Typography>
            <br/>
            <Typography variant="body1">
              <Cake style={{ marginRight: '8px', verticalAlign: 'middle', color: 'grey'}} />
              <strong style={{color: 'black'}}>Date of Birth:</strong> <span style={{ color: 'black' }}>{user.dob}</span>
            </Typography>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default MyAccount;
