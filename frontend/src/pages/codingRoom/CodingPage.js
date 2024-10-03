
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CodingPage.css';
import Header from './header/Header';
import VersionControl from './versionControl/VersionControl';
// import CodeEditor from './CodeEditor';
import ChatComponent from './chat/Chat';
import InputOutput from './inputOutput/InputOutput';
import Footer from './footer/Footer';
import EditorPlayGround from "./editorPlayground/EditorPlayGround";

const CodingPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [code, setCode] = useState('');
    const [currentFileName, setCurrentFileName] = useState('');
    const [currentProjectName, setCurrentProjectName] = useState('');
    const [currentRoomId, setCurrentRoomId] = useState('');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');

    const [currentFile, setCurrentFile] = useState({ filename: '', roomId: '', projectName:'', content: '' });

    const navigate = useNavigate();
    const location = useLocation();
    const { user, room } = location.state

    // const { userName, profileImage, roomId } = location.state || {};

    useEffect(() => {
        if (!location.state) {
            navigate('/home');
        }
    }, [location.state, navigate]);

    const toggleTheme = () => setDarkMode(!darkMode);

    const runCode = () => {
        setOutput(`Executing:\n${code}`);
    };

    const handleSelectFileVersion = (selectedFile) => {
        setCode(selectedFile.content);
        setCurrentFile(selectedFile);
    };

    return (
        <div className={`coding-room-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <Header
                user={user}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
            />

            <div className="main-content-wrapper">
                {/* Sidebar for Version Control */}
                <div className="sidebar">
                    <VersionControl room={room} currentFile={handleSelectFileVersion} />
                </div>

                {/* Main Content Area for Code Editor */}
                <div className="coding-playground">
                    <EditorPlayGround code={code} setCode={setCode} darkMode={darkMode} runCode={runCode} currentFile={currentFile} user={user} room={room} />
                </div>

                {/* Chat Box on the Right */}
                <div className="chat-container">
                    <ChatComponent />
                </div>
            </div>

            <InputOutput input={input} output={output} setInput={setInput} />

            <Footer />
        </div>
    );
};

export default CodingPage;
