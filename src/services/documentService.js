// src/services/documentService.js
// Mock implementation of document service

// Mock data
let mockDocuments = [
    {
      id: '1',
      name: 'React Fundamentals.pdf',
      type: 'pdf',
      size: 2500000,
      uploadDate: new Date('2022-01-15').toISOString(),
      lastAccessed: new Date('2022-01-20').toISOString(),
      summary: 'An overview of React core concepts including components, props, and state management.',
      url: '/mock-files/react-fundamentals.pdf',
      thumbnail: '/mock-images/pdf-thumb.png'
    },
    {
      id: '2',
      name: 'Advanced JavaScript.docx',
      type: 'docx',
      size: 1800000,
      uploadDate: new Date('2022-02-10').toISOString(),
      lastAccessed: new Date('2022-02-15').toISOString(),
      summary: null,
      url: '/mock-files/advanced-javascript.docx',
      thumbnail: '/mock-images/docx-thumb.png'
    }
  ];
  
  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);
  
  // Simulate network delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const documentService = {
    // Get all documents
    getDocuments: async () => {
      await delay(800); // Simulate network delay
      return [...mockDocuments];
    },
  
    // Get a single document by ID
    getDocument: async (id) => {
      await delay(600);
      const document = mockDocuments.find(doc => doc.id === id);
      if (!document) {
        throw new Error('Document not found');
      }
      // Update last accessed date
      document.lastAccessed = new Date().toISOString();
      return { ...document };
    },
  
    // Upload a new document
    uploadDocument: async (file, metadata = {}) => {
      await delay(1200);
      
      // Create a new document object
      const newDocument = {
        id: generateId(),
        name: file.name,
        type: file.name.split('.').pop().toLowerCase(),
        size: file.size,
        uploadDate: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        summary: null,
        url: URL.createObjectURL(file), // Create a local URL for the file
        thumbnail: `/mock-images/${file.name.split('.').pop().toLowerCase()}-thumb.png`,
        ...metadata
      };
      
      // Add to mock database
      mockDocuments = [...mockDocuments, newDocument];
      
      return newDocument;
    },
  
    // Generate a summary for a document
    generateSummary: async (documentId) => {
      await delay(2000); // Longer delay to simulate processing
      
      const document = mockDocuments.find(doc => doc.id === documentId);
      if (!document) {
        throw new Error('Document not found');
      }
      
      // Generate a mock summary based on the document name
      const summaries = {
        'pdf': 'This PDF document covers important concepts and provides detailed explanations with visual aids.',
        'docx': 'This Word document contains structured information with headings, lists, and formatted text.',
        'txt': 'This text file includes raw content that can be easily parsed and analyzed.',
        'pptx': 'This PowerPoint presentation contains slides with key points and visual elements.'
      };
      
      const fileType = document.type;
      const summary = summaries[fileType] || 'This document contains useful information related to your studies.';
      
      // Update the document in our mock database
      mockDocuments = mockDocuments.map(doc => 
        doc.id === documentId ? {...doc, summary} : doc
      );
      
      return summary;
    },
  
    // Delete a document
    deleteDocument: async (id) => {
      await delay(800);
      const initialLength = mockDocuments.length;
      mockDocuments = mockDocuments.filter(doc => doc.id !== id);
      
      if (mockDocuments.length === initialLength) {
        throw new Error('Document not found');
      }
      
      return true;
    }
  };
  
  export default documentService;