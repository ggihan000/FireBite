import { useEffect, useCallback, useRef } from 'react';

export default function useWebSocket(onMessage) {
  const wsRef = useRef(null);
  
  const send = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);
  
  useEffect(() => {
    // Get token from storage
    const token = localStorage.getItem('token');
    
    // Create WebSocket connection
    const ws = new WebSocket(`ws://localhost:5000`);
    
    // Add token to headers after connection opens
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'auth',
        token
      }));
    };
    
    // Handle incoming messages
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        onMessage(message);
      } catch (err) {
        console.error('Invalid message format', event.data);
      }
    };
    
    wsRef.current = ws;
    
    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [onMessage]);
  
  return { send };
}