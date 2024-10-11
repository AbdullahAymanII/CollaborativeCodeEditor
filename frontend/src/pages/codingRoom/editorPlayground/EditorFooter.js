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


// import React from 'react';
//
// const EditorFooter = ({ role, runCode, onMergeClick, onPushClick, onViewDetailsClick, startConnection, endConnection, viewLogs }) => {
//     return (
//         <div className="editor-footer">
//             {/* "Run" button should always be visible */}
//             <button className="run-btn" onClick={runCode}>Run</button>
//             <button className="push-btn" onClick={startConnection}>LIVE EDITOR MODE</button>
//             <button className="push-btn" onClick={endConnection}>END LIVE EDITING MODE</button>
//             {/* Show "MERGE" and "PUSH" buttons only if the user is a collaborator */}
//             {role === 'COLLABORATOR' && (
//                 <>
//                     <button className="push-btn" onClick={onMergeClick}>MERGE</button>
//                     <button className="push-btn" onClick={onPushClick}>PUSH</button>
//                 </>
//             )}
//
//             {/* Show "View Details" button only for roles other than 'viewer' */}
//             {role === 'VIEWER' && (
//                 <>
//                 <button className="push-btn" onClick={viewLogs}>DISPLAY LOGS</button>
//                 <button className="view-details-btn" onClick={onViewDetailsClick}>View Details</button>
//                 </>
//             )}
//         </div>
//     );
// };
//
// export default EditorFooter;



// import React, { useState } from 'react';
//
// const EditorFooter = ({ role, runCode, onMergeClick, onPushClick, onViewDetailsClick, startConnection, endConnection, viewLogs, sender, setSender }) => {
//     const [liveEditorActive, setLiveEditorActive] = useState(false); // State to track live editor mode
//
//     const handleStartConnection = () => {
//         if(!liveEditorActive){
//             startConnection();
//         }else {
//             endConnection();
//         }
//         setLiveEditorActive(!liveEditorActive);
//     };
//
//     return (
//         <div className="editor-footer">
//             {/* "Run" button should always be visible */}
//             <button className="run-btn" onClick={runCode}>Run</button>
//
//             {/* Toggle the class for live editor mode based on the state */}
//             <button
//                 className={`live-editing-btn ${liveEditorActive ? 'active-btn' : ''}`}
//                 onClick={handleStartConnection}
//                 // disabled={liveEditorActive} // Disable if already active
//             >
//                 LIVE EDITOR MODE
//             </button>
//
//             {/* Show "MERGE" and "PUSH" buttons only if the user is a collaborator */}
//             {role === 'COLLABORATOR' && (
//                 <>
//                     <button className="push-btn" onClick={onMergeClick}>MERGE</button>
//                     <button className="push-btn" onClick={onPushClick}>PUSH</button>
//                 </>
//             )}
//
//             {/* Show "DISPLAY LOGS" and "View Details" buttons for 'VIEWER' role */}
//             {role === 'VIEWER' && (
//                 <>
//                     <button className="download-btn" onClick={viewLogs}>DOWNLOAD LOGS</button>
//                     <button className="view-details-btn" onClick={onViewDetailsClick}>View Details</button>
//                 </>
//             )}
//             <div className="typing">
//                 <span>{sender}</span>
//             </div>
//         </div>
//     );
// };
//
// export default EditorFooter;


// import React, { useState } from 'react';
//
// const EditorFooter = ({ role, runCode, onMergeClick, onPushClick, onViewDetailsClick, startConnection, endConnection, viewLogs, sender, setSender }) => {
//     const [liveEditorActive, setLiveEditorActive] = useState(false); // State to track live editor mode
//
//     const handleStartConnection = () => {
//         if (!liveEditorActive) {
//             startConnection();
//         } else {
//             endConnection();
//         }
//         setLiveEditorActive(!liveEditorActive);
//     };
//
//     return (
//         <div className="editor-footer">
//             <div className="typing-indicator">
//                 {sender && <span>{sender} is typing...</span>}
//             </div>
//             <div className="action-buttons">
//                 <button className="run-btn" onClick={runCode}>Run</button>
//
//                 <button
//                     className={`live-editing-btn ${liveEditorActive ? 'active-btn' : ''}`}
//                     onClick={handleStartConnection}
//                 >
//                     LIVE EDITOR MODE
//                 </button>
//
//                 {role === 'COLLABORATOR' && (
//                     <>
//                         <button className="push-btn" onClick={onMergeClick}>MERGE</button>
//                         <button className="push-btn" onClick={onPushClick}>PUSH</button>
//                     </>
//                 )}
//
//                 {role === 'VIEWER' && (
//                     <>
//                         <button className="download-btn" onClick={viewLogs}>DOWNLOAD LOGS</button>
//                         <button className="view-details-btn" onClick={onViewDetailsClick}>View Details</button>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default EditorFooter;
import React, { useState, useEffect } from 'react';

const EditorFooter = ({ role, runCode, onMergeClick, onPushClick, onViewDetailsClick, startConnection, endConnection, viewLogs, sender, setSender }) => {
    const [liveEditorActive, setLiveEditorActive] = useState(false); // State to track live editor mode
    const [isTyping, setIsTyping] = useState(false); // State to track if typing is happening

    useEffect(() => {
        if (sender) {
            setIsTyping(true);

            // Set a timeout to clear typing status after 3 seconds
            const typingTimeout = setTimeout(() => {
                setSender('');
                setIsTyping(false);
            }, 2500);

            // Cleanup the timeout when sender changes or component unmounts
            return () => clearTimeout(typingTimeout);
        } else {
            setIsTyping(false);
        }
    }, [sender, setSender]); // Trigger the effect whenever `sender` changes

    const handleStartConnection = () => {
        if (!liveEditorActive) {
            startConnection();
        } else {
            endConnection();
        }
        setLiveEditorActive(!liveEditorActive);
    };

    return (
        <div className="editor-footer">
            <div className="typing-indicator">
                {isTyping && <span>{sender} is typing...</span>}
            </div>
            <div className="action-buttons">
                <button className="run-btn" onClick={runCode}>Run</button>

                <button
                    className={`live-editing-btn ${liveEditorActive ? 'active-btn' : ''}`}
                    onClick={handleStartConnection}
                >
                    LIVE EDITOR MODE
                </button>

                {role === 'COLLABORATOR' && (
                    <>
                        <button className="push-btn" onClick={onMergeClick}>MERGE</button>
                        <button className="push-btn" onClick={onPushClick}>PUSH</button>
                    </>
                )}

                {role === 'VIEWER' && (
                    <>
                        <button className="download-btn" onClick={viewLogs}>DOWNLOAD LOGS</button>
                        <button className="view-details-btn" onClick={onViewDetailsClick}>View Details</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditorFooter;
