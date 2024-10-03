import React from 'react';
import LanguageSelector from './LanguageSelector';

const EditorHeader = ({ selectedLanguage, onLanguageChange }) => {
    return (
        <div className="editor-header">
            <h2>Code Playground</h2>
            <div className="actions">
                <label htmlFor="language-select" className="language-label">Language</label>
                <LanguageSelector
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={onLanguageChange}
                />
            </div>
        </div>
    );
};

export default EditorHeader;
