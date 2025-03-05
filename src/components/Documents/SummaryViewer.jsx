// src/components/Documents/SummaryViewer.jsx
import React from 'react';
import styles from '../../styles/Documents/SummaryViewer.module.css';
import { useDocuments } from '../../contexts/DocumentContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import Button from '../Common/Button';

const SummaryViewer = ({ documentId }) => {
  const { currentDocument, loading, generateSummary } = useDocuments();
  
  const handleRefreshSummary = async () => {
    if (documentId) {
      await generateSummary(documentId);
    }
  };
  
  if (!currentDocument) {
    return (
      <div className={styles.noDocument}>
        <p>No document selected.</p>
      </div>
    );
  }
  
  if (loading && !currentDocument.summary) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Generating document summary...</p>
      </div>
    );
  }
  
  if (!currentDocument.summary) {
    return (
      <div className={styles.noSummary}>
        <p>No summary available for this document.</p>
        <Button
          variant="primary"
          onClick={handleRefreshSummary}
          disabled={loading}
        >
          Generate Summary
        </Button>
      </div>
    );
  }
  
  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryHeader}>
        <h3>Document Summary</h3>
        <Button
          variant="secondary"
          onClick={handleRefreshSummary}
          disabled={loading}
          size="small"
        >
          {loading ? <LoadingSpinner size="small" /> : 'Refresh'}
        </Button>
      </div>
      
      <div className={styles.summaryContent}>
        <p>{currentDocument.summary}</p>
      </div>
      
      <div className={styles.keyPoints}>
        <h4>Key Points</h4>
        <ul>
          {/* Mock key points based on the document summary */}
          {currentDocument.summary.split('.').filter(s => s.trim().length > 10).slice(0, 3).map((point, index) => (
            <li key={index}>{point.trim()}.</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SummaryViewer;