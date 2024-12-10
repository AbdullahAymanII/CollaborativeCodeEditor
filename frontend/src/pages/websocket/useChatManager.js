import { useCallback } from 'react';

const useChatManager = (wsRef, isConnected, currentFile, setMessages, user, role, room) => {
    // Subscribe to chat callback
    const subscribeToChat = useCallback(() => {

        if (isConnected && wsRef.current) {

            wsRef.current.subscribe(`/topic/chat/${room.roomId}`, (message) => {
                const chatData = JSON.parse(message.body);
                if (chatData.roomId === room.roomId) {
                    setMessages((prevMessages) => [...prevMessages, chatData]);
                }

            });
        } else {
            console.log('Cannot subscribe to chat, WebSocket is not connected.');
        }
    }, [isConnected, wsRef, room, setMessages]);

    const sendChatMessage = useCallback((chatMessage) => {
        if (wsRef.current && isConnected) {

            wsRef.current.publish({
                destination: `/app/chat/${room.roomId}`,
                body: JSON.stringify(chatMessage),
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } else {
            console.log('Cannot send message, WebSocket is not connected.');
        }
    }, [wsRef, isConnected, room]);

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
