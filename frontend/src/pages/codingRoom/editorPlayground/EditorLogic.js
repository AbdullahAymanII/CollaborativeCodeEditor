import { useRef, useCallback } from 'react';

const useEditorLogic = (setCode, publishCodeChange, user) => {
    const editorRef = useRef(null);

    const handleEditorChange = useCallback(
        (newCode) => {
            setCode(newCode);
            publishCodeChange(user, newCode);
        },
        [setCode, publishCodeChange, user]
    );

    const handleEditorDidMount = useCallback((editor) => {
        editorRef.current = editor;
        // editor.onDidChangeCursorPosition(handleCursorChange);
    }, []);

    return { handleEditorChange, handleEditorDidMount };
};

export default useEditorLogic;