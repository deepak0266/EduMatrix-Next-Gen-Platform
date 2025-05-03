// src/components/Chatbot/ChatInput.jsx
import React, { useState } from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import styles from '../../styles/Chatbot/ChatInput.module.css'; 

const ChatInput = ({ isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const { sendMessage, currentMode } = useChatbot();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };
  
  return (
    <form 
      className={`${styles.inputContainer} ${styles[currentMode + 'Input']}`}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={`Ask ${currentMode} assistant...`}
        className={styles.chatInput}
        disabled={isLoading}
      />
      
      <button 
        type="submit" 
        className={`${styles.sendButton} ${isLoading ? styles.loading : ''}`}
        disabled={isLoading || !inputValue.trim()}
      >
        {isLoading ? (
          <div className={styles.loadingSpinner} />
        ) : (
          <span className={styles.sendIcon}>➤</span>
        )}
      </button>
    </form>
  );
};

export default ChatInput;