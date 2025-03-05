// src/components/Documents/DocumentViewer.jsx
import React, { useState, useEffect } from 'react';
import { useDocuments } from '../../contexts/DocumentContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import Button from '../Common/Button';
import styles from '../../styles/Documents/DocumentViewer.module.css';
import { trackViewTime } from '../../utils/timeTracker';

const DocumentViewer = ({ documentId }) => {
  const [viewStartTime, setViewStartTime] = useState(null);
  const { getDocument, currentDocument, loading, error, generateSummary } = useDocuments();
  
  useEffect(() => {
    if (documentId) {
      getDocument(documentId);
      const startTime = new Date();
      setViewStartTime(startTime);
      
      return () => {
        if (viewStartTime) {
          const endTime = new Date();
          trackViewTime(documentId, viewStartTime, endTime);
        }
      };
    }
  }, [documentId]);
  
  const handleGenerateSummary = async () => {
    if (documentId) {
      await generateSummary(documentId);
    }
  };
  
  if (loading && !currentDocument) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  if (!currentDocument) {
    return (
      <div className={styles.noDocument}>
        <p>No document selected. Please select a document from the list.</p>
      </div>
    );
  }
  
  const renderDocument = () => {
    const { type, url, name } = currentDocument;
    
    switch (type) {
      case 'pdf':
        return (
          <iframe 
            src={url} 
            className={styles.pdfViewer} 
            title={name}
          />
        );
      case 'txt':
        return (
          <div className={styles.textViewer}>
            <pre>{currentDocument.content || 'Text content not available for preview'}</pre>
          </div>
        );
      default:
        return (
          <div className={styles.unsupportedFormat}>
            <p>
              Preview not available for {type.toUpperCase()} files. 
              <a href={url} download={name} className={styles.downloadLink}>
                Download the file
              </a>
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className={styles.documentViewer}>
      <div className={styles.viewerHeader}>
        <h2>{currentDocument.name}</h2>
        <div className={styles.viewerActions}>
          <Button 
            variant="secondary" 
            onClick={handleGenerateSummary}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Generate Summary'}
          </Button>
          <a 
            href={currentDocument.url} 
            download={currentDocument.name}
            className={styles.downloadButton}
          >
            Download
          </a>
        </div>
      </div>
      
      <div className={styles.viewerContent}>
        {renderDocument()}
      </div>
    </div>
  );
};

export default DocumentViewer;