// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './CreateRoom.css';
// const CreateRoom = () => {
//     const [roomName, setRoomName] = useState('');
//     const [roomId, setRoomId] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [room, setRoom] = useState({ roomId: "", roomName: "" });
//
//     const { user } = location.state || {};
//
//     const handleCreateRoom = async () => {
//         setLoading(true);
//         setErrorMessage('');
//         console.log(user);
//         const updatedRoom = { roomId: roomId, roomName: roomName };
//         console.log(updatedRoom);
//         try {
//             const response = await fetch('http://localhost:8080/api/rooms/createRoom', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({ roomName, roomId, ownerEmail: user.name }),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Invalid RoomName or RoomId');
//             }
//             setRoom(updatedRoom);
//             console.log(response);
//             console.log(room);
//
//             navigate('/add-members', { state: { user : user, room : updatedRoom } });
//         } catch (error) {
//             setErrorMessage(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="create-room-container">
//             <div className="create-room-form">
//                 <h2>Create a New Room</h2>
//
//                 {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error */}
//
//                 <div className="input-group">
//                     <label htmlFor="roomName">Room Name</label>
//                     <input
//                         type="text"
//                         id="roomName"
//                         value={roomName}
//                         onChange={(e) => setRoomName(e.target.value)}
//                         placeholder="Enter room name"
//                         disabled={loading}
//                     />
//                 </div>
//
//                 <div className="input-group">
//                     <label htmlFor="roomId">Room ID</label>
//                     <input
//                         type="text"
//                         id="roomId"
//                         value={roomId}
//                         onChange={(e) => setRoomId(e.target.value)}
//                         placeholder="Enter room ID"
//                         disabled={loading}
//                     />
//                 </div>
//
//                 <button
//                     className="create-room-button"
//                     onClick={handleCreateRoom}
//                     disabled={loading || !roomName || !roomId}
//                 >
//                     {loading ? 'Creating...' : 'Next'}
//                 </button>
//             </div>
//         </div>
//     );
// };
//
// export default CreateRoom;

// import React, { useState } from 'react';
// import {useLocation, useNavigate} from 'react-router-dom';
// import './CreateRoom.css';
//
// const CreateRoom = () => {
//     const [roomName, setRoomName] = useState('');
//     const [roomId, setRoomId] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const location = useLocation();
//     const navigate = useNavigate();
//     // const [room, setRoom] = useState({ roomId: "", roomName: "" });
//     const { user } = location.state || {};
//
//     const handleCreateRoom = async () => {
//         setLoading(true);
//         setErrorMessage('');
//         try {
//             const response = await fetch('http://localhost:8080/api/rooms/createRoom', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({ roomName, roomId, ownerEmail: user.name }),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Invalid RoomName or RoomId');
//             }
//
//             navigate('/add-members', { state: { room: { roomId, roomName } } });
//         } catch (error) {
//             setErrorMessage(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="container" id="container">
//             <div className="form-container create-room">
//                 <form onSubmit={(e) => e.preventDefault()}>
//                     <h1>Create Room</h1>
//                     {errorMessage && <div className="error-message">{errorMessage}</div>}
//                     <input
//                         type="text"
//                         placeholder="Room Name"
//                         value={roomName}
//                         onChange={(e) => setRoomName(e.target.value)}
//                         disabled={loading}
//                     />
//                     <input
//                         type="text"
//                         placeholder="Room ID"
//                         value={roomId}
//                         onChange={(e) => setRoomId(e.target.value)}
//                         disabled={loading}
//                     />
//                     <button
//                         type="submit"
//                         onClick={handleCreateRoom}
//                         disabled={loading || !roomName || !roomId}
//                     >
//                         {loading ? 'Creating...' : 'Next'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default CreateRoom;


// import React, { useState } from 'react';
// import {useLocation, useNavigate} from 'react-router-dom';
// import { motion } from 'framer-motion';
// import './CreateRoom.css';
//
// const CreateRoomAndAddMembers = () => {
//     const [roomName, setRoomName] = useState('');
//     const [roomId, setRoomId] = useState('');
//     const [newViewer, setNewViewer] = useState('');
//     const [newCollaborator, setNewCollaborator] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [showAddMembersForm, setShowAddMembersForm] = useState(false); // To toggle forms
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { user } = location.state || {};
//     const handleCreateRoom = async () => {
//         setLoading(true);
//         setErrorMessage('');
//         try {
//             const response = await fetch('http://localhost:8080/api/rooms/createRoom', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({ roomName, roomId, ownerEmail: user.name }),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Invalid RoomName or RoomId');
//             }
//
//             setShowAddMembersForm(true); // Show the Add Members form on successful room creation
//         } catch (error) {
//             setErrorMessage(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const addMember = async (type, member) => {
//         setLoading(true);
//         setErrorMessage('');
//         try {
//             const endpoint = type === 'viewer' ? 'add-viewer' : 'add-collaborator';
//             const response = await fetch(`http://localhost:8080/api/rooms/${endpoint}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: JSON.stringify({ member, roomId }),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Failed to add new member');
//             }
//
//             type === 'viewer' ? setNewViewer('') : setNewCollaborator('');
//         } catch (error) {
//             setErrorMessage(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleAddViewer = () => addMember('viewer', newViewer);
//     const handleAddCollaborator = () => addMember('collaborator', newCollaborator);
//
//     return (
//         <div className="container" id="container">
//             {errorMessage && <div className="error-message">{errorMessage}</div>}
//
//             {/* Animate between forms */}
//             <motion.div
//                 className="form-container"
//                 initial={{ opacity: 0, x: 100 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -100 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 {!showAddMembersForm ? (
//                     // Create Room Form
//                     <form onSubmit={(e) => e.preventDefault()}>
//                         <h1>Create Room</h1>
//                         <input
//                             type="text"
//                             placeholder="Room Name"
//                             value={roomName}
//                             onChange={(e) => setRoomName(e.target.value)}
//                             disabled={loading}
//                         />
//                         <input
//                             type="text"
//                             placeholder="Room ID"
//                             value={roomId}
//                             onChange={(e) => setRoomId(e.target.value)}
//                             disabled={loading}
//                         />
//                         <button
//                             type="submit"
//                             onClick={handleCreateRoom}
//                             disabled={loading || !roomName || !roomId}
//                         >
//                             {loading ? 'Creating...' : 'Next'}
//                         </button>
//                     </form>
//                 ) : (
//                     // Add Members Form
//                     <div>
//                         <h1>Add Members to {roomName}</h1>
//                         <input
//                             type="text"
//                             placeholder="Add new viewer"
//                             value={newViewer}
//                             onChange={(e) => setNewViewer(e.target.value)}
//                             disabled={loading}
//                         />
//                         <button onClick={handleAddViewer} disabled={loading || !newViewer}>
//                             {loading ? 'Adding...' : 'Add Viewer'}
//                         </button>
//                         <input
//                             type="text"
//                             placeholder="Add new collaborator"
//                             value={newCollaborator}
//                             onChange={(e) => setNewCollaborator(e.target.value)}
//                             disabled={loading}
//                         />
//                         <button onClick={handleAddCollaborator} disabled={loading || !newCollaborator}>
//                             {loading ? 'Adding...' : 'Add Collaborator'}
//                         </button>
//                         <button onClick={() => navigate('/home')} disabled={loading}>
//                             {loading ? 'Finishing...' : 'Finish'}
//                         </button>
//                     </div>
//                 )}
//             </motion.div>
//         </div>
//     );
// };
//
// export default CreateRoomAndAddMembers;


import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import './CreateRoom.css';

const RoomCreationFlow = () => {
    const [roomName, setRoomName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [newViewer, setNewViewer] = useState('');
    const [newCollaborator, setNewCollaborator] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showMemberForm, setShowMemberForm] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = location.state || {};

    const handleCreateRoom = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch('http://localhost:8080/api/rooms/createRoom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({roomName, memberEmail: user.name}),
            });
            if (!response.ok) {
                throw new Error('Invalid Room Name or ID');
            }
            // Parse the response body to JSON
            const data = await response.json();
            setRoomId(data.roomId);  // Set the roomId from the response data
            setShowMemberForm(true); // Transition to the Add Members form
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addMember = async (type, member) => {
        setLoading(true);
        setErrorMessage('');
        try {
            const endpoint = type === 'viewer' ? 'VIEWER' : 'COLLABORATOR';
            const response = await fetch(`http://localhost:8080/api/rooms/add-member`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({memberEmail: member, roomId: roomId, role: endpoint}),
            });
            if (!response.ok) {
                throw new Error('Failed to add new member');
            }

            type === 'viewer' ? setNewViewer('') : setNewCollaborator('');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddViewer = () => addMember('viewer', newViewer);
    const handleAddCollaborator = () => addMember('collaborator', newCollaborator);

    return (
        <div className="form-wrapper">
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <motion.div
                className="form-animation"
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.8}}
                transition={{duration: 0.5}}
            >
                {!showMemberForm ? (
                    <form className="creation-form" onSubmit={(e) => e.preventDefault()}>
                        <h1 className="form-room-header">Create Your Room</h1>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Room Name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            disabled={loading}
                        />
                        {/*<input*/}
                        {/*    className="form-input"*/}
                        {/*    type="text"*/}
                        {/*    placeholder="Room ID"*/}
                        {/*    value={roomId}*/}
                        {/*    onChange={(e) => setRoomId(e.target.value)}*/}
                        {/*    disabled={loading}*/}
                        {/*/>*/}
                        <button
                            className="form-action-button"
                            type="submit"
                            onClick={handleCreateRoom}
                            // disabled={loading || !roomName || !roomId}
                            disabled={loading || !roomName}
                        >
                            {loading ? 'Creating...' : 'Next'}
                        </button>
                    </form>
                ) : (
                    <div className="member-forms">
                        <h1 className="add-member-headerForm">Add Members to {roomName}</h1>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Add Viewer"
                            value={newViewer}
                            onChange={(e) => setNewViewer(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            className="form-action-button"
                            onClick={handleAddViewer}
                            disabled={loading || !newViewer}
                        >
                            {loading ? 'Adding...' : 'Add Viewer'}
                        </button>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Add Collaborator"
                            value={newCollaborator}
                            onChange={(e) => setNewCollaborator(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            className="form-action-button"
                            onClick={handleAddCollaborator}
                            disabled={loading || !newCollaborator}
                        >
                            {loading ? 'Adding...' : 'Add Collaborator'}
                        </button>
                        <button
                            className="form-action-button finish-button"
                            onClick={() => navigate('/home')}
                            disabled={loading}
                        >
                            {loading ? 'Finishing...' : 'Finish'}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default RoomCreationFlow;
