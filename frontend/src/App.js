// App.js
import React from 'react';
import Header from './components/Header'; // Import the Header
import JobList from './components/JobList';
import Footer from './components/Footer';

function App() {
    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header /> {/* Add Header component */}
            <main style={{ flex: '1', padding: '20px' }}> {/* Padding for space */}
                <h1 style={{ margin: '0 0 20px 0' }}>Job Listings</h1> {/* Heading for Job Listings */}
                <JobList /> {/* Job List component */}
            </main>
            <Footer /> {/* Footer component */}
        </div>
    );
}

export default App;
