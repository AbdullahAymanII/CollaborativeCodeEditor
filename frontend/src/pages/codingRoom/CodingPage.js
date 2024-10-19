import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './CodingPage.css';
import Header from './header/Header';
import InputOutput from './inputOutput/InputOutput';
import EditorPlayGround from './editorPlayground/EditorPlayGround';
import Control from './versionControl/Control';
import Footer from './footer/Footer';
import ChatComponent from "./chat/Chat";
import useWebSocketConnection from "../websocket/useWebSocketConnection";
import useCodeManager from "../websocket/useCodeManager";
import useChatManager from "../websocket/useChatManager";
import useEditorLogic from "./editorPlayground/EditorLogic";


const CodingPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [code, setCode] = useState('');
    const [sender, setSender] = useState('');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [currentFile, setCurrentFile] = useState({
        filename: '',
        roomId: '',
        projectName: '',
        code: '',
        createdAt: '',
        lastModifiedAt: '',
        extension: ''
    });
    const [messages, setMessages] = useState([]);
    const [liveEditing, setLiveEditing] = useState(false);
    const [isJoined, setIsJoined] = useState(true);
    const [isWelcomed, setIsWelcomed] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    const { user, room, role } = location.state || { user: {}, room: { roomId: '', name: '' }, role: '' };
    const { wsRef, isConnected, closeWebSocketConnection, createWebSocketConnection } = useWebSocketConnection();

    const {
        subscribeToChat,
        sendActionMessage,
        sendChatMessage
    } = useChatManager(wsRef, isConnected, currentFile, setMessages, user, role, room);

    const {
        handleEditorDidMount,
        editorRef,
        cursorPosition,
        lineContent,
        isCommentBoxVisible,
        setIsCommentBoxVisible,
        comment,
        setComment
    } = useEditorLogic(role);

    const {
        subscribeToCodeUpdates,
        publishCodeChange
    } = useCodeManager(wsRef, isConnected, currentFile, setCode, liveEditing, setSender);

    const handleEditorChange = useCallback(
        (newCode) => {
            if (editorRef.current && role === 'COLLABORATOR') {
                const updatedRange = {
                    lineNumber: cursorPosition.lineNumber,
                    column: cursorPosition.endColumn,
                    lineContent: lineContent,
                    code: newCode,
                    role: role
                };

                setCode(newCode);
                publishCodeChange(user, updatedRange);
            }
        },
        [setCode, publishCodeChange, user, editorRef, cursorPosition, lineContent]
    );

    useEffect(() => {
        if (!location.state) {
            navigate('/home');
            return;
        }

        if (isJoined) {
            createWebSocketConnection();
            setIsJoined(false);
        }

        if (isConnected && isWelcomed) {
            subscribeToChat();

            const joinMessage = {
                sender: user.name,
                role: role,
                filename: '',
                roomId: room.roomId,
                projectName: '',
                content: 'joined the room',
                type: 'join'
            };
            sendChatMessage(joinMessage);
            setIsWelcomed(false);
        }

    }, [isJoined, isConnected, location.state, navigate, sendChatMessage, subscribeToChat, createWebSocketConnection]);

    const toggleTheme = () => setDarkMode(!darkMode);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmitComment = () => {
        console.log(`Comment Submitted for Line ${cursorPosition.lineNumber}:`, comment);

        const updatedRange = {
            lineNumber: cursorPosition.lineNumber,
            column: cursorPosition.endColumn,
            lineContent: comment,
            code: code,
            role: role
        };

        publishCodeChange(user, updatedRange);

        setIsCommentBoxVisible(false);
        setComment('');
    };

    const handleCancelComment = () => {
        setIsCommentBoxVisible(false);
        setComment('');
    };

    const runCode = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/execute/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    language: selectedLanguage,
                    code: code,
                    input: input, // Pass the input field
                }),
            });
            if (!response.ok) throw new Error('Failed to fetch file content');
            const data = await response.json();
            setOutput(`Executing:\n${data.output}`);
        } catch (error) {
            console.error('Error running code:', error);
        }
    };

    const handleSelectFileVersion = (selectedFile) => {
        setCode(selectedFile.content);
        setCurrentFile(selectedFile);
    };

    return (
        <div className={`coding-room-container ${darkMode ? 'light-mode' : 'dark-mode'}`}>
            <Header
                user={user}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
                closeWebSocketConnection={closeWebSocketConnection}
                sendChatMessage={sendChatMessage}
                room={room}
                role={role}
            />

            <div className="main-content-wrapper">
                <div className="sidebar">
                    <Control
                        room={room}
                        currentFile={handleSelectFileVersion}
                        isConnected={isConnected}
                        subscribeToCodeUpdates={subscribeToCodeUpdates}
                    />
                </div>

                <div className="coding-playground">
                    <EditorPlayGround
                        code={code}
                        setCode={setCode}
                        darkMode={darkMode}
                        runCode={runCode}
                        currentFile={currentFile}
                        user={user}
                        room={room}
                        selectedLanguage={selectedLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                        role={role}
                        setLiveEditing={setLiveEditing}
                        liveEditing={liveEditing}
                        publishCodeChange={publishCodeChange}
                        sendActionMessage={sendActionMessage}
                        isConnected={isConnected}
                        sender={sender}
                        setSender={setSender}
                        handleEditorDidMount={handleEditorDidMount}
                        handleEditorChange={handleEditorChange}
                    />
                    {/* Conditionally render the comment overlay */}
                    {isCommentBoxVisible && (
                        <div className="comment-overlay">
                            <div className="comment-modal">
                                <h3>Add a comment to Line {cursorPosition.lineNumber}</h3>
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={handleCommentChange}
                                    placeholder="Type your comment here"
                                />
                                <div className="comment-modal-buttons">
                                    <button onClick={handleSubmitComment}>Submit Comment</button>
                                    <button onClick={handleCancelComment}>Cancel</button> {/* Cancel button */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="chat-container">
                    <ChatComponent
                        messages={messages}
                        user={user}
                        currentFile={currentFile}
                        role={role}
                        sendMessage={sendChatMessage}
                        room={room}
                    />
                </div>
            </div>

            <InputOutput input={input} output={output} setInput={setInput} />

            <Footer />
        </div>
    );
};

export default CodingPage;
