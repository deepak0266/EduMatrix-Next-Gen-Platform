// src/components/Chatbot/SuggestionChips.jsx
import React from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import styles from '../../styles/Chatbot/SuggestionChips.module.css'; 

const SuggestionChips = ({ suggestions }) => {
  const { sendMessage, currentMode } = useChatbot();
  
  return (
    <div className={`${styles.suggestionsContainer} ${styles[currentMode + 'Suggestions']}`}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className={styles.suggestionChip}
          onClick={() => sendMessage(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;