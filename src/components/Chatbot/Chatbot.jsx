// src/components/Chatbot/Chatbot.jsx
import React, { useState } from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ModeSwitcher from './ModeSwitcher';
import styles from '../../styles/Chatbot/Chatbot.module.css'; 

const Chatbot = () => {
  const { currentMode, isLoading } = useChatbot();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    <div className={`${styles.chatbotContainer} ${styles[currentMode]} ${isMinimized ? styles.minimized : ''} ${isExpanded ? styles.expanded : ''}`}>
      {isMinimized ? (
        <div className={styles.chatbotButton} onClick={toggleMinimized}>
          <div className={`${styles.chatbotIcon} ${styles[currentMode + 'Icon']}`}>
            {currentMode === 'study' && '📚'}
            {currentMode === 'game' && '🎮'}
            {currentMode === 'music' && '🎵'}
          </div>
        </div>
      ) : (
        <>
          <div className={styles.chatbotHeader}>
            <div className={styles.headerModeIndicator}>
              <span className={styles.modeIcon}>
                {currentMode === 'study' && '📚'}
                {currentMode === 'game' && '🎮'}
                {currentMode === 'music' && '🎵'}
              </span>
              <span className={styles.modeTitle}>
                {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Assistant
              </span>
            </div>
            <div className={styles.headerControls}>
              <button 
                className={styles.expandButton} 
                onClick={toggleExpanded}
                aria-label={isExpanded ? "Collapse chatbot" : "Expand chatbot"}
              >
                {isExpanded ? '⊙' : '⊕'}
              </button>
              <button 
                className={styles.minimizeButton} 
                onClick={toggleMinimized}
                aria-label="Minimize chatbot"
              >
                −
              </button>
            </div>
          </div>
          
          <ModeSwitcher />
          
          <div className={styles.chatbotBody}>
            <ChatHistory />
          </div>
          
          <div className={styles.chatbotFooter}>
            <ChatInput isLoading={isLoading} />
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;