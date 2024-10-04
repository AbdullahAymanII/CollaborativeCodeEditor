// import React, {useState} from 'react';
// import {useLocation, useNavigate} from 'react-router-dom';
// import './CreateProject.css';
//
// const CreateProject = () => {
//     const [projectName, setProjectName] = useState('');
//     const [projectDescription, setProjectDescription] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [project, setProject] = useState({projectName: '', projectDescription: ''});
//
//     const {user, room} = location.state || {};  // Retrieve userEmail from state
//
//     const handleCreateProject = async () => {
//         setLoading(true);
//         setErrorMessage(''); // Reset error message before request
//         console.log(room);
//         console.log(user);
//         try {
//             const response = await fetch('http://localhost:8080/api/projects/create-project', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({projectName, roomId: room.roomId, projectDescription}),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Invalid Project Name or Project Id');
//             }
//             setProject({projectName: projectName, projectDescription: projectDescription});
//             navigate('/add-members', {
//                 state: {user: user, room: room, project: project},
//             });
//         } catch (error) {
//             setErrorMessage(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="create-project-container">
//             <div className="create-project-form">
//                 <h2>Create Your First Project</h2>
//                 {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
//                 <div className="input-group">
//                     <label htmlFor="projectName">Project Name</label>
//                     <input
//                         type="text"
//                         id="projectName"
//                         value={projectName}
//                         onChange={(e) => setProjectName(e.target.value)}
//                     />
//                 </div>
//                 <div className="input-group">
//                     <label htmlFor="projectId">Project Description</label>
//                     <input
//                         type="text"
//                         id="projectId" // Changed from textarea to input for Project Id
//                         value={projectDescription}
//                         onChange={(e) => setProjectDescription(e.target.value)}
//                     />
//                 </div>
//                 <button className="create-project-button" onClick={handleCreateProject} disabled={loading}>
//                     {loading ? 'Creating...' : 'Next'}
//                 </button>
//             </div>
//         </div>
//     );
// };
//
// export default CreateProject;
