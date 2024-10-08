// const useChatManager = (wsRef, isConnected, currentFile, setMessages, user, role, room) => {
//     const subscribeToChat = () => {
//         console.log('subscribe to chat');
//         if (isConnected) {
//             console.log('subscribe to chat');
//             wsRef.current.subscribe(`/topic/chat/${room.roomId}`, (message) => {
//                 const chatData = JSON.parse(message.body);
//                 if (chatData.roomId === room.roomId) {
//                     setMessages((prev) => [...prev, chatData]);
//                 }
//                 console.log('subscribe to chatttttttttttttttttttttttttttttt');
//             });
//
//         }
//     };
//
//     const sendChatMessage = (chatMessage) => {
//         if (wsRef.current && isConnected) {
//             console.log('sendChatMessage');
//             console.log(chatMessage);
//             wsRef.current.publish({
//                 destination: `/app/chat/${room.roomId}`,
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
//     return { subscribeToChat, sendChatMessage, sendActionMessage };
// };
//
// export default useChatManager;


import { useCallback } from 'react';

const useChatManager = (wsRef, isConnected, currentFile, setMessages, user, role, room) => {
    // Subscribe to chat callback
    const subscribeToChat = useCallback(() => {
        console.log('Subscribing to chat...');
        console.log(isConnected);
        console.log('Subscribing to chat...');
        if (isConnected && wsRef.current) {
            console.log('Subscribing to chat...');

            wsRef.current.subscribe(`/topic/chat/${room.roomId}`, (message) => {
                const chatData = JSON.parse(message.body);
                if (chatData.roomId === room.roomId) {
                    setMessages((prevMessages) => [...prevMessages, chatData]);
                }
                console.log('Chat message received:', chatData);
            });
        } else {
            console.log('Cannot subscribe to chat, WebSocket is not connected.');
        }
    }, [isConnected, wsRef, room, setMessages]); // Memoize the callback to avoid re-creating it on every render

    // Send a chat message
    const sendChatMessage = useCallback((chatMessage) => {
        if (wsRef.current && isConnected) {
            console.log('Sending chat message:', chatMessage);

            wsRef.current.publish({
                destination: `/app/chat/${room.roomId}`,
                body: JSON.stringify(chatMessage),
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } else {
            console.log('Cannot send message, WebSocket is not connected.');
        }
    }, [wsRef, isConnected, room]);

    // Send an action message (such as file save or other user actions)
    const sendActionMessage = useCallback((actionType) => {
        if (wsRef.current && isConnected) {
            const actionMessage = {
                content: `${user.name} performed a ${actionType} on ${currentFile.filename}`,
                sender: user.name,
                roomId: currentFile.roomId,
                projectName: currentFile.projectName,
                role: role,
                type: actionType,
            };
            sendChatMessage(actionMessage);
        } else {
            console.log('Cannot send action message, WebSocket is not connected.');
        }
    }, [wsRef, isConnected, user, currentFile, role, sendChatMessage]);

    return { subscribeToChat, sendChatMessage, sendActionMessage };
};

export default useChatManager;
