import { useState, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const useWebSocketConnection = () => {
    const wsRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const createWebSocketConnection = useCallback(() => {
        console.log('trying Connected to WebSocket');
        if (wsRef.current) return;

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



