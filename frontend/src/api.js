// src/api.js
export const fetchJobs = async (filters) => {
  const { jobType, location } = filters;
  const queryString = new URLSearchParams({
    jobType,
    location,
  }).toString();

  const response = await fetch(`http://localhost:5000/api/jobs?${queryString}`);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  const data = await response.json();
  return data; // Assuming data is an array of job objects
};
