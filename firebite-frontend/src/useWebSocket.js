import { useEffect, useRef, useState } from 'react';

export default function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    // Create WebSocket connection
    wsRef.current = new WebSocket(url);

    // Connection opened
    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    // Listen for messages
    wsRef.current.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };

    // Connection closed
    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    // Clean up on unmount
    return () => {
      wsRef.current.close();
    };
  }, [url]);

  // Send message function
  const sendMessage = (message) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(message);
    }
  };

  return { messages, sendMessage, isConnected };
}