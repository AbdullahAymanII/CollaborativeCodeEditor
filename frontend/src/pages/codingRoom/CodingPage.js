//
// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './CodingPage.css';
// import Header from './header/Header';
// // import VersionControl from './versionControl/VersionControl';
// // import CodeEditor from './CodeEditor';
// import ChatComponent from './chat/Chat';
// import InputOutput from './inputOutput/InputOutput';
// import Footer from './footer/Footer';
// import EditorPlayGround from "./editorPlayground/EditorPlayGround";
// import Control from "./versionControl/Control";
//
// const CodingPage = () => {
//     const [darkMode, setDarkMode] = useState(false);
//     const [code, setCode] = useState('');
//     const [output, setOutput] = useState('');
//     const [input, setInput] = useState('');
//     const [selectedLanguage, setSelectedLanguage] = useState('python');
//
//     const [currentFile, setCurrentFile] = useState({ filename: '', roomId: '', projectName:'', content: '' });
//
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { user, room, role } = location.state
//
//     useEffect(() => {
//         if (!location.state) {
//             navigate('/home');
//         }
//     }, [location.state, navigate]);
//
//     const toggleTheme = () => setDarkMode(!darkMode);
//
//     // const runCode = () => {
//     //     setOutput(`Executing:\n${code}`);
//     // };
//
//     const runCode = async () => {
//         try {
//             console.log(code);
//             console.log(selectedLanguage);
//             console.log(input);
//             const response = await fetch(`http://localhost:8080/api/execute/run`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify({
//                     language: selectedLanguage,
//                     code: code,
//                     input: input, // Pass the input field
//                 }),
//             });
//             if (!response.ok) throw new Error('Failed to fetch file content');
//             const data = await response.json();
//             console.log(data.output);
//             setOutput(`Executing:\n${data.output}`);
//             console.log(output);
//         } catch (error) {
//             // showError('The file does not have content currently...');
//         }
//     };
//
//     const handleSelectFileVersion = (selectedFile) => {
//         setCode(selectedFile.content);
//         setCurrentFile(selectedFile);
//     };
//
//     return (
//         <div className={`coding-room-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
//             <Header
//                 user={user}
//                 darkMode={darkMode}
//                 toggleTheme={toggleTheme}
//             />
//
//             <div className="main-content-wrapper">
//                 {/* Sidebar for Version Control */}
//                 <div className="sidebar">
//                     <Control room={room} currentFile={handleSelectFileVersion} />
//                 </div>
//
//                 {/* Main Content Area for Code Editor */}
//                 <div className="coding-playground">
//                     <EditorPlayGround
//                                       code={code}
//                                       setCode={setCode}
//                                       darkMode={darkMode}
//                                       runCode={runCode}
//                                       currentFile={currentFile}
//                                       user={user}
//                                       room={room}
//                                       selectedLanguage={selectedLanguage}
//                                       setSelectedLanguage={setSelectedLanguage}
//                                       role={role}
//                     />
//
//                 </div>
//
//                 {/* Chat Box on the Right */}
//                 <div className="chat-container">
//                     <ChatComponent />
//                 </div>
//             </div>
//
//             <InputOutput input={input} output={output} setInput={setInput} />
//
//             <Footer />
//         </div>
//     );
// };
// export default CodingPage;


import React, {useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './CodingPage.css';
import Header from './header/Header';
import InputOutput from './inputOutput/InputOutput';
import EditorPlayGround from './editorPlayground/EditorPlayGround';
import Control from './versionControl/Control';
import Footer from './footer/Footer';
// import useWebSocketManager from './editorPlayground/WebSocketManager';

import ChatComponent from "./chat/Chat";
import useWebSocketConnection from "../websocket/useWebSocketConnection";
import useCodeManager from "../websocket/useCodeManager";
import useChatManager from "../websocket/useChatManager";
// import useWebSocketManager from "../websocket/websocketConfig";

const CodingPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [code, setCode] = useState('');
    const [sender, setSender] = useState('');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [currentFile, setCurrentFile] = useState({filename: '', roomId: '', projectName: '', content: ''});
    const [messages, setMessages] = useState([]); // Store chat messages
    const [liveEditing, setLiveEditing] = useState(false); // New state to control live editing
    const [isJoined, setIsJoined] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const {user, room, role} = location.state || {user: {}, room: {roomId: '', name: ''}, role: ''};
    const {wsRef, isConnected, closeWebSocketConnection, createWebSocketConnection} = useWebSocketConnection();
    const {
        subscribeToCodeUpdates,
        publishCodeChange
    } = useCodeManager(wsRef, isConnected, currentFile, setCode, liveEditing, setSender);
    const {
        subscribeToChat,
        sendActionMessage,
        sendChatMessage
    } = useChatManager(wsRef, isConnected, currentFile, setMessages, user, role, room);


    useEffect(() => {
        if (!location.state) {
            navigate('/home');
            return;
        }

        if (isJoined) {
            createWebSocketConnection();
            setIsJoined(false);
        }

        if (isConnected) {
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
        }
    }, [isJoined, isConnected, location.state, navigate, sendChatMessage, subscribeToChat, createWebSocketConnection]);



    const toggleTheme = () => setDarkMode(!darkMode);

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
            <Header user={user}
                    darkMode={darkMode}
                    toggleTheme={toggleTheme}
                    closeWebSocketConnection={closeWebSocketConnection}
                    sendChatMessage={sendChatMessage}
                    room={room}
                    role={role}
            />

            <div className="main-content-wrapper">
                <div className="sidebar">
                    <Control room={room}
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
                    />
                </div>

                <div className="chat-container">
                    <ChatComponent
                        messages={messages} // Pass the chat messages
                        user={user}
                        currentFile={currentFile}
                        role={role}
                        sendMessage={sendChatMessage} // Function to send chat messages
                        room={room}
                    />
                </div>
            </div>

            <InputOutput input={input} output={output} setInput={setInput}/>

            <Footer />
        </div>
    );
};

export default CodingPage;