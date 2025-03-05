// src/utils/formatters.js
// Utility functions for formatting data

/**
 * Format a date string into a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  /**
   * Format file size in bytes to a human-readable string
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  export const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  };
  
  /**
   * Format a duration in seconds to a human-readable string
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration
   */
  export const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingSeconds = seconds % 3600;
      const minutes = Math.floor(remainingSeconds / 60);
      return `${hours}h ${minutes}m`;
    }
  };
  
  /**
   * Truncate text to a specific length with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };
  
  /**
   * Format a percentage value
   * @param {number} value - Percentage value
   * @returns {string} Formatted percentage
   */
  export const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };