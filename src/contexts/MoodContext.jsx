import React, { createContext, useState, useContext, useEffect } from 'react';

const MoodContext = createContext();

export function useMood() {
  return useContext(MoodContext);
}

export function MoodProvider({ children }) {
  const [currentMood, setCurrentMood] = useState('focused');
  const [studyTime, setStudyTime] = useState(0);
  const [showRecommendation, setShowRecommendation] = useState(false);
  
  // Timer to track continuous study time
  useEffect(() => {
    let timer;
    if (currentMood === 'focused') {
      timer = setInterval(() => {
        setStudyTime(prevTime => {
          const newTime = prevTime + 1;
          // Show recommendations after 30 minutes of study
          if (newTime >= 30 && !showRecommendation) {
            setShowRecommendation(true);
          }
          return newTime;
        });
      }, 60000); // Update every minute
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentMood, showRecommendation]);
  
  // Reset study time when mood changes
  useEffect(() => {
    if (currentMood !== 'focused') {
      setStudyTime(0);
      setShowRecommendation(false);
    }
  }, [currentMood]);
  
  const value = {
    currentMood,
    setCurrentMood,
    studyTime,
    showRecommendation,
    setShowRecommendation
  };
  
  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
}