import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddMembers.css'; // Make sure to include the CSS file in your project

const AddMembers = () => {
    const [newViewer, setNewViewer] = useState('');
    const [newCollaborator, setNewCollaborator] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [darkMode, setDarkMode] = useState(false); // State to handle theme toggle

    const location = useLocation();
    const navigate = useNavigate();

    // const roomId = location?.state?.roomId || null;

    const { user, room, project } = location.state;

    useEffect(() => {
        // Add or remove dark mode class to the body
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    if (!room.roomId) {
        return (
            <div>
                <p>Error: Room ID not found. Please navigate correctly.</p>
                <button onClick={() => navigate('/home')}>Go to Home</button>
            </div>
        );
    }

    const addMember = async (type, member) => {
        setLoading(true);
        setErrorMessage('');

        try {
            const endpoint = type === 'viewer' ? 'add-viewer' : 'add-collaborator';
            const response = await fetch(`http://localhost:8080/api/rooms/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ member, roomId:room.roomId }),
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

    const handleAddViewer = () => {
        addMember('viewer', newViewer);
    };

    const handleAddCollaborator = () => {
        addMember('collaborator', newCollaborator);
    };

    return (
        <div className="add-members-container">
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                Switch to {darkMode ? 'Light' : 'Dark'} Mode
            </button>
            <h2>Add Members to Room ID: {room.roomId}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Add new viewer"
                    value={newViewer}
                    onChange={(e) => setNewViewer(e.target.value)}
                />
                <button onClick={handleAddViewer} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Viewer'}
                </button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Add new collaborator"
                    value={newCollaborator}
                    onChange={(e) => setNewCollaborator(e.target.value)}
                />
                <button onClick={handleAddCollaborator} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Collaborator'}
                </button>
            </div>
            <button onClick={() => navigate('/home')} disabled={loading}>
                {loading ? 'Finishing...' : 'Finish'}
            </button>
        </div>
    );
};

export default AddMembers;



