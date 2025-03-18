import { useState, useCallback, useEffect } from 'react';
import { summarizeDocument, saveSummary } from '../services/summarizerService';

/**
 * Custom hook for document summarization functionality
 * @param {string} documentContent - The document content to summarize
 * @param {string} documentId - The document ID
 * @param {Object} options - Configuration options
 * @returns {Object} Summarization methods and state
 */
const useSummarizer = (documentContent, documentId, options = {}) => {
  const { autoSummarize = false, defaultLength = 'medium' } = options;
  
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [summaryLength, setSummaryLength] = useState(defaultLength);
  const [savedSummaries, setSavedSummaries] = useState([]);
  
  const generateSummary = useCallback(async (length = summaryLength) => {
    if (!documentContent || !documentId) {
      setError('Document content is required to generate a summary');
      return null;
    }
    
    try {
      setIsGenerating(true);
      setError(null);
      
      const generatedSummary = await summarizeDocument(
        documentContent, 
        length
      );
      
      setSummary(generatedSummary);
      return generatedSummary;
    } catch (err) {
      console.error('Summary generation failed:', err);
      setError(err.message || 'Failed to generate summary');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [documentContent, documentId, summaryLength]);
  
  const saveSummaryToAccount = useCallback(async (title = '') => {
    if (!summary) {
      setError('No summary to save');
      return null;
    }
    
    try {
      const savedSummary = await saveSummary(documentId, summary, title);
      setSavedSummaries(prev => [...prev, savedSummary]);
      return savedSummary;
    } catch (err) {
      console.error('Failed to save summary:', err);
      setError(err.message || 'Failed to save summary');
      return null;
    }
  }, [documentId, summary]);
  
  const downloadSummary = useCallback(() => {
    if (!summary) {
      setError('No summary to download');
      return;
    }
    
    try {
      // Create a blob with the summary text
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `summary-${documentId.substring(0, 8)}.txt`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download summary:', err);
      setError(err.message || 'Failed to download summary');
    }
  }, [documentId, summary]);
  
  // Auto-generate summary if configured
  useEffect(() => {
    if (autoSummarize && documentContent && !summary && !isGenerating) {
      generateSummary();
    }
  }, [autoSummarize, documentContent, generateSummary, isGenerating, summary]);
  
  return {
    summary,
    isGenerating,
    error,
    summaryLength,
    setSummaryLength,
    generateSummary,
    saveSummary: saveSummaryToAccount,
    downloadSummary,
    savedSummaries
  };
};

export default useSummarizer;