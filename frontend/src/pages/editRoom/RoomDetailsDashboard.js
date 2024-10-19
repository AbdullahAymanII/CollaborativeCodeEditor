// import React, {useState, useEffect} from 'react';
// import {useLocation, useNavigate} from 'react-router-dom';
// import './EditRoom.css';
//
// const RoomAdmin = () => {
//     const [viewers, setViewers] = useState([]);
//     const [collaborators, setCollaborators] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const [roomName, setRoomName] = useState('');
//     const [newViewer, setNewViewer] = useState('');
//     const [newName, setNewName] = useState('');
//     const [newCollaborator, setNewCollaborator] = useState('');
//     const [darkMode, setDarkMode] = useState(false);
//     const location = useLocation();
//     const navigate = useNavigate();
//     const {user, room} = location.state; // Retrieve user and room from state
//
//     // Fetch room data (viewers, collaborators, and projects)
//     const fetchRoomDetails = async () => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/rooms/${room.roomId}/details`, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             if (!response.ok) throw new Error('Failed to fetch room details');
//
//             const data = await response.json();
//
//             // Flatten the nested arrays
//             setViewers(data.viewers.flat());
//             setCollaborators(data.collaborators.flat());
//             setProjects(data.projects.flat());
//
//             // Optionally log the results to verify
//             console.log("Viewers:", data.viewers);
//             console.log("Collaborators:", data.collaborators);
//             console.log("Projects:", data.projects);
//
//             setRoomName(room.name);
//         } catch (error) {
//             console.error('Error fetching room details:', error);
//         }
//     };
//
//
//     useEffect(() => {
//         fetchRoomDetails();
//     }, []);
//
//     const addMember = async (type, member) => {
//         try {
//             const endpoint = type === 'viewer' ? 'add-viewer' : 'add-collaborator';
//             const response = await fetch(`http://localhost:8080/api/rooms/${endpoint}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: JSON.stringify({member, roomId: room.roomId}),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Failed to add new member');
//             }
//
//             if (newViewer) {
//                 // Add API logic to update backend
//                 setViewers([...viewers, newViewer]);
//                 setNewViewer('');
//             }
//             if (newCollaborator) {
//                 // Add API logic to update backend
//                 setCollaborators([...collaborators, newCollaborator]);
//                 setNewCollaborator('');
//             }
//
//             type === 'viewer' ? setNewViewer('') : setNewCollaborator('');
//         } catch (error) {
//
//         }
//     };
//
//     const handleAddViewer = () => addMember('viewer', newViewer);
//     const handleAddCollaborator = () => addMember('collaborator', newCollaborator);
//
//     const removeMember = async (type, member) => {
//         try {
//             const endpoint = type === 'viewer' ? 'remove-viewer' : 'remove-collaborator';
//             const response = await fetch(`http://localhost:8080/api/rooms/remove-member`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: JSON.stringify({
//                     roomId: room.roomId, // This should be a string
//                     member // The member's email or ID
//                 }),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Failed to add new member');
//             }
//
//             type === 'viewer' ? setViewers(viewers.filter(v => v !== member)) : setCollaborators(collaborators.filter(c => c !== member));
//         } catch (error) {
//
//         }
//     };
//
//
//     const handleRemoveViewer = (viewer) => {
//         removeMember("viewer", viewer);
//     };
//
//     const handleRemoveCollaborator = (collaborator) => {
//         removeMember("collaborator", collaborator);
//     };
//
//     const handleRemoveProject = async (project) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/projects/remove-project`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 // Make sure to pass the right fields for ProjectDTO
//                 body: JSON.stringify({
//                     projectName: project.projectName,
//                     roomId: project.roomId,
//                 }),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Failed to remove project');
//             }
//
//             setProjects(projects.filter(p => p !== project));
//         } catch (error) {
//             console.error('Error removing project:', error);
//         }
//     };
//
//
//     const handleRenameRoom = async (newName) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/rooms/rename`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: JSON.stringify({ newName, roomId: room.roomId}),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Failed to add new member');
//             }
//             setRoomName(newName);
//         } catch (error) {
//
//         }
//     };
//
//     const toggleTheme = () => setDarkMode(!darkMode);
//
//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         navigate('/');
//     };
//
//     return (
//         <div className={`room-admin-container ${darkMode ? 'light-mode' : 'dark-mode'}`}>
//             <header className="rooms-header">
//                 <div className="user-info">
//                     <img className="user-image" src={user.profileImage} alt="User"/>
//                     <span className="user-name">{user.name}</span>
//                 </div>
//                 <div className="header-buttons">
//                     <button className="theme-toggle-btn" onClick={toggleTheme}>
//                         {darkMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
//                     </button>
//                     <button className="logout-btn" onClick={handleLogout}>
//                         LOG OUT
//                     </button>
//                 </div>
//             </header>
//
//             <div className="room-admin-body">
//                 <h2>Manage Room: {roomName}</h2>
//                 <input
//                     type="text"
//                     value={newName}
//                     onChange={(e) => setNewName(e.target.value)}
//                     placeholder="Add new viewer"
//                 />
//                 <button onClick={() => handleRenameRoom(newName)} className="remove-btn">Rename Room</button>
//                 <section className="stats">
//                     <div className="stat-card">
//                         <h3>Viewers</h3>
//                         <p>{viewers.length}</p>
//                     </div>
//                     <div className="stat-card">
//                         <h3>Collaborators</h3>
//                         <p>{collaborators.length}</p>
//                     </div>
//                 </section>
//
//                 <section className="management-section">
//                     <div className="viewer-management">
//                         <h3>Viewers</h3>
//                         <ul>
//                             {viewers.map(viewer => (
//                                 <li key={viewer}>
//                                     {viewer}
//                                     <button onClick={() => handleRemoveViewer(viewer)} className="remove-btn">Remove
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                         <input
//                             type="text"
//                             value={newViewer}
//                             onChange={(e) => setNewViewer(e.target.value)}
//                             placeholder="Add new viewer"
//                         />
//                         <button onClick={handleAddViewer}>Add Viewer</button>
//                     </div>
//
//                     <div className="collaborator-management">
//                         <h3>Collaborators</h3>
//                         <ul>
//                             {collaborators.map(collaborator => (
//                                 <li key={collaborator}>
//                                     {collaborator}
//                                     <button onClick={() => handleRemoveCollaborator(collaborator)}
//                                             className="remove-btn">Remove
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                         <input
//                             type="text"
//                             value={newCollaborator}
//                             onChange={(e) => setNewCollaborator(e.target.value)}
//                             placeholder="Add new collaborator"
//                         />
//                         <button onClick={handleAddCollaborator}>Add Collaborator</button>
//                     </div>
//                 </section>
//
//                 <section className="project-management">
//                     <h3>Projects</h3>
//                     <ul>
//                         {projects.map(project => (
//                             <li key={project.projectName}>
//                                 {project.projectName}
//                                 <button onClick={() => handleRemoveProject(project)} className="remove-btn">Remove
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </section>
//             </div>
//
//             <footer className="rooms-footer">
//                 <p>&copy; {new Date().getFullYear()} Developed by Abdullah Ayman</p>
//             </footer>
//         </div>
//     );
// };
//
// export default RoomAdmin;
//
//
//
//


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EditRoom.css';

const RoomAdmin = () => {
    const [viewers, setViewers] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [projects, setProjects] = useState([]);
    const [roomName, setRoomName] = useState('');
    const [newViewer, setNewViewer] = useState('');
    const [newName, setNewName] = useState('');
    const [newCollaborator, setNewCollaborator] = useState('');
    const [newProject, setNewProject] = useState(''); // For adding new project
    const [darkMode, setDarkMode] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, room } = location.state;

    const fetchRoomDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/rooms/${room.roomId}/details`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch room details');
            const data = await response.json();
            setViewers(data.viewers.flat());
            setCollaborators(data.collaborators.flat());
            setProjects(data.projects.flat());
            setRoomName(room.name);
        } catch (error) {
            console.error('Error fetching room details:', error);
        }
    };

    useEffect(() => {
        fetchRoomDetails();
    }, []);

    const addMember = async (type, member) => {
        const endpoint = type === 'viewer' ? 'VIEWER' : 'COLLABORATOR';
        try {
            const response = await fetch(`http://localhost:8080/api/rooms/add-member`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ memberEmail:member, roomId: room.roomId, role: endpoint }),
            });
            if (!response.ok) throw new Error('Failed to add new member');
            if (type === 'viewer') setViewers([...viewers, newViewer]);
            else setCollaborators([...collaborators, newCollaborator]);
            setNewViewer('');
            setNewCollaborator('');
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    const handleAddViewer = () => addMember('viewer', newViewer);
    const handleAddCollaborator = () => addMember('collaborator', newCollaborator);

    const removeMember = async (type, member) => {
        try {
            const endpoint = type === 'viewer' ? 'VIEWER' : 'COLLABORATOR';
            const response = await fetch(`http://localhost:8080/api/rooms/remove-member`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ roomId: room.roomId, memberEmail: member, role: endpoint }),
            });
            if (!response.ok) throw new Error('Failed to remove member');
            if (type === 'viewer') setViewers(viewers.filter(v => v !== member));
            else setCollaborators(collaborators.filter(c => c !== member));
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };

    const handleRemoveViewer = (viewer) => removeMember('viewer', viewer);
    const handleRemoveCollaborator = (collaborator) => removeMember('collaborator', collaborator);

    const handleRemoveProject = async (project) => {
        try {
            const response = await fetch(`http://localhost:8080/api/projects/remove-project`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ projectName: project.projectName, roomId: project.roomId }),
            });
            if (!response.ok) throw new Error('Failed to remove project');
            setProjects(projects.filter(p => p !== project));
        } catch (error) {
            console.error('Error removing project:', error);
        }
    };

    const handleRenameRoom = async (newName) => {
        try {
            const response = await fetch(`http://localhost:8080/api/rooms/rename`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name: newName, roomId: room.roomId }),
            });
            if (!response.ok) throw new Error('Failed to rename room');
            setRoomName(newName);
        } catch (error) {
            console.error('Error renaming room:', error);
        }
    };

    const handleAddProject = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/projects/create-project`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ projectName: newProject, roomId: room.roomId }),
            });
            if (!response.ok) throw new Error('Failed to add project');
            setProjects([...projects, { projectName: newProject, roomId: room.roomId }]);
            setNewProject('');
        } catch (error) {
            console.error('Error adding project:', error);
        }
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
        <div className={`room-admin-container ${darkMode ? 'light-mode' : 'dark-mode'}`}>
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

            <div className="room-admin-body">
                <h2 className="edit-h2" >Manage Room: {roomName}</h2>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New room name"
                />
                <button onClick={() => handleRenameRoom(newName)} className="edit-button">Rename Room</button>

                <section className="stats">
                    <div className="stat-card">
                        <h3>Viewers</h3>
                        <p>{viewers.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Collaborators</h3>
                        <p>{collaborators.length}</p>
                    </div>
                </section>

                <section className="management-section">
                    <div className="viewer-management">
                        <h3>Viewers</h3>
                        <ul>
                            {viewers.map(viewer => (
                                <li key={viewer}>
                                    {viewer}
                                    <button onClick={() => handleRemoveViewer(viewer)} className="remove-btn">Remove</button>
                                </li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            value={newViewer}
                            onChange={(e) => setNewViewer(e.target.value)}
                            placeholder="Add new viewer"
                        />
                        <button onClick={handleAddViewer} className="edit-button">Add Viewer</button>
                    </div>

                    <div className="collaborator-management">
                        <h3>Collaborators</h3>
                        <ul>
                            {collaborators.map(collaborator => (
                                <li key={collaborator}>
                                    {collaborator}
                                    <button onClick={() => handleRemoveCollaborator(collaborator)} className="remove-btn">Remove</button>
                                </li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            value={newCollaborator}
                            onChange={(e) => setNewCollaborator(e.target.value)}
                            placeholder="Add new collaborator"
                        />
                        <button onClick={handleAddCollaborator} className="edit-button">Add Collaborator</button>
                    </div>
                </section>

                <section className="project-management">
                    <h3>Projects</h3>
                    <ul>
                        {projects.map(project => (
                            <li key={project.projectName}>
                                {project.projectName}
                                <button onClick={() => handleRemoveProject(project)} className="remove-btn">Remove</button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={newProject}
                        onChange={(e) => setNewProject(e.target.value)}
                        placeholder="Add new project"
                    />
                    <button onClick={handleAddProject} className="edit-button">Add Project</button>
                </section>
            </div>
        </div>
    );
};

export default RoomAdmin;

