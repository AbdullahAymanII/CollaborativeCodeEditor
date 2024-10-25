import React from "react";
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page-container">
            <div className="landing-page-content">
                <h1 className="landing-page-title">Collaborate. Create. Code in Real-Time.</h1>
                <p className="landing-page-description">
                    Unlock the power of collaboration. Code, review, and merge projects in multiple languages without leaving your browser.
                </p>
                <a href="/login" className="landing-page-cta">Start Coding Now</a>
            </div>
        </div>
    );
};

export default LandingPage;
