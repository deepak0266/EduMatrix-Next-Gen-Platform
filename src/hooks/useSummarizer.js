// src/hooks/useSummarizer.js
import { useState } from 'react';
import { generateSummary, fetchDocumentContent } from '../services/summarizerService';

const useSummarizer = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const summarizeFromCloudinaryUrl = async (url, documentType, length = 'medium') => {
    setLoading(true);
    setError(null);
    
    try {
      // First fetch document content from Cloudinary URL
      const content = await fetchDocumentContent(url);
      
      // Then generate summary
      const generatedSummary = await generateSummary(content, length);
      
      setSummary(generatedSummary);
      return generatedSummary;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    summary,
    loading,
    error,
    summarizeFromCloudinaryUrl
  };
};

export default useSummarizer;