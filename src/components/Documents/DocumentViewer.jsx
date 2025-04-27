import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocuments } from '../../contexts/DocumentContext';
import {
  ArrowLeft,
  Download,
  Maximize,
  Minimize,
  Clock,
  X,
  FileText,
  ChevronDown,
  Volume2,
  Search,
  Bookmark,
  Share2,
  Moon,
  ExternalLink,
  Camera,
  PanelLeft,
  PanelRight,
  Layout,
  AlertCircle
} from 'lucide-react';
import SplitViewContainer from './SplitViewContainer';
import SummaryViewer from './SummaryViewer';
import styles from '../../styles/Documents/DocumentViewer.module.css';

const DocumentViewer = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const documentRef = useRef(null);
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

  // State management
  const [viewMode, setViewMode] = useState('document');
  const [sessionTime, setSessionTime] = useState(0);
  const [summaryTime, setSummaryTime] = useState(0);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryFormat, setSummaryFormat] = useState('paragraphs');
  const [fullscreen, setFullscreen] = useState(false);
  const [leftPanelFullscreen, setLeftPanelFullscreen] = useState(false);
  const [rightPanelFullscreen, setRightPanelFullscreen] = useState(false);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isSummaryCopied, setIsSummaryCopied] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [summaryTimerActive, setSummaryTimerActive] = useState(false);
  const [preferredSplitRatio, setPreferredSplitRatio] = useState(50); // Default 50:50
  const [darkMode, setDarkMode] = useState(false);

  // Initialize modal and event listeners
  useEffect(() => {
    setDocumentLoaded(false);
    setTextContent('');
    setPdfLoadError(false);

    // Add event listener for escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (fullscreen) {
          toggleFullscreen();
        } else if (leftPanelFullscreen || rightPanelFullscreen) {
          setLeftPanelFullscreen(false);
          setRightPanelFullscreen(false);
        } else {
          handleClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);

    // Animation entrance
    setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.style.opacity = '1';
        setTimeout(() => {
          if (modalRef.current) {
            modalRef.current.classList.add(styles.modalVisible);
          }
        }, 50);
      }
    }, 10);

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [documentId, fullscreen, leftPanelFullscreen, rightPanelFullscreen]);

  const handleDownload = () => {
    if (currentDocument?.fileURL) {
      const link = document.createElement('a');
      link.href = currentDocument.fileURL;
      link.download = currentDocument.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  // Load document from context
  const loadDocument = useCallback(async () => {
    if (!loading && !documentLoaded) {
      try {
        await getDocument(documentId);
        setDocumentLoaded(true);

        // Set a default total page number based on document type
        if (currentDocument?.fileType === 'application/pdf') {
          // This would be implemented to actually detect number of pages
          // For now, setting a placeholder value
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Failed to load document:", err);
      }
    }
  }, [loading, documentLoaded, documentId, getDocument, currentDocument]);

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

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => setSessionTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Summary timer - only runs when summary is active
  useEffect(() => {
    if (summaryTimerActive) {
      const timer = setInterval(() => setSummaryTime(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [summaryTimerActive]);

  // Handle summary generation
  const handleSummarize = useCallback(async () => {
    try {
      setViewMode('split');
      setSummaryTimerActive(true);

      // If we don't have an existing summary, generate one
      if (!summary) {
        await summarizeDocument(
          documentId,
          currentDocument?.content || textContent,
          currentDocument?.fileURL,
          summaryLength,
          summaryFormat
        );
      } else {
        // If we have an existing summary, just fetch it
        await getSummary(documentId);
      }
    } catch (error) {
      console.error("Summary generation failed:", error);
    }
  }, [documentId, currentDocument, textContent, summary, summaryLength, summaryFormat, summarizeDocument, getSummary]);

  // Update summary when preferences change
useEffect(() => {
  if (viewMode === 'split' && documentLoaded) {
    summarizeDocument(
      documentId,
      currentDocument?.content || textContent,
      currentDocument?.fileURL,
      summaryLength,
      summaryFormat
    );
  }
}, [summaryLength, summaryFormat, viewMode]); // Removed unnecessary dependencies
  // Helper functions
  const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  // Take screenshot function
const takeScreenshot = async () => {
  try {
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(document.documentElement, {
      useCORS: true,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
      scale: 1
    });

    // डाउनलोड करें
    const link = document.createElement('a');
    link.download = `full-website-screenshot-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

  } catch (error) {
    alert('स्क्रीनशॉट फ़ेल हुआ! ब्राउज़र कंसोल चेक करें।');
    console.error("स्क्रीनशॉट एरर:", error);
  }
};

  // Navigation and control handlers
  const handleBack = () => navigate('/documents');

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsModalOpen(false);
      handleBack();
    }, 300);
  };

  const handleReturnToDocumentView = () => {
    setViewMode('document');
    setSummaryTimerActive(false);
  };

  


  const toggleFullscreen = () => {
    setFullscreen(prev => !prev);
    setLeftPanelFullscreen(false);
    setRightPanelFullscreen(false);

    // Handle browser fullscreen API
    const elem = document.documentElement;
    if (!fullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const toggleLeftPanelFullscreen = () => {
    setLeftPanelFullscreen(prev => !prev);
    setRightPanelFullscreen(false); // 
    setFullscreen(false); //
  };
  
  const toggleRightPanelFullscreen = () => {
    setRightPanelFullscreen(prev => !prev);
    setLeftPanelFullscreen(false); // 
    setFullscreen(false); // 
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    // In a real implementation, you would apply a class to the root element
    // document.documentElement.classList.toggle('dark-mode');
  };

  // PDF controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoomLevel(100);

  const handleNextPage = () => setPageNumber(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));

  const handlePdfError = () => {
    console.log("PDF failed to load");
    setPdfLoadError(true);
  };

  const toggleOptions = () => {
    setShowOptions(prev => !prev);
  };

  // Summary functionality
  const handleCopySummary = () => {
    if (summary?.content) { // ✅ .content check करें
      navigator.clipboard.writeText(summary.content)
        .then(() => {
          setIsSummaryCopied(true);
          setTimeout(() => setIsSummaryCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  const handleRefreshSummary = async () => {
    try {
      await summarizeDocument(
        documentId,
        currentDocument?.content || textContent,
        currentDocument?.fileURL,
        summaryLength,
        summaryFormat,
        true // force refresh
      );
    } catch (error) {
      console.error("Failed to refresh summary:", error);
    }
  };

  const handleDownloadSummary = () => {
    if (!summary?.content) return; // ✅ .content check करें
  
    const element = document.createElement('a');
    const file = new Blob([summary.content], { type: 'text/plain' }); // ✅ .content use करें
    element.href = URL.createObjectURL(file);
    element.download = `${currentDocument?.fileName.split('.')[0]}_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  

  const handleGenerateQuiz = () => {
    // This would be implemented to generate a quiz based on the summary
    alert("Quiz generation feature coming soon!");
  };

  const setSplitRatioPreset = (ratio) => {
    setPreferredSplitRatio(ratio);
  };

  // Render document content based on file type
  const renderDocumentContent = () => {
    if (!currentDocument?.fileURL) {
      return (
        <div className={styles.documentErrorContainer}>
          <div className={styles.documentError}>
            <AlertCircle size={48} />
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
        <div className={styles.pdfContainer} ref={documentRef}>
          {pdfLoadError ? (
            <div className={styles.documentErrorContainer}>
              <div className={styles.documentError}>
                <AlertCircle size={48} />
                <h3>PDF Viewer Not Available</h3>
                <p>The PDF could not be loaded in the embedded viewer.</p>
                <p>Try using the download link below to view the document:</p>
                <button
                  onClick={handleDownload}
                  className={styles.primaryButton}
                >
                  Download PDF
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.pdfViewerWrapper}>
              <iframe
                src={`${currentDocument.fileURL}#toolbar=0&navpanes=0&zoom=${zoomLevel}&page=${pageNumber}`}
                className={styles.pdfViewer}
                title={currentDocument.fileName}
                onError={handlePdfError}
              />

              <div className={styles.pdfControls}>
                <div className={styles.pageNavigation}>
                  <button
                    onClick={handlePrevPage}
                    className={styles.pageNavButton}
                    disabled={pageNumber <= 1}
                    aria-label="Previous page"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <span className={styles.pageIndicator}>{pageNumber}/{totalPages}</span>
                  <button
                    onClick={handleNextPage}
                    className={styles.pageNavButton}
                    disabled={pageNumber >= totalPages}
                    aria-label="Next page"
                  >
                    <ArrowLeft size={16} className={styles.rotateIcon} />
                  </button>
                </div>

                <div className={styles.zoomControls}>
                  <button
                    onClick={handleZoomOut}
                    className={styles.zoomButton}
                    disabled={zoomLevel <= 50}
                    aria-label="Zoom out"
                  >
                    -
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className={styles.zoomResetButton}
                    aria-label="Reset zoom"
                  >
                    <span className={styles.zoomLevel}>{zoomLevel}%</span>
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className={styles.zoomButton}
                    disabled={zoomLevel >= 200}
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // For text files, display the fetched content
      return (
        <div className={styles.textContainer} ref={documentRef}>
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

  // Modal visibility check
  if (!isModalOpen) {
    return null;
  }

  // Loading state
  if (loading && !documentLoaded) {
    return (
      <div className={`${styles.modalBackdrop} ${darkMode ? styles.darkMode : ''}`}>
        <div className={`${styles.modalContainer} ${styles.loadingModal} ${styles.glassmorphic}`} ref={modalRef}>
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
            <p>Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`${styles.modalBackdrop} ${darkMode ? styles.darkMode : ''}`}>
        <div className={`${styles.modalContainer} ${styles.errorModal} ${styles.glassmorphic}`} ref={modalRef}>
          <div className={styles.documentErrorContainer}>
            <div className={styles.documentError}>
              <AlertCircle size={64} />
              <h3>Error Loading Document</h3>
              <p>{error}</p>
              <button className={styles.primaryButton} onClick={handleBack}>Back to Library</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Document not found state
  if (!currentDocument) {
    return (
      <div className={`${styles.modalBackdrop} ${darkMode ? styles.darkMode : ''}`}>
        <div className={`${styles.modalContainer} ${styles.errorModal} ${styles.glassmorphic}`} ref={modalRef}>
          <div className={styles.documentErrorContainer}>
            <div className={styles.documentError}>
              <AlertCircle size={64} />
              <h3>Document Not Found</h3>
              <p>The requested document could not be loaded.</p>
              <button className={styles.primaryButton} onClick={handleBack}>Back to Library</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Split View mode
  if (viewMode === 'split') {
    return (
      <div className={`${styles.modalBackdrop} ${darkMode ? styles.darkMode : ''}`}>
        <div
          className={`
            ${styles.modalContainer} 
            ${isExiting ? styles.modalExit : ''} 
            ${fullscreen ? styles.fullscreenModal : ''} 
            ${leftPanelFullscreen ? styles.leftPanelFullscreen : ''} 
            ${rightPanelFullscreen ? styles.rightPanelFullscreen : ''} 
            ${styles.glassmorphic}
          `}
          ref={modalRef}
        >
          {/* Modal Header - Split View Mode */}
          <div className={styles.modalHeader}>
            <div className={styles.headerLeft}>
              <button
                className={styles.backButton}
                onClick={handleReturnToDocumentView}
                aria-label="Return to document view"
              >
                <ArrowLeft size={20} />
                <span>Back to Document</span>
              </button>
            </div>

            <div className={styles.documentInfo}>
              <h2 className={styles.documentTitle}>{currentDocument.fileName}</h2>
              <p className={styles.documentMeta}>
                {currentDocument.subject} • {currentDocument.fileSize} • Uploaded on {new Date(currentDocument.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className={styles.modalControls}>
              <button
                className={styles.controlButton}
                onClick={handleGenerateQuiz}
                aria-label="Generate quiz from summary"
              >
                <FileText size={18} />
                <span className={styles.controlLabel}>Generate Quiz</span>
              </button>
              <button
                className={styles.controlButton}
                onClick={toggleFullscreen}
                aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                <span className={styles.controlLabel}>{fullscreen ? 'Exit' : 'Fullscreen'}</span>
              </button>
              <button
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="Close document viewer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Split View Container */}
          <SplitViewContainer
            leftContent={renderDocumentContent()}
            rightContent={
              <SummaryViewer
                documentContent={currentDocument?.content || textContent}
                documentId={documentId}
                summary={summary}
                loading={summarizing}
                error={summaryError}
                summaryLength={summaryLength}
                setSummaryLength={setSummaryLength}
                summaryFormat={summaryFormat}
                setSummaryFormat={setSummaryFormat}
                onCopy={handleCopySummary}
                onRefresh={handleRefreshSummary}
                onDownload={handleDownloadSummary}
                isCopied={isSummaryCopied}
              />
            }
            leftTitle="Original Document"
            rightTitle="AI Summary"
            leftControls={
              <div className={styles.panelControls}>
                <button
                  className={styles.panelControlButton}
                  onClick={() => takeScreenshot(documentRef, "document")}
                  aria-label="Take screenshot of document"
                >
                  <Camera size={16} />
                </button>
                <button
                  className={styles.panelControlButton}
                  onClick={toggleLeftPanelFullscreen}
                  aria-label={leftPanelFullscreen ? "Exit fullscreen" : "Fullscreen document"}
                >
                  {leftPanelFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
              </div>
            }
            rightControls={
              <div className={styles.panelControls}>
                <button
                  className={styles.panelControlButton}
                  onClick={handleDownloadSummary}
                  aria-label="Download summary"
                >
                  <Download size={16} />
                </button>
                <button
                  className={styles.panelControlButton}
                  onClick={toggleRightPanelFullscreen}
                  aria-label={rightPanelFullscreen ? "Exit fullscreen" : "Fullscreen summary"}
                >
                  {rightPanelFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
              </div>
            }
            leftFooter={
              <div className={styles.sessionFooter}>
                <Clock size={16} /> Document viewing: <strong>{formatTime(sessionTime)}</strong>
              </div>
            }
            rightFooter={
              <div className={styles.sessionFooter}>
                <Clock size={16} /> Summary session: <strong>{formatTime(summaryTime)}</strong>
              </div>
            }
            splitRatio={preferredSplitRatio}
            presetControls={
              <div className={styles.splitPresets}>
                <button
                  className={`${styles.presetButton} ${preferredSplitRatio === 30 ? styles.activePreset : ''}`}
                  onClick={() => setSplitRatioPreset(30)}
                  aria-label="30:70 split ratio"
                >
                  <PanelLeft size={14} />
                  <span>30:70</span>
                </button>
                <button
                  className={`${styles.presetButton} ${preferredSplitRatio === 50 ? styles.activePreset : ''}`}
                  onClick={() => setSplitRatioPreset(50)}
                  aria-label="50:50 split ratio"
                >
                  <Layout size={14} />
                  <span>50:50</span>
                </button>
                <button
                  className={`${styles.presetButton} ${preferredSplitRatio === 70 ? styles.activePreset : ''}`}
                  onClick={() => setSplitRatioPreset(70)}
                  aria-label="70:30 split ratio"
                >
                  <PanelRight size={14} />
                  <span>70:30</span>
                </button>
              </div>
            }
          />

          {/* Footer Area */}
          <div className={styles.modalFooter}>
            <div className={styles.footerLeft}>
              <div className={styles.sessionTimer}>
                <Clock size={16} /> Total time: <strong>{formatTime(sessionTime)}</strong>
              </div>
            </div>

            <div className={styles.moreOptions}>
              <button
                className={`${styles.optionsButton} ${showOptions ? styles.activeOption : ''}`}
                onClick={toggleOptions}
                aria-label="Show more options"
                aria-expanded={showOptions}
              >
                <span>Options</span>
                <ChevronDown size={14} className={showOptions ? styles.rotatedChevron : ''} />
              </button>

              {showOptions && (
                <div className={styles.optionsDropdown}>
                  <div className={styles.optionSection}>
                    <h4>Current Options</h4>
                    <button className={styles.optionItem} onClick={toggleDarkMode}>
                      <div className={styles.optionDetail}>
                        <Moon size={16} />
                        <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                      </div>
                    </button>
                    <h4>Coming Soon</h4>
                    <div className={styles.optionItem} aria-disabled="true">
                      <div className={styles.optionDetail}>
                        <Volume2 size={16} />
                        <span>Text-to-Speech</span>
                      </div>
                      <span className={styles.comingSoonBadge}>Soon</span>
                    </div>
                    <div className={styles.optionItem} aria-disabled="true">
                      <div className={styles.optionDetail}>
                        <Search size={16} />
                        <span>Highlight Keywords</span>
                      </div>
                      <span className={styles.comingSoonBadge}>Soon</span>
                    </div>
                    <div className={styles.optionItem} aria-disabled="true">
                      <div className={styles.optionDetail}>
                        <Bookmark size={16} />
                        <span>Add Notes</span>
                      </div>
                      <span className={styles.comingSoonBadge}>Soon</span>
                    </div>
                    <div className={styles.optionItem} aria-disabled="true">
                      <div className={styles.optionDetail}>
                        <Share2 size={16} />
                        <span>Share</span>
                      </div>
                      <span className={styles.comingSoonBadge}>Soon</span>
                    </div>
                    <div className={styles.optionItem} aria-disabled="true">
                      <div className={styles.optionDetail}>
                        <ExternalLink size={16} />
                        <span>Open in New Tab</span>
                      </div>
                      <span className={styles.comingSoonBadge}>Soon</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Document View mode (default)
  return (
    <div className={`${styles.modalBackdrop} ${darkMode ? styles.darkMode : ''}`}>
      <div
        className={`${styles.modalContainer} ${isExiting ? styles.modalExit : ''} ${fullscreen ? styles.fullscreenModal : ''} ${styles.glassmorphic}`}
        ref={modalRef}
      >
        {/* Modal Header - Document View Mode */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <button
              className={styles.backButton}
              onClick={handleBack}
              aria-label="Back to document library"
            >
              <ArrowLeft size={20} />
              <span>Back to Library</span>
            </button>
          </div>

          <div className={styles.documentInfo}>
            <h2 className={styles.documentTitle}>{currentDocument.fileName}</h2>
            <p className={styles.documentMeta}>
              {currentDocument.subject} • {currentDocument.fileSize} • Uploaded on {new Date(currentDocument.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className={styles.modalControls}>
            <button
              className={styles.controlButton}
              onClick={handleDownload}
              aria-label="Download document"
            >
              
              <Download size={18} />
              <span className={styles.controlLabel}>Download</span>
            </button>
            <button
              className={styles.controlButton}
              onClick={() => takeScreenshot(documentRef, "document")}
              aria-label="Take screenshot"
            >
              <Camera size={18} />
              <span className={styles.controlLabel}>Screenshot</span>
            </button>
            <button
              className={styles.controlButton}
              onClick={toggleFullscreen}
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              <span className={styles.controlLabel}>{fullscreen ? 'Exit' : 'Fullscreen'}</span>
            </button>
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close document viewer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Document Container */}
        <div className={styles.modalBody}>
          {renderDocumentContent()}
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.footerLeft}>
            <div className={styles.sessionTimer}>
              <Clock size={16} /> Session time: <strong>{formatTime(sessionTime)}</strong>
            </div>
          </div>

          <div className={styles.footerRight}>
            <button
              className={styles.summarizeButton}
              onClick={handleSummarize}
              aria-label="Summarize document"
            >
              <span>Summarize</span>
            </button>

            <div className={styles.moreOptions}>
              <button
                className={`${styles.optionsButton} ${showOptions ? styles.activeOption : ''}`}
                onClick={toggleOptions}
                aria-label="Show more options"
                aria-expanded={showOptions}
              >
                <span>Options</span>
                <ChevronDown size={14} className={showOptions ? styles.rotatedChevron : ''} />
              </button>

              {showOptions && (
                <div className={styles.optionsDropdown}>
                  <div className={styles.optionSection}>
                    <h4>Current Options</h4>
                    <button className={styles.optionItem} onClick={toggleDarkMode}>
                      <div className={styles.optionDetail}>
                        <Moon size={16} />
                        <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                      </div>
                    </button>
                    <h4>Coming Soon</h4>
                    <div className={styles.optionItem} aria-disabled="true">
                      <div className={styles.optionDetail}>
                        <Volume2 size={16} />
                        <span>Text-to-Speech</span>
                      </div>
                      <span className={styles.comingSoonBadge}>Soon</span>
                    </div>
                    <div className={styles.optionItem} aria-disabled="true">
                      <div className={styles.optionDetail}>
                        <Search size={16} />
                        <span>Highlight Keywords</span>
                      </div>
                      <span className={styles.comingSoonBadge}>Soon</span>
                    </div>
                    <div className={styles.optionItem} aria-disabled="true">
                      <div className={styles.optionDetail}>
                        <Bookmark size={16} />
                        <span>Add Notes</span>
                      </div>
                      <span className={styles.comingSoonBadge}>Soon</span>
                    </div>
                    <div className={styles.optionItem} aria-disabled="true">
                      <div className={styles.optionDetail}>
                        <Share2 size={16} />
                        <span>Share</span>
                      </div>
                      <span className={styles.comingSoonBadge}>Soon</span>
                    </div>
                    <div className={styles.optionItem} aria-disabled="true">
                      <div className={styles.optionDetail}>
                        <ExternalLink size={16} />
                        <span>Open in New Tab</span>
                      </div>
                      <span className={styles.comingSoonBadge}>Soon</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DocumentViewer;