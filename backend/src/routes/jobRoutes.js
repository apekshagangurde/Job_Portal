// backend/routes/jobRoutes.js
const express = require('express');
const router = express.Router();

// Sample job data for testing
const jobs = [
  { id: 1, title: 'Software Engineer' },
  { id: 2, title: 'Data Scientist' },
  { id: 3, title: 'Web Developer' }
];

// GET route for fetching jobs
router.get('/', (req, res) => {
  res.json(jobs); // Send back the sample job data as JSON
});

module.exports = router; // Export the router
