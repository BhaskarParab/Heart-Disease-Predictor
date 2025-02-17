import React, { useEffect, useState } from 'react';
import { Typography, Container, Paper, Avatar, TextField } from '@mui/material';
import { AccountCircle, Email, Wc, Cake, Edit, Save } from '@mui/icons-material';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

interface User {
  username: string;
  email: string;
  gender: string;
  dob: string;
  photoURL: string | null;
  isGoogleUser: boolean;
}

const MyAccount: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      setLoading(true);

      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const isGoogleUser = currentUser.providerData.some(
            (provider) => provider.providerId === 'google.com'
          );

          const db = getFirestore();
          const userRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser({
              username: userData.username || currentUser.displayName || 'N/A',
              email: currentUser.email || 'N/A',
              gender: userData.gender || 'N/A',
              dob: userData.dob || 'N/A',
              photoURL: currentUser.photoURL || null,
              isGoogleUser,
            });
            setNewUsername(userData.username || currentUser.displayName || '');
          } else {
            setUser({
              username: currentUser.displayName || 'N/A',
              email: currentUser.email || 'N/A',
              gender: 'N/A',
              dob: currentUser.metadata.creationTime || 'N/A',
              photoURL: currentUser.photoURL || null,
              isGoogleUser,
            });
            setNewUsername(currentUser.displayName || '');
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!user || user.isGoogleUser) return;

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', currentUser.uid);

        await updateDoc(userRef, {
          username: newUsername,
        });

        setUser((prev) => prev ? { ...prev, username: newUsername } : null);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating username:', error);
        setError('Failed to update username. Please try again.');
      }
    }
  };

  if (loading) {
    return <Typography color="textSecondary">Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', textAlign: 'center' }}>
        {user?.photoURL && (
          <Avatar
            src={user.photoURL}
            alt="Profile Picture"
            sx={{ width: 100, height: 100, margin: 'auto', marginBottom: 2 }}
          />
        )}
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <hr />
        {user && (
          <>
            <Typography variant="body1">
              <AccountCircle style={{ marginRight: '8px', verticalAlign: 'middle', color: 'grey' }} />
              <strong style={{ color: 'black' }}>Username:</strong> 
              {user.isGoogleUser ? (
                <span style={{ color: 'black', marginLeft: '10px' }}>{user.username}</span>
              ) : (
                isEditing ? (
                  <TextField
                    variant="standard"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    style={{ marginLeft: '10px' }}
                  />
                ) : (
                  <span style={{ color: 'black', marginLeft: '10px' }}>{user.username}</span>
                )
              )}
              {!user.isGoogleUser && (
                isEditing ? (
                  <Save
                    onClick={handleSaveClick}
                    style={{ marginLeft: '10px', cursor: 'pointer', color: 'green' }}
                  />
                ) : (
                  <Edit
                    onClick={handleEditClick}
                    style={{ marginLeft: '10px', cursor: 'pointer', color: 'blue' }}
                  />
                )
              )}
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