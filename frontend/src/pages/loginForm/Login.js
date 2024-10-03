import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Import the CSS for styling
// import './one.css';
// import Loading from './Loading'; // Assuming the Loading component is in src/components

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // useNavigate replaces useHistory

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading on button click

        fetch('http://localhost:8080/api/log-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Invalid login credentials.');
                }
                return res.json();
            })
            .then((data) => {
                localStorage.setItem('token', data.token);
                navigate('/home'); // Redirect to home on successful login
            })
            .catch((err) => {
                setErrorMessage(err.message);
            })
            .finally(() => {
                setIsLoading(false); // Stop loading once the request completes
            });
    };

    const handleOAuthLogin = (provider) => {
        window.location.href = `http://localhost:8080/api/sign-in/provider/${provider}`;
    };


    return (
        <>
            {/*{isLoading && <Loading />} /!* Show loading screen during form submission *!/*/}

            {/*{!isLoading && ( // Show the login form only if not loading*/}
                <div className="login-container">
                    <div className="form-box">
                        <h2>Login to Collaborative Code Editor</h2>
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="auth-button">
                                {isLoading ? 'Loading...' : 'Login'}
                            </button>
                        </form>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <div className="oauth-buttons">
                            <button className="google-button" onClick={() => handleOAuthLogin('google')}>
                                Login with Google
                            </button>
                            <button className="github-button" onClick={() => handleOAuthLogin('github')}>
                                Login with GitHub
                            </button>
                        </div>

                        <p>
                            Don't have an account? <Link to="/register">Register here</Link>
                        </p>
                    </div>
                </div>
            {/*)}*/}
        </>
    );
};

export default Login;
