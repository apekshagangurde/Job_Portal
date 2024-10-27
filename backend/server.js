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
        scriptSrc: ["'self'", "'unsafe-inline'", "https://example.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://example.com"],
        imgSrc: ["'self'", "data:", "https://job-portal-r88a.onrender.com/"],
        connectSrc: ["'self'", "http://localhost:5000", "https://example.com"],
    }
}));

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'https://job-portal-r88a.onrender.com'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
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
            return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
        }
        try {
            const jobs = JSON.parse(data);
            res.json(jobs);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).json({ error: 'Failed to parse jobs data.' });
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
    console.log('Scraping data...');
    const scraperPath = path.join(__dirname, '../telegram_scraper/scraper.py'); // Adjust path
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
    const scraperPath = path.join(__dirname, '../telegram_scraper/scraper.py'); // Adjust path
    exec(`python ${scraperPath}`, (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Scraping failed');
        }
        // After scraping, read the jobs and emit them
        const filePath = path.join(__dirname, '../telegram_scraper/scraped_jobs.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading scraped jobs file:', err);
                return res.status(500).send('Failed to read jobs');
            }
            try {
                const jobs = JSON.parse(data);
                io.emit('new_jobs', jobs); // Emit latest jobs to all clients
                res.json(jobs); // Send the scraped jobs as response
            } catch (parseErr) {
                console.error('Error parsing scraped jobs JSON:', parseErr);
                res.status(500).send('Failed to parse jobs data');
            }
        });
    });
});

// Serve the main HTML file (index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html')); // Serve your main HTML file
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
