// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import { useState, useEffect, useRef, useCallback } from 'react';
// const useWebSocketManager = (setCode, user, currentFile, role) => {
//     const [isConnected, setIsConnected] = useState(false);
//     const [initializedCode, setInitializedCode] = useState(false);
//     const wsRef = useRef(null);
//
//     const createWebSocketConnection = useCallback(() => {
//         const socket = new SockJS('http://localhost:8080/ws');
//
//         const stompClient = new Client({
//             webSocketFactory: () => socket,
//             reconnectDelay: 5000,
//             onConnect: () => {
//                 console.log('Connected to WebSocket server');
//                 console.log(role);
//                 setIsConnected(true);
//
//                 stompClient.subscribe(`/topic/file/updates`, (message) => {
//                     const data = JSON.parse(message.body);
//
//                     // Filter by file-specific identifiers
//                     if (data.filename === currentFile.filename &&
//                         data.roomId === currentFile.roomId &&
//                         data.projectName === currentFile.projectName
//                     ) {
//                         setCode(data.code);
//                     }
//                 });
//
//             },
//             onStompError: console.error,
//             onDisconnect: () => console.log('Disconnected from WebSocket server'),
//             connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//
//         stompClient.activate();
//
//         return stompClient;
//     }, [setCode, currentFile.filename, currentFile.roomId]);
//
//     const publishCodeChange = (user, code) => {
//         if (wsRef.current && isConnected) {
//             setInitializedCode(code);
//
//             wsRef.current.publish({
//                 destination: `/app/code/updates`, // Use a general destination
//                 body: JSON.stringify({
//                     userId: user.name,
//                     filename: currentFile.filename,
//                     roomId: currentFile.roomId,
//                     projectName: currentFile.projectName,
//                     code
//                 }),
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });
//         }
//     };
//
//     useEffect(() => {
//         if (currentFile.filename) {
//             wsRef.current = createWebSocketConnection();
//             return () => wsRef.current.deactivate();
//         }
//
//     }, [createWebSocketConnection, currentFile.filename]);
//
//
//     return { publishCodeChange, isConnected };
// };
//
// export default useWebSocketManager;


import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useState, useEffect, useRef, useCallback } from 'react';

const useWebSocketManager = (setCode, setMessages, user, currentFile, role) => {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);

    const createWebSocketConnection = useCallback(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket server');
                setIsConnected(true);

                // Subscribe to file updates for collaborative code editing
                stompClient.subscribe(`/topic/file/updates`, (message) => {
                    const data = JSON.parse(message.body);
                    if (
                        data.filename === currentFile.filename &&
                        data.roomId === currentFile.roomId &&
                        data.projectName === currentFile.projectName
                    ) {
                        setCode(data.code);
                    }
                });

                // Subscribe to chat messages
                stompClient.subscribe(`/topic/chat/${currentFile.roomId}`, (message) => {
                    const chatData = JSON.parse(message.body);

                    if (
                        chatData.filename === currentFile.filename &&
                        chatData.roomId === currentFile.roomId &&
                        chatData.projectName === currentFile.projectName
                    ) {
                        setMessages((prevMessages) => [...prevMessages, chatData]);
                    }

                });
            },
            onStompError: console.error,
            onDisconnect: () => console.log('Disconnected from WebSocket server'),
            connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        stompClient.activate();
        return stompClient;
    }, [setCode, setMessages, currentFile]);

    const publishCodeChange = (user, code) => {
        if (wsRef.current && isConnected) {
            wsRef.current.publish({
                destination: `/app/code/updates`,
                body: JSON.stringify({
                    userId: user.name,
                    filename: currentFile.filename,
                    roomId: currentFile.roomId,
                    projectName: currentFile.projectName,
                    code
                }),
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        }
    };

    const sendChatMessage = (chatMessage) => {
        if (wsRef.current && isConnected) {
            wsRef.current.publish({
                destination: `/app/chat/${currentFile.roomId}`,
                body: JSON.stringify(chatMessage),
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        }
    };

    useEffect(() => {
        if (currentFile.filename) {
            wsRef.current = createWebSocketConnection();
            return () => wsRef.current.deactivate();
        }
    }, [createWebSocketConnection, currentFile.filename]);

    return { publishCodeChange, sendChatMessage, isConnected };
};

export default useWebSocketManager;

