// src/utils/fileValidator.js
// File validation utility

// Allowed file types and their maximum sizes (in bytes)
const FILE_CONSTRAINTS = {
    maxSize: 10 * 1024 * 1024, // 10MB general limit
    types: {
      pdf: {
        mimeTypes: ['application/pdf'],
        maxSize: 20 * 1024 * 1024, // 20MB for PDFs
      },
      docx: {
        mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
        maxSize: 15 * 1024 * 1024, // 15MB for Word documents
      },
      txt: {
        mimeTypes: ['text/plain'],
        maxSize: 5 * 1024 * 1024, // 5MB for text files
      },
      pptx: {
        mimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'],
        maxSize: 30 * 1024 * 1024, // 30MB for PowerPoint
      },
    }
  };
  
  /**
   * Validates a file based on type and size constraints
   * @param {File} file - The file to validate
   * @returns {Object} Validation result with valid status and error message if any
   */
  export const validateFile = (file) => {
    // Check if file exists
    if (!file) {
      return {
        valid: false,
        error: 'No file selected'
      };
    }
    
    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileTypeConfig = FILE_CONSTRAINTS.types[fileExtension];
    
    if (!fileTypeConfig) {
      return {
        valid: false,
        error: `File type .${fileExtension} is not supported. Please upload a PDF, DOCX, TXT, or PPTX file.`
      };
    }
    
    // Check MIME type
    if (!fileTypeConfig.mimeTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file format. Expected ${fileExtension.toUpperCase()} but got ${file.type}`
      };
    }
    
    // Check file size
    const maxSize = fileTypeConfig.maxSize || FILE_CONSTRAINTS.maxSize;
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / 1024 / 1024;
      return {
        valid: false,
        error: `File is too large. Maximum size for ${fileExtension.toUpperCase()} files is ${maxSizeMB} MB`
      };
    }
    
    // All checks passed
    return {
      valid: true
    };
  };