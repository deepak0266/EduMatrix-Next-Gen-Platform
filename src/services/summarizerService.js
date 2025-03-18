import { getAuth } from 'firebase/auth';
import { httpsCallable, getFunctions } from 'firebase/functions';

// Map our user-friendly length options to the API parameters
const lengthMap = {
  short: 'short',
  medium: 'medium',
  long: 'long'
};

/**
 * Summarizes the given document text
 * @param {string} text - The document text to summarize
 * @param {string} length - Summary length: 'short', 'medium', or 'long'
 * @param {string} format - Output format: 'paragraphs', 'bullets', or 'key_points'
 * @returns {Promise<string>} The generated summary
 */
export const summarizeDocument = async (text, length = 'medium', format = 'paragraphs') => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('Authentication required to summarize documents');
    }
    
    // Truncate text if it's too long for the API
    const maxLength = 15000; // Adjust based on your API limits
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) : text;
    
    // Use Firebase Cloud Functions to call our summarization API
    const functions = getFunctions();
    const generateSummary = httpsCallable(functions, 'generateDocumentSummary');
    
    const response = await generateSummary({
      text: truncatedText,
      length: lengthMap[length] || 'medium',
      format: format,
      userId: currentUser.uid
    });
    
    if (response.data && response.data.summary) {
      return response.data.summary;
    } else {
      throw new Error('Summary generation failed');
    }
  } catch (error) {
    console.error('Error in summarizeDocument:', error);
    throw error;
  }
};

/**
 * Saves a generated summary to the user's account
 * @param {string} documentId - The ID of the original document
 * @param {string} summary - The generated summary
 * @param {string} title - Optional title for the summary
 * @returns {Promise<object>} The saved summary object
 */
export const saveSummary = async (documentId, summary, title = '') => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('Authentication required to save summaries');
    }
    
    const functions = getFunctions();
    const saveSummaryFunction = httpsCallable(functions, 'saveSummary');
    
    const response = await saveSummaryFunction({
      documentId,
      summary,
      title: title || `Summary of document ${documentId}`,
      userId: currentUser.uid,
      createdAt: new Date().toISOString()
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in saveSummary:', error);
    throw error;
  }
};

/**
 * Get all summaries for a specific document
 * @param {string} documentId - The ID of the document
 * @returns {Promise<Array>} List of saved summaries
 */
export const getSummariesForDocument = async (documentId) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('Authentication required to retrieve summaries');
    }
    
    const functions = getFunctions();
    const getSummaries = httpsCallable(functions, 'getDocumentSummaries');
    
    const response = await getSummaries({
      documentId,
      userId: currentUser.uid
    });
    
    return response.data || [];
  } catch (error) {
    console.error('Error in getSummariesForDocument:', error);
    throw error;
  }
};