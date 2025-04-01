// react-frontend/src/PasswordResetPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PasswordResetPage.css";

function PasswordResetPage() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await fetch("http://localhost:3000/api/auth/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, newPassword }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to reset password");
            }

            setSuccessMessage("Password reset successfully!");
            setEmail("");
            setNewPassword("");
            // Optionally navigate away, e.g. to login
            // navigate("/");
        } catch (err) {
            console.error("Password Reset Error:", err);
            setErrorMessage(err.message);
        }
    }

    return (
        <div className="password-reset-container">
            <div className="reset-form-wrapper">
                <h1 className="reset-title">Reset Password</h1>
                <p className="reset-description">
                    Enter your email and new password. Once you submit, your password will be updated.
                </p>
                <form className="reset-form" onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>New Password</label>
                    <input
                        type="password"
                        placeholder="Enter new password..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="password-reset-btn">
                        Reset Password
                    </button>
                </form>

                {errorMessage && <p className="reset-error">{errorMessage}</p>}
                {successMessage && <p className="reset-success">{successMessage}</p>}
            </div>
        </div>
    );
}

export default PasswordResetPage;
