import React, { useState, useEffect } from 'react';
import ProjectList from './ProjectList';
import Action from "./Action";

const Control = ({ room, currentFile, isConnected, subscribeToCodeUpdates }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [fileToFetch, setFileToFetch] = useState(null);

    const [showBranchModal, setShowBranchModal] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);

    const showError = (message) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(''), 3000);
    };

    const fetchProjects = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/projects/room/${room.roomId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch projects');
            const data = await response.json();
            setProjects(data.projects);
        } catch (error) {
            showError('You do not have projects currently. Please add a new project.');
        }
    };


    const fetchFiles = async (projectName) => {
        try {
            const encodedProjectName = encodeURIComponent(projectName);
            const response = await fetch(`http://localhost:8080/api/files/list-files/${encodedProjectName}/${room.roomId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch files');
            const data = await response.json();
            setFiles(data.files);
        } catch (error) {
            showError('You do not have files currently. Please add a new file.');
        }
    };

    const fetchFileContent = async (file) => {
        try {
            const response = await fetch(`http://localhost:8080/api/files/pull-file-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    fileName: file.fileName,
                    roomId: file.roomId,
                    projectName: file.projectName
                }),
            });
            if (!response.ok) throw new Error('Failed to fetch file content');

            const data = await response.json();
            setSelectedFileContent(data.file.content);
            currentFile(data.file);
            if (isConnected && data.file) {
                subscribeToCodeUpdates(data.file);
            }
        } catch (error) {
            showError('The file does not have content currently...');
        }
    };

    const handleProjectSelect = (project) => {
        setSelectedProject(selectedProject === project ? null : project);
        setFiles([]);
        setSelectedFile(null);
        if (selectedProject !== project) {
            fetchFiles(project.projectName);
        }
    };

    const handleFileSelect = (file) => {
        setFileToFetch(file);
        setShowConfirmModal(true);
    };

    const handleConfirmPull = () => {
        setSelectedFile(fileToFetch);
        fetchFileContent(fileToFetch);
        setShowConfirmModal(false);
    };

    const handleCancelPull = () => setShowConfirmModal(false);

    const handleCreateNewBranch = async (branchName) => {
        try {
            const response = await fetch(`http://localhost:8080/api/projects/create-project`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ projectName: branchName, roomId: room.roomId }),
            });
            if (!response.ok) throw new Error('Failed to create branch');
            fetchProjects();
        } catch (error) {
            showError('Failed to create new branch.');
        }
    };

    const handleCreateNewFile = async ({ branchName, fileName }) => {
        if (fileName && branchName) {
            try {
                const encodedBranchName = encodeURIComponent(branchName);
                const response = await fetch(`http://localhost:8080/api/files/create-file`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ fileName, roomId: room.roomId, projectName: branchName }),
                });
                if (!response.ok) throw new Error('Failed to create file');
                fetchFiles(branchName);
            } catch (error) {
                showError('Failed to create new file.');
            }
        }
    };

    useEffect(() => {
        if (room.roomId) {
            fetchProjects();
        }
    }, [room.roomId]);

    return (
        <div className="version-control">
            <h2>📂 Version Control</h2>
            <div className="version-control-buttons">
                <button className="action-btn add-branch-btn" onClick={() => setShowBranchModal(true)}>
                    Add New Branch
                </button>
                <button className="action-btn add-file-btn" onClick={() => setShowFileModal(true)}>
                    Add New File
                </button>
            </div>

            <ProjectList
                projects={projects}
                selectedProject={selectedProject}
                onSelectProject={handleProjectSelect}
                files={files}
                selectedFile={selectedFile}
                onSelectFile={handleFileSelect}
            />

            <Action
                show={showBranchModal}
                title="Create New Branch"
                actionLabel="Create"
                inputs={[{ label: 'Branch Name', placeholder: 'Enter new branch name', name: 'branchName' }]}
                onConfirm={(inputValues) => {
                    handleCreateNewBranch(inputValues.branchName);
                    setShowBranchModal(false);
                }}
                onCancel={() => setShowBranchModal(false)}
            />

            <Action
                show={showFileModal}
                title="Create New File"
                actionLabel="Create"
                inputs={[
                    { label: 'Branch Name', placeholder: 'Enter branch name', name: 'branchName' },
                    { label: 'File Name', placeholder: 'Enter new file name (e.g., file.txt)', name: 'fileName' },
                ]}
                onConfirm={(inputValues) => {
                    handleCreateNewFile(inputValues);
                    setShowFileModal(false);
                }}
                onCancel={() => setShowFileModal(false)}
            />

            <Action
                show={showConfirmModal}
                title="Confirm PULL"
                actionLabel="PULL"
                inputs={[]}
                onConfirm={handleConfirmPull}
                onCancel={handleCancelPull}
            />
        </div>
    );
};

export default Control;
