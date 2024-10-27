const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Mock scraping function
const scrapeJobs = async () => {
    return [
        { title: 'Software Engineer', company: 'Company A', location: 'Location A', description: 'Job Description' },
        { title: 'Data Scientist', company: 'Company B', location: 'Location B', description: 'Job Description' }
    ];
};

// Define the route for scraping jobs
app.get('/api/job', async (req, res) => {
    try {
        const jobs = await scrapeJobs(); // Call the mock scraping function
        res.json(jobs); // Send the jobs as a JSON response
    } catch (error) {
        console.error('Error fetching jobs:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to fetch jobs' }); // Send error response
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
