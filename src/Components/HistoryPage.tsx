import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistoryPage.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
// import InputPageNavbar from '../Inputpagenavbar';

interface HistoryItem {
  _id: string;
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
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get<HistoryItem[]>('http://127.0.0.1:8000/history', {
          params: { user_id: userId },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="history-page">
      {/* <InputPageNavbar title={'Prediction History'} /> */}
      {error && <Typography className="error" color="error">{error}</Typography>}
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
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
              <TableRow key={item._id}>
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
    </div>
  );
}

export default HistoryPage;
