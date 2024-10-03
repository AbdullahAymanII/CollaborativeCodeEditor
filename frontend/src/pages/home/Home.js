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
            setUser({ name: userInfo.username, profileImage: userInfo.profileImage });
        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const toggleTheme = () => setDarkMode(!darkMode);

    const navigateToCreateRoom = () => {
        // navigate('/create-room', { state: { userName: user.name } });
        navigate('/create-room', { state: { user } });
    };

    const navigateToJoinRoom = () => {
        // navigate('/join-room', { state: { userName: user.name , profileImage: user.profileImage } });
        navigate('/join-room', { state: { user } });
    };

    const navigateToEditRoom = () => {
        // navigate('/edit-room', { state: { userName: user.name } });
        navigate('/edit-room', { state: { user } });
    };

    return (
        <div className={`home-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <header className="home-header">
                <div className="user-info">
                    <img className="user-image" src={user.profileImage} alt="User" />
                    <span className="user-name">{user.name}</span>
                </div>
                <button className="theme-toggle-btn" onClick={toggleTheme}>
                    {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
            </header>

            <div className="home-body">
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

            <footer className="home-footer">
            <p>&copy; {new Date().getFullYear()} Developed by Abdullah Ayman</p>
            </footer>
        </div>
    );
};

export default Home;




//
//
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Home.css';
//
// const Home = () => {
//     const [darkMode, setDarkMode] = useState(false);
//     const [user, setUser] = useState({ name: '', profileImage: '' });
//     const navigate = useNavigate();
//
//     const fetchUserInfo = async () => {
//         try {
//             const response = await fetch('http://localhost:8080/api/user/info', {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             if (!response.ok) throw new Error('Failed to fetch user info');
//             const userInfo = await response.json();
//             setUser({ name: userInfo.username, profileImage: userInfo.profileImage });
//         } catch (error) {
//             console.error('Failed to fetch user info:', error);
//         }
//     };
//
//     useEffect(() => {
//         fetchUserInfo();
//     }, []);
//
//     const toggleTheme = () => setDarkMode(!darkMode);
//
//     const navigateToCreateRoom = () => {
//         navigate('/create-room', { state: { userName: user.name } });
//     };
//
//     return (
//         <div className={`home-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
//             <header className="home-header">
//                 <div className="user-info">
//                     <img className="user-image" src={user.profileImage} alt="User" />
//                     <span className="user-name">{user.name}</span>
//                 </div>
//                 <button className="theme-toggle-btn" onClick={toggleTheme}>
//                     {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//                 </button>
//             </header>
//
//             <div className="home-body">
//                 <div className="buttons-container">
//                     <button className="btn" onClick={navigateToCreateRoom}>
//                         Create Room
//                     </button>
//                 </div>
//             </div>
//
//             <footer className="home-footer">
//                 <p>&copy; {new Date().getFullYear()} Developed by Abdullah Ayman</p>
//             </footer>
//         </div>
//     );
// };
//
// export default Home;

