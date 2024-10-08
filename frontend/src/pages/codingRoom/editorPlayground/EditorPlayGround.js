// import React, { useState } from 'react';
// import { Editor } from '@monaco-editor/react';
// import ActionModal from './ActionModal';
// import EditorHeader from './EditorHeader';
// import EditorFooter from './EditorFooter';
// import useWebSocketManager from './WebSocketManager';
// import useFileManager from './FileManager';
// import useEditorLogic from './EditorLogic';
//
// const EditorPlayGround = ({ code, setCode, darkMode, runCode, currentFile, user, room ,selectedLanguage,setSelectedLanguage, role}) => {
//
//     // const [selectedLanguage, setSelectedLanguage] = useState('python');
//     const [showConfirmPushModal, setShowConfirmPushModal] = useState(false);
//     const [showConfirmMergeModal, setShowConfirmMergeModal] = useState(false);
//
//     const { publishCodeChange, isConnected } = useWebSocketManager(setCode, user, currentFile, role);
//     const { pushFileToServer, mergeFileFromServer, successMessage } = useFileManager(code, currentFile, room, setCode, setShowConfirmMergeModal, setShowConfirmPushModal);
//     const { handleEditorChange, handleEditorDidMount, currentLine } = useEditorLogic(setCode, publishCodeChange, user);
//
//
//     return (
//         <div className={`code-editor-container ${darkMode ? 'dark' : 'light'}`}>
//             <EditorHeader
//                 selectedLanguage={selectedLanguage}
//                 onLanguageChange={e => setSelectedLanguage(e.target.value)}
//             />
//             <Editor
//                 height="67vh"
//                 language={selectedLanguage}
//                 theme={darkMode ? 'vs-dark' : 'light-plus'}
//                 value={code}
//                 onChange={handleEditorChange}
//                 editorDidMount={handleEditorDidMount}
//                 options={{
//                     fontSize: 20,
//                     automaticLayout: true,
//                     readOnly: false, // Users can edit code unless lines are locked
//                     minimap: {
//                         enabled: true,
//                         scale: 2,
//                         showSlider: 'always',
//                         maxColumn: 150
//                     },
//                     glyphMargin: true, // Enable glyph margin to show comment icons
//                     scrollBeyondLastLine: true,
//                     smoothScrolling: true,
//                     wordWrap: 'bounded',
//                     tabSize: 4,
//                     renderLineHighlight: 'all',
//                     lineNumbers: 'on',
//                     bracketPairColorization: true,
//                     fontLigatures: true,
//                     renderWhitespace: 'boundary',
//                     highlightActiveIndentGuide: true,
//                     codeLens: true,
//                     links: true,
//                     renderValidationDecorations: 'on',
//                     autoIndent: 'advanced',
//                     suggestOnTriggerCharacters: true,
//                     quickSuggestions: {
//                         other: true,
//                         comments: true,
//                         strings: true
//                     },
//                     parameterHints: {enabled: true},
//                     inlineSuggest: {enabled: true},
//                     acceptSuggestionOnEnter: 'on',
//                     foldingStrategy: 'indentation',
//                     cursorBlinking: 'expand',
//                     cursorSmoothCaretAnimation: true,
//                     cursorStyle: 'block',
//                     cursorWidth: 2,
//                     find: {addExtraSpaceOnTop: true},
//                     lightbulb: {enabled: true},
//                     hover: {enabled: true},
//                 }}
//             />
//             {successMessage && <div className="success-message">{successMessage}</div>}
//             <EditorFooter
//                 runCode={runCode}
//                 onMergeClick={() => setShowConfirmMergeModal(true)}
//                 onPushClick={() => setShowConfirmPushModal(true)}
//             />
//             <ActionModal
//                 show={showConfirmPushModal}
//                 title="Confirm Code Push"
//                 actionLabel="PUSH"
//                 onConfirm={pushFileToServer}
//                 onCancel={() => setShowConfirmPushModal(false)}
//             />
//             <ActionModal
//                 show={showConfirmMergeModal}
//                 title="Confirm Code Merge"
//                 actionLabel="MERGE"
//                 onConfirm={mergeFileFromServer}
//                 onCancel={() => setShowConfirmMergeModal(false)}
//             />
//         </div>
//     );
// };
//
// export default EditorPlayGround;
//
//
//


// import React, { useState } from 'react';
// import { Editor } from '@monaco-editor/react';
// import ActionModal from './ActionModal';
// import EditorHeader from './EditorHeader';
// import EditorFooter from './EditorFooter';
// import useWebSocketManager from './WebSocketManager';
// import useFileManager from './FileManager';
// import useEditorLogic from './EditorLogic';
// import CodeMetricsDisplay from './CodeMetricsDisplay'; // Import the CodeMetricsDisplay component
//
// const EditorPlayGround = ({ code, setCode, darkMode, runCode, currentFile, user, room, selectedLanguage, setSelectedLanguage, role }) => {
//     const [showConfirmPushModal, setShowConfirmPushModal] = useState(false);
//     const [showConfirmMergeModal, setShowConfirmMergeModal] = useState(false);
//
//     const { publishCodeChange, isConnected } = useWebSocketManager(setCode, user, currentFile, role);
//     const { pushFileToServer, mergeFileFromServer, successMessage } = useFileManager(code, currentFile, room, setCode, setShowConfirmMergeModal, setShowConfirmPushModal);
//     const { handleEditorChange, handleEditorDidMount, currentLine } = useEditorLogic(setCode, publishCodeChange, user, role);
//
//     return (
//         <div className={`code-editor-container ${darkMode ? 'dark' : 'light'}`}>
//             <EditorHeader
//                 selectedLanguage={selectedLanguage}
//                 onLanguageChange={e => setSelectedLanguage(e.target.value)}
//             />
//             <Editor
//                 height="67vh"
//                 language={selectedLanguage}
//                 theme={darkMode ? 'vs-dark' : 'light-plus'}
//                 value={code}
//                 onChange={handleEditorChange}
//                 editorDidMount={handleEditorDidMount}
//                 options={{
//                     fontSize: 20,
//                     automaticLayout: true,
//                     readOnly: role === 'viewer', // Viewer role cannot edit code
//                     minimap: {
//                         enabled: true,
//                         scale: 2,
//                         showSlider: 'always',
//                         maxColumn: 150,
//                     },
//                     glyphMargin: true,
//                     scrollBeyondLastLine: true,
//                     smoothScrolling: true,
//                     wordWrap: 'bounded',
//                     tabSize: 4,
//                     renderLineHighlight: 'all',
//                     lineNumbers: 'on',
//                     bracketPairColorization: true,
//                     fontLigatures: true,
//                     renderWhitespace: 'boundary',
//                     highlightActiveIndentGuide: true,
//                     codeLens: true,
//                     links: true,
//                     renderValidationDecorations: 'on',
//                     autoIndent: 'advanced',
//                     suggestOnTriggerCharacters: true,
//                     quickSuggestions: {
//                         other: true,
//                         comments: true,
//                         strings: true,
//                     },
//                     parameterHints: { enabled: true },
//                     inlineSuggest: { enabled: true },
//                     acceptSuggestionOnEnter: 'on',
//                     foldingStrategy: 'indentation',
//                     cursorBlinking: 'expand',
//                     cursorSmoothCaretAnimation: true,
//                     cursorStyle: 'block',
//                     cursorWidth: 2,
//                     find: { addExtraSpaceOnTop: true },
//                     lightbulb: { enabled: true },
//                     hover: { enabled: true },
//                 }}
//             />
//             {successMessage && <div className="success-message">{successMessage}</div>}
//
//             {/* Pass the role prop down to EditorFooter for conditional rendering */}
//             <EditorFooter
//                 role={role}
//                 runCode={runCode}
//                 onMergeClick={() => setShowConfirmMergeModal(true)}
//                 onPushClick={() => setShowConfirmPushModal(true)}
//             />
//
//             {/* Display Code Metrics */}
//             <CodeMetricsDisplay code={code} language={selectedLanguage} />
//
//             <ActionModal
//                 show={showConfirmPushModal}
//                 title="Confirm Code Push"
//                 actionLabel="PUSH"
//                 onConfirm={pushFileToServer}
//                 onCancel={() => setShowConfirmPushModal(false)}
//             />
//             <ActionModal
//                 show={showConfirmMergeModal}
//                 title="Confirm Code Merge"
//                 actionLabel="MERGE"
//                 onConfirm={mergeFileFromServer}
//                 onCancel={() => setShowConfirmMergeModal(false)}
//             />
//         </div>
//     );
// };
//
// export default EditorPlayGround;

// import React, { useState } from 'react';
// import { Editor } from '@monaco-editor/react';
// import ActionModal from './ActionModal';
// import EditorHeader from './EditorHeader';
// import EditorFooter from './EditorFooter';
// import useWebSocketManager from './WebSocketManager';
// import useFileManager from './FileManager';
// import useEditorLogic from './EditorLogic';
// import CodeMetricsDisplay from './CodeMetricsDisplay';
//
// const EditorPlayGround = ({ code, setCode, darkMode, runCode, currentFile, user, room, selectedLanguage, setSelectedLanguage, role, setMessages }) => {
//     const [showConfirmPushModal, setShowConfirmPushModal] = useState(false);
//     const [showConfirmMergeModal, setShowConfirmMergeModal] = useState(false);
//     const [showMetricsModal, setShowMetricsModal] = useState(false); // New state for metrics modal
//
//     const { publishCodeChange ,isConnected } = useWebSocketManager(setCode, setMessages, user, currentFile, role);
//     const { pushFileToServer, mergeFileFromServer, successMessage } = useFileManager(code, currentFile, room, setCode, setShowConfirmMergeModal, setShowConfirmPushModal);
//     const { handleEditorChange, handleEditorDidMount, currentLine } = useEditorLogic(setCode, publishCodeChange, user, role);
//
//     const handleViewDetailsClick = () => {
//         setShowMetricsModal(true); // Open the metrics modal when "View Details" is clicked
//     };
//
//     const handleCloseMetricsModal = () => {
//         setShowMetricsModal(false); // Close the modal
//     };
//
//     return (
//         <div className={`code-editor-container ${darkMode ? 'dark' : 'light'}`}>
//             <EditorHeader
//                 selectedLanguage={selectedLanguage}
//                 onLanguageChange={e => setSelectedLanguage(e.target.value)}
//             />
//             <Editor
//                 height="67vh"
//                 language={selectedLanguage}
//                 theme={darkMode ? 'vs-dark' : 'light-plus'}
//                 value={code}
//                 onChange={handleEditorChange}
//                 editorDidMount={handleEditorDidMount}
//                 options={{
//                     fontSize: 20,
//                     automaticLayout: true,
//                     readOnly: role === 'viewer', // Viewer role cannot edit code
//                     minimap: {
//                         enabled: true,
//                         scale: 2,
//                         showSlider: 'always',
//                         maxColumn: 150,
//                     },
//                     glyphMargin: true,
//                     scrollBeyondLastLine: true,
//                     smoothScrolling: true,
//                     wordWrap: 'bounded',
//                     tabSize: 4,
//                     renderLineHighlight: 'all',
//                     lineNumbers: 'on',
//                     bracketPairColorization: true,
//                     fontLigatures: true,
//                     renderWhitespace: 'boundary',
//                     highlightActiveIndentGuide: true,
//                     codeLens: true,
//                     links: true,
//                     renderValidationDecorations: 'on',
//                     autoIndent: 'advanced',
//                     suggestOnTriggerCharacters: true,
//                     quickSuggestions: {
//                         other: true,
//                         comments: true,
//                         strings: true,
//                     },
//                     parameterHints: { enabled: true },
//                     inlineSuggest: { enabled: true },
//                     acceptSuggestionOnEnter: 'on',
//                     foldingStrategy: 'indentation',
//                     cursorBlinking: 'expand',
//                     cursorSmoothCaretAnimation: true,
//                     cursorStyle: 'block',
//                     cursorWidth: 2,
//                     find: { addExtraSpaceOnTop: true },
//                     lightbulb: { enabled: true },
//                     hover: { enabled: true },
//                 }}
//             />
//             {successMessage && <div className="success-message">{successMessage}</div>}
//
//             {/* Footer with the buttons, including "View Details" */}
//             <EditorFooter
//                 role={role}
//                 runCode={runCode}
//                 onMergeClick={() => setShowConfirmMergeModal(true)}
//                 onPushClick={() => setShowConfirmPushModal(true)}
//                 onViewDetailsClick={handleViewDetailsClick} // Pass the handler to show modal
//             />
//
//             {/* Code Metrics Modal */}
//             {showMetricsModal && (
//                 <CodeMetricsDisplay
//                     code={code}
//                     language={selectedLanguage}
//                     onClose={handleCloseMetricsModal} // Pass close handler to the modal
//                 />
//             )}
//
//             <ActionModal
//                 show={showConfirmPushModal}
//                 title="Confirm Code Push"
//                 actionLabel="PUSH"
//                 onConfirm={pushFileToServer}
//                 onCancel={() => setShowConfirmPushModal(false)}
//             />
//             <ActionModal
//                 show={showConfirmMergeModal}
//                 title="Confirm Code Merge"
//                 actionLabel="MERGE"
//                 onConfirm={mergeFileFromServer}
//                 onCancel={() => setShowConfirmMergeModal(false)}
//             />
//         </div>
//     );
// };
//
// export default EditorPlayGround;
import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import ActionModal from './ActionModal';
import EditorHeader from './EditorHeader';
import EditorFooter from './EditorFooter';
// import useWebSocketManager from './WebSocketManager';
import useFileManager from './FileManager';
import useEditorLogic from './EditorLogic';
import CodeMetricsDisplay from './CodeMetricsDisplay';

const EditorPlayGround = ({ code, setCode, darkMode, runCode, currentFile, user, room, selectedLanguage, setSelectedLanguage, role, setLiveEditing, liveEditing, publishCodeChange, sendActionMessage, isConnected}) => {
    const [showConfirmPushModal, setShowConfirmPushModal] = useState(false);
    const [showConfirmMergeModal, setShowConfirmMergeModal] = useState(false);
    const [showMetricsModal, setShowMetricsModal] = useState(false); // New state for metrics modal

    // const { publishCodeChange, sendActionMessage, isConnected } = useWebSocketManager(setCode, setMessages, user, currentFile, role, liveEditing, room);
    const { pushFileToServer, mergeFileFromServer, successMessage } = useFileManager(code, currentFile, room, setCode, setShowConfirmMergeModal, setShowConfirmPushModal);
    const { handleEditorChange, handleEditorDidMount, currentLine } = useEditorLogic(setCode, publishCodeChange, user, role);

    const handleViewDetailsClick = () => {
        setShowMetricsModal(true); // Open the metrics modal when "View Details" is clicked
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
    const handleDisplayLogs = () => {
        console.log("Display logs");
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
            />
            <Editor
                height="67vh"
                language={selectedLanguage}
                theme={darkMode ? 'light-plus' : 'vs-dark'}
                value={code}
                onChange={handleEditorChange}
                editorDidMount={handleEditorDidMount}
                options={{
                    fontSize: 20,
                    automaticLayout: true,
                    readOnly: role === 'viewer', // Viewer role cannot edit code
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

            {/* Footer with the buttons, including "View Details" */}
            <EditorFooter
                role={role}
                runCode={runCode}
                onMergeClick={() => setShowConfirmMergeModal(true)}
                onPushClick={() => setShowConfirmPushModal(true)}
                onViewDetailsClick={handleViewDetailsClick} // Pass the handler to show modal
                startConnection={handleStartConnection}
                endConnection={handleEndConnection}
                viewLogs={handleDisplayLogs}
            />
            {/* Code Metrics Modal */}
            {showMetricsModal && (
                <CodeMetricsDisplay
                    code={code}
                    language={selectedLanguage}
                    onClose={handleCloseMetricsModal} // Pass close handler to the modal
                />
            )}

            <ActionModal
                show={showConfirmPushModal}
                title="Confirm Code Push"
                actionLabel="PUSH"
                onConfirm={handlePushConfirm} // Call the new confirm handler
                onCancel={() => setShowConfirmPushModal(false)}
            />
            <ActionModal
                show={showConfirmMergeModal}
                title="Confirm Code Merge"
                actionLabel="MERGE"
                onConfirm={handleMergeConfirm} // Call the new confirm handler
                onCancel={() => setShowConfirmMergeModal(false)}
            />
        </div>
    );
};

export default EditorPlayGround;