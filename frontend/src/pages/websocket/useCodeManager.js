// import { useCallback } from 'react';
//
// const useCodeManager = (wsRef, isConnected, currentFile, setCode, liveEditing, setSender) => {
//
//     const subscribeToCodeUpdates = useCallback((currentFile) => {
//         console.log('Subscribing to code updates...');
//         if (wsRef.current && isConnected ) {
//             wsRef.current.subscribe(
//                 `/topic/file/updates/${currentFile.roomId}/${currentFile.projectName}/${currentFile.filename}`,
//                 (message) => {
//                     const data = JSON.parse(message.body);
//                     setCode(data.code);
//                     setSender(data.userId);
//                     console.log('Code update received:', data);
//                 }
//             );
//         } else {
//             console.log('Cannot subscribe to code updates, WebSocket is not connected.');
//         }
//     }, [wsRef, isConnected, currentFile, setCode, setSender]);
//
//     const publishCodeChange = useCallback((user, code) => {
//         if (wsRef.current && isConnected && liveEditing) {
//             console.log('Publishing code change:', code);
//
//             wsRef.current.publish({
//                 destination: `/app/code/updates/${currentFile.roomId}/${currentFile.projectName}/${currentFile.filename}`,
//                 body: JSON.stringify({
//                     userId: user.name,
//                     filename: currentFile.filename,
//                     roomId: currentFile.roomId,
//                     projectName: currentFile.projectName,
//                     code,
//                 }),
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });
//         } else {
//             console.log('Cannot publish code change, WebSocket is not connected.');
//         }
//     }, [wsRef, isConnected, currentFile, liveEditing]);
//
//     return { subscribeToCodeUpdates, publishCodeChange };
// };
//
// export default useCodeManager;



import {useCallback} from 'react';
const useCodeManager = (wsRef, isConnected, currentFile, setCode, liveEditing, setSender) => {

    const subscribeToCodeUpdates = useCallback((currentFile) => {
        console.log('---------------------------------------------------------------------');
        console.log('Subscribing to code updates...');
        console.log('---------------------------------------------------------------------');
        if (wsRef.current && isConnected) {
            wsRef.current.subscribe(
                `/topic/file/updates/${currentFile.roomId}/${currentFile.projectName}/${currentFile.filename}`,
                (message) => {
                    const data = JSON.parse(message.body);

                    // editorRef.current.executeEdits('', [{
                    //     range: new monacoRef.current.Range(data.startLineNumber, data.startColumn, data.endLineNumber, data.endColumn),
                    //     text: data.lineContent
                    // }]);
                    console.log('result:', data);
                    setCode(data.code);
                    setSender(data.userId);
                }
            );
        }
    }, [wsRef, isConnected, liveEditing]);




    // const subscribeToCodeUpdates = useCallback((currentFile) => {
    //     console.log('Subscribing to code updates...');
    //
    //     const model = editorRef.current.getModel();
    //     console.log('===========222222=====================================');
    //     console.log(model);
    //     console.log('===========222222=====================================');
    //     if (wsRef.current && isConnected ) {
    //         wsRef.current.subscribe(
    //             `/topic/file/updates/${currentFile.roomId}/${currentFile.projectName}/${currentFile.filename}`,
    //             (message) => {
    //                 const data = JSON.parse(message.body);
    //                 console.log('===========222222=====================================');
    //                 console.log(data);
    //                 console.log('===========222222=====================================');
    //
    //                 const totalLines = model.getLineCount();
    //
    //                 if (data.startLineNumber > totalLines) {
    //                     let extraLines = data.startLineNumber - totalLines;
    //                     let extraText = "\n".repeat(extraLines);
    //                     model.applyEdits([{
    //                         range: {
    //                             startLineNumber: totalLines,
    //                             startColumn: model.getLineMaxColumn(totalLines),
    //                             endLineNumber: totalLines,
    //                             endColumn: model.getLineMaxColumn(totalLines),
    //                         },
    //                         text: extraText,
    //                         forceMoveMarkers: true,
    //                     }]);
    //                 }
    //
    //                 model.applyEdits([{
    //                     range: {
    //                         startLineNumber: data.startLineNumber,
    //                         startColumn: data.startColumn,
    //                         endLineNumber: data.endLineNumber,
    //                         endColumn: data.endColumn,
    //                     },
    //                     text: data.lineContent,
    //                     forceMoveMarkers: true,
    //                 }]);
    //
    //                 setSender(data.userId);
    //                 console.log('Code update received:', data);
    //             }
    //         );
    //     } else {
    //         console.log('Cannot subscribe to code updates, WebSocket is not connected.');
    //     }
    // }, [wsRef, isConnected, currentFile, setCode, setSender, editorRef]);

    const publishCodeChange = useCallback((user, range) => {
        console.log('0000000000000000000000000000000000000000000000000000');
        console.log('Publishing code change:', range);
        console.log('0000000000000000000000000000000000000000000000000000');
        if (wsRef.current && isConnected && liveEditing) {
            console.log('Publishing code change:', range);
            console.log('Publishing code change:', user);
            console.log('Publishing code change:', currentFile);
            wsRef.current.publish({
                destination: `/app/code/updates/${currentFile.roomId}/${currentFile.projectName}/${currentFile.filename}/${range.role}`,
                body: JSON.stringify({
                    userId: user.name,
                    filename: currentFile.filename,
                    roomId: currentFile.roomId,
                    projectName: currentFile.projectName,

                    lineNumber: range.lineNumber,
                    column: range.column,
                    lineContent: range.lineContent,
                    code: range.code
                }),
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } else {
            console.log('Cannot publish code change, WebSocket is not connected.');
        }
    }, [wsRef, isConnected, currentFile, liveEditing]);


    return { subscribeToCodeUpdates, publishCodeChange };
};

export default useCodeManager;