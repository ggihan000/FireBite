import React, { useState, useEffect, useRef } from 'react';
import './Message.css';
import { FaRegComment } from "react-icons/fa";

const HumanMessage = ({ msg }) => (
  <div className="message human-message">
    {msg}
  </div>
);

const AssistantMessage = ({ msg }) => (
  <div className="message assistant-message">
    {msg}
  </div>
);

const Popup = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const ws = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found in localStorage");
      setMessages([{ text: "Authentication error: No token found", sender: "error" }]);
      return;
    }

    ws.current = new WebSocket('ws://localhost:5000');

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      
      // Send authentication
      setTimeout(() => {
            ws.current.send(JSON.stringify({
            type: "auth",
            token: "Bearer " + token
            }));
        }, 200);
      
      setMessages([{ text: "Hi again! How can I assist you today? If you have any questions or need help with something, feel free to ask!", sender: "ai" }]);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "auth_success") {
          //setMessages([{ text: "Authenticated successfully", sender: "ai" }]);
          return;
        }
        
        if (data.type === "auth_failure") {
          setMessages([{ text: "Authentication failed", sender: "error" }]);
          return;
        }
        
        if (data.message) {
          setMessages(prev => [...prev, { text: data.message, sender: "ai" }]);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
        setMessages(prev => [...prev, { 
          text: "Error processing message", 
          sender: "error" 
        }]);
      } finally {
        // Always turn off loading when we get a response
        setIsLoading(false);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setMessages(prev => [...prev, { 
        text: "Connection error", 
        sender: "error" 
      }]);
      setIsLoading(false);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      setIsLoading(false);
    };

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim() || !ws.current || isLoading) return;

    // Add human message to UI
    const newMessage = { text: inputText, sender: "human" };
    setMessages(prev => [...prev, newMessage]);
    
    // Clear input and show loading
    setInputText('');
    setIsLoading(true);
    
    try {
      ws.current.send(JSON.stringify({ 
        type: "message", 
        content: inputText 
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        text: "Failed to send message", 
        sender: "error" 
      }]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="chat-container" ref={chatContainerRef}>
          {messages.map((msg, index) => {
            if (msg.sender === "human") {
              return <HumanMessage key={index} msg={msg.text} />;
            } else if (msg.sender === "ai") {
              return <AssistantMessage key={index} msg={msg.text} />;
            } else {
              return <div key={index} className="error-message">{msg.text}</div>;
            }
          })}
          
          {/* Loading indicator when waiting for AI response */}
          {isLoading && (
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
        </div>
        <div className="input-area">
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            onClick={sendMessage} 
            disabled={!inputText.trim() || isLoading}
          >
            Send
          </button>
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

function Message() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openMessagePopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="message-button-container">
      <button className="open-popup-btn" onClick={openMessagePopup}><FaRegComment className="message-icon" /></button>
      {isPopupOpen && <Popup onClose={closePopup} />}
    </div>
  );
}

export default Message;