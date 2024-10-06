import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './JoinRoom.css';

const JoinRoom = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [viewerRooms, setViewerRooms] = useState([]);
    const [collaboratorRooms, setCollaboratorRooms] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState('');
    // const { userName, profileImage } = location.state; // Retrieve userEmail from state
    const { user } = location.state; // Retrieve userEmail from state

    const fetchUserRooms = async () => {
        try {
            // Pass userName as a query parameter in the URL
            const response = await fetch(`http://localhost:8080/api/rooms/join-room?userName=${encodeURIComponent(user.name)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch rooms');
            const roomsData = await response.json();
            setViewerRooms(roomsData.viewRooms);
            setCollaboratorRooms(roomsData.collaborativeRooms);
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        }
    };


    useEffect(() => {
        fetchUserRooms();
    }, []);

    const toggleTheme = () => setDarkMode(!darkMode);

    const handleRoomClick = (room,roleClick) => {
        fetch(`http://localhost:8080/api/rooms/join-room/${room.roomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ roomId: room.roomId }),
        })
            .then((response) => {
                if (response.ok) {

                    setRole(roleClick);

                    console.log(role);

                    navigate(`/join-room/${room.roomId}/${roleClick}`, {
                        state: { user, room, role:roleClick },
                    });

                } else {
                    console.error('Failed to join room');
                }
            })
            .catch((error) => console.error('Error joining room:', error));
    };


    return (
        <div className={`join-room-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            {/* Reusable Header */}
            <header className="home-header">
                <div className="user-info">
                    <img className="user-image" src={user.profileImage} alt="User" />
                    <span className="user-name">{user.name}</span>
                </div>
                <button className="theme-toggle-btn" onClick={toggleTheme}>
                    {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
            </header>

            {/* Main Body for Room Lists */}
            <div className="room-lists-container">
                <div className="room-list">
                    <h2>Viewer Rooms</h2>
                    {viewerRooms.length === 0 ? (
                        <p>No rooms available as a viewer</p>
                    ) : (
                        viewerRooms.map((room) => (
                            <div key={room.roomId} className="room-card" onClick={() => handleRoomClick(room,"VIEWER")}>
                                <p>Room Name : {room.name}</p>
                                <p>Room Id: {room.roomId}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="room-list">
                    <h2>Collaborator Rooms</h2>
                    {collaboratorRooms.length === 0 ? (
                        <p>No rooms available as a collaborator</p>
                    ) : (
                        collaboratorRooms.map((room) => (
                            <div key={room.roomId} className="room-card" onClick={() => handleRoomClick(room,"COLLABORATOR")}>
                                <p>Room Name : {room.name}</p>
                                <p>Room Id: {room.roomId}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Reusable Footer */}
            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} Developed by Abdullah Ayman</p>
            </footer>
        </div>
    );
};

export default JoinRoom;

