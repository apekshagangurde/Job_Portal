
// App.js//-
import React from 'react';//-
import JobList from './components/JobList';//-
import Footer from './components/Footer'; // Adjust the path if necessary



function App() {
  return (
    <div className="App">

      <h1>Job Listings</h1>
      
      <JobList /> {/* Use the JobList component */}
      <Footer />
    </div>
  );
}//-
//-
export default App;//-
