import React, { createContext, useState, useContext, useCallback } from 'react';
import { summarizeDocument } from '../services/summarizerService';

const SummaryContext = createContext();

export const useSummary = () => useContext(SummaryContext);

export const SummaryProvider = ({ children }) => {
  const [summaries, setSummaries] = useState({});
  const [summaryLoading, setSummaryLoading] = useState({});
  const [summaryError, setSummaryError] = useState({});
  const [summaryLength, setSummaryLength] = useState('medium');
  
  const generateSummary = useCallback(async (documentId, documentText, length = summaryLength) => {
    if (!documentId || !documentText) return null;
    
    try {
      setSummaryLoading(prev => ({ ...prev, [documentId]: true }));
      setSummaryError(prev => ({ ...prev, [documentId]: null }));
      
      const summary = await summarizeDocument(documentText, length);
      
      setSummaries(prev => ({
        ...prev,
        [documentId]: {
          content: summary,
          length,
          generatedAt: new Date().toISOString(),
        }
      }));
      
      return summary;
    } catch (error) {
      console.error("Summary generation failed:", error);
      setSummaryError(prev => ({ 
        ...prev, 
        [documentId]: error.message || 'Failed to generate summary' 
      }));
      return null;
    } finally {
      setSummaryLoading(prev => ({ ...prev, [documentId]: false }));
    }
  }, [summaryLength]);
  
  const clearSummary = useCallback((documentId) => {
    setSummaries(prev => {
      const newSummaries = { ...prev };
      delete newSummaries[documentId];
      return newSummaries;
    });
    
    setSummaryLoading(prev => {
      const newLoading = { ...prev };
      delete newLoading[documentId];
      return newLoading;
    });
    
    setSummaryError(prev => {
      const newErrors = { ...prev };
      delete newErrors[documentId];
      return newErrors;
    });
  }, []);
  
  const value = {
    summaries,
    summaryLoading,
    summaryError,
    summaryLength,
    setSummaryLength,
    generateSummary,
    clearSummary,
    isSummarizing: (documentId) => !!summaryLoading[documentId],
    getSummary: (documentId) => summaries[documentId]?.content || null,
    getSummaryError: (documentId) => summaryError[documentId] || null,
  };
  
  return (
    <SummaryContext.Provider value={value}>
      {children}
    </SummaryContext.Provider>
  );
};

export default SummaryContext;