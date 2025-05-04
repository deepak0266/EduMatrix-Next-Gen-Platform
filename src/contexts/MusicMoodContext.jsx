import React, { createContext, useState } from 'react';

// Create the context
export const MusicMoodContext = createContext();

// Create a provider component
export const MusicMoodProvider = ({ children }) => {
  const [mood, setMood] = useState(null);

  // Value to be provided to consuming components
  const contextValue = {
    mood,
    setMood,
  };

  return (
    <MusicMoodContext.Provider value={contextValue}>
      {children}
    </MusicMoodContext.Provider>
  );
};

export default MusicMoodProvider;