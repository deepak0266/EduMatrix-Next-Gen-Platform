import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocuments } from '../../contexts/DocumentContext';
import { FiArrowLeft, FiDownload, FiPrinter, FiMaximize, FiMinimize } from 'react-icons/fi';
import SplitViewContainer from './SplitViewContainer';
import SummaryViewer from './SummaryViewer';
import styles from '../../styles/Documents/DocumentViewer.module.css';

const DocumentViewer = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const {
    getDocument,
    currentDocument,
    loading,
    error,
    summarizeDocument,
    getSummary,
    summary,
    summarizing,
    summaryError
  } = useDocuments();

  const [viewMode, setViewMode] = useState('document');
  const [sessionTime, setSessionTime] = useState(0);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryFormat, setSummaryFormat] = useState('paragraphs');
  const [fullscreen, setFullscreen] = useState(false);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [pdfLoadError, setPdfLoadError] = useState(false);

  useEffect(() => {
    setDocumentLoaded(false);
    setTextContent('');
    setPdfLoadError(false);
  }, [documentId]);

  const loadDocument = useCallback(async () => {
    if (!loading && !documentLoaded) {
      try {
        await getDocument(documentId);
        setDocumentLoaded(true);
      } catch (err) {
        console.error("Failed to load document:", err);
      }
    }
  }, [loading, documentLoaded, documentId, getDocument]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  // Fetch text content for text files
  useEffect(() => {
    const fetchTextContent = async () => {
      if (currentDocument?.fileURL && 
          (currentDocument.fileType === 'text/plain' || 
           currentDocument.fileName.toLowerCase().endsWith('.txt'))) {
        try {
          console.log("Fetching text content from:", currentDocument.fileURL);
          const response = await fetch(currentDocument.fileURL);
          if (!response.ok) {
            throw new Error(`Error fetching text: ${response.status}`);
          }
          const text = await response.text();
          setTextContent(text);
        } catch (err) {
          console.error("Failed to fetch text content:", err);
          setTextContent("Error loading text content: " + err.message);
        }
      }
    };
    
    if (currentDocument?.fileURL) {
      fetchTextContent();
    }
  }, [currentDocument]);

  useEffect(() => {
    const timer = setInterval(() => setSessionTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSummarize = useCallback(async () => {
    if (viewMode === 'split') {
      setViewMode('document');
    } else {
      setViewMode('split');
      if (!summary) {
        await summarizeDocument(documentId, summaryLength, summaryFormat);
      } else {
        await getSummary(documentId);
      }
    }
  }, [viewMode, summary, documentId, summaryLength, summaryFormat, summarizeDocument, getSummary]);

  useEffect(() => {
    if (viewMode === 'split' && summary && documentLoaded) {
      summarizeDocument(documentId, summaryLength, summaryFormat);
    }
  }, [summaryLength, summaryFormat, viewMode, summary, documentId, summarizeDocument, documentLoaded]);

  const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  const handleBack = () => navigate('/documents');
  
  const handleDownload = () => {
    if (currentDocument?.fileURL) {
      window.open(currentDocument.fileURL, '_blank');
    }
  };

  const handlePrint = () => window.print();

  const toggleFullscreen = () => {
    setFullscreen(f => !f);
    const el = document.documentElement;
    if (!fullscreen) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };

  const handleExportSummary = () => {
    if (summary?.content) {
      const blob = new Blob([summary.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDocument.fileName.replace(/\.[^/.]+$/, '')}_summary.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handlePdfError = () => {
    console.log("PDF failed to load");
    setPdfLoadError(true);
  };

  const handleGenerateQuiz = () => navigate(`/quiz/${documentId}`);

  const renderDocumentContent = () => {
    if (!currentDocument?.fileURL) {
      return (
        <div className={styles.documentErrorContainer}>
          <div className={styles.documentError}>
            <h3>File Content Unavailable</h3>
            <p>The file content could not be loaded. No URL found.</p>
          </div>
        </div>
      );
    }
    
    // Check if it's a PDF file
    const isPDF = currentDocument.fileType === 'application/pdf' || 
                  currentDocument.fileName.toLowerCase().endsWith('.pdf');
    
    if (isPDF) {
      return (
        <div className={styles.pdfContainer}>
          {pdfLoadError ? (
            <div className={styles.documentErrorContainer}>
              <div className={styles.documentError}>
                <h3>PDF Viewer Not Available</h3>
                <p>The PDF could not be loaded in the embedded viewer.</p>
                <p>Try using the download link below to view the document:</p>
                <a 
                  href={currentDocument.fileURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.primaryButton}
                >
                  Download PDF
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Primary PDF viewer using iframe for better compatibility */}
              <iframe
                src={`${currentDocument.fileURL}#toolbar=0&navpanes=0`}
                className={styles.pdfViewer}
                title={currentDocument.fileName}
                onError={handlePdfError}
              />
              
              {/* Fallback PDF viewer using object tag */}
              <object
                data={currentDocument.fileURL}
                type="application/pdf"
                className={`${styles.pdfViewer} ${styles.fallbackPdfViewer}`}
                onError={handlePdfError}
              >
                <div className={styles.documentErrorContainer}>
                  <div className={styles.documentError}>
                    <h3>PDF Viewer Not Available</h3>
                    <p>Your browser doesn't support PDF viewing or the PDF could not be loaded.</p>
                    <p>Try the direct download link below:</p>
                    <a 
                      href={currentDocument.fileURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.primaryButton}
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              </object>
            </>
          )}
        </div>
      );
    } else {
      // For text files, display the fetched content
      return (
        <div className={styles.textContainer}>
          {textContent ? (
            <pre className={styles.textContent}>{textContent}</pre>
          ) : (
            <div className={styles.loadingIndicator}>
              <div className={styles.spinner}></div>
              <p>Loading text content...</p>
            </div>
          )}
        </div>
      );
    }
  };

  const renderSummaryContent = () => (
    <SummaryViewer
      documentContent={currentDocument?.content}
      documentId={documentId}
      summary={summary}
      loading={summarizing}
      error={summaryError}
      summaryLength={summaryLength}
      setSummaryLength={setSummaryLength}
      summaryFormat={summaryFormat}
      setSummaryFormat={setSummaryFormat}
      onGenerateQuiz={handleGenerateQuiz}
      onExportSummary={handleExportSummary}
    />
  );

  if (loading && !documentLoaded) {
    return (
      <div className={styles.viewerContainer}>
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
          <p>Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.viewerContainer}>
        <div className={styles.documentErrorContainer}>
          <div className={styles.documentError}>
            <h3>Error Loading Document</h3>
            <p>{error}</p>
            <button className={styles.primaryButton} onClick={handleBack}>Back to Library</button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDocument) {
    return (
      <div className={styles.viewerContainer}>
        <div className={styles.documentErrorContainer}>
          <div className={styles.documentError}>
            <h3>Document Not Found</h3>
            <p>The requested document could not be loaded.</p>
            <button className={styles.primaryButton} onClick={handleBack}>Back to Library</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.viewerContainer} ${fullscreen ? styles.fullscreenMode : ''}`}>
      <div className={styles.viewerHeader}>
        <div className={styles.documentInfo}>
          <button className={styles.backBtn} onClick={handleBack}>
            <FiArrowLeft /> Back to Library
          </button>
          <h1 className={styles.documentTitle}>{currentDocument.fileName}</h1>
          <p className={styles.documentMeta}>
            {currentDocument.subject} • {currentDocument.fileSize} • Uploaded on {new Date(currentDocument.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className={styles.viewerActions}>
          <button className={styles.actionButton} onClick={handlePrint}><FiPrinter /> <span>Print</span></button>
          <button className={styles.actionButton} onClick={handleDownload}><FiDownload /> <span>Download</span></button>
          <button className={styles.actionButton} onClick={toggleFullscreen}>
            {fullscreen ? <FiMinimize /> : <FiMaximize />}
            <span>{fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
          <button className={styles.summaryButton} onClick={handleSummarize}>
            {viewMode === 'split' ? 'Hide Summary' : 'View Summary'}
          </button>
        </div>
      </div>

      {viewMode === 'split'
        ? <SplitViewContainer leftContent={renderDocumentContent()} rightContent={renderSummaryContent()} />
        : viewMode === 'summary'
          ? renderSummaryContent()
          : renderDocumentContent()}

      <div className={styles.sessionFooter}>
        <p>📖 Time spent: <strong>{formatTime(sessionTime)}</strong></p>
      </div>
    </div>
  );
};

export default DocumentViewer;