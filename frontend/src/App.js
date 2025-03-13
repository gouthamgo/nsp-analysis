import React, { useState } from 'react';
import axios from 'axios';
import NPSDashboard from './components/NPSDashboard';
import FileUpload from './components/FileUpload';

function App() {
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  
  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:8000/analyze-nps', formData);
      setAnalysisData(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to analyze file. Please check the file format and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container">
      <h1 className="page-title">NPS Analysis Dashboard</h1>
      
      <FileUpload onFileUpload={handleFileUpload} loading={loading} />
      
      {error && (
        <div className="card" style={{ backgroundColor: '#fef2f2', color: '#b91c1c' }}>
          {error}
        </div>
      )}
      
      {analysisData && !loading && (
        <NPSDashboard data={analysisData} />
      )}
      
      {loading && (
        <div className="card">
          <div className="text-center py-8">
            <div className="spinner"></div>
            <p className="mt-4 text-gray">Analyzing your NPS data...</p>
            <p className="text-sm text-gray">This may take a few moments as we run advanced analysis on your feedback.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;