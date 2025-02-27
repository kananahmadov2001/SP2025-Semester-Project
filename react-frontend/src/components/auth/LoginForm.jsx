// react-frontend/src/components/auth/LoginForm.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        // comment out this code block if you are developing with a local database
        // localStorage.setItem("userId", 1);
        // localStorage.setItem("userName", "User1");
        // navigate("/dashboard");
        // return;

        try {
            // 1. Call our login API
            const data = await login(email, password);
            // data = { message, userId, name }

            // 2. Store user info (might need to change to another method to store user info in the future)
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userName", data.name);

            // 3. Navigate to dashboard
            navigate("/dashboard");
        } catch (err) {
            console.warn("Comment out the codes in handleSubmit() if testing locally without a database");
            console.error("Login Error:", err);
            alert(err.message || "Login failed");
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
                required
            />

            <label>Password</label>
            <input
                type="password"
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit" className="login-button">
                Login
            </button>
        </form>
    );
}

export default LoginForm;
