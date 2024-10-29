# Job Portal

## Overview
This project is a job portal web application designed to scrape job listings from various sources and display them on a user-friendly interface. The project includes both backend and frontend components, with data scraping handled by a Python script and displayed using a React-based frontend. This job portal aims to provide users with the latest job opportunities in one centralized location.

## Features
- **Job Scraping**: The scraper collects job data from specified sources and stores it in `scraped_jobs.json`.
- **API Server**: A Node.js server provides an API endpoint to serve scraped job data.
- **Frontend**: A React-based frontend allows users to view job listings, with a responsive design.
- **Real-time Updates**: The job data is refreshed regularly to provide up-to-date information.

## Project Structure
```plaintext
jobportal/
├── backend/
│   ├── server.js          # Node.js server for API requests
│   ├── scraper.py         # Python script to scrape job data
│   ├── scraped_jobs.json  # File storing the scraped job data
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # React components
│       ├── App.js         # Main application file
│       ├── index.js       # Entry point for React
│       └── styles/        # CSS files for styling
├── package.json           # Node.js dependencies
└── README.md              # Project documentation

video:-https://drive.google.com/file/d/1QduN-5xrz6mnQuD_CFcXYLm4xoCV2mAk/view?usp=sharing
website link:-https://job-portal-r88a.onrender.com/



