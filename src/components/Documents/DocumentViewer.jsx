import React, { useState, useEffect } from 'react';
import { useDocuments } from '../../contexts/DocumentContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import Button from '../Common/Button';
import styles from '../../styles/Documents/DocumentViewer.module.css';
import { trackViewTime } from '../../utils/timeTracker';

const DocumentViewer = ({ documentId, onClose }) => {
  const [viewStartTime, setViewStartTime] = useState(null);
  const { getDocument, currentDocument, loading, error, generateSummary } = useDocuments();
  
  useEffect(() => {
    let isMounted = true;
    const loadDocument = async () => {
      if (documentId) {
        try {
          await getDocument(documentId);
          if (isMounted) setViewStartTime(new Date());
        } catch (err) {
          console.error('Document load error:', err);
        }
      }
    };
    loadDocument();
    return () => {
      isMounted = false;
    };
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
    const { fileType, fileURL, fileName } = currentDocument;
    
    // Determine the document type based on fileType
    const isPdf = fileType === 'application/pdf' || fileType === 'pdf';
    const isText = fileType === 'text/plain' || fileType === 'txt';
    const isImage = fileType && fileType.startsWith('image/');
    
    if (isPdf) {
      return (
        <div className={styles.pdfContainer}>
          <object 
            data={`${fileURL}#toolbar=0&navpanes=0`}
            type="application/pdf"
            className={styles.pdfViewer}
          >
            <p>This browser doesn't support PDFs. 
              <a href={fileURL} download>Download instead</a>
            </p>
          </object>
        </div>
      );
    } else if (isText) {
      return (
        <div className={styles.textViewer}>
          <pre>{currentDocument.content || 'Text content not available for preview'}</pre>
        </div>
      );
    } else if (isImage) {
      return (
        <div className={styles.imageViewer}>
          <img src={fileURL} alt={fileName} className={styles.documentImage} />
        </div>
      );
    } else {
      return (
        <div className={styles.unsupportedFormat}>
          <p>
            Preview not available for this file type.
            <a href={fileURL} download={fileName} className={styles.downloadLink}>
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
        <h2>{currentDocument.fileName}</h2>
        <div className={styles.viewerActions}>
          <Button 
            variant="secondary" 
            onClick={handleGenerateSummary}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Generate Summary'}
          </Button>
          <a 
            href={currentDocument.fileURL} 
            download={currentDocument.fileName}
            className={styles.downloadButton}
          >
            Download
          </a>
          {onClose && (
            <Button 
              variant="secondary" 
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>
      
      <div className={styles.viewerContent}>
        {renderDocument()}
      </div>
    </div>
  );
};

export default DocumentViewer;