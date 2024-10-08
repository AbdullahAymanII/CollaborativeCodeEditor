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
//
//
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import { useState, useEffect, useRef, useCallback } from 'react';
//
// const useWebSocketManager = (setCode, setMessages, user, currentFile, role) => {
//     const [isConnected, setIsConnected] = useState(false);
//     const wsRef = useRef(null);
//
//     const createWebSocketConnection = useCallback(() => {
//         const socket = new SockJS('http://localhost:8080/ws');
//         const stompClient = new Client({
//             webSocketFactory: () => socket,
//             reconnectDelay: 5000,
//             onConnect: () => {
//                 console.log('Connected to WebSocket server');
//                 setIsConnected(true);
//
//                 // Subscribe to file updates for collaborative code editing
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
//                 // Subscribe to chat messages
//                 stompClient.subscribe(`/topic/chat/${currentFile.roomId}`, (message) => {
//                     const chatData = JSON.parse(message.body);
//
//                     if (
//                         chatData.filename === currentFile.filename &&
//                         chatData.roomId === currentFile.roomId &&
//                         chatData.projectName === currentFile.projectName
//                     ) {
//                         setMessages((prevMessages) => [...prevMessages, chatData]);
//                     }
//
//                 });
//             },
//             onStompError: console.error,
//             onDisconnect: () => console.log('Disconnected from WebSocket server'),
//             connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//
//         stompClient.activate();
//         return stompClient;
//     }, [setCode, setMessages, currentFile]);
//
//     const publishCodeChange = (user, code) => {
//         if (wsRef.current && isConnected) {
//             wsRef.current.publish({
//                 destination: `/app/code/updates`,
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
//     const sendChatMessage = (chatMessage) => {
//         if (wsRef.current && isConnected) {
//             wsRef.current.publish({
//                 destination: `/app/chat/${currentFile.roomId}`,
//                 body: JSON.stringify(chatMessage),
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
//     }, [createWebSocketConnection, currentFile.filename]);
//
//     return { publishCodeChange, sendChatMessage, isConnected };
// };
//
// export default useWebSocketManager;




////////////////////////////////////////////////////////////////////////////////////////////////////
//
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import { useState, useEffect, useRef, useCallback } from 'react';
// const useWebSocketManager = (setCode, setMessages, user, currentFile, role, liveEditing, room) => {
//     const [isConnected, setIsConnected] = useState(false);
//     const wsRef = useRef(null);
//
//     const createWebSocketConnection = useCallback(() => {
//         if (wsRef.current) return; // Prevent duplicate WebSocket connections
//
//         const socket = new SockJS('http://localhost:8080/ws');
//         const stompClient = new Client({
//             webSocketFactory: () => socket,
//             reconnectDelay: 5000,
//             onConnect: () => {
//                 setIsConnected(true);
//
//                 // Notify other users that this user has joined
//                 // const joinMessage = {
//                 //     sender: user.name,
//                 //     role: role,
//                 //     filename: currentFile.filename,
//                 //     roomId: currentFile.roomId,
//                 //     projectName: currentFile.projectName,
//                 // };
//                 //
//                 // if (stompClient.connected) {
//                 //     stompClient.publish({
//                 //         destination: `/app/user/join/${currentFile.roomId}`,
//                 //         body: JSON.stringify(joinMessage),
//                 //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 //     });
//                 // }
//
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
//                 stompClient.subscribe(`/topic/chat/${currentFile.roomId}`, (message) => {
//                     const chatData = JSON.parse(message.body);
//                     if (
//                         chatData.roomId === currentFile.roomId
//                     ) {
//                         setMessages((prev) => [...prev, chatData]);
//                         console.log(chatData);
//                     }
//                 });
//             },
//             onStompError: console.error,
//             onDisconnect: () => {
//                 setIsConnected(false);
//             },
//             connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//
//         stompClient.activate();
//         wsRef.current = stompClient; // Store WebSocket client in ref
//     }, [setCode, setMessages, currentFile]);
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
//     const sendChatMessage = (chatMessage) => {
//         if (wsRef.current && isConnected ) {
//             wsRef.current.publish({
//                 destination: `/app/chat/${currentFile.roomId}`,
//                 body: JSON.stringify(chatMessage),
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });
//         }
//     };
//
//     const sendActionMessage = (actionType) => {
//         if (wsRef.current && isConnected) {
//             const actionMessage = {
//                 content: `${user.name} performed a ${actionType} on ${currentFile.filename}`,
//                 sender: user.name,
//                 roomId: currentFile.roomId,
//                 projectName: currentFile.projectName,
//                 role: role,
//             };
//             sendChatMessage(actionMessage);
//         }
//     };
//
//     useEffect(() => {
//         if ( room.roomId && !wsRef.current) {
//             createWebSocketConnection();
//         }
//
//         return () => {
//             if (wsRef.current || !room.roomId ) {
//                 const leaveMessage = {
//                     sender: user.name,
//                     role: role,
//                     filename: currentFile.filename,
//                     roomId: currentFile.roomId,
//                     projectName: currentFile.projectName,
//                 };
//
//                 if (isConnected) {
//                     wsRef.current.publish({
//                         destination: `/app/user/leave/${currentFile.roomId}`,
//                         body: JSON.stringify(leaveMessage),
//                         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                     });
//                 }
//
//                 wsRef.current.deactivate(); // Clean up on unmount
//                 wsRef.current = null; // Reset reference
//             }
//         };
//     }, [createWebSocketConnection, currentFile.filename]);
//
//     return { publishCodeChange, sendChatMessage, sendActionMessage, isConnected };
// };
//
// export default useWebSocketManager;
//

//////////////////////////////////////////////////////////////////////////////////////////////////
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import { useState, useEffect, useRef, useCallback } from 'react';
//
// const useWebSocketManager = (setCode, setMessages, user, currentFile, role) => {
//     const [isConnected, setIsConnected] = useState(false);
//     const wsRef = useRef(null);
//
//     const createWebSocketConnection = useCallback(() => {
//         if (wsRef.current) return; // Ensure only one WebSocket connection
//
//         const socket = new SockJS('http://localhost:8080/ws');
//         const stompClient = new Client({
//             webSocketFactory: () => socket,
//             reconnectDelay: 5000,
//             onConnect: () => {
//                 if (isConnected) return; // Prevent multiple subscriptions on reconnect
//                 setIsConnected(true);
//
//                 // Subscribe to file updates
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
//                 // Subscribe to chat messages
//                 stompClient.subscribe(`/topic/chat/${currentFile.roomId}`, (message) => {
//                     const chatData = JSON.parse(message.body);
//                     if (
//                         chatData.filename === currentFile.filename &&
//                         chatData.roomId === currentFile.roomId &&
//                         chatData.projectName === currentFile.projectName
//                     ) {
//                         setMessages((prev) => [...prev, chatData]);
//                     }
//                 });
//             },
//             onStompError: (error) => {
//                 console.error('STOMP error:', error);
//             },
//             onWebSocketClose: () => {
//                 console.warn('WebSocket connection closed');
//                 setIsConnected(false);
//             },
//             onDisconnect: () => setIsConnected(false),
//             connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//
//         stompClient.activate();
//         wsRef.current = stompClient; // Store WebSocket client in ref
//     }, [setCode, setMessages, currentFile, isConnected]);
//
//     useEffect(() => {
//         if (currentFile.filename && !wsRef.current) {
//             createWebSocketConnection();
//         }
//         return () => {
//             if (wsRef.current) {
//                 wsRef.current.deactivate(); // Clean up WebSocket connection on unmount
//                 wsRef.current = null;
//             }
//         };
//     }, [createWebSocketConnection, currentFile.filename]);
//
//     const sendChatMessage = (chatMessage) => {
//         if (wsRef.current && isConnected) {
//             try {
//                 wsRef.current.publish({
//                     destination: `/app/chat/${currentFile.roomId}`,
//                     body: JSON.stringify(chatMessage),
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//                 });
//             } catch (error) {
//                 console.error("Error while sending message:", error);
//             }
//         } else {
//             console.warn('Cannot send message: No active WebSocket connection.');
//         }
//     };
//
//     const publishCodeChange = (user, code) => {
//         if (wsRef.current && isConnected) {
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
//         } else {
//             console.warn('Cannot publish code change: No active WebSocket connection.');
//         }
//     };
//
//     // Send join message when a user connects
//     useEffect(() => {
//         if (isConnected) {
//             const joinMessage = {
//                 content: `${user.name} (${role}) has joined the room.`,
//                 sender: user.name,
//                 role: role,
//                 filename: currentFile.filename,
//                 roomId: currentFile.roomId,
//                 projectName: currentFile.projectName,
//                 timestamp: Date.now(),
//             };
//             sendChatMessage(joinMessage);
//         }
//     }, [user, role, currentFile, sendChatMessage, isConnected]);
//
//     // Handle user leaving
//     useEffect(() => {
//         const handleLeave = () => {
//             if (isConnected) {
//                 const leaveMessage = {
//                     content: `${user.name} (${role}) has left the room.`,
//                     sender: user.name,
//                     role: role,
//                     filename: currentFile.filename,
//                     roomId: currentFile.roomId,
//                     projectName: currentFile.projectName,
//                     timestamp: Date.now(),
//                 };
//                 sendChatMessage(leaveMessage); // Send leave notification
//             }
//         };
//
//         window.addEventListener('beforeunload', handleLeave);
//         return () => {
//             window.removeEventListener('beforeunload', handleLeave);
//         };
//     }, [user, role, currentFile, sendChatMessage, isConnected]);
//
//     return { sendChatMessage, publishCodeChange, isConnected };
// };
//
// export default useWebSocketManager;