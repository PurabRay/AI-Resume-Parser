import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [atsRole, setAtsRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name || '');
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
  useEffect(() => {
    const validateCalculation = async () => {
      if (result && result.atsEvaluation && result.atsEvaluation.breakdown) {
        const manualSum = result.atsEvaluation.breakdown.reduce(
          (sum, curr) => sum + Number(curr.assignedPoints),
          0
        );
        // Update the atsScore to be the manual sum
        setResult(prevResult => ({
          ...prevResult,
          atsEvaluation: {
            ...prevResult.atsEvaluation,
            atsScore: manualSum
          }
        }));
      }
    };
    validateCalculation();
  }, [result?.atsEvaluation?.breakdown]);

  return (
    <div className="upload-container">
      <h2>Upload Your Resume</h2>
      <form onSubmit={handleSubmit}>
        <div className="file-input-container">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="file-input"
            id="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            {fileName || 'Choose Resume File'}
          </label>
          {fileName && <p className="file-name">{fileName}</p>}
        </div>

        <div className="select-container">
          <select 
            value={atsRole} 
            onChange={(e) => setAtsRole(e.target.value)}
            className="ats-role-select"
          >
            <option value="">Select Role for ATS Evaluation</option>
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
          {loading ? 'Processing...' : 'Analyze Resume'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && <div className="loading-spinner" />}

      {result && (
        <div className="result-container">
          <h3>Resume Analysis Results</h3>
          
          {result.atsEvaluation && (
            <div className="ats-evaluation">
              <h3>ATS Score</h3>
              <div className="ats-score">{result.atsEvaluation.atsScore}/100</div>
              
              <div className="missing-skills">
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

              {result.atsEvaluation.breakdown && (
                <div className="skill-breakdown">
                  <h4>Skill Breakdown:</h4>
                  {result.atsEvaluation.breakdown.map((item, index) => (
                    <div key={index} className="skill-item">
                      <h5>{item.skill}</h5>
                      <p>{item.reasoning}</p>
                      <div className="skill-score">
                        Score: {item.assignedPoints}/{item.maxPoints}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p>
                {result.atsEvaluation.breakdown.reduce(
                  (sum, item) => sum + Number(item.assignedPoints),
                  0
                ) === result.atsEvaluation.atsScore
                  ? 'Verified: The manual sum matches the provided ATS score.'
                  : 'Discrepancy: The manual sum does not match the provided ATS score.'}
              </p>
            </div>
          )}

          {result.atsEvaluation.breakdown && (
            <div className="calculation-details">
              <h3>Calculation Details:</h3>
              <ul>
                {result.atsEvaluation.breakdown.map((item, index) => (
                  <li key={index}>
                    {item.skill}: {item.assignedPoints}
                  </li>
                ))}
              </ul>
              <p>
                Manual Sum:{' '}
                {result.atsEvaluation.breakdown.reduce(
                  (sum, item) => sum + Number(item.assignedPoints),
                  0
                )}
              </p>
            </div>
          )}

          <div className="parsed-data">
            <h3>Parsed Resume Data:</h3>
            <pre>
              {JSON.stringify(result.parsedData, null, 2)}
            </pre>
          </div>

          {result.atsEvaluation.missingSkills && result.atsEvaluation.missingSkills.length > 0 && (
            <div className="further-steps">
              <h3>Further Steps</h3>
              <p>To improve your profile, consider learning these missing skills:</p>
              
              {result.atsEvaluation.missingSkills.map((skill) => (
                result.atsEvaluation.learningResources?.[skill] && (
                  <div key={skill} className="skill-resources">
                    <h4>{skill}</h4>
                    <div className="resource-category">
                      <h5>Basic Resources:</h5>
                      <ul>
                        {result.atsEvaluation.learningResources[skill].basic.map((resource, index) => (
                          <li key={index}>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              {resource.title}
                            </a>
                            {resource.description && <p>{resource.description}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="resource-category">
                      <h5>Intermediate Resources:</h5>
                      <ul>
                        {result.atsEvaluation.learningResources[skill].intermediate.map((resource, index) => (
                          <li key={index}>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              {resource.title}
                            </a>
                            {resource.description && <p>{resource.description}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="resource-category">
                      <h5>Advanced Resources:</h5>
                      <ul>
                        {result.atsEvaluation.learningResources[skill].advanced.map((resource, index) => (
                          <li key={index}>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              {resource.title}
                            </a>
                            {resource.description && <p>{resource.description}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload; 
