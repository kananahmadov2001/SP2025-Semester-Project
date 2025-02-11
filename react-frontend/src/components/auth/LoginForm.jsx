// react-frontend/src/components/auth/LoginForm.jsx

import React, { useState } from "react";
import { login } from "../../services/authService";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const data = await login(email, password);
            // data = { message, userId, name }
            setSuccess(data.message);
            // If you want to store the user info in global state or context, do it here.
            // The cookie is automatically set in the browser by the server.
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
                type="email"
                className="login-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
                type="password"
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="login-button">
                Login
            </button>

            {/* Show error or success messages */}
            {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
            {success && <p style={{ color: "green", marginTop: "5px" }}>{success}</p>}
        </form>
    );
}

export default LoginForm;
