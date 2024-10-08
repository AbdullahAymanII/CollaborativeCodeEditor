// components/Header.js
import React from 'react';
import {useNavigate} from "react-router-dom";

const Header = ({ user, darkMode, toggleTheme, closeWebSocketConnection, sendChatMessage, room, role }) => {
    const navigate = useNavigate();

    const leaveMessage = {
        sender: user.name,
        role: role,
        filename: '',
        roomId: room.roomId,
        projectName: '',
        content: 'left the room',
        type: 'leave'
    };

    const handleLogout = () => {
        sendChatMessage(leaveMessage);
        closeWebSocketConnection();
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleHome = () => {
        sendChatMessage(leaveMessage);
        closeWebSocketConnection();
        navigate('/Home');
    };
    return (
        <header className="rooms-header">
            <div className="user-info">
                <img className="user-image" src={user.profileImage} alt="User"/>
                <span className="user-name">{user.name}</span>
            </div>
            <div className="header-buttons">
                <button className="theme-toggle-btn" onClick={toggleTheme}>
                    {darkMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                </button>
                <button className="theme-toggle-btn" onClick={handleHome}>HOME</button>
                <button className="logout-btn" onClick={handleLogout}>LOG OUT</button>
            </div>
        </header>
    );
};

export default Header;
