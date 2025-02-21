import React, { useState } from 'react';
import axios from 'axios';

const JobPost = () => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: { min: '', max: '', currency: 'USD' }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/jobs', {
        ...jobData,
        requirements: jobData.requirements.split('\n')
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Job posted successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Error posting job');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Job Title</label>
          <input
            type="text"
            value={jobData.title}
            onChange={e => setJobData({...jobData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
       
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default JobPost; 
