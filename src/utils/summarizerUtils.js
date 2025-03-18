/**
 * Estimates reading time for a text
 * @param {string} text - The text to estimate reading time for
 * @param {number} wordsPerMinute - Reading speed in words per minute
 * @returns {number} Estimated reading time in minutes
 */
export const estimateReadingTime = (text, wordsPerMinute = 200) => {
    if (!text) return 0;
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };
  
  /**
   * Extracts key terms from a text
   * @param {string} text - The text to extract terms from
   * @param {number} maxTerms - Maximum number of terms to extract
   * @returns {Array<string>} Array of key terms
   */
  export const extractKeyTerms = (text, maxTerms = 10) => {
    if (!text) return [];
    
    // Remove common words and punctuation
    const cleanText = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ');
    
    // Split into words
    const words = cleanText.split(' ');
    
    // Filter out common words (basic stopwords)
    const stopwords = new Set([
      'the', 'and', 'to', 'of', 'a', 'in', 'that', 'is', 'it', 'was', 'for', 'on', 'with',
      'as', 'are', 'at', 'be', 'this', 'by', 'from', 'or', 'an', 'but', 'not', 'what', 'all',
      'were', 'when', 'we', 'there', 'can', 'an', 'your', 'which', 'their', 'has', 'have',
      'one', 'do', 'more', 'no', 'they', 'so', 'about', 'than', 'our', 'some', 'would', 'out',
      'up', 'if', 'his', 'her', 'my', 'them', 'its', 'will', 'who', 'said', 'been', 'had', 'i',
      'also', 'each', 'etc', 'you', 'just', 'may', 'only', 'these', 'those', 'very', 'such'
    ]);
    
    const filteredWords = words.filter(word => 
      word.length > 3 && !stopwords.has(word)
    );
    
    // Count word frequency
    const wordFrequency = {};
    filteredWords.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Sort by frequency
    const sortedTerms = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxTerms)
      .map(([term]) => term);
    
    return sortedTerms;
  };
  
  /**
   * Formats a summary based on the requested format
   * @param {string} summary - The raw summary text
   * @param {string} format - The desired format ('paragraphs', 'bullets', 'key_points')
   * @returns {string} Formatted summary
   */
  export const formatSummary = (summary, format) => {
    if (!summary) return '';
    
    switch (format) {
      case 'bullets':
        // Convert paragraphs to bullet points
        return summary
          .split('\n\n')
          .map(paragraph => paragraph.trim())
          .filter(paragraph => paragraph.length > 0)
          .map(paragraph => `• ${paragraph}`)
          .join('\n\n');
      
      case 'key_points':
        // Extract sentences and format as key points
        const sentences = summary
          .replace(/([.!?])\s+/g, '$1|')
          .split('|')
          .map(sentence => sentence.trim())
          .filter(sentence => sentence.length > 5);
        
        return [
          '# Key Points',
          ...sentences.map((sentence, index) => `${index + 1}. ${sentence}`)
        ].join('\n\n');
      
      case 'paragraphs':
      default:
        // Return as is (already in paragraph format)
        return summary;
    }
  };
  
  /**
   * Generates a suitable title for a summary based on the content
   * @param {string} text - The text to generate a title from
   * @returns {string} Generated title
   */
  export const generateSummaryTitle = (text) => {
    if (!text) return 'Document Summary';
    
    // Get the first sentence or first 100 characters
    const firstSentence = text.split(/[.!?]/)[0].trim();
    
    if (firstSentence.length < 60) {
      return firstSentence;
    } else {
      // Take first 6-8 words
      const words = firstSentence.split(' ');
      return words.slice(0, Math.min(8, words.length)).join(' ') + '...';
    }
  };
  
  /**
   * Creates a downloadable file from a summary
   * @param {string} summary - The summary text
   * @param {string} filename - The filename to use
   * @param {string} format - The file format ('txt', 'md', 'html')
   */
  export const downloadSummaryFile = (summary, filename = 'summary', format = 'txt') => {
    if (!summary) return;
    
    let content = summary;
    let mimeType = 'text/plain';
    let extension = 'txt';
    
    switch (format) {
      case 'md':
        mimeType = 'text/markdown';
        extension = 'md';
        break;
      case 'html':
        content = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Document Summary</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
      h1 { color: #333; }
      p { margin-bottom: 16px; }
    </style>
  </head>
  <body>
    <h1>Document Summary</h1>
    ${summary.split('\n\n').map(p => `<p>${p}</p>`).join('')}
  </body>
  </html>`;
        mimeType = 'text/html';
        extension = 'html';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };