import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CreateRoom.css';
const CreateRoom = () => {
    const [roomName, setRoomName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [room, setRoom] = useState({ roomId: "", roomName: "" });

    const { user } = location.state || {};

    const handleCreateRoom = async () => {
        setLoading(true);
        setErrorMessage('');
        console.log(user);
        const updatedRoom = { roomId: roomId, roomName: roomName };
        console.log(updatedRoom);
        try {
            const response = await fetch('http://localhost:8080/api/rooms/createRoom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ roomName, roomId, ownerEmail: user.name }),
            });

            if (!response.ok) {
                throw new Error('Invalid RoomName or RoomId');
            }
            setRoom(updatedRoom);
            console.log(response);
            console.log(room);

            navigate('/add-members', { state: { user : user, room : updatedRoom } });
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-room-container">
            <div className="create-room-form">
                <h2>Create a New Room</h2>

                {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error */}

                <div className="input-group">
                    <label htmlFor="roomName">Room Name</label>
                    <input
                        type="text"
                        id="roomName"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Enter room name"
                        disabled={loading}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="roomId">Room ID</label>
                    <input
                        type="text"
                        id="roomId"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter room ID"
                        disabled={loading}
                    />
                </div>

                <button
                    className="create-room-button"
                    onClick={handleCreateRoom}
                    disabled={loading || !roomName || !roomId}
                >
                    {loading ? 'Creating...' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default CreateRoom;
