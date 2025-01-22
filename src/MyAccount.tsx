import React, { useEffect, useState } from 'react';
import { Typography, Container, Paper } from '@mui/material';
import { AccountCircle, Email, Wc, Cake } from '@mui/icons-material';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth methods
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore methods

interface User {
  username: string;
  email: string;
  gender: string;
  dob: string;
}

const MyAccount: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Firebase user data
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      setLoading(true);

      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Fetch additional user data from Firestore
          const db = getFirestore();
          const userRef = doc(db, 'users', currentUser.uid); // Assuming user data is stored in 'users' collection
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser({
              username: currentUser.displayName || 'N/A',
              email: currentUser.email || 'N/A',
              gender: userData.gender || 'N/A',
              dob: userData.dob || 'N/A',
            });
          } else {
            // If no data is found in Firestore, fall back to Firebase metadata or default values
            setUser({
              username: currentUser.displayName || 'N/A',
              email: currentUser.email || 'N/A',
              gender: 'N/A', // Default value for gender if not available
              dob: currentUser.metadata.creationTime || 'N/A', // Creation time as a fallback for Date of Birth
            });
          }
        } else {
          setError('User not authenticated.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Typography color="textSecondary">Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <hr />
        {user && (
          <>
            <Typography variant="body2">
              <AccountCircle style={{ marginRight: '8px', verticalAlign: 'middle', color: 'grey' }} />
              <strong style={{ color: 'black' }}>Username:</strong> <span style={{ color: 'black' }}>{user.username}</span>
            </Typography>
            <br />
            <Typography variant="body1">
              <Email style={{ marginRight: '8px', verticalAlign: 'middle', color: 'grey' }} />
              <strong style={{ color: 'black' }}>Email:</strong> <span style={{ color: 'black' }}>{user.email}</span>
            </Typography>
            <br />
            <Typography variant="body1">
              <Wc style={{ marginRight: '8px', verticalAlign: 'middle', color: 'grey' }} />
              <strong style={{ color: 'black' }}>Gender:</strong> <span style={{ color: 'black' }}>{user.gender}</span>
            </Typography>
            <br />
            <Typography variant="body1">
              <Cake style={{ marginRight: '8px', verticalAlign: 'middle', color: 'grey' }} />
              <strong style={{ color: 'black' }}>Date of Birth:</strong> <span style={{ color: 'black' }}>{user.dob}</span>
            </Typography>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default MyAccount;
