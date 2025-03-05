// src/utils/timeTracker.js
// Utility to track time spent on documents

// Mock storage for time tracking data
let timeTrackingData = {};

/**
 * Track the time spent viewing a document
 * @param {string} documentId - ID of the document being viewed
 * @param {Date} startTime - When the viewing session started
 * @param {Date} endTime - When the viewing session ended
 */
export const trackViewTime = (documentId, startTime, endTime) => {
  // Calculate duration in seconds
  const durationSeconds = Math.floor((endTime - startTime) / 1000);
  
  // Ignore very short sessions (less than 2 seconds)
  if (durationSeconds < 2) return;
  
  // Get existing data for this document
  const existingData = timeTrackingData[documentId] || {
    totalTimeSeconds: 0,
    sessions: []
  };
  
  // Add new session
  const newSession = {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    durationSeconds
  };
  
  // Update tracking data
  timeTrackingData[documentId] = {
    totalTimeSeconds: existingData.totalTimeSeconds + durationSeconds,
    sessions: [...existingData.sessions, newSession]
  };
  
  // Store in localStorage (in a real app)
  try {
    // Only store the aggregated data to save space
    const storedData = {
      ...timeTrackingData
    };
    localStorage.setItem('edumatrix_time_tracking', JSON.stringify(storedData));
  } catch (error) {
    console.error('Error saving time tracking data:', error);
  }
  
  // For debugging
  console.log(`Tracked ${durationSeconds}s viewing document ${documentId}`);
};

/**
 * Get time tracking data for a specific document
 * @param {string} documentId - ID of the document
 * @returns {Object} Time tracking data for the document
 */
export const getDocumentViewTime = (documentId) => {
  return timeTrackingData[documentId] || { totalTimeSeconds: 0, sessions: [] };
};

/**
 * Get total view time for all documents
 * @returns {Object} Summary of view time across all documents
 */
export const getTotalViewTime = () => {
  let totalSeconds = 0;
  let documentCount = 0;
  
  Object.values(timeTrackingData).forEach(data => {
    totalSeconds += data.totalTimeSeconds;
    documentCount += 1;
  });
  
  return {
    totalSeconds,
    formattedTime: formatTime(totalSeconds),
    documentCount
  };
};

/**
 * Format seconds into a human-readable string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
};

// Initialize from localStorage if available
try {
  const storedData = localStorage.getItem('edumatrix_time_tracking');
  if (storedData) {
    timeTrackingData = JSON.parse(storedData);
  }
} catch (error) {
  console.error('Error loading time tracking data:', error);
}