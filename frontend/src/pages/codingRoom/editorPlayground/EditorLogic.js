import { useRef, useCallback } from 'react';

const useEditorLogic = (setCode, publishCodeChange, publishCursorChange, lockLine, user) => {
    const editorRef = useRef(null);

    const handleEditorChange = useCallback(
        (newCode) => {
            setCode(newCode);
            publishCodeChange(user.name, newCode);
        },
        [setCode, publishCodeChange, user.name]
    );

    const handleCursorChange = useCallback(
        (event) => {
            const lineNumber = event.position.lineNumber;
            publishCursorChange(user.name, lineNumber);
            lockLine(lineNumber);
        },
        [publishCursorChange, lockLine, user.name]
    );

    const handleEditorDidMount = useCallback((editor) => {
        editorRef.current = editor;
        editor.onDidChangeCursorPosition(handleCursorChange);
    }, [handleCursorChange]);

    return { handleEditorChange, handleEditorDidMount };
};

export default useEditorLogic;
