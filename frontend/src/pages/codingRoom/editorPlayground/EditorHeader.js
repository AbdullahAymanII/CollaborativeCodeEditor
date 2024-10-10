// import React from 'react';
// import LanguageSelector from './LanguageSelector';
//
// const EditorHeader = ({ selectedLanguage, onLanguageChange, room }) => {
//     return (
//         <div className="editor-header">
//             <h2>Room Name</h2>
//             <div className="actions">
//                 <label htmlFor="language-select" className="language-label">Language</label>
//                 <LanguageSelector
//                     selectedLanguage={selectedLanguage}
//                     onLanguageChange={onLanguageChange}
//                 />
//             </div>
//         </div>
//     );
// };
//
// export default EditorHeader;

import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';

const EditorHeader = ({ selectedLanguage, onLanguageChange, room }) => {
    const [showToast, setShowToast] = useState(false);

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(room.roomId);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
    };

    return (
        <div className="editor-header">
            <div className="room-info">
                <h2>{room.name}</h2>
                <div className="room-actions">
                    <div className="room-id-container">
                        <span>{room.roomId}</span>
                        <button className="copy-btn" onClick={handleCopyRoomId}>Copy ID</button>
                    </div>
                    <div className="actions">
                        <label htmlFor="language-select" className="language-label">Language</label>
                        <LanguageSelector
                            selectedLanguage={selectedLanguage}
                            onLanguageChange={onLanguageChange}
                        />
                    </div>
                </div>
            </div>

            {showToast && (
                <div className="toast">
                    <p>Room ID copied to clipboard!</p>
                </div>
            )}
        </div>
    );
};

export default EditorHeader;


