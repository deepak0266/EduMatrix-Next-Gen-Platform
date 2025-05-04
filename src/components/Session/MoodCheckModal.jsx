// src/components/Session/MoodCheckModal.jsx
import React, { useEffect, useState } from 'react';
import styles from './MoodCheckModal.module.css';

const MoodCheckModal = ({ onMoodSelect, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Mood options with emoji, label, mood value, and redirect path
  const moodOptions = [
    { emoji: '😊', label: 'Focused', mood: 'focused', path: '/study' },
    { emoji: '😴', label: 'Tired', mood: 'tired', path: '/music' },
    { emoji: '🎮', label: 'Distracted', mood: 'distracted', path: '/games' },
    { emoji: '😕', label: 'Confused', mood: 'confused', path: '/chatbot' }
  ];
  
  useEffect(() => {
    // Set a small timeout to allow for the animation to work
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    // Cleanup
    return () => clearTimeout(timer);
  }, []);
  
  // Handle background click (close without selection)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  // Close modal with animation
  const handleClose = () => {
    setIsVisible(false);
    
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      onClose();
    }, 300); // Match the animation duration
  };
  
  // Handle mood selection
  const handleMoodSelect = (path, mood) => {
    setIsVisible(false);
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      onMoodSelect(path, mood);
    }, 300); // Match the animation duration
  };
  
  return (
    <div 
      className={`${styles.modalBackdrop} ${isVisible ? styles.visible : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`${styles.modalContent} ${isVisible ? styles.slideUp : ''}`}>
        <div className={styles.modalHeader}>
          <h2>How are you feeling?</h2>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>
        
        <div className={styles.moodOptionsContainer}>
          {moodOptions.map((option, index) => (
            <button
              key={index}
              className={styles.moodOption}
              onClick={() => handleMoodSelect(option.path, option.mood)}
            >
              <span className={styles.emoji}>{option.emoji}</span>
              <span className={styles.label}>{option.label}</span>
            </button>
          ))}
        </div>
        
        <div className={styles.modalFooter}>
          <p>We'll redirect you to the most helpful resources</p>
        </div>
      </div>
    </div>
  );
};

export default MoodCheckModal;