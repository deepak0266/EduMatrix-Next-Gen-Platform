import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Changed from user to currentUser
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [lastMoodCheck, setLastMoodCheck] = useState(null);
  
  // Load mood data from localStorage when component mounts
  useEffect(() => {
    if (currentUser) { // Changed from user to currentUser
      try {
        const savedMood = localStorage.getItem(`mood_${currentUser.uid}`);
        const savedHistory = localStorage.getItem(`moodHistory_${currentUser.uid}`);
        const savedLastCheck = localStorage.getItem(`lastMoodCheck_${currentUser.uid}`);
        
        if (savedMood) setCurrentMood(JSON.parse(savedMood));
        if (savedHistory) setMoodHistory(JSON.parse(savedHistory));
        if (savedLastCheck) setLastMoodCheck(JSON.parse(savedLastCheck));
      } catch (error) {
        console.error("Error loading mood data:", error);
      }
    } else {
      // Reset states if no user is logged in
      setCurrentMood(null);
      setMoodHistory([]);
      setLastMoodCheck(null);
    }
  }, [currentUser]); // Changed from user to currentUser
  
  // Update mood and save to localStorage
  const updateMood = (mood) => {
    if (!currentUser) return; // Changed from user to currentUser
    
    const timestamp = new Date().toISOString();
    const newMood = { mood, timestamp };
    
    // Update current mood
    setCurrentMood(newMood);
    
    // Add to history (keeping last 10 entries)
    setMoodHistory(prevHistory => {
      const updatedHistory = [newMood, ...prevHistory].slice(0, 10);
      return updatedHistory;
    });
    
    // Update last check time
    setLastMoodCheck(timestamp);
    
    // Save to localStorage
    try {
      localStorage.setItem(`mood_${currentUser.uid}`, JSON.stringify(newMood));
      localStorage.setItem(`moodHistory_${currentUser.uid}`, JSON.stringify([newMood, ...moodHistory].slice(0, 10)));
      localStorage.setItem(`lastMoodCheck_${currentUser.uid}`, JSON.stringify(timestamp));
    } catch (error) {
      console.error("Error saving mood data:", error);
    }
  };
  
  // Get current mood label
  const getMoodLabel = () => {
    if (!currentMood) return null;
    
    const moodLabels = {
      'focused': '😊 Focused',
      'tired': '😴 Tired',
      'distracted': '🎮 Distracted',
      'confused': '😕 Confused'
    };
    
    return moodLabels[currentMood.mood] || currentMood.mood;
  };
  
  // Get appropriate recommendations based on current mood
  const getMoodRecommendations = () => {
    if (!currentMood) return [];
    
    const recommendations = {
      'focused': [
        'Keep up the good work!',
        'Consider setting a timer for focused study sessions',
        'Take short breaks every 25-30 minutes'
      ],
      'tired': [
        'Try some relaxing background music',
        'Take a short power nap (15-20 minutes)',
        'Consider a quick stretching break'
      ],
      'distracted': [
        'Try a quick game to reset your focus',
        'Use the Pomodoro timer to structure your work',
        'Consider changing your study environment'
      ],
      'confused': [
        'Use the chatbot to ask specific questions',
        'Break down complex topics into smaller parts',
        'Try explaining the concept in your own words'
      ]
    };
    
    return recommendations[currentMood.mood] || [];
  };
  
  return (
    <MoodContext.Provider value={{
      currentMood,
      moodHistory,
      lastMoodCheck,
      updateMood,
      getMoodLabel,
      getMoodRecommendations
    }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};