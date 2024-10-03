import React from 'react';

const EditorFooter = ({ runCode, onMergeClick, onPushClick }) => {
    return (
        <div className="editor-footer">
            <button className="run-btn" onClick={runCode}>Run</button>
            <button className="push-btn" onClick={onMergeClick}>MERGE</button>
            <button className="push-btn" onClick={onPushClick}>PUSH</button>
        </div>
    );
};

export default EditorFooter;
