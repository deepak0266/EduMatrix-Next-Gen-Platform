// src/components/Chatbot/ModeSwitcher.jsx
import React from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import styles from '../../styles/Chatbot/ModeSwitcher.module.css'; 

const ModeSwitcher = () => {
  const { currentMode, switchMode } = useChatbot();
  
  return (
    <div className={styles.modeSwitcherContainer}>
      <button 
        className={`${styles.modeButton} ${currentMode === 'study' ? styles.activeMode : ''}`}
        onClick={() => switchMode('study')}
        aria-label="Switch to study mode"
      >
        <span className={styles.modeIcon}>📚</span>
        <span className={styles.modeLabel}>Study</span>
      </button>
      
      <button 
        className={`${styles.modeButton} ${currentMode === 'game' ? styles.activeMode : ''}`}
        onClick={() => switchMode('game')}
        aria-label="Switch to game mode"
      >
        <span className={styles.modeIcon}>🎮</span>
        <span className={styles.modeLabel}>Game</span>
      </button>
      
      <button 
        className={`${styles.modeButton} ${currentMode === 'music' ? styles.activeMode : ''}`}
        onClick={() => switchMode('music')}
        aria-label="Switch to music mode"
      >
        <span className={styles.modeIcon}>🎵</span>
        <span className={styles.modeLabel}>Music</span>
      </button>
    </div>
  );
};

export default ModeSwitcher;