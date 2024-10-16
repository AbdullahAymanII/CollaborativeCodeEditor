import { useCallback } from 'react';

const useCodeManager = (wsRef, isConnected, currentFile, setCode, liveEditing, setSender) => {

    const subscribeToCodeUpdates = useCallback((currentFile) => {
        console.log('Subscribing to code updates...');
        if (wsRef.current && isConnected ) {
            wsRef.current.subscribe(
                `/topic/file/updates/${currentFile.roomId}/${currentFile.projectName}/${currentFile.filename}`,
                (message) => {
                    const data = JSON.parse(message.body);
                    setCode(data.code);
                    setSender(data.userId);
                    console.log('Code update received:', data);
                }
            );
        } else {
            console.log('Cannot subscribe to code updates, WebSocket is not connected.');
        }
    }, [wsRef, isConnected, currentFile, setCode, setSender]);

    const publishCodeChange = useCallback((user, code) => {
        if (wsRef.current && isConnected && liveEditing) {
            console.log('Publishing code change:', code);

            wsRef.current.publish({
                destination: `/app/code/updates/${currentFile.roomId}/${currentFile.projectName}/${currentFile.filename}`,
                body: JSON.stringify({
                    userId: user.name,
                    filename: currentFile.filename,
                    roomId: currentFile.roomId,
                    projectName: currentFile.projectName,
                    code,
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
