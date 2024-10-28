const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { exec } = require('child_process');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 5000;

// Use Helmet for security, including CSP
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", "data:", "https://job-portal-r88a.onrender.com/"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://job-portal-r88a.onrender.com/"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://job-portal-r88a.onrender.com/"],
        imgSrc: ["'self'", "data:", "https://job-portal-r88a.onrender.com/"],
        connectSrc: ["'self'", "https://job-portal-r88a.onrender.com/"],
    }
}));

// CORS configuration
const allowedOrigins = [
    'https://job-portal-r88a.onrender.com',
    'http://localhost:3000' // Add this for local development
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error(`Not allowed by CORS: ${origin}`), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Middleware to parse JSON requests
app.use(express.json());

// Route to get jobs from the scraped JSON file
app.get('/jobs', (req, res) => {
    const filePath = path.join(__dirname, '../telegram_scraper/scraped_jobs.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
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

// WebSocket: Emit new jobs to all connected clients
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Function to scrape data periodically and emit updates
function scrapeDataAndEmit() {
    console.log('Scraping data...');
    const scraperPath = path.join(__dirname, '../telegram_scraper/scraper.py'); // Adjust path as needed
    exec(`python ${scraperPath}`, (error) => {
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
                io.emit('new_jobs', jobs); // Emit latest jobs to all clients
            } catch (parseErr) {
                console.error('Error parsing scraped jobs JSON:', parseErr);
            }
        });
    });
}

// Run scraper every 10 minutes
setInterval(scrapeDataAndEmit, 10 * 60 * 1000);

// Endpoint to manually trigger scraping
app.get('/scrape', (req, res) => {
    console.log('Manual scraping triggered');
    scrapeDataAndEmit();
    res.send('Scraping started');
});

// Serve the main HTML file (index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on https://job-portal-r88a.onrender.com/`);
});
