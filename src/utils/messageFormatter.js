// src/utils/messageFormatter.js
import DOMPurify from 'dompurify';

export const formatMessageContent = (content, mode) => {
  if (!content) return '';
  
  // Sanitize content first
  let sanitized = DOMPurify.sanitize(content);
  
  // Apply mode-specific formatting
  switch(mode) {
    case 'study':
      return formatStudyContent(sanitized);
    case 'game':
      return formatGameContent(sanitized);
    case 'music':
      return formatMusicContent(sanitized);
    default:
      return sanitized;
  }
};

const formatStudyContent = (content) => {
  // Process <math> tags
  let formatted = content.replace(/<math>(.*?)<\/math>/g, (match, p1) => {
    return `<span class="math-formula">${p1}</span>`;
  });
  
  // Process <citation> tags
  formatted = formatted.replace(/<citation>(.*?)<\/citation>/g, (match, p1) => {
    return `<span class="citation">${p1}</span>`;
  });
  
  // Process <term> tags
  formatted = formatted.replace(/<term>(.*?)<\/term>/g, (match, p1) => {
    return `<span class="key-term">${p1}</span>`;
  });
  
  return formatted;
};

const formatGameContent = (content) => {
  // Process game title tags
  let formatted = content.replace(/<game-title>(.*?)<\/game-title>/g, (match, p1) => {
    return `<span class="game-title">${p1}</span>`;
  });
  
  // Add gaming icons
  formatted = formatted.replace(/🎮 (game|play|level|score)/gi, (match) => {
    return `<span class="game-term">${match}</span>`;
  });
  
  return formatted;
};

const formatMusicContent = (content) => {
  // Process chord tags
  let formatted = content.replace(/<chord>(.*?)<\/chord>/g, (match, p1) => {
    return `<span class="music-chord">${p1}</span>`;
  });
  
  // Add music icons
  formatted = formatted.replace(/🎵 (music|song|playlist|melody)/gi, (match) => {
    return `<span class="music-term">${match}</span>`;
  });
  
  return formatted;
};