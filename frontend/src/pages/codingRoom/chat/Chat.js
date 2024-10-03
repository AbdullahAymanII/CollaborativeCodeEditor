// // components/ChatComponent.js
// import React, { useState } from 'react';
//
// const ChatComponent = () => {
//     const [message, setMessage] = useState('');
//
//     const sendMessage = () => {
//         // Add functionality to send messages.
//     };
//
//     return (
//         <div className="chat-area">
//             <h2>💬 Chat</h2>
//             <div className="chat-box">
//                 <div className="message">👤 User1: Hi there! 👋</div>
//                 <div className="message">👤 User2: Hello! 😊</div>
//             </div>
//             <input
//                 type="text"
//                 className="chat-input"
//                 placeholder="Type your message..."
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//             />
//             <button onClick={sendMessage}>Send</button>
//         </div>
//     );
// };
//
// export default ChatComponent;
import React, { useEffect, useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import '../CodingPage.css';

const ChatEditor = () => {
    const editor = useMemo(() => withReact(createEditor()), []);

    const initialValue = [
        {
            type: 'paragraph',
            children: [{ text: 'A line of text in a paragraph.' }],
        },
    ];

    const [value, setValue] = useState(initialValue || []);
    const [messages, setMessages] = useState([]);

    // Mocking fetchedValue for demonstration; this should be fetched properly in your real use case
    const fetchedValue = [
        {
            type: 'paragraph',
            children: [{ text: 'This is a fetched value from some API.' }],
        },
    ];

    // Set value only once when the component mounts
    useEffect(() => {
        setValue(fetchedValue);
    }, []); // Empty dependency array ensures this runs only once

    const sendMessage = () => {
        if (value[0].children[0].text.trim() === '') return;

        setMessages([...messages, { content: value }]);

        // Clear the editor after sending the message
        setValue([{ type: 'paragraph', children: [{ text: '' }] }]);
    };

    return (
        <div className="chat-editor-container">
            <h2>💬 Chat</h2>

            {/* Chat Box to display all messages */}
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <Slate editor={editor} value={msg.content} onChange={() => {}} initialValue={initialValue}>
                            <Editable readOnly />
                        </Slate>
                    </div>
                ))}
            </div>

            {/* Input field for new messages */}
            <div className="chat-input">
                <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)} initialValue={initialValue}>
                    <Editable />
                </Slate>

                <button className="send-btn" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatEditor;
