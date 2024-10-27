// Header.js

import React from 'react';
import './Header.css'; // Import the CSS for the Header component

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Job Portal</h1>
      <nav className="header-nav">
        <a href="/add-job" className="nav-link">Add Job</a>
        <a href="/show-jobs" className="nav-link">Show Jobs</a>
      </nav>
    </header>
  );
};

export default Header;
