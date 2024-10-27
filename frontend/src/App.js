import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jobs');
        console.log('Response data:', response.data);

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
    return <p>Loading jobs...</p>;
  }

  return (
    <div className="App">
      <h1>Job Listings</h1>
      {error && <p className="error-message">{error}</p>}
      {jobs.length > 0 ? (
        jobs.map((job) => {
          const roleMatch = job.description.match(/Role: (.+?)\n/);
          const batchEligibleMatch = job.description.match(/Batch Eligible: (.+?)\n/);
          const locationMatch = job.description.match(/Location: (.+?)\n/);
          const expectedMatch = job.description.match(/Expected Stipend: (.+?)\n/);
          
          // Extract "Apply Link" or "Registration Link" from description
          const applyLinkMatch = job.description.match(/(?:Apply Link|Registration Link): (https?:\/\/\S+)/i);
          const applyLink = applyLinkMatch ? applyLinkMatch[1] : null;

          return (
            <div key={job.title} className="job-card">
              <h2 className="job-title">{job.title}</h2>
              <div className="job-details">
                <p><strong>Role:</strong> {roleMatch ? roleMatch[1] : 'Not specified'}</p>
                <p><strong>Batch Eligible:</strong> {batchEligibleMatch ? batchEligibleMatch[1] : 'Not specified'}</p>
                <p><strong>Location:</strong> {locationMatch ? locationMatch[1] : 'Not specified'}</p>
                {expectedMatch && (
                  <p><strong>Expected Stipend:</strong> {expectedMatch[1]}</p>
                )}
              </div>
              {applyLink && (
                <a href={applyLink} target="_blank" rel="noopener noreferrer">
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
}

export default App;
