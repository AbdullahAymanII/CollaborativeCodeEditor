import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CreateRoom.css';
const CreateRoom = () => {
    const [roomName, setRoomName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Define errorMessage
    const location = useLocation();
    const navigate = useNavigate();
    const [room, setRoom] = useState({ roomName: '', roomId: '' });

    // const { userName } = location.state; // Retrieve userEmail from state
    const { user } = location.state; // Retrieve userEmail from state

    const handleCreateRoom = async () => {
        setLoading(true);
        setErrorMessage(''); // Reset error message before request

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
            console.log(response);
            // const data = await response.json(); // Parse the response data
            setRoom({ roomName: roomName, roomId: roomId })
            // Navigate to create-project page, passing room and user information
            navigate('/create-project', {
                // state: { roomId: roomId, roomName: roomName, ownerName: userName },
                state: { user, room },
            });
        } catch (error) {
            setErrorMessage(error.message); // Display the error message
        } finally {
            setLoading(false); // Stop loading once the request completes
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



//
//
//
//
//
//
//
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
//
// const CreateRoom = () => {
//     const [roomName, setRoomName] = useState('');
//     const location = useLocation();
//     const { userName } = location.state; // Get the username from Home page
//     const navigate = useNavigate();
//
//     const handleCreateRoom = async () => {
//         try {
//             const response = await fetch('http://localhost:8080/api/rooms/create', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({
//                     roomName,
//                     ownerUsername: userName,
//                 }),
//             });
//             if (!response.ok) throw new Error('Failed to create room');
//             const roomData = await response.json();
//             const roomID = roomData.roomID; // Assuming server returns the roomID
//             navigate('/create-project', { state: { roomID, roomName, userName } });
//         } catch (error) {
//             console.error('Error creating room:', error);
//         }
//     };
//
//     return (
//         <div>
//             <h1>Create Room</h1>
//             <input
//                 type="text"
//                 placeholder="Enter Room Name"
//                 value={roomName}
//                 onChange={(e) => setRoomName(e.target.value)}
//             />
//             <button onClick={handleCreateRoom}>Create Room</button>
//         </div>
//     );
// };
//
// export default CreateRoom;
