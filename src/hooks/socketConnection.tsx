import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { imageUrl } from '../redux/base/baseAPI';


export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create socket connection with URL sanitization
    const targetUrl = (imageUrl || 'http://localhost:4002').replace(/^(https?:\/\/)+/, (match: string) => match.includes('https') ? 'https://' : 'http://');

    socketRef.current = io(targetUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return socketRef.current;
};