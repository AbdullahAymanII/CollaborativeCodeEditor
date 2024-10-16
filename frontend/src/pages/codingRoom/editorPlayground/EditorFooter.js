import React, { useState, useEffect } from 'react';

const EditorFooter = ({ role, runCode, onMergeClick, onPushClick, onViewDetailsClick, startConnection, endConnection, viewLogs, sender, setSender }) => {
    const [liveEditorActive, setLiveEditorActive] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (sender) {
            setIsTyping(true);

            // Set a timeout to clear typing status after 3 seconds
            const typingTimeout = setTimeout(() => {
                setSender('');
                setIsTyping(false);
            }, 2500);

            return () => clearTimeout(typingTimeout);
        } else {
            setIsTyping(false);
        }
    }, [sender, setSender]);

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
