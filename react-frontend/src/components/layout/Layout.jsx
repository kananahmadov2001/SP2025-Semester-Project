// react-frontend/src/components/layout/Layout.jsx

import React from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import "./Layout.css";
import { UseAuth } from "../../context/AuthContext";

function Layout() {
    const { user, logout } = UseAuth();
    const navigate = useNavigate();

    // A simple array of nav links
    const navLinks = [
        { path: "/", label: "Home", protected: false },
        { path: "/help", label: "Help", protected: false },
        { path: "/dashboard", label: "Dashboard", protected: false },
        { path: "/dashboard/teamView", label: "TeamView", protected: true },
        { path: "/dashboard/trashTalk", label: "TrashTalk", protected: true },
        { path: "/dashboard/challenge", label: "Challenge", protected: true },
    ];

    function handleSignOut() {
        // Clear user from context (i.e., "logout")
        logout();
        // Navigate to home after sign out
        navigate("/");
    }

    return (
        <div className="layout-container">
            {/* ----------  HEADER SECTION  ---------- */}
            <header className="layout-header">
                {/* Background + Logo */}
                <div className="header-section">
                    <div></div> {/* just empty space if you want symmetrical layout */}
                    <div className="hfl-logo-container">
                        <div className="hfl-logo">
                            <Link to="/" className="site-logo">
                                HFL
                            </Link>
                            <span>Hater Fantasy League</span>
                            <div className="hfl-border"></div>
                        </div>
                        <img src="/src/assets/nba-logo.png" alt="NBA Logo" className="nba-logo" />
                    </div>
                </div>

                {/* ----------  NAVIGATION  ---------- */}
                <nav className="layout-nav">
                    <div className="nav-links">
                        {navLinks
                            // Show non-protected links to everyone; protected links only if user != null
                            .filter((link) => !link.protected || user)
                            .map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        isActive ? "nav-link active" : "nav-link"
                                    }
                                    end
                                // 'end' ensures exact matching for root paths
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                    </div>

                    {/* Right side: user info and sign-out */}
                    <div className="user-controls">
                        {user ? (
                            <>
                                <span className="welcome-text">Welcome, {user.name}!</span>
                                <button className="signout-btn" onClick={handleSignOut}>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <span className="welcome-text">Please login to build your squad</span>
                        )}
                    </div>
                </nav>
            </header>

            {/* Main content via <Outlet /> */}
            <main className="layout-content">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="footer-section">
            <div className="footer-links-container">
                <div className="footer-column">
                    <h3 className="footer-heading">Explore</h3>
                    <a href="/dashboard/teamView">Player Stats</a>
                    <a href="/dashboard/teamView">Team Standings</a>
                    <a href="/dashboard">Fantasy Leaderboards</a>
                    <a href="/help">Draft Strategy Guide</a>
                </div>

                <div className="footer-column">
                    <h3 className="footer-heading">Game Info</h3>
                    <Link to="/help">How to Play</Link>
                    <a href="/help">Scoring Rules</a>
                    <a href="/dashboard/challenge">Weekly Challenges</a>
                    <a href="/help">FAQs</a>
                </div>

                <div className="footer-column">
                    <h3 className="footer-heading">Community</h3>
                    <a href="/help">Forums</a>
                    <a href="/challenge">League Events</a>
                    <Link to="/dashboard/trashTalk">Trash Talk Zone</Link>
                    <a href="/help">Contact Support</a>
                </div>

                <div className="footer-column">
                    <h3 className="footer-heading">About</h3>
                    <a href="/help">Our Mission</a>
                    <a href="/help">In the Press</a>
                    <a href="/help">Privacy Policy</a>
                    <a href="/help">Terms of Service</a>
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
