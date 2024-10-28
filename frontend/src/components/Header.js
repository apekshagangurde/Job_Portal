// Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons'; // Job icon
import './Header.css'; // Create this CSS file for styles

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <FontAwesomeIcon icon={faBriefcase} size="2x" />
                <h1 className="website-title">JobVista</h1>
            </div>
            <p className="tagline">Find Your Dream Job with Ease!</p> {/* Tagline */}
        </header>
    );
};

export default Header;
