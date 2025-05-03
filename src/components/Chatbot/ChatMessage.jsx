// src/components/Chatbot/ChatMessage.jsx
import React from 'react';
import styles from '../../styles/Chatbot/ChatMessage.module.css'; 
import SuggestionChips from './SuggestionChips';
import { formatMessageContent } from '../../utils/messageFormatter';

const ChatMessage = ({ message, isConsecutive }) => {
  const { type, content, mode, suggestions, error } = message;
  
  // Determine message style classes
  const messageClasses = [
    styles.messageContainer,
    styles[`${type}Message`],
    styles[`${mode}Theme`],
    isConsecutive ? styles.consecutiveMessage : '',
    error ? styles.errorMessage : ''
  ].join(' ');
  
  // Format content based on mode and message type
  const formattedContent = formatMessageContent(content, mode);
  
  // Render avatar based on message type and mode
  const renderAvatar = () => {
    if (isConsecutive) return null;
    
    if (type === 'user') {
      return <div className={styles.userAvatar}>👤</div>;
    }
    
    if (type === 'bot') {
      return (
        <div className={`${styles.botAvatar} ${styles[mode + 'Avatar']}`}>
          {mode === 'study' && '📚'}
          {mode === 'game' && '🎮'}
          {mode === 'music' && '🎵'}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className={messageClasses}>
      {renderAvatar()}
      
      <div className={styles.messageContent}>
        <div 
          className={styles.messageText}
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
        
        {type === 'bot' && suggestions && suggestions.length > 0 && (
          <SuggestionChips suggestions={suggestions} />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;