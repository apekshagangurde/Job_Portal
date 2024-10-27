// frontend/components/JobCard.js
import React from 'react';
import './JobCard.css';

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <a href={job.link} target="_blank" rel="noopener noreferrer" className="apply-button">
        View Job
      </a>
    </div>
  );
};

export default JobCard;
