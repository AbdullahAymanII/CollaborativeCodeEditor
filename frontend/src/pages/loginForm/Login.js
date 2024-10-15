// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
//
// const Login = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         username: '',
//         email: '',
//         password: '',
//     });
//     const [message, setMessage] = useState('');
//     const [isError, setIsError] = useState(false);
//     const [loginData, setLoginData] = useState({
//         email: '',
//         password: ''
//     });
//     const [errorMessage, setErrorMessage] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
//
//     const handleLoginChange = (e) => {
//         setLoginData({ ...loginData, [e.target.name]: e.target.value });
//     };
//
//     const handleRegisterSubmit = async (e) => {
//         e.preventDefault();
//         setMessage('');
//         setIsError(false);
//
//         try {
//             const response = await fetch('http://localhost:8080/api/sign-up', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//                 credentials: 'include',
//             });
//             console.log(response);
//             // const data = await response.json();
//             console.log(response);
//             // console.log(data);
//             if (response.ok) {
//                 console.log('response');
//                 console.log(response);
//                 // console.log(data);
//                 setMessage('Registration successful! Redirecting...');
//                 setTimeout(() => {
//                     handleFlip('login');
//                     // navigate('/', { state: { email: formData.email, password: formData.password } });
//                 }, 2000);
//             } else {
//                 setMessage( 'Registration failed, please try again.');
//                 setIsError(true);
//             }
//
//         } catch (error) {
//             setMessage('An error occurred during registration.');
//             setIsError(true);
//         }
//     };
//
//     const handleLoginSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//
//         try {
//             const response = await fetch('http://localhost:8080/api/sign-in', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(loginData),
//             });
//
//             if (!response.ok) throw new Error('Invalid login credentials.');
//
//             const data = await response.json();
//             localStorage.setItem('token', data.token);
//             navigate('/home');
//         } catch (err) {
//             setErrorMessage(err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     const handleOAuthLogin = (provider) => {
//         window.location.href = `http://localhost:8080/api/sign-in/provider/${provider}`;
//     };
//
//     const handleFlip = (action) => {
//         const container = document.getElementById('container');
//         if (action === 'register') {
//             container.classList.add('active');
//         } else {
//             container.classList.remove('active');
//         }
//     };
//
//     return (
//         <div className="container" id="container">
//             <div className="form-container sign-up">
//                 <form onSubmit={handleRegisterSubmit}>
//                     <h1>Create Account</h1>
//                     <div className="social-icons">
//                         <a href="#" className="icon" onClick={() => handleOAuthLogin('google')}><i className="fa-brands fa-google-plus-g"></i></a>
//                         <a href="#" className="icon" onClick={() => handleOAuthLogin('facebook')}><i className="fa-brands fa-facebook-f"></i></a>
//                         <a href="#" className="icon" onClick={() => handleOAuthLogin('github')}><i className="fa-brands fa-github"></i></a>
//                         <a href="#" className="icon" onClick={() => handleOAuthLogin('linkedin')}><i className="fa-brands fa-linkedin-in"></i></a>
//                     </div>
//                     <span>or use your email for registration</span>
//                     <input type="text" placeholder="Name" name="username" onChange={handleChange} required />
//                     <input type="email" placeholder="Email" name="email" onChange={handleChange} required />
//                     <input type="password" placeholder="Password" name="password" onChange={handleChange} required />
//                     <button type="submit">Sign Up</button>
//                 </form>
//             </div>
//
//             <div className="form-container sign-in">
//                 <form onSubmit={handleLoginSubmit}>
//                     <h1>Sign In</h1>
//                     <div className="social-icons">
//                         <a href="#" className="icon" onClick={() => handleOAuthLogin('google')}><i className="fa-brands fa-google-plus-g"></i></a>
//                         <a href="#" className="icon" onClick={() => handleOAuthLogin('facebook')}><i className="fa-brands fa-facebook-f"></i></a>
//                         <a href="#" className="icon" onClick={() => handleOAuthLogin('github')}><i className="fa-brands fa-github"></i></a>
//                         <a href="#" className="icon" onClick={() => handleOAuthLogin('linkedin')}><i className="fa-brands fa-linkedin-in"></i></a>
//                     </div>
//                     <span>or use your email password</span>
//                     <input type="email" placeholder="Email" name="email" onChange={handleLoginChange} required />
//                     <input type="password" placeholder="Password" name="password" onChange={handleLoginChange} required />
//                     <a href="#">Forgot your password?</a>
//                     <button type="submit" disabled={isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</button>
//                 </form>
//             </div>
//
//             <div className="toggle-container">
//                 <div className="toggle">
//                     <div className="toggle-panel toggle-left">
//                         <h1>Welcome Back!</h1>
//                         <p>Enter your personal details to use our Collaborative Code Editor</p>
//                         <button className="hidden" id="login" onClick={() => handleFlip('login')}>Sign In</button>
//                     </div>
//                     <div className="toggle-panel toggle-right">
//                         <h1>Hello, Friend!</h1>
//                         <p>Register with your personal details to use our Collaborative Code Editor</p>
//                         <button className="hidden" id="register" onClick={() => handleFlip('register')}>Sign Up</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Login;
//

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
            const response = await fetch('http://localhost:8080/api/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            if (response.ok) {
                setMessage('Registration successful! Redirecting...');
                setTimeout(() => {
                    handleFlip('login');
                }, 2000);
            } else {
                const errorData = await response.json(); // Parse JSON to get the error message
                setMessage(errorData.message || 'Registration failed, please try again.');
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
            const response = await fetch('http://localhost:8080/api/sign-in', {
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
                    {message && (
                        <div className={`message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}
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
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
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
