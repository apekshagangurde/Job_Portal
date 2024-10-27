const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet'); // Don't forget to include helmet
const { exec } = require('child_process');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000

// Use Helmet for security, including CSP
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],  // Allow loading from the same origin
        fontSrc: ["'self'", "data:", "https://job-portal-express.onrender.com"], // Allow fonts from self and data URLs
        scriptSrc: ["'self'", "https://example.com"], // Adjust your script sources as needed
        styleSrc: ["'self'", "https://example.com"], // Adjust your style sources as needed
        imgSrc: ["'self'", "data:", "https://job-portal-express.onrender.com"], // Allow images from self and data URLs
        connectSrc: ["'self'", "https://example.com"], // Adjust for WebSocket connections if needed
    }
}));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON requests
app.use(express.json());

// Route to get jobs from the scraped JSON file
app.get('/jobs', (req, res) => {
    const filePath = path.join(__dirname, '../telegram_scraper/scraped_jobs.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to fetch jobs' });
        }
        try {
            const jobs = JSON.parse(data);
            res.json(jobs);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).json({ error: 'Failed to parse jobs data' });
        }
    });
});

// Emit new jobs to all connected clients
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Function to scrape data periodically and emit updates
function scrapeDataAndEmit() {
    exec('python ../telegram_scraper/scraper.py', (error) => {
        if (error) {
            console.error(`Error running scraper.py: ${error.message}`);
            return;
        }
        const filePath = path.join(__dirname, '../telegram_scraper/scraped_jobs.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading scraped jobs file:', err);
                return;
            }
            try {
                const jobs = JSON.parse(data);
                io.emit('new_jobs', jobs);  // Emit latest jobs to all clients
            } catch (parseErr) {
                console.error('Error parsing scraped jobs JSON:', parseErr);
            }
        });
    });
}

// Run scraper every 10 sec
setInterval(scrapeDataAndEmit, 10 * 60 * 1000);

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve your main HTML file
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
