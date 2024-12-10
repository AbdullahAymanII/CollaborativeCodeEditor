import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EditRoom.css';

const EditRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state;

    const fetchRooms = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/rooms/edit-room/${user.name}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch rooms');
            const data = await response.json();
            setRooms(data.rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleRoomClick = (room) => {
        navigate(`/edit-room/room/${room.roomId}`, { state: { user, room } });
    };

    const toggleTheme = () => setDarkMode(!darkMode);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    const handleHome = () => {
        navigate('/Home');
    };
    return (
        <div className={`rooms-container ${darkMode ? 'light-mode' : 'dark-mode'}`}>
            <header className="rooms-header">
                <div className="user-info">
                    <img className="user-image" src={user.profileImage} alt="User" />
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

            <div className="rooms-body">
                {rooms.length === 0 ? (
                    <p>No rooms found.</p>
                ) : (
                    <div className="rooms-grid">
                        {rooms.map((room) => (
                            <div key={room.roomId} className="room-card" onClick={() => handleRoomClick(room)}>
                                <img
                                    src="https://w7.pngwing.com/pngs/687/710/png-transparent-conference-centre-meeting-convention-table-computer-icons-program-development-blue-text-symmetry-thumbnail.png"
                                    alt={room.name}
                                    className="room-image"
                                />
                                <h3 className="room-name">{room.name}</h3>
                                <p className="room-id">ID: {room.roomId}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="rooms-footer">
                <p>&copy; {new Date().getFullYear()} Developed by Abdullah Ayman</p>
            </footer>
        </div>
    );
};

export default EditRoom;
