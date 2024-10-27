import React, { useEffect, useState } from 'react';

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/jobs');  // Fetches data from backend
      const data = await response.json();
      setJobs(data);  // Updates jobs state
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h2>Job Listings</h2>
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <a href={job.link} target="_blank" rel="noopener noreferrer">View Job</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
