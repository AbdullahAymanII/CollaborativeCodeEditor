// import React from 'react';
//
// const EditorFooter = ({ runCode, onMergeClick, onPushClick }) => {
//     return (
//         <div className="editor-footer">
//             <button className="run-btn" onClick={runCode}>Run</button>
//             <button className="push-btn" onClick={onMergeClick}>MERGE</button>
//             <button className="push-btn" onClick={onPushClick}>PUSH</button>
//         </div>
//     );
// };
//
// export default EditorFooter;


import React from 'react';

const EditorFooter = ({ role, runCode, onMergeClick, onPushClick, onViewDetailsClick }) => {
    return (
        <div className="editor-footer">
            {/* "Run" button should always be visible */}
            <button className="run-btn" onClick={runCode}>Run</button>

            {/* Show "MERGE" and "PUSH" buttons only if the user is a collaborator */}
            {role === 'COLLABORATOR' && (
                <>
                    <button className="push-btn" onClick={onMergeClick}>MERGE</button>
                    <button className="push-btn" onClick={onPushClick}>PUSH</button>
                </>
            )}

            {/* Show "View Details" button only for roles other than 'viewer' */}
            {role === 'VIEWER' && (
                <button className="view-details-btn" onClick={onViewDetailsClick}>View Details</button>
            )}
        </div>
    );
};

export default EditorFooter;


