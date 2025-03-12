import React from 'react';

const FileUpload = ({ onFileUpload, loading }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      onFileUpload(file);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Upload NPS Data</h2>
      <p className="text-gray mb-4">
        Upload your NPS CSV file to generate insights and visualizations.
      </p>
      
      <div className="file-upload">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="npsFile"
          disabled={loading}
          style={{ display: 'none' }}
        />
        <label
          htmlFor="npsFile"
          className="button"
          style={{ opacity: loading ? 0.5 : 1 }}
        >
          {loading ? 'Processing...' : 'Select CSV File'}
        </label>
        
        {loading && (
          <div className="ml-3" style={{ flex: 1 }}>
            <div className="loading-bar">
              <div className="loading-bar-progress"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;