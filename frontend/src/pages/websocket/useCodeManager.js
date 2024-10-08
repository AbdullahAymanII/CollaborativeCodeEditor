// import { useState } from 'react';
// import { useWebSocketConnection } from './useWebSocketConnection';
// import { useMessageHandler } from './useMessageHandler';
//
// const useWebSocketManager = (setCode, setMessages, user, currentFile, role, liveEditing, room) => {
//     const [isConnected, setIsConnected] = useState(false);
//
//     const wsRef = useWebSocketConnection(setIsConnected, setCode, setMessages, user, currentFile, room, role);
//     const { publishCodeChange, sendChatMessage, sendActionMessage } = useMessageHandler(wsRef, isConnected, liveEditing, currentFile);
//
//     return { publishCodeChange, sendChatMessage, sendActionMessage, isConnected };
// };
//
// export default useWebSocketManager;





//
// const useCodeManager = (wsRef, isConnected, currentFile, setCode, liveEditing) => {
//     const subscribeToCodeUpdates = () => {
//         console.log('subscribeToCodeUpdates===========================================================')
//         if (wsRef.current && isConnected) {
//             console.log('subscribeToCodeUpdates===========================================================')
//             wsRef.current.subscribe(`/topic/file/updates`, (message) => {
//                 console.log('subscribeToCodeUpdates===========================================================')
//                 const data = JSON.parse(message.body);
//                 if (data.filename === currentFile.filename
//                     && data.roomId === currentFile.roomId
//                     && data.projectName === currentFile.projectName
//                     && liveEditing
//                 ) {
//                     setCode(data.code);
//                 }
//             });
//             console.log('subscribeToCodeUpdates===========================================================')
//         }
//     };
//
//     const publishCodeChange = (user, code) => {
//         if (wsRef.current && isConnected && liveEditing) {
//             wsRef.current.publish({
//                 destination: `/app/code/updates`,
//                 body: JSON.stringify({
//                     userId: user.name,
//                     filename: currentFile.filename,
//                     roomId: currentFile.roomId,
//                     projectName: currentFile.projectName,
//                     code,
//                 }),
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });
//         }
//     };
//
//     return { subscribeToCodeUpdates, publishCodeChange };
// };
//
// export default useCodeManager;



import { useCallback } from 'react';

const useCodeManager = (wsRef, isConnected, currentFile, setCode, liveEditing) => {
    // Subscribe to code updates callback
    const subscribeToCodeUpdates = useCallback((currentFile) => {
        console.log('Subscribing to code updates...');
        if (wsRef.current && isConnected) {
            wsRef.current.subscribe(`/topic/file/updates`, (message) => {
                const data = JSON.parse(message.body);
                if (
                    data.filename === currentFile.filename &&
                    data.roomId === currentFile.roomId &&
                    data.projectName === currentFile.projectName
                ) {
                    setCode(data.code);  // Update the code state with the received data
                }
                console.log('Code update received:', data);
                console.log('Code update received:', currentFile);
            });
        } else {
            console.log('Cannot subscribe to code updates, WebSocket is not connected.');
        }
    }, [wsRef, isConnected, liveEditing, currentFile, setCode]); // Memoize the callback

    // Publish code change callback
    const publishCodeChange = useCallback((user, code) => {
        if (wsRef.current && isConnected && liveEditing) {
            console.log('Publishing code change:', code);
            wsRef.current.publish({
                destination: `/app/code/updates`,
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
    }, [wsRef, isConnected, currentFile, liveEditing]); // Memoize the callback

    return { subscribeToCodeUpdates, publishCodeChange };
};

export default useCodeManager;
