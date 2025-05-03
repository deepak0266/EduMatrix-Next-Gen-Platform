// src/contexts/ChatbotContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatbotService } from '../services/chatbotService';

const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState('study'); // 'study', 'game', or 'music'
  
  // Initialize with welcome message based on current mode
  useEffect(() => {
    const welcomeMessage = generateWelcomeMessage(currentMode);
    setMessages([{ type: 'bot', content: welcomeMessage, mode: currentMode }]);
  }, [currentMode]);
  
  const generateWelcomeMessage = (mode) => {
    switch(mode) {
      case 'study':
        return "👋 Welcome to EduMatrix Study Assistant! I'm here to help with your academic questions, summarize content, and provide learning resources. How can I assist with your studies today?";
      case 'game':
        return "🎮 Game mode activated! I can help with game strategies, suggest games to play during study breaks, or discuss gaming concepts. What would you like to play or learn about?";
      case 'music':
        return "🎵 Music mode enabled! I can suggest focus music, discuss music theory, or help find the perfect study playlist. What kind of music inspiration do you need?";
      default:
        return "Welcome to EduMatrix Assistant! How can I help you today?";
    }
  };
  
  const switchMode = (newMode) => {
    if (newMode !== currentMode) {
      setCurrentMode(newMode);
      const modeChangeMessage = `Mode switched to ${newMode} mode`;
      const welcomeMessage = generateWelcomeMessage(newMode);
      
      setMessages(prev => [
        ...prev,
        { type: 'system', content: modeChangeMessage, mode: newMode },
        { type: 'bot', content: welcomeMessage, mode: newMode }
      ]);
    }
  };
  
  const sendMessage = async (content) => {
    if (!content.trim()) return;
    
    // Add user message to chat
    const userMessage = { type: 'user', content, mode: currentMode };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Transform prompt based on current mode
      const enhancedPrompt = transformPrompt(content, currentMode);
      
      // Send to chatbot service
      const response = await chatbotService.sendMessage(enhancedPrompt, user?.uid);
      
      // Process and format response based on mode
      const formattedResponse = formatResponse(response, currentMode);
      
      // Add bot response to chat
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: formattedResponse, 
        mode: currentMode,
        suggestions: generateSuggestions(formattedResponse, currentMode)
      }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "I'm having trouble connecting right now. Please try again shortly.", 
        mode: currentMode,
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const transformPrompt = (content, mode) => {
    // Add mode-specific context to the user's prompt
    const modeContext = {
      study: "You are EduMatrix Study Assistant, an educational AI focused on academic help. Provide detailed,brief accurate information with references when possible. Use academic language and formatting suitable for educational content. Include relevant formulas, concepts, and learning resources.",
      game: "You are EduMatrix Game Assistant, a gaming-focused AI. Use gaming terminology, be enthusiastic about games, and provide game-related advice. Suggest games that might help with cognitive skills during study breaks. Keep responses concise and engaging with gaming references.",
      music: "You are EduMatrix Music Assistant, a music-focused AI. Discuss music theory, suggest study playlists, and use music terminology. Recommend music based on study needs (focus, relaxation, energy) and explain why certain music helps with studying."
    };
    
    return `${modeContext[mode]}\n\nUser message: ${content}`;
  };
  
  const formatResponse = (response, mode) => {
    // Format response based on the current mode
    switch(mode) {
      case 'study':
        // Format study responses - handle math equations, citations, etc.
        return enhanceStudyResponse(response);
      case 'game':
        // Format game responses - highlight game terms, add emojis, etc.
        return enhanceGameResponse(response);
      case 'music':
        // Format music responses - highlight music terms, add notation, etc.
        return enhanceMusicResponse(response);
      default:
        return response;
    }
  };
  
  const enhanceStudyResponse = (response) => {
    // Replace math expressions with formatted equations
    let enhanced = response.replace(/\$([^$]+)\$/g, '<math>$1</math>');
    
    // Format citations
    enhanced = enhanced.replace(/\[([0-9]+)\]/g, '<citation>[$1]</citation>');
    
    // Highlight key terms
    enhanced = enhanced.replace(/\*\*([^*]+)\*\*/g, '<term>$1</term>');
    
    return enhanced;
  };
  
  const enhanceGameResponse = (response) => {
    // Add gaming icons and formatting
    let enhanced = response;
    
    // Add gaming emoji
    enhanced = enhanced.replace(/\b(game|play|level|score)\b/gi, '🎮 $1');
    
    // Highlight game titles
    enhanced = enhanced.replace(/\b([A-Z][A-Za-z0-9\s]+)\b/g, (match) => {
      // Check if it looks like a game title (capitalized words)
      if (/^[A-Z]/.test(match) && match.length > 3) {
        return '<game-title>' + match + '</game-title>';
      }
      return match;
    });
    
    return enhanced;
  };
  
  const enhanceMusicResponse = (response) => {
    // Add music notation and formatting
    let enhanced = response;
    
    // Add music emoji
    enhanced = enhanced.replace(/\b(music|song|playlist|melody)\b/gi, '🎵 $1');
    
    // Format chord references
    enhanced = enhanced.replace(/\b([A-G][#b]?(?:maj|min|m|dim|aug|7|9|11|13)?)\b/g, '<chord>$1</chord>');
    
    return enhanced;
  };
  
  const generateSuggestions = (response, mode) => {
    // Create context-aware suggestions based on the bot's response and current mode
    const suggestions = {
      study: [
        "Explain this concept",
        "Generate practice questions",
        "Summarize this topic",
        "Provide study resources"
      ],
      game: [
        "Suggest a quick game",
        "Game strategies",
        "Educational games",
        "Gaming break timer"
      ],
      music: [
        "Focus playlist",
        "Relaxing music",
        "Energizing tracks",
        "Music theory explanation"
      ]
    };
    
    // Return 2-3 relevant suggestions
    return suggestions[mode].slice(0, 3);
  };
  
  // Clear chat history
  const clearChat = () => {
    setMessages([{ 
      type: 'bot', 
      content: generateWelcomeMessage(currentMode), 
      mode: currentMode 
    }]);
  };
  
  return (
    <ChatbotContext.Provider value={{
      messages,
      isLoading,
      currentMode,
      sendMessage,
      switchMode,
      clearChat
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => useContext(ChatbotContext);