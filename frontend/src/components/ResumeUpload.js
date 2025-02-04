import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [atsRole, setAtsRole] = useState('');
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
    if (!atsRole) {
      setError('Please select a role for ATS evaluation');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('atsRole', atsRole);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
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
        <div>
          <label>Select Role for ATS Evaluation:</label>
          <select 
            value={atsRole} 
            onChange={(e) => setAtsRole(e.target.value)}
            className="ats-role-select"
          >
            <option value="">--Select Role--</option>
            <option value="Full Stack Developer (MERN)">Full Stack Developer (MERN)</option>
            <option value="Detective">Detective</option>
            <option value="Lawyer">Lawyer</option>
          </select>
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
            {JSON.stringify(result.parsedData, null, 2)}
          </pre>

          {result.atsEvaluation && (
            <div className="ats-evaluation">
              <h3>ATS Evaluation:</h3>
              <p><strong>ATS Score:</strong> {result.atsEvaluation.atsScore}</p>
              <div>
                <h4>Missing Skills:</h4>
                {result.atsEvaluation.missingSkills && result.atsEvaluation.missingSkills.length > 0 ? (
                  <ul>
                    {result.atsEvaluation.missingSkills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>None</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload; 