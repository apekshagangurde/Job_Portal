// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Importing the job routes
const jobRoutes = require('./routes/jobRoutes'); // Make sure the path and name are correct

// Use the job routes
app.use('/api/jobs', jobRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Job Scraping API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
