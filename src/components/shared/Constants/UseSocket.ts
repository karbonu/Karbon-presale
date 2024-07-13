// useSocketIO.ts
import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketMessage {
    event: string;
    data: any[];
}

const useSocketIO = (url: string) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [lastMessage, setLastMessage] = useState<SocketMessage | null>(null);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Connect to the Socket.IO server with more options
        socketRef.current = io(url, {
            transports: ['polling', 'websocket'], // Try polling first, then WebSocket
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            timeout: 20000,
            forceNew: true,
        });

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            setConnectionError(null);
            // console.log('Connected to Socket.IO server');
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
            // console.log('Disconnected from Socket.IO server:', reason);
        });

        socketRef.current.on('connect_error', (error) => {
            setConnectionError(error.message);
            // console.error('Connection error:', error);
        });

        // Listen for all events
        socketRef.current.onAny((eventName: string, ...args: any[]) => {
            // console.log(`Received event: ${eventName}`, args);
            setLastMessage({ event: eventName, data: args });
        });

        // Clean up on unmount
        return () => {
            socketRef.current?.disconnect();
        };
    }, [url]);
    // Function to emit events
    const emit = useCallback((eventName: string, data: any) => {
        if (socketRef.current) {
            socketRef.current.emit(eventName, data);
        }
    }, []);

    return { isConnected, lastMessage, emit, connectionError };
};

export default useSocketIO;