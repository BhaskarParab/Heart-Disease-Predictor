import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistoryPage.css';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Checkbox,
  Button,
  IconButton
} from '@mui/material';
import { getAuth, getIdToken } from 'firebase/auth'; // Import Firebase Auth methods

interface HistoryItem {
  id: string; // Changed from '_id' to 'id' (Firestore document ID)
  feature1: number;
  feature2: number;
  feature3: number;
  feature4: number;
  feature5: number;
  feature6: number;
  feature7: number;
  feature8: number;
  feature9: number;
  feature10: number;
  feature11: number;
  feature12: number;
  feature13: number;
  prediction: string;
}

const HistoryPage: React.FC = () => {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data from the backend
  const fetchData = async () => {
    const auth = getAuth();
    setLoading(true);

    try {
      // Get the Firebase token
      const token = await getIdToken(auth.currentUser!);
      
      const response = await axios.get<HistoryItem[]>('http://127.0.0.1:8000/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Select or deselect a row
  const handleSelect = (id: string) => {
    setSelected((prevSelected) => {
      const updated = new Set(prevSelected);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  // Select or deselect all rows
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((item) => item.id); // Use 'id' instead of '_id'
      setSelected(new Set(allIds));
    } else {
      setSelected(new Set());
    }
  };

  // Delete selected rows
  const handleDelete = async () => {
    const auth = getAuth();
    setLoading(true);

    try {
      // Get the Firebase token
      const token = await getIdToken(auth.currentUser!);

      await Promise.all(
        Array.from(selected).map((id) =>
          axios.delete(`http://127.0.0.1:8000/history/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setData((prevData) => prevData.filter((item) => !selected.has(item.id))); // Use 'id' instead of '_id'
      setSelected(new Set());
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to delete selected history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Check if all items are selected
  const isAllSelected = data.length > 0 && selected.size === data.length;

  return (
    <div className="history-page">
      {error && <Typography className="error" color="error">{error}</Typography>}
      {selected.size > 0 && (
        <div style={{ marginBottom: '10px', textAlign: 'left' }}>
          <IconButton
            color="warning"
            onClick={handleDelete}
            title="Delete Selected"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  indeterminate={selected.size > 0 && selected.size < data.length}
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>CP</TableCell>
              <TableCell>TrestBPS</TableCell>
              <TableCell>Chol</TableCell>
              <TableCell>FBS</TableCell>
              <TableCell>RestECG</TableCell>
              <TableCell>Thalch</TableCell>
              <TableCell>Exang</TableCell>
              <TableCell>Oldpeak</TableCell>
              <TableCell>Slope</TableCell>
              <TableCell>CA</TableCell>
              <TableCell>Thal</TableCell>
              <TableCell>Prediction</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.has(item.id)} // Use 'id' instead of '_id'
                    onChange={() => handleSelect(item.id)} // Use 'id' instead of '_id'
                  />
                </TableCell>
                <TableCell>{item.feature1}</TableCell>
                <TableCell>{item.feature2 === 1 ? 'Male' : 'Female'}</TableCell>
                <TableCell>{item.feature3}</TableCell>
                <TableCell>{item.feature4}</TableCell>
                <TableCell>{item.feature5}</TableCell>
                <TableCell>{item.feature6}</TableCell>
                <TableCell>{item.feature7}</TableCell>
                <TableCell>{item.feature8}</TableCell>
                <TableCell>{item.feature9}</TableCell>
                <TableCell>{item.feature10}</TableCell>
                <TableCell>{item.feature11}</TableCell>
                <TableCell>{item.feature12}</TableCell>
                <TableCell>{item.feature13}</TableCell>
                <TableCell>{item.prediction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {loading && <Typography className="loading" color="textSecondary">Loading...</Typography>}
    </div>
  );
};

export default HistoryPage;
