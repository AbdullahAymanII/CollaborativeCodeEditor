import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import ActionModal from './ActionModal';
import EditorHeader from './EditorHeader';
import EditorFooter from './EditorFooter';
import useFileManager from './FileManager';
import CodeMetricsDisplay from './CodeMetricsDisplay';

const EditorPlayGround = ({ code, setCode, darkMode, runCode, currentFile, user, room, selectedLanguage, setSelectedLanguage, role, setLiveEditing, liveEditing, sendActionMessage, isConnected, sender, setSender, handleEditorDidMount, handleEditorChange}) => {
    const [showConfirmPushModal, setShowConfirmPushModal] = useState(false);
    const [showConfirmMergeModal, setShowConfirmMergeModal] = useState(false);
    const [showMetricsModal, setShowMetricsModal] = useState(false);

    const { pushFileToServer, mergeFileFromServer, successMessage } = useFileManager(code, currentFile, room, setCode, setShowConfirmMergeModal, setShowConfirmPushModal);

    const handleViewDetailsClick = () => {
        setShowMetricsModal(true);
    };

    const handleCloseMetricsModal = () => {
        setShowMetricsModal(false); // Close the modal
    };

    const handlePushConfirm = () => {
        if (isConnected) {
            pushFileToServer();
            sendActionMessage('PUSH');
        }
        setShowConfirmPushModal(false);
    };

    const handleMergeConfirm = () => {
        if (isConnected) {
            mergeFileFromServer();
            sendActionMessage('MERGE');
        }
        setShowConfirmMergeModal(false);
    };

    const handleDisplayLogs = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/viewer/room/${room.roomId}/logs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch room logs');

            const data = await response.json();
            const blob = new Blob([JSON.stringify(data.roomLogs, null, 2)], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `room_logs_${room.roomId}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error fetching room logs:', error);
        }
    };


    const handleStartConnection = () => {
        if (isConnected) {
            setLiveEditing(true);
        }
    };

    const handleEndConnection = () => {
        if (isConnected) {
            setLiveEditing(false);
        }
    };



    return (
        <div className={`code-editor-container ${darkMode ? 'light' : 'dark'}`}>
            <EditorHeader
                selectedLanguage={selectedLanguage}
                onLanguageChange={e => setSelectedLanguage(e.target.value)}
                room={room}
            />
            <Editor
                height="70vh"
                language={selectedLanguage}
                theme={darkMode ? 'light-plus' : 'vs-dark'}
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: 20,
                    automaticLayout: true,
                    readOnly: role === 'VIEWER',
                    minimap: {
                        enabled: true,
                        scale: 2,
                        showSlider: 'always',
                        maxColumn: 150,
                    },
                    glyphMargin: true,
                    scrollBeyondLastLine: true,
                    smoothScrolling: true,
                    wordWrap: 'bounded',
                    tabSize: 4,
                    renderLineHighlight: 'all',
                    lineNumbers: 'on',
                    bracketPairColorization: true,
                    fontLigatures: true,
                    renderWhitespace: 'boundary',
                    highlightActiveIndentGuide: true,
                    codeLens: true,
                    links: true,
                    renderValidationDecorations: 'on',
                    autoIndent: 'advanced',
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: {
                        other: true,
                        comments: true,
                        strings: true,
                    },
                    parameterHints: { enabled: true },
                    inlineSuggest: { enabled: true },
                    acceptSuggestionOnEnter: 'on',
                    foldingStrategy: 'indentation',
                    cursorBlinking: 'expand',
                    cursorSmoothCaretAnimation: true,
                    cursorStyle: 'block',
                    cursorWidth: 2,
                    find: { addExtraSpaceOnTop: true },
                    lightbulb: { enabled: true },
                    hover: { enabled: true },
                }}
            />
            {successMessage && <div className="success-message">{successMessage}</div>}

            <EditorFooter
                role={role}
                runCode={runCode}
                onMergeClick={() => setShowConfirmMergeModal(true)}
                onPushClick={() => setShowConfirmPushModal(true)}
                onViewDetailsClick={handleViewDetailsClick}
                startConnection={handleStartConnection}
                endConnection={handleEndConnection}
                viewLogs={handleDisplayLogs}
                sender={sender}
                setSender={setSender}
            />
            {/* Code Metrics Modal */}
            {showMetricsModal && (
                <CodeMetricsDisplay
                    code={code}
                    language={selectedLanguage}
                    onClose={handleCloseMetricsModal}
                />
            )}

            <ActionModal
                show={showConfirmPushModal}
                title="Confirm Code Push"
                actionLabel="PUSH"
                onConfirm={handlePushConfirm}
                onCancel={() => setShowConfirmPushModal(false)}
            />
            <ActionModal
                show={showConfirmMergeModal}
                title="Confirm Code Merge"
                actionLabel="MERGE"
                onConfirm={handleMergeConfirm}
                onCancel={() => setShowConfirmMergeModal(false)}
            />
        </div>
    );
};

export default EditorPlayGround;