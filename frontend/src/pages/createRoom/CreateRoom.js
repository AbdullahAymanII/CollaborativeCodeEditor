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

            const data = await response.json();
            setRoomId(data.roomId);
            setShowMemberForm(true);
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
