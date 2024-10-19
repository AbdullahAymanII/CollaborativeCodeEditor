import { useRef, useState } from 'react';

const useEditorLogic = (role) => {
    const editorRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState({ lineNumber: null, column: null, endColumn: 0 });
    const [lineContent, setLineContent] = useState('');
    const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
    const [currentLine, setCurrentLine] = useState(null); // To store the line number for adding comment
    const [comment, setComment] = useState(''); // To store the inputted comment

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        if(role === 'VIEWER'){
            editorRef.current.addAction({
                id: 'add-comment',
                label: 'Add Comment',
                keybindings: [],
                contextMenuGroupId: 'navigation',
                contextMenuOrder: 1.5,

                run: (ed) => {
                    const position = ed.getPosition();
                    const lineNumber = position.lineNumber;

                    // Store the line number where the comment will be added
                    setCurrentLine(lineNumber);

                    // Show the comment input box
                    setIsCommentBoxVisible(true);
                }
            });
        }

        // Cursor position tracking
        const handleCursorChange = (event) => {
            const model = editorRef.current.getModel();
            const position = event.position;
            const lineNumber = position.lineNumber;
            const endColumn = model.getLineMaxColumn(lineNumber);
            const content = model.getLineContent(lineNumber);

            // Update state with the current cursor position and line content
            setCursorPosition({ lineNumber, column: position.column, endColumn: endColumn });
            setLineContent(content);

            console.log(`Cursor Position - Line: ${lineNumber}, Column: ${position.column}`);
            console.log(`Line Content: ${content}`);
        };

        editor.onDidChangeCursorPosition(handleCursorChange);
    };



    return {
        editorRef,
        cursorPosition,
        lineContent,
        isCommentBoxVisible,
        setIsCommentBoxVisible,
        handleEditorDidMount,
        comment,
        setComment,
    };
};

export default useEditorLogic;
