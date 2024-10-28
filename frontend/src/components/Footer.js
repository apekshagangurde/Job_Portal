// Footer.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = ({ isVisible }) => {
    return (
        <footer className={`footer ${isVisible ? 'visible' : ''}`}>
            <div className="footer-content">
                <p>Website created by Apeksha Gangurde</p>
                <div className="social-links">
                    <a href="mailto:your-email@example.com" title="Email">
                        <FontAwesomeIcon icon={faEnvelope} className="icon" />
                    </a>
                    <a href="https://www.linkedin.com/in/your-linkedin" title="LinkedIn">
                        <FontAwesomeIcon icon={faLinkedin} className="icon" />
                    </a>
                    <a href="https://github.com/your-github" title="GitHub">
                        <FontAwesomeIcon icon={faGithub} className="icon" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
