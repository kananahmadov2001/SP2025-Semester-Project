// react-frontend/src/components/layout/Layout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(null);

    // A simple array of nav links
    const navLinks = [
        { path: "/", label: "Home", protected: false },
        { path: "/dashboard", label: "Dashboard", protected: false },
        { path: "/dashboard/teamView", label: "TeamView", protected: true },
        { path: "/dashboard/trashTalk", label: "TrashTalk", protected: true },
        { path: "/dashboard/challenge", label: "Challenge", protected: true },
    ];

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
            {/* ----------  HEADER SECTION  ---------- */}
            <header className="layout-header">

                {/* ---------- Background + Logo ---------- */}
                <div className="header-section">
                    {/* Left Side: Empty space for layout symmetry (if desired) */}
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

                {/* ----------  NAVIGATION  ---------- */}
                <nav className="layout-nav">
                    <div className="nav-links">
                        {navLinks
                            // Filter out protected links if user is not logged in
                            .filter((link) => !link.protected || userId)
                            .map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    // React Router v6: className can be a function
                                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                                    end
                                // 'end' ensures exact matching for root paths
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                    </div>

                    {/* ---------- User Controls (Welcome / Sign Out) ---------- */}
                    <div className="user-controls">
                        {userId ? (
                            <>
                                <span className="welcome-text">Welcome, {userName}!</span>
                                <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
                            </>
                        ) : (
                            <span className="welcome-text">You are not signed in</span>
                        )}
                    </div>
                </nav>
            </header>

            {/* ---------- MAIN CONTENT ---------- */}
            <main className="layout-content">
                <Outlet />
            </main>

            {/* ---------- FOOTER ---------- */}
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
                    &copy; 2025 Hater Fantasy League. All rights reserved.{" "}
                    <a href="#">Privacy Policy</a> | <a href="#">Terms</a> | <a href="#">Site Map</a>
                </p>
            </footer>
        </div>
    );
}

export default Layout;

