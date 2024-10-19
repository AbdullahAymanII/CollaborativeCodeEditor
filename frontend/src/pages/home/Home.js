import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState({ name: '', profileImage: '' });
    const navigate = useNavigate();

    // Fetch user info from the backend
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/user/info', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch user info');
            const userInfo = await response.json();
            console.log(userInfo);
            setUser({ name: userInfo.username, profileImage: userInfo.profileImage });
        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const toggleTheme = () => setDarkMode(!darkMode);

    const handleLogout = () => {
        // Clear the token and navigate to the login page
        localStorage.removeItem('token');
        navigate('/');
    };

    const navigateToCreateRoom = () => navigate('/create-room', { state: { user } });
    const navigateToJoinRoom = () => navigate('/join-room', { state: { user } });
    const navigateToEditRoom = () => navigate('/edit-room', { state: { user } });

    return (
        <div className={`home-container ${darkMode ? 'light-mode' : 'dark-mode'}`}>
            <header className="home-header">
                <div className="user-info">
                    <img className="user-image" src={user.profileImage} alt="User" />
                    <span className="user-name">{user.name}</span>
                </div>
                <div className="header-buttons">
                    <button className="theme-toggle-btn" onClick={toggleTheme}>
                        {darkMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        LOG OUT
                    </button>
                </div>
            </header>

            <div className="home-body">
                {/* Image displayed above the buttons and title */}
                <div className="home-image"></div>

                <div className="buttons-title-container">
                    <div className="buttons-container">
                        <button className="btn" onClick={navigateToCreateRoom}>
                            Create Room
                        </button>
                        <button className="btn" onClick={navigateToJoinRoom}>
                            Join Room
                        </button>
                        <button className="btn" onClick={navigateToEditRoom}>
                            Edit Room
                        </button>
                    </div>
                    <div className="title-container">
                        <h1 className="title">Collaborative Code Editor</h1>
                        <p className="subtitle">Real-time collaboration and version control</p>
                    </div>
                </div>
            </div>

            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} Developed by Abdullah Ayman</p>
            </footer>
        </div>
    );
};

export default Home;

