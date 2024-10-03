// components/Header.js
import React from 'react';

const Header = ({ user, darkMode, toggleTheme }) => {
    return (
        <header className="coding-room-header">
            <div className="user-info">
                {user.profileImage && <img className="user-image" src={user.profileImage} alt="User" />}
                <span className="user-name">{user.name || 'Guest'}</span>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
        </header>
    );
};

export default Header;
