import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistoryPage.css';

interface HistoryItem {
  _id: string;
  feature1: number;
  feature2: number; // Assuming Gender is stored as a number (1 for Male, 0 for Female)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<HistoryItem[]>('http://127.0.0.1:8000/history'); // Adjust the URL as needed
        setData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="history-page">
      <h1>Prediction History</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Age</th>
            <th>Gender</th>
            <th>CP</th>
            <th>TrestBPS</th>
            <th>Chol</th>
            <th>FBS</th>
            <th>RestECG</th>
            <th>Thalch</th>
            <th>Exang</th>
            <th>Oldpeak</th>
            <th>Slope</th>
            <th>CA</th>
            <th>Thal</th>
            <th>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.feature1}</td>
              <td>{item.feature2 === 1 ? 'Male' : 'Female'}</td>
              <td>{item.feature3}</td>
              <td>{item.feature4}</td>
              <td>{item.feature5}</td>
              <td>{item.feature6}</td>
              <td>{item.feature7}</td>
              <td>{item.feature8}</td>
              <td>{item.feature9}</td>
              <td>{item.feature10}</td>
              <td>{item.feature11}</td>
              <td>{item.feature12}</td>
              <td>{item.feature13}</td>
              <td>{item.prediction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryPage;
