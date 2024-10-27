const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 5000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/jobs', (req, res) => {
    const filePath = path.join(__dirname, '../telegram_scraper/scraped_jobs.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ error: 'Failed to fetch jobs' });
            return;
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
    socket.on('disconnect', () => console.log('Client disconnected'));
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
            const jobs = JSON.parse(data);
            io.emit('new_jobs', jobs);  // Emit latest jobs to all clients
        });
    });
}

// Run scraper every 10 minutes
setInterval(scrapeDataAndEmit, 10 * 60 * 1000);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
