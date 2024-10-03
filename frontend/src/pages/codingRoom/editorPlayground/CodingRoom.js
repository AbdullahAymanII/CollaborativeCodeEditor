// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './CodingRoom.css'; // Assuming CSS for styling components
//
// const CodingRoom = () => {
//     const [darkMode, setDarkMode] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();
//
//     // Check if location.state is available to prevent errors
//     const { userName, profileImage, roomId } = location.state || {};  // Destructure with fallback
//
//     useEffect(() => {
//         if (!location.state) {
//             // Redirect to a safe page (e.g., Home) if location.state is missing
//             navigate('/home');
//         }
//     }, [location.state, navigate]);
//
//     const toggleTheme = () => setDarkMode(!darkMode);
//
//     return (
//         <div className={`coding-room-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
//             {/* Header */}
//             <header className="coding-room-header">
//                 <div className="user-info">
//                     {profileImage && <img className="user-image" src={profileImage} alt="User" />}
//                     <span className="user-name">{userName || 'Guest'}</span>
//                 </div>
//                 <button className="theme-toggle-btn" onClick={toggleTheme}>
//                     {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//                 </button>
//             </header>
//
//             {/* Main Content */}
//             <div className="coding-room-content">
//                 {/* Left Side: Project Files */}
//                 <div className="version-control">
//                     <h2>📂 Project Files</h2>
//                     <ul>
//                         <li>📝 index.js</li>
//                         <li>📝 App.js</li>
//                         <li>📄 style.css</li>
//                     </ul>
//                 </div>
//
//                 {/* Center: Code Editor */}
//                 <div className="code-editor">
//                     <h2>💻 Code Editor</h2>
//                     <textarea className="code-area" placeholder="Write your code here..." />
//                 </div>
//
//                 {/* Right Side: Chat Area */}
//                 <div className="chat-area">
//                     <h2>💬 Chat</h2>
//                     <div className="chat-box">
//                         <div className="message">👤 User1: Hi there! 👋</div>
//                         <div className="message">👤 User2: Hello! 😊</div>
//                     </div>
//                     <input type="text" className="chat-input" placeholder="Type your message..." />
//                 </div>
//             </div>
//
//             {/* Bottom: Input/Output */}
//             <div className="input-output-container">
//                 <div className="input-box">
//                     <h3>Input</h3>
//                     <textarea className="input-area" placeholder="Provide input..." />
//                 </div>
//                 <div className="output-box">
//                     <h3>Output</h3>
//                     <textarea className="output-area" placeholder="Results will appear here..." readOnly />
//                 </div>
//             </div>
//
//             {/* Footer */}
//             <footer className="coding-room-footer">
//                 <p>💻 &copy; {new Date().getFullYear()} Built by Abdullah Ayman</p>
//             </footer>
//         </div>
//     );
// };
//
// export default CodingRoom;

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './CodingRoom.css';
//
// const CodingRoom = () => {
//     const [darkMode, setDarkMode] = useState(false);
//     const [code, setCode] = useState('');  // State to store code
//     const [output, setOutput] = useState('');  // State to store the output after running code
//     const navigate = useNavigate();
//     const location = useLocation();
//
//     // Destructure state or fallback to prevent errors
//     const { userName, profileImage } = location.state || {};
//
//     useEffect(() => {
//         if (!location.state) {
//             navigate('/home');
//         }
//     }, [location.state, navigate]);
//
//     const toggleTheme = () => setDarkMode(!darkMode);
//
//     // Function to run the code (mock execution for now)
//     const runCode = () => {
//         // For now, we just echo the input as output (You can integrate a real JS code evaluator here)
//         setOutput(`Executing:\n${code}`);
//     };
//
//     return (
//         <div className={`coding-room-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
//             {/* Header */}
//             <header className="coding-room-header">
//                 <div className="user-info">
//                     {profileImage && <img className="user-image" src={profileImage} alt="User" />}
//                     <span className="user-name">{userName || 'Guest'}</span>
//                 </div>
//                 <button className="theme-toggle-btn" onClick={toggleTheme}>
//                     {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//                 </button>
//             </header>
//
//             {/* Main Content */}
//             <div className="coding-room-content">
//                 {/* Left Side: Project Files */}
//                 <div className="version-control">
//                     <h2>📂 Project Files</h2>
//                     <ul>
//                         <li>📝 index.js</li>
//                         <li>📝 App.js</li>
//                         <li>📄 style.css</li>
//                     </ul>
//                 </div>
//
//                 {/* Center: Code Editor */}
//                 <div className="code-editor">
//                     <h2>💻 Code Editor</h2>
//                     <textarea
//                         className="code-area"
//                         name="codeArea"
//                         rows="20"
//                         cols="70"
//                         placeholder="Write your JavaScript code here..."
//                         value={code}
//                         onChange={(e) => setCode(e.target.value)}
//                         autofocus
//                         wrap="soft"
//                         maxlength="1000"
//                     />
//                     <button className="run-code-btn" onClick={runCode}>
//                         🏃‍♂️ Run Code
//                     </button>
//                 </div>
//
//                 {/* Right Side: Chat Area */}
//                 <div className="chat-area">
//                     <h2>💬 Chat</h2>
//                     <div className="chat-box">
//                         <div className="message">👤 User1: Hi there! 👋</div>
//                         <div className="message">👤 User2: Hello! 😊</div>
//                     </div>
//                     <input type="text" className="chat-input" placeholder="Type your message..." />
//                 </div>
//             </div>
//
//             {/* Bottom: Input/Output */}
//             <div className="input-output-container">
//                 <div className="input-box">
//                     <h3>🔧 Input</h3>
//                     <textarea
//                         className="input-area"
//                         placeholder="Provide input..."
//                         rows="4"
//                         cols="50"
//                     />
//                 </div>
//                 <div className="output-box">
//                     <h3>🚀 Output</h3>
//                     <textarea
//                         className="output-area"
//                         placeholder="Results will appear here..."
//                         readOnly
//                         value={output}
//                     />
//                 </div>
//             </div>
//
//             {/* Footer */}
//             <footer className="coding-room-footer">
//                 <p>💻 &copy; {new Date().getFullYear()} Built by Abdullah Ayman 🚀</p>
//             </footer>
//         </div>
//     );
// };
//
// export default CodingRoom;



import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../CodingRoom.css';
import { Editor } from '@monaco-editor/react';


const CodingRoom = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [code, setCode] = useState('');  // State to store code
    const [output, setOutput] = useState('');  // State to store the output after running code
    const navigate = useNavigate();
    const location = useLocation();

    // Destructure state or fallback to prevent errors
    const { userName, profileImage } = location.state || {};

    useEffect(() => {
        if (!location.state) {
            navigate('/home');
        }
    }, [location.state, navigate]);

    const toggleTheme = () => setDarkMode(!darkMode);

    // Function to run the code (mock execution for now)
    const runCode = () => {
        // For now, we just echo the input as output (You can integrate a real JS code evaluator here)
        setOutput(`Executing:\n${code}`);
    };

    return (
        <div className={`coding-room-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            {/* Header */}
            <header className="coding-room-header">
                <div className="user-info">
                    {profileImage && <img className="user-image" src={profileImage} alt="User" />}
                    <span className="user-name">{userName || 'Guest'}</span>
                </div>
                <button className="theme-toggle-btn" onClick={toggleTheme}>
                    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
            </header>

            {/* Main Content */}
            <div className="coding-room-content">
                {/* Left Side: Project Files */}
                <div className="version-control">
                    <h2>📂 Project Files</h2>
                    <ul>
                        <li>📝 index.js</li>
                        <li>📝 App.js</li>
                        <li>📄 style.css</li>
                    </ul>
                </div>

                {/* Center: Code Editor */}
                <div className="code-editor">
                    <h2>💻 Code Editor</h2>
                    <Editor
                        height="60vh"
                        language="python"
                        theme={darkMode ? 'vs-dark' : 'vs-light'}  // Set theme based on darkMode
                        value={code}
                        options={{
                            fontSize: 16,
                            automaticLayout: true,
                        }}
                        onChange={(value) => setCode(value)}  // Update code state
                    />

                    <button className="run-code-btn" onClick={runCode}>
                        🏃‍♂️ Run Code
                    </button>
                </div>

                {/* Right Side: Chat Area */}
                <div className="chat-area">
                    <h2>💬 Chat</h2>
                    <div className="chat-box">
                        <div className="message">👤 User1: Hi there! 👋</div>
                        <div className="message">👤 User2: Hello! 😊</div>
                    </div>
                    <input type="text" className="chat-input" placeholder="Type your message..." />
                </div>
            </div>

            {/* Bottom: Input/Output */}
            <div className="input-output-container">
                <div className="input-box">
                    <h3>🔧 Input</h3>
                    <textarea
                        className="input-area"
                        placeholder="Provide input..."
                        rows="4"
                        cols="50"
                    />
                </div>
                <div className="output-box">
                    <h3>🚀 Output</h3>
                    <textarea
                        className="output-area"
                        placeholder="Results will appear here..."
                        readOnly
                        value={output}
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="coding-room-footer">
                <p>💻 &copy; {new Date().getFullYear()} Built by Abdullah Ayman 🚀</p>
            </footer>
        </div>
    );
};

export default CodingRoom;
