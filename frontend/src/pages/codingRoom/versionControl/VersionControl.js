// import React, { useState, useEffect } from 'react';
//
// // Modal Component for Confirmation Actions
// const ActionModal = ({ show, title, actionLabel, inputs, onConfirm, onCancel }) => {
//     const [inputValues, setInputValues] = useState({});
//
//     const handleInputChange = (e, field) => {
//         setInputValues({ ...inputValues, [field]: e.target.value });
//     };
//
//     const handleConfirm = () => {
//         const filled = Object.values(inputValues).every(val => val.trim());
//         if (filled) {
//             onConfirm(inputValues);
//             setInputValues({}); // Clear inputs after confirmation
//         }
//     };
//
//     if (!show) return null;
//
//     return (
//         <div className="modal-overlay">
//             <div className="modal">
//                 <h3>{title}</h3>
//                 {inputs.map(({ label, placeholder, name }) => (
//                     <div key={name}>
//                         <label>{label}</label>
//                         <input
//                             type="text"
//                             className="modal-input"
//                             placeholder={placeholder}
//                             value={inputValues[name] || ''}
//                             onChange={(e) => handleInputChange(e, name)}
//                         />
//                     </div>
//                 ))}
//                 <div className="modal-actions">
//                     <button className="confirm-btn" onClick={handleConfirm}>{actionLabel}</button>
//                     <button className="cancel-btn" onClick={onCancel}>Cancel</button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const VersionControl = ({ room, currentFile }) => {
//     const [projects, setProjects] = useState([]);
//     const [selectedProject, setSelectedProject] = useState(null);
//     const [files, setFiles] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [selectedFileContent, setSelectedFileContent] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [showConfirmModal, setShowConfirmModal] = useState(false);
//     const [fileToFetch, setFileToFetch] = useState(null);
//
//     const [showBranchModal, setShowBranchModal] = useState(false); // Modal for creating new branch
//     const [showFileModal, setShowFileModal] = useState(false); // Modal for creating new file
//
//     const showError = (message) => {
//         setErrorMessage(message);
//         setTimeout(() => {
//             setErrorMessage('');
//         }, 3000);
//     };
//
//     // Fetch Projects (Branches)
//     const fetchProjects = async () => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/projects/room/${room.roomId}`, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             if (!response.ok) throw new Error('Failed to fetch projects');
//             const data = await response.json();
//             setProjects(data.projects);
//         } catch (error) {
//             showError('You do not have projects currently. Please add a new project.');
//         }
//     };
//
//     // Fetch Files
//     const fetchFiles = async (projectName) => {
//         try {
//             const encodedProjectName = encodeURIComponent(projectName);
//             const response = await fetch(`http://localhost:8080/api/files/list-files/${encodedProjectName}/${room.roomId}`, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             if (!response.ok) throw new Error('Failed to fetch files');
//             const data = await response.json();
//             setFiles(data.files);
//         } catch (error) {
//             showError('You do not have files currently. Please add a new file.');
//         }
//     };
//
//
//     const fetchFileContent = async (file) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/files/pull-file-content`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',  // Add the correct content type
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({
//                     fileName: file.fileName,
//                     roomId: file.roomId,
//                     projectName: file.projectName
//                 }),
//             });
//
//             if (!response.ok) throw new Error('Failed to fetch file content');
//
//             const data = await response.json();
//             setSelectedFileContent(data.file.content);
//             currentFile(data.file);
//         } catch (error) {
//             console.error(error);  // Added logging to see error in the console
//             showError('The file does not have content currently...');
//         }
//     };
//
//
//     const handleProjectSelect = (project) => {
//         setSelectedProject(selectedProject === project ? null : project);
//         setFiles([]);
//         setSelectedFile(null);
//         if (selectedProject !== project) {
//             fetchFiles(project.projectName);
//         }
//     };
//
//     const handleFileSelect = (file) => {
//         setFileToFetch(file);
//         setShowConfirmModal(true); // Show confirmation modal
//     };
//
//     const handleConfirmPull = () => {
//         setSelectedFile(fileToFetch);
//         fetchFileContent(fileToFetch);
//         setShowConfirmModal(false);
//     };
//
//     const handleCancelPull = () => {
//         setShowConfirmModal(false);
//     };
//
//     // Handle creating new branch (with modal input)
//     const handleCreateNewBranch = async (branchName) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/projects/create-project`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({ projectName: branchName, roomId:room.roomId }),
//             });
//             if (!response.ok) throw new Error('Failed to create branch');
//             fetchProjects(); // Refresh projects list
//         } catch (error) {
//             showError('Failed to create new branch.');
//         }
//     };
//
//     // Handle creating new file (with modal input for branch and file name)
//     const handleCreateNewFile = async ({ branchName, fileName }) => {
//         if (fileName && branchName) {
//             try {
//                 const encodedBranchName = encodeURIComponent(branchName);
//                 const response = await fetch(`http://localhost:8080/api/files/create-file`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${localStorage.getItem('token')}`,
//                     },
//                     body: JSON.stringify({ fileName, roomId:room.roomId, projectName: branchName}),
//                 });
//                 if (!response.ok) throw new Error('Failed to create file');
//                 fetchFiles(branchName); // Refresh file list
//             } catch (error) {
//                 showError('Failed to create new file.');
//             }
//         }
//     };
//
//     useEffect(() => {
//         if (room.roomId) {
//             fetchProjects();
//         }
//     }, [room.roomId]);
//
//     return (
//         <div className="version-control">
//             <h2>📂 Version Control</h2>
//
//             {/* Buttons for creating new branch and file */}
//             <div className="version-control-buttons">
//                 <button className="action-btn add-branch-btn" onClick={() => setShowBranchModal(true)}>Add New
//                     Branch
//                 </button>
//                 <button className="action-btn add-file-btn" onClick={() => setShowFileModal(true)}>Add New File
//                 </button>
//             </div>
//
//
//             {/* Projects (Branches) List */}
//             <div className="projects-container">
//                 <h2>Branches</h2>
//                 {projects.length === 0 ? (
//                     <p>No branches available.</p>
//                 ) : (
//                     <ul className="projects-list">
//                         {projects.map((project) => (
//                             <li
//                                 key={project.projectName}
//                                 className={`project-item ${selectedProject === project ? 'open' : ''}`}
//                                 onClick={() => handleProjectSelect(project)}
//                             >
//                                 <div className="project-name">
//                                     {project.projectName}
//                                     <span className="arrow">{selectedProject === project ? '▲' : '▼'}</span>
//                                 </div>
//
//                                 {selectedProject === project && (
//                                     <ul className="files-list">
//                                         {files.length === 0 ? (
//                                             <li className="file-item">No files available.</li>
//                                         ) : (
//                                             files.map((file) => (
//                                                 <li
//                                                     key={file.fileName}
//                                                     className={`file-item ${selectedFile === file ? 'selected' : ''}`}
//                                                     onClick={() => handleFileSelect(file)}
//                                                 >
//                                                     {file.fileName}
//                                                 </li>
//                                             ))
//                                         )}
//                                     </ul>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//
//             <ActionModal
//                 show={showBranchModal}
//                 title="Create New Branch"
//                 actionLabel="Create"
//                 inputs={[
//                     {label: 'Branch Name', placeholder: 'Enter new branch name', name: 'branchName'},
//                 ]}
//                 onConfirm={(inputValues) => {
//                     handleCreateNewBranch(inputValues.branchName);
//                     setShowBranchModal(false);
//                 }}
//                 onCancel={() => setShowBranchModal(false)}
//             />
//
//             <ActionModal
//                 show={showFileModal}
//                 title="Create New File"
//                 actionLabel="Create"
//                 inputs={[
//                     {label: 'Branch Name', placeholder: 'Enter branch name', name: 'branchName'},
//                     {label: 'File Name', placeholder: 'Enter new file name (e.g., file.txt)', name: 'fileName'},
//                 ]}
//                 onConfirm={(inputValues) => {
//                     handleCreateNewFile(inputValues);
//                     setShowFileModal(false);
//                 }}
//                 onCancel={() => setShowFileModal(false)}
//             />
//
//             <ActionModal
//                 show={showConfirmModal}
//                 title="Confirm PULL"
//                 actionLabel="PULL"
//                 inputs={[]}
//                 onConfirm={handleConfirmPull}
//                 onCancel={handleCancelPull}
//             />
//
//             {/* Error Message */}
//             {/*{errorMessage && <p className="error-message">{errorMessage}</p>}*/}
//         </div>
//     );
// };
//
// export default VersionControl;
