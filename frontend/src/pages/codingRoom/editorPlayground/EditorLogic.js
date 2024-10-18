// import { useRef, useCallback } from 'react';
//
// const useEditorLogic = (setCode, publishCodeChange, user) => {
//     const editorRef = useRef(null);
//
//     const handleEditorChange = useCallback(
//         (newCode) => {
//             setCode(newCode);
//             publishCodeChange(user, newCode);
//         },
//         [setCode, publishCodeChange, user]
//     );
//
//
//
//     const handleEditorDidMount = useCallback((editor) => {
//         editorRef.current = editor;
//         console.log(editor);
//         // editor.onDidChangeCursorPosition(handleCursorChange);
//     }, []);
//
//     return { handleEditorChange, handleEditorDidMount };
// };
//
// export default useEditorLogic;
//
// import { useRef, useCallback } from 'react';
//
// const useEditorLogic = (setCode, publishCodeChange, user) => {
//     const editorRef = useRef(null);
//
//     const handleEditorChange = useCallback(
//         (newCode) => {
//             setCode(newCode);
//             publishCodeChange(user, newCode);
//         },
//         [setCode, publishCodeChange, user]
//     );
//
//     const handleEditorDidMount = useCallback((editor) => {
//         editorRef.current = editor;
//         console.log('Editor instance:', editor);
//
//         // Function to handle cursor position changes and log the current line content
//         const handleCursorChange = (event) => {
//             const position = event.position;
//             const lineContent = editor.getModel().getLineContent(position.lineNumber);
//             console.log(`Cursor Position - Line: ${position.lineNumber}, Column: ${position.column}`);
//             console.log(`Line ${position.lineNumber} Content: ${lineContent}`);
//         };
//
//         // Listen to cursor position changes
//         editor.onDidChangeCursorPosition(handleCursorChange);
//     }, []);
//
//     return { handleEditorChange, handleEditorDidMount };
// };
//
// export default useEditorLogic;
//


// useEditorLogic.js

// import { useRef } from 'react';
//
// const useEditorLogic = () => {
//     const editorRef = useRef(null);
//
//     const handleEditorDidMount = (editor, monaco) => {
//         editorRef.current = editor;
//
//
//         const handleCursorChange = (event) => {
//             const model = editorRef.current.getModel();
//             const position = event.position;
//             const lineNumber = position.lineNumber;
//             const lineContent = model.getLineContent(lineNumber);
//             console.log(`Cursor Position - Line: ${lineNumber}, Column: ${position.column}`);
//             console.log(`Line ${lineNumber} Content: ${lineContent}`);
//         }
//         editorRef.current.onDidChangeCursorPosition(handleCursorChange);
//     };
//     return { handleEditorDidMount, editorRef };
// };
//
// export default useEditorLogic;



// import { useRef, useState } from 'react';
//
// const useEditorLogic = () => {
//     const editorRef = useRef(null);
//     const [cursorPosition, setCursorPosition] = useState({ lineNumber: null, column: null, endColumn: 0 });
//     const [lineContent, setLineContent] = useState('');
//
//     const handleEditorDidMount = (editor, monaco) => {
//         editorRef.current = editor;
//
//         const handleCursorChange = (event) => {
//             const model = editorRef.current.getModel();
//             const position = event.position;
//             const lineNumber = position.lineNumber;
//             const endColumn = model.getLineMaxColumn(lineNumber);
//
//             const content = model.getLineContent(lineNumber);
//
//             // Update state with the current cursor position and line content
//             setCursorPosition({ lineNumber, column: position.column, endColumn: endColumn});
//             setLineContent(content);
//
//             console.log(`Cursor Position - Line: ${lineNumber}, Column: ${position.column}`);
//             console.log(`Line ${lineNumber} Content: ${content}`);
//         };
//
//         editorRef.current.onDidChangeCursorPosition(handleCursorChange);
//     };
//
//     return { handleEditorDidMount, editorRef, cursorPosition, lineContent };
// };
//
// export default useEditorLogic;



// import { useRef, useState } from 'react';
//
// const useEditorLogic = () => {
//     const editorRef = useRef(null);
//     const [cursorPosition, setCursorPosition] = useState({ lineNumber: null, column: null, endColumn: 0 });
//     const [lineContent, setLineContent] = useState('');
//
//     const handleEditorDidMount = (editor, monaco) => {
//         editorRef.current = editor;
//
//         // Custom Command for Adding Comment
//         editorRef.current.addAction({
//             id: 'add-comment',
//             label: 'Add Comment',
//             keybindings: [],
//             contextMenuGroupId: 'navigation',
//             contextMenuOrder: 1.5,
//
//             // Run command logic
//             run: (ed) => {
//                 const position = ed.getPosition();
//                 const lineNumber = position.lineNumber;
//                 const model = ed.getModel();
//                 const lineContent = model.getLineContent(lineNumber);
//
//                 // Log the action or send the comment
//                 console.log(`Add Comment for Line ${lineNumber}: ${lineContent}`);
//                 sendComment(lineNumber, lineContent);
//             }
//         });
//
//         // Right-click (context menu) event listener
//         editorRef.current.onContextMenu((event) => {
//             const position = editorRef.current.getPosition();
//             const lineNumber = position.lineNumber;
//             const model = editorRef.current.getModel();
//             const lineContent = model.getLineContent(lineNumber);
//
//             console.log(`Right-clicked on Line ${lineNumber}: ${lineContent}`);
//         });
//
//         // Cursor position tracking
//         const handleCursorChange = (event) => {
//             const model = editorRef.current.getModel();
//             const position = event.position;
//             const lineNumber = position.lineNumber;
//             const endColumn = model.getLineMaxColumn(lineNumber);
//             const content = model.getLineContent(lineNumber);
//
//             // Update state with the current cursor position and line content
//             setCursorPosition({ lineNumber, column: position.column, endColumn: endColumn });
//             setLineContent(content);
//
//             console.log(`Cursor Position - Line: ${lineNumber}, Column: ${position.column}`);
//             console.log(`Line ${lineNumber} Content: ${content}`);
//         };
//
//         editorRef.current.onDidChangeCursorPosition(handleCursorChange);
//     };
//
//     // Sample function to simulate sending a comment
//     const sendComment = (lineNumber, content) => {
//         // Implement your logic here to send the comment
//         // For example, trigger an API call or update UI
//         console.log(`Sending comment for line ${lineNumber}: ${content}`);
//     };
//
//     return { handleEditorDidMount, editorRef, cursorPosition, lineContent };
// };
//
// export default useEditorLogic;




// import { useRef, useState } from 'react';
//
// const useEditorLogic = () => {
//     const editorRef = useRef(null);
//     const [cursorPosition, setCursorPosition] = useState({ lineNumber: null, column: null, endColumn: 0 });
//     const [lineContent, setLineContent] = useState('');
//     const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
//     const [currentLine, setCurrentLine] = useState(null); // To store the line number for adding comment
//     const [comment, setComment] = useState(''); // To store the inputted comment
//
//     const handleEditorDidMount = (editor, monaco) => {
//         editorRef.current = editor;
//
//         // Custom Command for Adding Comment
//         editorRef.current.addAction({
//             id: 'add-comment',
//             label: 'Add Comment',
//             keybindings: [],
//             contextMenuGroupId: 'navigation',
//             contextMenuOrder: 1.5,
//
//             // Run command logic
//             run: (ed) => {
//                 const position = ed.getPosition();
//                 const lineNumber = position.lineNumber;
//
//                 // Store the line number where the comment will be added
//                 setCurrentLine(lineNumber);
//
//                 // Show the comment input box
//                 setIsCommentBoxVisible(true);
//             }
//         });
//
//         // Cursor position tracking
//         const handleCursorChange = (event) => {
//             const model = editorRef.current.getModel();
//             const position = event.position;
//             const lineNumber = position.lineNumber;
//             const endColumn = model.getLineMaxColumn(lineNumber);
//             const content = model.getLineContent(lineNumber);
//
//             // Update state with the current cursor position and line content
//             setCursorPosition({ lineNumber, column: position.column, endColumn: endColumn });
//             setLineContent(content);
//
//             console.log(`Cursor Position - Line: ${lineNumber}, Column: ${position.column}`);
//             console.log(`Line ${lineNumber} Content: ${content}`);
//         };
//
//         editorRef.current.onDidChangeCursorPosition(handleCursorChange);
//     };
//
//     // Handle comment input change
//     const handleCommentChange = (event) => {
//         setComment(event.target.value);
//     };
//
//     // Handle comment submission
//     const handleSubmitComment = () => {
//         if (currentLine !== null) {
//             sendComment(currentLine, comment);
//             setComment(''); // Reset the comment input
//             setIsCommentBoxVisible(false); // Hide the input box
//         }
//     };
//
//     // Sample function to simulate sending a comment
//     const sendComment = (lineNumber, comment) => {
//         console.log(`Sending comment for line ${lineNumber}: ${comment}`);
//     };
//
//     return {
//         handleEditorDidMount,
//         editorRef,
//         cursorPosition,
//         lineContent,
//         isCommentBoxVisible,
//         handleCommentChange,
//         comment,
//         handleSubmitComment
//     };
// };
//
// export default useEditorLogic;



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
