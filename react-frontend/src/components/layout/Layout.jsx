// react-frontend/src/components/layout/Layout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedName = localStorage.getItem("userName");
        if (storedUserId) setUserId(storedUserId);
        if (storedName) setUserName(storedName);
    }, []);

    function handleSignOut() {
        // Clear localStorage or remove tokens
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        // Navigate back to HomePage (or wherever you want)
        navigate("/");
    }

    return (
        <div className="layout-container">
            {/* Header Section */}
            <header className="layout-header">

                <div className="header-section">
                    {/* Left Side: Empty Space to Balance Layout */}
                    <div></div>

                    {/* Right Side: HFL Logo + NBA Logo */}
                    <div className="hfl-logo-container">
                        {/* HFL Logo */}
                        <div className="hfl-logo">
                            <Link to="/" className="site-logo">
                                HFL
                            </Link>
                            <span>Hater Fantasy League</span>
                            <div className="hfl-border"></div>
                        </div>
                        {/* NBA Logo */}
                        <img src="/src/assets/nba-logo.png" alt="NBA Logo" className="nba-logo" />
                    </div>
                </div>

                {/* ----------  NAV BAR  ---------- */}
                <nav className="layout-nav">
                    {/* Public or global links */}
                    <Link to="/">Home</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    {/* Only show these if user is logged in */}
                    {userId && (
                        <>
                            <Link to="/dashboard/teamView">TeamView</Link>
                            <Link to="/dashboard/trashTalk">TrashTalk</Link>
                            <Link to="/dashboard/challenge">Challenge</Link>
                        </>
                    )}
                </nav>

                {/* Right side: user info and sign-out */}
                <div className="user-controls">
                    {userId ? (
                        <>
                            <span className="welcome-text">Welcome, {userName}!</span>
                            <button onClick={handleSignOut}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            {/* If not logged in, you could show a login/register button, or do nothing */}
                            <span className="welcome-text">You are not signed in</span>
                        </>
                    )}
                </div>
            </header>

            {/* ----------  MAIN CONTENT VIA OUTLET  ---------- */}
            <main className="layout-content">
                <Outlet />
            </main>

            {/* ----------  FOOTER  ---------- */}
            <footer className="footer-section">
                <div className="footer-links-container">
                    <div className="footer-column">
                        <h3 className="footer-heading">Explore</h3>
                        <a href="#">NBA Players</a>
                        <a href="#">Teams</a>
                        <a href="#">Fantasy Leaderboards</a>
                        <a href="#">Draft Guide</a>
                    </div>
                    <div className="footer-column">
                        <h3 className="footer-heading">Game Info</h3>
                        <Link to="/">How to Play</Link>
                        <a href="#">Scoring Rules</a>
                        <a href="#">Weekly Challenges</a>
                        <a href="#">FAQs</a>
                    </div>
                    <div className="footer-column">
                        <h3 className="footer-heading">Community</h3>
                        <a href="#">Forums</a>
                        <a href="#">Events</a>
                        <Link to="/dashboard/trashTalk">Trash Talk Zone</Link>
                        <a href="#">Contact Support</a>
                    </div>
                    <div className="footer-column">
                        <h3 className="footer-heading">About</h3>
                        <a href="#">Our Story</a>
                        <a href="#">Press</a>
                        <a href="#">Careers</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
                <div className="footer-social-container">
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-square social-icon"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter social-icon"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram social-icon"></i>
                        </a>
                    </div>
                </div>
                <p className="footer-copyright">
                    &copy; 2025 Hater Fantasy League. All rights reserved. <a href="#">Privacy Policy</a> | <a href="#">Terms</a> | <a href="#">Site Map</a>
                </p>
            </footer>
        </div>
    );
}

export default Layout;
