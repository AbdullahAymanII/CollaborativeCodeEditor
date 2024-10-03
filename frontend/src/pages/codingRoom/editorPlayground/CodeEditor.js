// import React, { useState } from 'react';
// import { Editor } from '@monaco-editor/react';
//
// const ActionModal = ({ show, title, actionLabel, onConfirm, onCancel }) => {
//     if (!show) return null;
//
//     return (
//         <div className="modal-overlay">
//             <div className="modal">
//                 <h3>{title}</h3>
//                 <div className="modal-actions">
//                     <button className="confirm-btn" onClick={onConfirm}>{actionLabel}</button>
//                     <button className="cancel-btn" onClick={onCancel}>Cancel</button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const CodeEditor = ({ code, setCode, darkMode, runCode, filename, projectName, roomId }) => {
//     const languages = [
//         { label: "Python", value: "python" },
//         { label: "JavaScript", value: "javascript" },
//         { label: "TypeScript", value: "typescript" },
//         { label: "Java", value: "java" },
//         { label: "C++", value: "cpp" },
//         { label: "C#", value: "csharp" },
//         { label: "Go", value: "go" },
//         { label: "Ruby", value: "ruby" },
//         { label: "PHP", value: "php" },
//         { label: "HTML", value: "html" },
//     ];
//
//     const [selectedLanguage, setSelectedLanguage] = useState('python');
//     const [showConfirmPushModal, setShowConfirmPushModal] = useState(false);
//     const [showConfirmMergeModal, setShowConfirmMergeModal] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//
//
//     // Handle pushing file to server
//     const pushFileToServer = async (code, filename, projectName, roomId) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/files/push-file-content`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({ filename, roomId, projectName, content: code }),
//             });
//             if (!response.ok) throw new Error('Failed to push to server');
//             setSuccessMessage('Pushed to server successfully!');
//             setTimeout(() => setSuccessMessage(''), 3000);
//         } catch (error) {
//             setSuccessMessage('Push error!');
//             console.error('Push error:', error);
//         }
//     };
//
//     // Handle merging file from server
//     const mergeFileFromServer = async (filename, projectName, roomId, code ) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/files/merge-file-content`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({
//                     filename,
//                     roomId,
//                     projectName,
//                     content: code
//                 }),
//             });
//
//             if (!response.ok) throw new Error('Failed to merge from server');
//
//             const data = await response.json();
//             setCode(data.file.content);  // Set the fetched code from the server to the editor
//             // setSuccessMessage('Merged from server successfully!');
//             setTimeout(() => setSuccessMessage(''), 3000);
//         } catch (error) {
//             console.error('Merge error:', error);
//         }
//     };
//
//
//     const handleLanguageChange = (e) => setSelectedLanguage(e.target.value);
//
//     const handlePushClick = () => setShowConfirmPushModal(true);
//
//     const handleMergeClick = () => setShowConfirmMergeModal(true);
//
//     const handleConfirmPush = () => {
//         pushFileToServer(code, filename, projectName, roomId);
//         setShowConfirmPushModal(false);
//     };
//
//     const handleConfirmMerge = () => {
//         mergeFileFromServer(filename, projectName, roomId, code);
//         setShowConfirmMergeModal(false);
//     };
//
//     const handleCancelPush = () => setShowConfirmPushModal(false);
//
//     const handleCancelMerge = () => setShowConfirmMergeModal(false);
//
//     return (
//         <div className={`code-editor-container ${darkMode ? 'dark' : 'light'}`}>
//             <div className="editor-header">
//                 <h2>Code Playground</h2>
//                 <div className="actions">
//                     <label htmlFor="language-select" className="language-label">Language</label>
//                     <select
//                         id="language-select"
//                         value={selectedLanguage}
//                         onChange={handleLanguageChange}
//                         className="language-selector"
//                     >
//                         {languages.map((lang) => (
//                             <option key={lang.value} value={lang.value}>
//                                 {lang.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>
//
//             <Editor
//                 height="67vh"
//                 language={selectedLanguage}
//                 theme={darkMode ? 'vs-dark' : 'light-plus'}
//                 value={code}
//                 options={{
//                     fontSize: 20,
//                     automaticLayout: true,
//                     minimap: {
//                         enabled: true,
//                         scale: 2,
//                         showSlider: 'always',
//                         maxColumn: 150
//                     },
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
//                 onChange={(value) => setCode(value)}
//             />
//             {successMessage && (
//                 <div className="success-message">
//                     {successMessage}
//                 </div>
//             )}
//
//             <div className="editor-footer">
//                 <button className="run-btn" onClick={runCode}>Run</button>
//                 <button className="push-btn" onClick={handleMergeClick}>MERGE</button>
//                 <button className="push-btn" onClick={handlePushClick}>PUSH</button>
//             </div>
//
//             <ActionModal
//                 show={showConfirmPushModal}
//                 title="Confirm Code Push"
//                 actionLabel="PUSH"
//                 onConfirm={handleConfirmPush}
//                 onCancel={handleCancelPush}
//             />
//
//             <ActionModal
//                 show={showConfirmMergeModal}
//                 title="Confirm Code Merge"
//                 actionLabel="MERGE"
//                 onConfirm={handleConfirmMerge}
//                 onCancel={handleCancelMerge}
//             />
//         </div>
//     );
// };
//
// export default CodeEditor


// import React, {useState, useEffect, useRef} from 'react';
// import {Editor} from '@monaco-editor/react';
// import {io} from 'socket.io-client'; // Using Socket.io for real-time WebSocket communication
//
// const ActionModal = ({ show, title, actionLabel, onConfirm, onCancel }) => {
//     if (!show) return null;
//
//     return (
//         <div className="modal-overlay">
//             <div className="modal">
//                 <h3>{title}</h3>
//                 <div className="modal-actions">
//                     <button className="confirm-btn" onClick={onConfirm}>{actionLabel}</button>
//                     <button className="cancel-btn" onClick={onCancel}>Cancel</button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const CodeEditor = ({code, setCode, darkMode, runCode, filename, projectName, roomId, userId}) => {
//     const [codeEditing, setCodeEditing] = useState(code); // Track code state
//     const [cursorPositions, setCursorPositions] = useState([]); // Cursor positions of collaborators
//     const [lockedLines, setLockedLines] = useState(new Set()); // Track locked lines
//
//     const editorRef = useRef(null); // Reference to the Monaco editor instance
//     const [comments, setComments] = useState([]); // State to store line comments
//     const [selectedLine, setSelectedLine] = useState(null); // Line selected for adding a comment
//     const [newComment, setNewComment] = useState(''); // New comment input
//     const socket = useRef(null); // Ref to store WebSocket connection
//     const [selectedLanguage, setSelectedLanguage] = useState('python');
//     const [showConfirmPushModal, setShowConfirmPushModal] = useState(false);
//     const [showConfirmMergeModal, setShowConfirmMergeModal] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//
//     // Initialize WebSocket connection on component mount
//     useEffect(() => {
//         const token = localStorage.getItem('token'); // Retrieve the JWT token
//
//         // Initialize WebSocket connection with token in query parameters and headers
//         socket.current = io('http://localhost:8080/ws', {
//             query: { token },  // Pass JWT as a query parameter
//             transportOptions: {
//                 polling: {
//                     extraHeaders: {
//                         'Authorization': `Bearer ${token}`  // Send JWT as an Authorization header
//                     }
//                 }
//             }
//         });
//
//
//         // Listen for incoming code changes from the server
//         socket.current.on('http://localhost:8080/editor/code', (codeData) => {
//             setCode(codeData.code); // Update code with incoming changes
//         });
//
//         // // Listen for incoming cursor updates
//         // socket.current.on('http://localhost:8080/editor/cursor', (cursorData) => {
//         //     setCursorPositions((prev) => {
//         //         const updatedPositions = prev.filter((pos) => pos.userId !== cursorData.userId);
//         //         updatedPositions.push(cursorData);
//         //         return updatedPositions;
//         //     });
//         //
//         //     // Lock the line where the cursor is located
//         //     setLockedLines((prev) => {
//         //         const newLockedLines = new Set(prev);
//         //         newLockedLines.add(cursorData.lineNumber);
//         //         return newLockedLines;
//         //     });
//         // });
//
//         return () => {
//             socket.current.disconnect(); // Cleanup WebSocket connection on unmount
//         };
//     }, []);
//
//
//     // // Initialize WebSocket connection when the component mounts
//     // useEffect(() => {
//     //     const token = localStorage.getItem('token'); // Retrieve the JWT token
//     //
//     //     // Initialize WebSocket connection with token in query parameters and headers
//     //     socket.current = io('http://localhost:8080/ws', {
//     //         query: { token },  // Pass JWT as a query parameter
//     //         transportOptions: {
//     //             polling: {
//     //                 extraHeaders: {
//     //                     'Authorization': `Bearer ${token}`  // Send JWT as an Authorization header
//     //                 }
//     //             }
//     //         }
//     //     });
//     //
//     //
//     //     // Handle incoming comments from the WebSocket
//     //     socket.current.on('receive_comment', (commentData) => {
//     //         setComments((prev) => [...prev, commentData]);
//     //     });
//     //
//     //     return () => {
//     //         socket.current.disconnect();
//     //     };
//     // }, []);
//
//     const languages = [
//         {label: "Python", value: "python"},
//         {label: "JavaScript", value: "javascript"},
//         {label: "TypeScript", value: "typescript"},
//         {label: "Java", value: "java"},
//         {label: "C++", value: "cpp"},
//         {label: "C#", value: "csharp"},
//         {label: "Go", value: "go"},
//         {label: "Ruby", value: "ruby"},
//         {label: "PHP", value: "php"},
//         {label: "HTML", value: "html"},
//     ];
//
//
//
//     // Handle changes in the editor
//     const handleEditorChange = (newCode) => {
//         setCode(newCode); // Update local code state
//         socket.current.emit('http://localhost:8080/code', { userId, code: newCode }); // Send changes to server
//     };
//
//     // Handle cursor position changes
//     // const handleCursorChange = (event) => {
//     //     const lineNumber = event.position.lineNumber;
//     //     socket.current.emit('http://localhost:8080/cursor', {
//     //         userId,
//     //         lineNumber,
//     //     });
//     //
//     //     setLockedLines((prev) => {
//     //         const newLockedLines = new Set(prev);
//     //         newLockedLines.delete(editorRef.current.previousLine);
//     //         newLockedLines.add(lineNumber);
//     //         editorRef.current.previousLine = lineNumber;
//     //         return newLockedLines;
//     //     });
//     // };
//
//     // // Store reference to Monaco Editor and setup cursor change listener
//     // const handleEditorDidMount = (editor, monaco) => {
//     //     editorRef.current = editor;
//     //
//     //     // Detect cursor position changes
//     //     editor.onDidChangeCursorPosition(handleCursorChange);
//     // };
//
//
//     // // Function to add a new comment to a specific line
//     // const addCommentToLine = () => {
//     //     if (newComment && selectedLine !== null) {
//     //         const commentData = {
//     //             lineNumber: selectedLine,
//     //             comment: newComment,
//     //             fileName: filename,
//     //             projectName,
//     //             roomId,
//     //         };
//     //
//     //         // Send the comment via WebSocket
//     //         socket.current.emit('send_comment', commentData);
//     //
//     //         // Add the comment locally
//     //         setComments((prev) => [...prev, commentData]);
//     //         setNewComment(''); // Clear input
//     //         setSelectedLine(null); // Deselect the line after commenting
//     //     }
//     // };
//
//     // Function to handle editor instance
//     // const handleEditorDidMount = (editor, monaco) => {
//     //     editorRef.current = editor;
//     //
//     //     // Click event to select a line for commenting
//     //     editor.onMouseDown((event) => {
//     //         if (event.target && event.target.position) {
//     //             setSelectedLine(event.target.position.lineNumber); // Set the selected line number
//     //         }
//     //     });
//     //
//     //     // Display comments on the editor using decorations
//     //     const displayComments = () => {
//     //         const decorations = comments.map((comment) => ({
//     //             range: new monaco.Range(comment.lineNumber, 1, comment.lineNumber, 1),
//     //             options: {
//     //                 isWholeLine: true,
//     //                 glyphMarginClassName: 'comment-icon',
//     //                 glyphMarginHoverMessage: {value: comment.comment},
//     //             },
//     //         }));
//     //         editor.deltaDecorations([], decorations);
//     //     };
//     //
//     //     // Rerender the decorations when comments change
//     //     displayComments();
//     // };
//
//
//     // Handle pushing file to server
//     const pushFileToServer = async (code, filename, projectName, roomId) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/files/push-file-content`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({filename, roomId, projectName, content: code}),
//             });
//             if (!response.ok) throw new Error('Failed to push to server');
//             setSuccessMessage('Pushed to server successfully!');
//             setTimeout(() => setSuccessMessage(''), 3000);
//         } catch (error) {
//             setSuccessMessage('Push error!');
//             console.error('Push error:', error);
//         }
//     };
//
//     // Handle merging file from server
//     const mergeFileFromServer = async (filename, projectName, roomId, code) => {
//         try {
//             const response = await fetch(`http://localhost:8080/api/files/merge-file-content`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({
//                     filename,
//                     roomId,
//                     projectName,
//                     content: code
//                 }),
//             });
//
//             if (!response.ok) throw new Error('Failed to merge from server');
//
//             const data = await response.json();
//             setCode(data.file.content);  // Set the fetched code from the server to the editor
//             // setSuccessMessage('Merged from server successfully!');
//             setTimeout(() => setSuccessMessage(''), 3000);
//         } catch (error) {
//             console.error('Merge error:', error);
//         }
//     };
//
//
//     const handleLanguageChange = (e) => setSelectedLanguage(e.target.value);
//
//     const handlePushClick = () => setShowConfirmPushModal(true);
//
//     const handleMergeClick = () => setShowConfirmMergeModal(true);
//
//     const handleConfirmPush = () => {
//         pushFileToServer(code, filename, projectName, roomId);
//         setShowConfirmPushModal(false);
//     };
//
//     const handleConfirmMerge = () => {
//         mergeFileFromServer(filename, projectName, roomId, code);
//         setShowConfirmMergeModal(false);
//     };
//
//     const handleCancelPush = () => setShowConfirmPushModal(false);
//
//     const handleCancelMerge = () => setShowConfirmMergeModal(false);
//
//     return (
//         <div className={`code-editor-container ${darkMode ? 'dark' : 'light'}`}>
//             <div className="editor-header">
//                 <h2>Code Playground</h2>
//                 <div className="actions">
//                     <label htmlFor="language-select" className="language-label">Language</label>
//                     <select
//                         id="language-select"
//                         value={selectedLanguage}
//                         onChange={handleLanguageChange}
//                         className="language-selector"
//                     >
//                         {languages.map((lang) => (
//                             <option key={lang.value} value={lang.value}>
//                                 {lang.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>
//
//             <Editor
//                 height="67vh"
//                 language={selectedLanguage}
//                 theme={darkMode ? 'vs-dark' : 'light-plus'}
//                 value={code}
//                 onChange={handleEditorChange} // Handle code changes
//                 // editorDidMount={handleEditorDidMount} // Handle cursor synchronization
//
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
//
//             {successMessage && (
//                 <div className="success-message">
//                     {successMessage}
//                 </div>
//             )}
//
//             {/*/!* Comment Input Section *!/*/}
//             {/*{selectedLine !== null && (*/}
//             {/*    <div className="comment-input">*/}
//             {/*        <textarea*/}
//             {/*            value={newComment}*/}
//             {/*            onChange={(e) => setNewComment(e.target.value)}*/}
//             {/*            placeholder={`Comment for line ${selectedLine}`}*/}
//             {/*        />*/}
//             {/*        <button onClick={addCommentToLine}>Add Comment</button>*/}
//             {/*    </div>*/}
//             {/*)}*/}
//
//             <div className="editor-footer">
//                 <button className="run-btn" onClick={runCode}>Run</button>
//                 <button className="push-btn" onClick={handleMergeClick}>MERGE</button>
//                 <button className="push-btn" onClick={handlePushClick}>PUSH</button>
//             </div>
//
//             <ActionModal
//                 show={showConfirmPushModal}
//                 title="Confirm Code Push"
//                 actionLabel="PUSH"
//                 onConfirm={handleConfirmPush}
//                 onCancel={handleCancelPush}
//             />
//
//             <ActionModal
//                 show={showConfirmMergeModal}
//                 title="Confirm Code Merge"
//                 actionLabel="MERGE"
//                 onConfirm={handleConfirmMerge}
//                 onCancel={handleCancelMerge}
//             />
//         </div>
//     );
// };
//
// export default CodeEditor;


import React, {useState, useEffect, useRef} from 'react';
import {Editor} from '@monaco-editor/react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';

const ActionModal = ({show, title, actionLabel, onConfirm, onCancel}) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>{title}</h3>
                <div className="modal-actions">
                    <button className="confirm-btn" onClick={onConfirm}>{actionLabel}</button>
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};
const languages = [
    {label: "Python", value: "python"},
    {label: "JavaScript", value: "javascript"},
    {label: "TypeScript", value: "typescript"},
    {label: "Java", value: "java"},
    {label: "C++", value: "cpp"},
    {label: "C#", value: "csharp"},
    {label: "Go", value: "go"},
    {label: "Ruby", value: "ruby"},
    {label: "PHP", value: "php"},
    {label: "HTML", value: "html"},
];

const CodeEditor = ({code, setCode, darkMode, runCode, filename, projectName, roomId, userId}) => {
    const [codeEditing, setCodeEditing] = useState(code);
    const [cursorPositions, setCursorPositions] = useState([]);
    const [lockedLines, setLockedLines] = useState(new Set());
    const editorRef = useRef(null);
    const [comments, setComments] = useState([]);
    const [selectedLine, setSelectedLine] = useState(null);
    const [newComment, setNewComment] = useState('');
    const wsRef = useRef(null);
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [showConfirmPushModal, setShowConfirmPushModal] = useState(false);
    const [showConfirmMergeModal, setShowConfirmMergeModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    // Function to establish WebSocket connection with token authorization
    const createWebSocketConnection = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket server');
                setIsConnected(true); // Set connection state to true

                // Subscribe to channels after connection
                stompClient.subscribe('/topic/code', (message) => {
                    const data = JSON.parse(message.body);
                    setCode(data.code); // Update code in the editor
                });

                stompClient.subscribe('/topic/cursor', (message) => {
                    const data = JSON.parse(message.body);
                    setCursorPositions((prev) => {
                        const updatedPositions = prev.filter(pos => pos.userId !== data.userId);
                        updatedPositions.push(data);
                        return updatedPositions;
                    });
                    lockLine(data.lineNumber);
                });
            },
            onStompError: (error) => {
                console.error('STOMP error:', error);
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket server');
            },
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        stompClient.activate();
        return stompClient;
    };

    useEffect(() => {
        wsRef.current = createWebSocketConnection();

        return () => wsRef.current.deactivate(); // Cleanup on unmount
    }, []);

    const handleEditorChange = (newCode) => {
        setCode(newCode);

        // Send code update via WebSocket only if connected
        if (wsRef.current && isConnected) {
            wsRef.current.publish({
                destination: '/app/code',
                body: JSON.stringify({userId, code: newCode}),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        } else {
            console.warn('WebSocket connection is not established yet.');
        }
    };

    const handleCursorChange = (event) => {
        const lineNumber = event.position.lineNumber;

        // Send cursor update via WebSocket only if connected
        if (wsRef.current && isConnected) {
            wsRef.current.publish({
                destination: '/app/cursor',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({userId, lineNumber}),
            });
        } else {
            console.warn('WebSocket connection is not established yet.');
        }

        lockLine(lineNumber);
    };

    const lockLine = (lineNumber) => {
        setLockedLines((prev) => {
            const newLockedLines = new Set(prev);
            newLockedLines.add(lineNumber);
            return newLockedLines;
        });
    };

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Detect cursor position changes
        editor.onDidChangeCursorPosition(handleCursorChange);

        // Click event to select a line for commenting
        editor.onMouseDown((event) => {
            if (event.target && event.target.position) {
                setSelectedLine(event.target.position.lineNumber);
            }
        });
    };

    const handleLanguageChange = (e) => setSelectedLanguage(e.target.value);

    const handlePushClick = () => setShowConfirmPushModal(true);

    const handleMergeClick = () => setShowConfirmMergeModal(true);

    // Handle pushing file to server
    const pushFileToServer = async (code, filename, projectName, roomId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/files/push-file-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({filename, roomId, projectName, content: code}),
            });
            if (!response.ok) throw new Error('Failed to push to server');
            setSuccessMessage('Pushed to server successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setSuccessMessage('Push error!');
            console.error('Push error:', error);
        }
    };

    // Handle merging file from server
    const mergeFileFromServer = async (filename, projectName, roomId, code) => {
        try {
            const response = await fetch(`http://localhost:8080/api/files/merge-file-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({filename, roomId, projectName, content: code}),
            });

            if (!response.ok) throw new Error('Failed to merge from server');

            const data = await response.json();
            setCode(data.file.content);  // Set the fetched code from the server to the editor
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Merge error:', error);
        }
    };

    const handleConfirmPush = () => {
        pushFileToServer(code, filename, projectName, roomId);
        setShowConfirmPushModal(false);
    };

    const handleConfirmMerge = () => {
        mergeFileFromServer(filename, projectName, roomId, code);
        setShowConfirmMergeModal(false);
    };

    const handleCancelPush = () => setShowConfirmPushModal(false);

    const handleCancelMerge = () => setShowConfirmMergeModal(false);

    return (
        <div className={`code-editor-container ${darkMode ? 'dark' : 'light'}`}>
            <div className="editor-header">
                <h2>Code Playground</h2>
                <div className="actions">
                    <label htmlFor="language-select" className="language-label">Language</label>
                    <select
                        id="language-select"
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        className="language-selector"
                    >
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <Editor
                height="67vh"
                language={selectedLanguage}
                theme={darkMode ? 'vs-dark' : 'light-plus'}
                value={code}
                onChange={handleEditorChange} // Handle code changes
                editorDidMount={handleEditorDidMount} // Handle cursor synchronization
                options={{
                    fontSize: 20,
                    automaticLayout: true,
                    readOnly: false, // Users can edit code unless lines are locked
                    minimap: {
                        enabled: true,
                        scale: 2,
                        showSlider: 'always',
                        maxColumn: 150
                    },
                    glyphMargin: true, // Enable glyph margin to show comment icons
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
                        strings: true
                    },
                    parameterHints: {enabled: true},
                    inlineSuggest: {enabled: true},
                    acceptSuggestionOnEnter: 'on',
                    foldingStrategy: 'indentation',
                    cursorBlinking: 'expand',
                    cursorSmoothCaretAnimation: true,
                    cursorStyle: 'block',
                    cursorWidth: 2,
                    find: {addExtraSpaceOnTop: true},
                    lightbulb: {enabled: true},
                    hover: {enabled: true},
                }}
            />


            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}

            <div className="editor-footer">
                <button className="run-btn" onClick={runCode}>Run</button>
                <button className="push-btn" onClick={handleMergeClick}>MERGE</button>
                <button className="push-btn" onClick={handlePushClick}>PUSH</button>
            </div>

            <ActionModal
                show={showConfirmPushModal}
                title="Confirm Code Push"
                actionLabel="PUSH"
                onConfirm={handleConfirmPush}
                onCancel={handleCancelPush}
            />

            <ActionModal
                show={showConfirmMergeModal}
                title="Confirm Code Merge"
                actionLabel="MERGE"
                onConfirm={handleConfirmMerge}
                onCancel={handleCancelMerge}
            />
        </div>
    );
};

export default CodeEditor;

