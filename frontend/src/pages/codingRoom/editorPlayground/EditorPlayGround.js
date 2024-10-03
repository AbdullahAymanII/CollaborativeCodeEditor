import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import ActionModal from './ActionModal';
import EditorHeader from './EditorHeader';
import EditorFooter from './EditorFooter';
import useWebSocketManager from './WebSocketManager';
import useFileManager from './FileManager';
import useEditorLogic from './EditorLogic';
// <EditorPlayGround code={code} setCode={setCode} darkMode={darkMode} runCode={runCode} currentFile={currentFile} user={user} />
const EditorPlayGround = ({ code, setCode, darkMode, runCode, currentFile, user, room }) => {
    // const [lockedLines, setLockedLines] = useState(new Set());
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [showConfirmPushModal, setShowConfirmPushModal] = useState(false);
    const [showConfirmMergeModal, setShowConfirmMergeModal] = useState(false);
    // const [publishCodeChange, publishCodeChange] = useState('');



    const { publishCodeChange, isConnected } = useWebSocketManager(setCode, user, currentFile);
    const { pushFileToServer, mergeFileFromServer, successMessage } = useFileManager(code, currentFile, room, setCode, setShowConfirmMergeModal, setShowConfirmPushModal);
    const { handleEditorChange, handleEditorDidMount } = useEditorLogic(setCode, publishCodeChange, user);


    return (
        <div className={`code-editor-container ${darkMode ? 'dark' : 'light'}`}>
            <EditorHeader
                selectedLanguage={selectedLanguage}
                onLanguageChange={e => setSelectedLanguage(e.target.value)}
            />
            <Editor
                height="67vh"
                language={selectedLanguage}
                theme={darkMode ? 'vs-dark' : 'light-plus'}
                value={code}
                onChange={handleEditorChange}
                editorDidMount={handleEditorDidMount}
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
            {successMessage && <div className="success-message">{successMessage}</div>}
            <EditorFooter
                runCode={runCode}
                onMergeClick={() => setShowConfirmMergeModal(true)}
                onPushClick={() => setShowConfirmPushModal(true)}
            />
            <ActionModal
                show={showConfirmPushModal}
                title="Confirm Code Push"
                actionLabel="PUSH"
                onConfirm={pushFileToServer}
                onCancel={() => setShowConfirmPushModal(false)}
            />
            <ActionModal
                show={showConfirmMergeModal}
                title="Confirm Code Merge"
                actionLabel="MERGE"
                onConfirm={mergeFileFromServer}
                onCancel={() => setShowConfirmMergeModal(false)}
            />
        </div>
    );
};

export default EditorPlayGround;
