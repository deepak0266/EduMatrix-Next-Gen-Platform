// src/services/chatbotService.js
import axios from 'axios';

export const chatbotService = {
  sendMessage: async (message, userId) => {
    try {
      const openAIKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          user: userId || 'anonymous-user'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`
          }
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw new Error("Failed to get response from AI service");
    }
  }
};