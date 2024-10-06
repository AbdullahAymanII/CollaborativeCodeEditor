// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './Login.css'; // Import the CSS for styling
// // import './one.css';
// // import Loading from './Loading'; // Assuming the Loading component is in src/components
//
// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate(); // useNavigate replaces useHistory
//
//     const handleLogin = (e) => {
//         e.preventDefault();
//         setIsLoading(true); // Start loading on button click
//
//         fetch('http://localhost:8080/api/log-in', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password }),
//         })
//             .then((res) => {
//                 if (!res.ok) {
//                     throw new Error('Invalid login credentials.');
//                 }
//                 return res.json();
//             })
//             .then((data) => {
//                 localStorage.setItem('token', data.token);
//                 navigate('/home'); // Redirect to home on successful login
//             })
//             .catch((err) => {
//                 setErrorMessage(err.message);
//             })
//             .finally(() => {
//                 setIsLoading(false); // Stop loading once the request completes
//             });
//     };
//
//     const handleOAuthLogin = (provider) => {
//         window.location.href = `http://localhost:8080/api/sign-in/provider/${provider}`;
//     };

//
//     return (
//         <>
//             {/*{isLoading && <Loading />} /!* Show loading screen during form submission *!/*/}
//
//             {/*{!isLoading && ( // Show the login form only if not loading*/}
//                 <div className="login-container">
//                     <div className="form-box">
//                         <h2>Login to Collaborative Code Editor</h2>
//                         <form onSubmit={handleLogin}>
//                             <div className="input-group">
//                                 <label htmlFor="email">Email</label>
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     placeholder="Email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div className="input-group">
//                                 <label htmlFor="password">Password</label>
//                                 <input
//                                     type="password"
//                                     id="password"
//                                     placeholder="Password"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <button type="submit" className="auth-button">
//                                 {isLoading ? 'Loading...' : 'Login'}
//                             </button>
//                         </form>
//
//                         {errorMessage && <p className="error-message">{errorMessage}</p>}
//
//                         <div className="oauth-buttons">
//                             <button className="google-button" onClick={() => handleOAuthLogin('google')}>
//                                 Login with Google
//                             </button>
//                             <button className="github-button" onClick={() => handleOAuthLogin('github')}>
//                                 Login with GitHub
//                             </button>
//                         </div>
//
//                         <p>
//                             Don't have an account? <Link to="/register">Register here</Link>
//                         </p>
//                     </div>
//                 </div>
//             {/*)}*/}
//         </>
//     );
// };
//
// export default Login;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Import the CSS for styling
import '@fortawesome/fontawesome-free/css/all.min.css';
// import './AuthPage.css'; // You can adapt the styles from your CSS

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('http://localhost:8080/api/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setMessage('Registration successful! Redirecting...');
                setTimeout(() => {
                    handleFlip('login');
                    // navigate('/', { state: { email: formData.email, password: formData.password } });
                }, 2000);
            } else {
                setMessage(data.message || 'Registration failed, please try again.');
                setIsError(true);
            }

        } catch (error) {
            setMessage('An error occurred during registration.');
            setIsError(true);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/log-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) throw new Error('Invalid login credentials.');

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/home');
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = (provider) => {
        window.location.href = `http://localhost:8080/api/sign-in/provider/${provider}`;
    };

    const handleFlip = (action) => {
        const container = document.getElementById('container');
        if (action === 'register') {
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    };

    return (
        <div className="container" id="container">
            <div className="form-container sign-up">
                <form onSubmit={handleRegisterSubmit}>
                    <h1>Create Account</h1>
                    <div className="social-icons">
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('google')}><i className="fa-brands fa-google-plus-g"></i></a>
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('facebook')}><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('github')}><i className="fa-brands fa-github"></i></a>
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('linkedin')}><i className="fa-brands fa-linkedin-in"></i></a>
                    </div>
                    <span>or use your email for registration</span>
                    <input type="text" placeholder="Name" name="username" onChange={handleChange} required />
                    <input type="email" placeholder="Email" name="email" onChange={handleChange} required />
                    <input type="password" placeholder="Password" name="password" onChange={handleChange} required />
                    <button type="submit">Sign Up</button>
                </form>
            </div>

            <div className="form-container sign-in">
                <form onSubmit={handleLoginSubmit}>
                    <h1>Sign In</h1>
                    <div className="social-icons">
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('google')}><i className="fa-brands fa-google-plus-g"></i></a>
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('facebook')}><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('github')}><i className="fa-brands fa-github"></i></a>
                        <a href="#" className="icon" onClick={() => handleOAuthLogin('linkedin')}><i className="fa-brands fa-linkedin-in"></i></a>
                    </div>
                    <span>or use your email password</span>
                    <input type="email" placeholder="Email" name="email" onChange={handleLoginChange} required />
                    <input type="password" placeholder="Password" name="password" onChange={handleLoginChange} required />
                    <a href="#">Forgot your password?</a>
                    <button type="submit" disabled={isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</button>
                </form>
            </div>

            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>Enter your personal details to use our Collaborative Code Editor</p>
                        <button className="hidden" id="login" onClick={() => handleFlip('login')}>Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use our Collaborative Code Editor</p>
                        <button className="hidden" id="register" onClick={() => handleFlip('register')}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

