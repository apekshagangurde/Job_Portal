// Footer.js
import React from 'react';
import './Footer.css'; // Assuming you will create a separate CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>Website created by Apeksha Gangurde</p>
                <div className="social-links">
                    <a href="mailto:your-email@example.com" title="Email">
                        <img src="path/to/email-icon.png" alt="Email Logo" className="icon" />
                    </a>
                    <a href="https://www.linkedin.com/in/your-linkedin" title="LinkedIn">
                        <img src="path/to/linkedin-icon.png" alt="LinkedIn Logo" className="icon" />
                    </a>
                    <a href="https://github.com/your-github" title="GitHub">
                        <img src="path/to/github-icon.png" alt="GitHub Logo" className="icon" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
