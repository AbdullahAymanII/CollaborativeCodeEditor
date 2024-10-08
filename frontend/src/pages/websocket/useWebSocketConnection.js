// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import { useRef, useState, useEffect } from 'react';
//
// export const useWebSocketConnection = (setIsConnected, setCode, setMessages, user, currentFile, room, role) => {
//     const wsRef = useRef(null);
//
//     const createWebSocketConnection = () => {
//         if (wsRef.current) return;
//
//         const socket = new SockJS('http://localhost:8080/ws');
//         const stompClient = new Client({
//             webSocketFactory: () => socket,
//             reconnectDelay: 1000,
//             onConnect: () => {
//                 setIsConnected(true);
//
//                 // Subscribe to code updates
//                 stompClient.subscribe(`/topic/file/updates`, (message) => {
//                     const data = JSON.parse(message.body);
//                     if (
//                         data.filename === currentFile.filename &&
//                         data.roomId === currentFile.roomId &&
//                         data.projectName === currentFile.projectName
//                     ) {
//                         setCode(data.code);
//                     }
//                 });
//
//                 // Subscribe to chat updates
//                 stompClient.subscribe(`/topic/chat/${currentFile.roomId}`, (message) => {
//                     const chatData = JSON.parse(message.body);
//                     if (chatData.roomId === currentFile.roomId) {
//                         setMessages((prev) => [...prev, chatData]);
//                     }
//                 });
//             },
//             onStompError: console.error,
//             onDisconnect: () => setIsConnected(false),
//             connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//
//         stompClient.activate();
//         wsRef.current = stompClient;
//     };
//
//     useEffect(() => {
//         if (room.roomId && !wsRef.current) {
//             createWebSocketConnection();
//         }
//
//         return () => {
//             if (wsRef.current) {
//                 const leaveMessage = {
//                     sender: user.name,
//                     role,
//                     filename: currentFile.filename,
//                     roomId: currentFile.roomId,
//                     projectName: currentFile.projectName,
//                 };
//
//                 if (wsRef.current.connected) {
//                     wsRef.current.publish({
//                         destination: `/app/user/leave/${currentFile.roomId}`,
//                         body: JSON.stringify(leaveMessage),
//                         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                     });
//                 }
//
//                 wsRef.current.deactivate();
//                 wsRef.current = null;
//             }
//         };
//     }, [ room.roomId ]);
//
//     return wsRef;
// };

import { useState, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const useWebSocketConnection = () => {
    const wsRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const createWebSocketConnection = useCallback(() => {
        console.log('trying Connected to WebSocket');
        if (wsRef.current) return; // Prevent duplicate WebSocket connections

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                setIsConnected(true);
                console.log('Connected to WebSocket');
            },
            onStompError: (error) => {
                console.error('STOMP error:', error);
            },
            onDisconnect: () => {
                setIsConnected(false);
                console.log('WebSocket disconnected');
            },
            connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        stompClient.activate();
        wsRef.current = stompClient; // Store WebSocket client in ref
        console.log('WebSocket connected');
    }, [isConnected, setIsConnected, wsRef, wsRef]);

    const closeWebSocketConnection = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.deactivate();
            wsRef.current = null;
            setIsConnected(false);
            console.log('WebSocket connection closed');
        }
    }, [isConnected, setIsConnected, wsRef, wsRef]);

    return {wsRef, isConnected, createWebSocketConnection, closeWebSocketConnection };
};

export default useWebSocketConnection;



