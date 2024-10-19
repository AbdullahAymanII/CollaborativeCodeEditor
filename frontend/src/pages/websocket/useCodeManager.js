import {useCallback} from 'react';
const useCodeManager = (wsRef, isConnected, currentFile, setCode, liveEditing, setSender) => {

    const subscribeToCodeUpdates = useCallback((currentFile) => {

        if (wsRef.current && isConnected) {
            wsRef.current.subscribe(
                `/topic/file/updates/${currentFile.roomId}/${currentFile.projectName}/${currentFile.filename}`,
                (message) => {
                    const data = JSON.parse(message.body);

                    setCode(data.code);
                    setSender(data.userId);
                }
            );
        }
    }, [wsRef, isConnected, liveEditing]);

    const publishCodeChange = useCallback((user, range) => {

        if (wsRef.current && isConnected && liveEditing) {

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