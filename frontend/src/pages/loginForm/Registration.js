import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Register.css';
// import './one.css';
const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState(''); // State to store the message
    const [isError, setIsError] = useState(false); // State to track error/success

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Reset the message before form submission
        setIsError(false); // Reset error status

        try {
            const response = await fetch('http://localhost:8080/api/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                },
                body: JSON.stringify(formData), // Convert formData to JSON string
                credentials: 'include',
            });

            const data = await response.json(); // Parse the JSON response

            if (response.ok && data.status === 'success') {
                // If registration is successful, show success message and redirect
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/', { state: { email: formData.email, password: formData.password } }); // Pass email and password to login
                }, 2000); // Redirect after 2 seconds
            } else {
                // Handle registration failure
                setMessage(data.message || 'Registration failed, please try again.');
                setIsError(true); // Set error flag
            }

        } catch (error) {
            console.error('Error during registration:', error);
            setMessage('An error occurred during registration.');
            setIsError(true); // Set error flag
        }
    };

    const handleOAuthLogin = (provider) => {
        window.location.href = `http://localhost:8080/api/sign-in/provider/${provider}`;
    };

    return (
        <div className="auth-container">
            <div className="form-box">
                <h2>Register</h2>

                {message && (
                    <div className={`message-box ${isError ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Register</button>
                </form>

                <div className="oauth-buttons">
                    <button className="google-button" onClick={() => handleOAuthLogin('google')}>
                        Register with Google
                    </button>
                    <button className="github-button" onClick={() => handleOAuthLogin('github')}
                    >Register with GitHub
                    </button>
                </div>
                <p>Already have an account? <a href="/">Login here</a></p>
            </div>
        </div>
    );
};

export default RegisterPage;
