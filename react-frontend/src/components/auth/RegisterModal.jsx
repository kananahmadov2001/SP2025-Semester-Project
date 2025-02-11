// react-frontend/src/components/auth/RegisterModal.jsx

import React, { useState } from "react";
import { register } from "../../services/authService";
import "./RegisterModal.css";

function RegisterModal({ onClose }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const data = await register(name, email, password);
            // data = { message }
            setSuccess(data.message);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>
                <h2>Register</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input
                        type="text"
                        className="register-input"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        className="register-input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        className="register-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className="register-button">
                        Sign Up
                    </button>

                    {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
                    {success && <p style={{ color: "green", marginTop: "5px" }}>{success}</p>}
                </form>
            </div>
        </div>
    );
}

export default RegisterModal;
