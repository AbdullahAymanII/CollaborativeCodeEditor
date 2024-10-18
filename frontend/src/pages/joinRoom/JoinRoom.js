import React, {useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './JoinRoom.css';

const JoinRoom = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [viewerRooms, setViewerRooms] = useState([]);
    const [collaboratorRooms, setCollaboratorRooms] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState('');

    const {user} = location.state;

    const fetchUserRooms = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/rooms/join-room?username=${encodeURIComponent(user.name)}`, {
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

    const handleRoomClick = (room, roleClick) => {
        fetch(`http://localhost:8080/api/rooms/join-room/${room.roomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({roomName: room.name}),
        })
            .then((response) => {
                console.log(role);
                if (response.ok) {

                    setRole(roleClick);

                    console.log(role);
                    navigate(`/join-room/${room.roomId}/${roleClick}`, {
                        state: {user, room:{roomId:room.roomId, name:room.name}, role: roleClick},
                    });

                } else {
                    console.error('Failed to join room');
                }
            })
            .catch((error) => console.error('Error joining room:', error));
    };

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

            {/* Main Body for Room Lists */}
            <div className="room-lists-container">
                <div className="room-list">
                    <h2>Viewer Rooms</h2>
                    {viewerRooms.length === 0 ? (
                        <p>No rooms available as a viewer</p>
                    ) : (
                        viewerRooms.map((room) => (
                            <div key={room.roomId} className="room-card"
                                 onClick={() => handleRoomClick(room, "VIEWER")}>
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
                            <div key={room.roomId} className="room-card"
                                 onClick={() => handleRoomClick(room, "COLLABORATOR")}>
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

