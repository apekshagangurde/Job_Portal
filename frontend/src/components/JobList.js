// JobList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Puff } from 'react-loader-spinner'; // Adjust import
import '../App.css'; // Ensure CSS styles are applied

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(' https://job-portal-r88a.onrender.com/jobs');
        if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else {
          setJobs([response.data]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to fetch jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <Puff
          height="100"
          width="100"
          color="#3498db"
          ariaLabel="puff-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="job-listings" style={{ marginTop: '100px' }}>
      {error && <p className="error-message">{error}</p>}
      {jobs.length > 0 ? (
        jobs.map((job) => {
          const roleMatch = job.description.match(/(?:Role|Position|Title|Designation)\s*:\s*(.+?)(?:\n|$)/i);
          const batchEligibleMatch = job.description.match(/(?:Batch Eligible|batch|Eligible Batch|Passing Out|Graduation)\s*:\s*(.+?)(?:\n|$)/i);
          const locationMatch = job.description.match(/(?:Location|Place)\s*:\s*(.+?)(?:\n|$)/i);
          const stipendMatch = job.description.match(/(?:Expected Stipend|CTC|Salary|Expected)\s*:\s*(.+?)(?:\n|$)/i);
          const applyLinkMatch = job.description.match(/(?:Apply Link|Link)\s*:\s*(https?:\/\/[^\s]+)/i);

          return (
            <div key={job.title} className="job-card">
              <h2 className="job-title">{job.title}</h2>
              <div className="job-details">
                <p><strong>Role:</strong> {roleMatch ? roleMatch[1].trim() : 'Not specified'}</p>
                <p><strong>Batch Eligible:</strong> {batchEligibleMatch ? batchEligibleMatch[1].trim() : 'Not specified'}</p>
                <p><strong>Location:</strong> {locationMatch ? locationMatch[1].trim() : 'Not specified'}</p>
                <p><strong>Expected Salary:</strong> {stipendMatch ? stipendMatch[1].trim() : 'Not specified'}</p>
              </div>
              {applyLinkMatch && (
                <a href={applyLinkMatch[1]} target="_blank" rel="noopener noreferrer">
                  <button className="apply-button">Apply Now</button>
                </a>
              )}
            </div>
          );
        })
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  );
};

export default JobList;
