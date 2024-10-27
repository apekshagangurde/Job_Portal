// src/components/Filter.js
import React, { useState } from "react";

function Filter({ onFilterChange }) {
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    onFilterChange({ jobType, location });
  };

  return (
    <form onSubmit={handleFilterSubmit} className="filter-form">
      <label>
        Job Type:
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="">All</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
        </select>
      </label>
      <label>
        Location:
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
      </label>
      <button type="submit">Filter</button>
    </form>
  );
}

export default Filter;
