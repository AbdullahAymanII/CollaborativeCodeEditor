import React from "react";
import './LandingPage.css'; // Updated CSS file name

const LandingPage = () => {
    return (
        <div className="landing-page-container">
            <div className="landing-page-content">
                <h1 className="landing-page-title">Collaborate, Create, and Code in Real-Time</h1>
                <p className="landing-page-description">
                    Join a our community of developers. Write, edit, push, merge and run code together with different
                    languages without leaving your browser.
                </p>
                <a href="/login" className="landing-page-cta">Start Coding Now</a>
            </div>

        </div>
    );
};

export default LandingPage;
