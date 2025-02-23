import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth, getIdToken } from 'firebase/auth';
import './HistoryPage.css';

interface HistoryItem {
  id: string;
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
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchData = async () => {
    const auth = getAuth();
    setLoading(true);

    try {
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((item) => item.id);
      setSelected(new Set(allIds));
    } else {
      setSelected(new Set());
    }
  };

  const handleDelete = async () => {
    const auth = getAuth();
    setLoading(true);

    try {
      const token = await getIdToken(auth.currentUser!);
      await Promise.all(
        Array.from(selected).map((id) =>
          axios.delete(`http://127.0.0.1:8000/history/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setData((prevData) => prevData.filter((item) => !selected.has(item.id)));
      setSelected(new Set());
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to delete selected history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div id="webcrumbs">
      <div className="w-full max-w-[90%] lg:max-w-[1000px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-2xl p-6 md:p-8">
        <div className="mb-10 space-y-4">
          <h2 className="text-lg text-gray-600 text-center">Healthcare History Analytics</h2>
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Patient Records Dashboard
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-indigo-600 cursor-pointer" onClick={handleDelete}>delete</span>
              <span className="text-sm text-gray-600">Selected items: {selected.size}</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search records..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <tr>
                  <th className="p-4 text-left rounded-tl-lg">
                    <span className="material-symbols-outlined cursor-pointer" onClick={() => handleSelectAll(!selected.size)}>
                      {selected.size ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </th>
                  {[
                    "Age", "Gender", "CP", "TrestBPS", "Chol", "FBS", "RestECG",
                    "Thalch", "Exang", "Oldpeak", "Slope", "CA", "Thal", "Prediction"
                  ].map((header) => (
                    <th key={header} className="p-4 text-left whitespace-nowrap">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <span
                        className="material-symbols-outlined text-gray-400 hover:text-indigo-600 cursor-pointer"
                        onClick={() => handleSelect(item.id)}
                      >
                        {selected.has(item.id) ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">{item.feature1}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature2 === 1 ? 'Male' : 'Female'}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature3}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature4}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature5}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature6}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature7}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature8}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature9}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature10}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature11}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature12}</td>
                    <td className="p-4 whitespace-nowrap">{item.feature13}</td>
                    <td
  className={`p-4 whitespace-nowrap font-semibold ${
    Number(item.prediction) === 0 ? "text-green-600" : "text-red-600"
  }`}
>
  {Number(item.prediction) === 0 ? "Not Detected" : "Detected"}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default HistoryPage;
