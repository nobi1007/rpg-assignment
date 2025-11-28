import { io } from 'socket.io-client';

export const socket = io('http://localhost:3200', {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
});

socket.on('connect', () => {
    console.log('WebSocket connected:', socket.id);
});

socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
});

socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
});
