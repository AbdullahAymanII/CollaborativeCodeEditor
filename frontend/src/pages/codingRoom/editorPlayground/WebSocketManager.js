import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useState, useEffect, useRef, useCallback } from 'react';

const useWebSocketManager = (setCode, user, lockLine) => {
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

                stompClient.subscribe('/topic/code', (message) => {
                    const data = JSON.parse(message.body);
                    setCode(data.code);
                });

                stompClient.subscribe('/topic/cursor', (message) => {
                    const data = JSON.parse(message.body);
                    lockLine(data.lineNumber);
                });
            },
            onStompError: console.error,
            onDisconnect: () => console.log('Disconnected from WebSocket server'),
            connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        stompClient.activate();
        return stompClient;
    }, [setCode, lockLine]);

    useEffect(() => {
        wsRef.current = createWebSocketConnection();
        return () => wsRef.current.deactivate();
    }, [createWebSocketConnection]);

    const publishCodeChange = (code) => {
        if (wsRef.current && isConnected) {
            wsRef.current.publish({
                destination: '/app/code',
                body: JSON.stringify({ userId:user.name, code }),
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        }
    };

    const publishCursorChange = (userId, lineNumber) => {
        if (wsRef.current && isConnected) {
            wsRef.current.publish({
                destination: '/app/cursor',
                body: JSON.stringify({ userId:user.name, lineNumber }),
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        }
    };

    return { publishCodeChange, publishCursorChange, isConnected };
};

export default useWebSocketManager;
