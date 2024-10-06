// import React, { useState } from 'react';
// import '../CodingPage.css';
// const ChatComponent = ({ messages, user, currentFile, role, sendMessage }) => {
//     const [chatInput, setChatInput] = useState('');
//
//     const handleSendMessage = () => {
//         if (chatInput.trim()) {
//             const chatMessage = {
//                 content: chatInput,
//                 sender: user.name,
//                 filename: currentFile.filename,
//                 roomId: currentFile.roomId,
//                 projectName: currentFile.projectName,
//                 role: role
//             };
//             sendMessage(chatMessage);
//             setChatInput(''); // Clear the input field after sending
//         }
//     };
//
//     return (
//         <div className="chat-box">
//             <div className="chat-messages">
//                 {messages.map((message, index) => (
//                     <div key={index} className="chat-message">
//                         <strong>{message.sender} ({message.role}):</strong> {message.content}
//                     </div>
//                 ))}
//             </div>
//             <div className="chat-input-container">
//                 <input
//                     type="text"
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     placeholder="Type a message..."
//                     className="chat-input"
//                 />
//                 <button onClick={handleSendMessage} className="send-button">Send</button>
//             </div>
//         </div>
//     );
// };
//
// export default ChatComponent;


// import React, { useState } from 'react';
// import '../CodingPage.css';
//
// const ChatComponent = ({ messages, user, currentFile, role, sendMessage }) => {
//     const [chatInput, setChatInput] = useState('');
//     const [isSending, setIsSending] = useState(false); // Prevent double sends
//
//     const handleSendMessage = () => {
//         if (chatInput.trim() && !isSending) {
//             setIsSending(true);
//             const chatMessage = {
//                 content: chatInput,
//                 sender: user.name,
//                 filename: currentFile.filename,
//                 roomId: currentFile.roomId,
//                 projectName: currentFile.projectName,
//                 role: role
//             };
//             console.log(chatMessage);
//             sendMessage(chatMessage);
//             setChatInput('');
//             setTimeout(() => setIsSending(false), 500); // Reset flag after short delay
//         }
//     };
//
//     return (
//         <div className="chat-box">
//             <div className="chat-messages">
//                 {messages.map((message, index) => (
//                     <div key={index} className="chat-message">
//                         <strong>{message.sender} ({message.role}):</strong> {message.content}
//                     </div>
//                 ))}
//             </div>
//             <div className="chat-input-container">
//                 <input
//                     type="text"
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     placeholder="Type a message..."
//                     className="chat-input"
//                 />
//                 <button onClick={handleSendMessage} className="send-button" disabled={isSending}>
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// };
//
// export default ChatComponent;


import React, { useState } from 'react';
import '../CodingPage.css';

const ChatComponent = ({ messages, user, currentFile, role, sendMessage }) => {
    const [chatInput, setChatInput] = useState('');

    const handleSendMessage = () => {
        if (chatInput.trim()) {
            const chatMessage = {
                content: chatInput,
                sender: user.name,
                filename: currentFile.filename,
                roomId: currentFile.roomId,
                projectName: currentFile.projectName,
                role: role
            };
            sendMessage(chatMessage);
            setChatInput('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.system ? 'system-message' : ''}`}>
                        <strong>{message.sender} ({message.role}):</strong> {message.content}
                        {message.timestamp && (
                            <div className="timestamp">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button onClick={handleSendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
};

export default ChatComponent;

