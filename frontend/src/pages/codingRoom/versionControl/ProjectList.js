// import React from 'react';
//
// const ProjectList = ({ projects, selectedProject, onSelectProject, files, selectedFile, onSelectFile }) => {
//     return (
//         <div className="projects-container">
//             <h2>Branches</h2>
//             {projects.length === 0 ? (
//                 <p>No branches available.</p>
//             ) : (
//                 <ul className="projects-list">
//                     {projects.map((project) => (
//                         <li
//                             key={project.projectName}
//                             className={`project-item ${selectedProject === project ? 'open' : ''}`}
//                             onClick={() => onSelectProject(project)}
//                         >
//                             <div className="project-name">
//                                 {project.projectName}
//                                 <span className="arrow">{selectedProject === project ? '▲' : '▼'}</span>
//                             </div>
//
//                             {selectedProject === project && (
//                                 <ul className="files-list">
//                                     {files.length === 0 ? (
//                                         <li className="file-item">No files available.</li>
//                                     ) : (
//                                         files.map((file) => (
//                                             <li
//                                                 key={file.fileName}
//                                                 className={`file-item ${selectedFile === file ? 'selected' : ''}`}
//                                                 onClick={() => onSelectFile(file)}
//                                             >
//                                                 {file.fileName}
//                                             </li>
//                                         ))
//                                     )}
//                                 </ul>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };
//
// export default ProjectList;
import React from 'react';

const ProjectList = ({ projects, selectedProject, onSelectProject, files, selectedFile, onSelectFile }) => {
    return (
        <div className="projects-container">
            <h2>Branches</h2>
            {projects.length === 0 ? (
                <p className="no-branches">No branches available.</p>
            ) : (
                <ul className="projects-list">
                    {projects.map((project) => (
                        <li
                            key={project.projectName}
                            className={`project-item ${selectedProject === project ? 'open' : ''}`}
                        >
                            <div
                                className="project-header"
                                onClick={() => onSelectProject(project)}
                            >
                                <span className="arrow">{selectedProject === project ? '▼' : '►'}</span>
                                <span className="project-name">{project.projectName}</span>
                            </div>

                            {/* Only render the file list when the project is selected */}
                            {selectedProject === project && (
                                <ul className="files-list">
                                    {files.length === 0 ? (
                                        <li className="file-item no-files">No files available.</li>
                                    ) : (
                                        files.map((file) => (
                                            <li
                                                key={file.filename}
                                                className={`file-item ${selectedFile === file ? 'selected' : ''}`}
                                                onClick={() => onSelectFile(file)}
                                            >
                                                {file.filename}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProjectList;
