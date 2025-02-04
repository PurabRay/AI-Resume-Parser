import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.parsedData);
    } catch (err) {
      setError(err.response?.data?.error || 'Error uploading resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Resume</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="upload-button"
        >
          {loading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {result && (
        <div className="result-container">
          <h3>Parsed Resume Data:</h3>
          <pre>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload; 