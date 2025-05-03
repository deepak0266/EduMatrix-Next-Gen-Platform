// src/components/Chatbot/ChatHistory.jsx
import React, { useRef, useEffect } from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import ChatMessage from './ChatMessage';
import styles from '../../styles/Chatbot/ChatHistory.module.css'; 

const ChatHistory = () => {
  const { messages, currentMode } = useChatbot();
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className={`${styles.chatHistoryContainer} ${styles[currentMode + 'History']}`}>
      {messages.map((message, index) => (
        <ChatMessage 
          key={index} 
          message={message} 
          isConsecutive={index > 0 && messages[index-1].type === message.type}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatHistory;