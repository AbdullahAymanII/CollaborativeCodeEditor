// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import { useState, useRef, useCallback } from 'react';
//
// const useWebSocketManager = (setCode, setMessages, user, currentFile, role, liveEditing, room) => {
//     const [isConnected, setIsConnected] = useState(false);
//     const wsRef = useRef(null);
//
//     // Create WebSocket session manually
//     const createWebSocketConnection = useCallback(() => {
//         if (wsRef.current) return; // Prevent duplicate WebSocket connections
//
//         const socket = new SockJS('http://localhost:8080/ws');
//         const stompClient = new Client({
//             webSocketFactory: () => socket,
//             reconnectDelay: 5000,
//             onConnect: () => {
//                 setIsConnected(true);
//                 console.log('Connected to WebSocket');
//
//                 // Subscribe to code updates
//                 stompClient.subscribe(`/topic/file/updates`, (message) => {
//                     const data = JSON.parse(message.body);
//                     if (data.filename === currentFile.filename && data.roomId === currentFile.roomId) {
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
//             onStompError: (error) => {
//                 console.error('STOMP error:', error);
//             },
//             onDisconnect: () => {
//                 setIsConnected(false);
//                 console.log('WebSocket disconnected');
//             },
//             connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//
//         stompClient.activate();
//         wsRef.current = stompClient; // Store WebSocket client in ref
//     }, [setCode, setMessages, currentFile]);
//
//     // Close WebSocket session manually
//     const closeWebSocketConnection = useCallback(() => {
//         if (wsRef.current && isConnected) {
//             console.log('Closing WebSocket connection...');
//             wsRef.current.deactivate(); // Disconnect the WebSocket
//             wsRef.current = null; // Reset the WebSocket reference
//             setIsConnected(false); // Update connection state
//         }
//     }, [isConnected]);
//
//     // Send code updates
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
//     // Send chat message
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
//         const sendActionMessage = (actionType) => {
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
//     return {
//         createWebSocketConnection, // Function to manually create WebSocket session
//         closeWebSocketConnection,  // Function to manually terminate WebSocket session
//         publishCodeChange,         // Function to publish code changes
//         sendChatMessage,           // Function to send chat messages
//         sendActionMessage,       // Function to send action messages (e.g., file creation, deletion)
//         isConnected,               // WebSocket connection state
//     };
// };
//
// export default useWebSocketManager;



