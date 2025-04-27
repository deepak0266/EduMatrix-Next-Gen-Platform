import React, { useState, useEffect, useRef } from 'react';
import {
  RefreshCw,
  Copy,
  ChevronDown,
  Download,
  AlertCircle
} from 'lucide-react';
import styles from '../../styles/Documents/SummaryViewer.module.css';

const SummaryViewer = ({
  summary,
  loading,
  error,
  summaryLength,
  setSummaryLength,
  summaryFormat,
  setSummaryFormat,
  onCopy,
  onRefresh,
  onDownload,
  isCopied
}) => {
  const [showLengthOptions, setShowLengthOptions] = useState(false);
  const [showFormatOptions, setShowFormatOptions] = useState(false);
  
  // Store the stable summary content without creating a dependency cycle
  const summaryContentRef = useRef(null);
  
  // We'll only update this ref when we have valid content and aren't loading
  useEffect(() => {
    // Only update our stable reference when:
    // 1. We have new summary data
    // 2. We're not in a loading state
    if (!loading && summary && summary.content) {
      summaryContentRef.current = summary.content;
    }
  }, [summary, loading]);

  // Format options
  const formatOptions = {
    paragraphs: 'Paragraphs',
    bullets: 'Bullet Points',
    outline: 'Outline'
  };

  // Length options
  const lengthOptions = {
    short: 'Brief (1-2 paragraphs)',
    medium: 'Standard (3-4 paragraphs)',
    long: 'Detailed (5+ paragraphs)'
  };

  // Handle summary length change
  const handleLengthChange = (length) => {
    setSummaryLength(length);
    setShowLengthOptions(false);
  };

  // Handle summary format change
  const handleFormatChange = (format) => {
    setSummaryFormat(format);
    setShowFormatOptions(false);
  };

  // Render error state
  if (error) {
    return (
      <div className={styles.summaryContainer}>
        <div className={styles.summaryErrorState}>
          <AlertCircle size={48} />
          <h3>Summary Generation Failed</h3>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={onRefresh}
          >
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // If first load with no content
  if (loading && !summaryContentRef.current) {
    return (
      <div className={styles.summaryContainer}>
        <div className={styles.summaryLoadingState}>
          <div className={styles.spinner}></div>
          <p>Generating summary...</p>
          <p className={styles.summaryLoadingMessage}>
            Analyzing document and creating summary based on your preferences
          </p>
        </div>
      </div>
    );
  }

  // Get the current content to display
  const displayContent = summaryContentRef.current || 
    (summary && typeof summary === 'string' ? summary : summary?.content) ||
    "No summary available";

  // Controls and content view
  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryContent}>
        <div className={styles.summaryBody}>
          {displayContent}
          {loading && (
            <div className={styles.refreshingIndicator}>
              <RefreshCw size={16} className={styles.rotatingIcon} /> Refreshing...
            </div>
          )}
        </div>
      </div>

      <div className={styles.summaryControls}>
        <div className={styles.controlGroup}>
          <div className={styles.dropdownControl}>
            <button
              className={styles.dropdownButton}
              onClick={() => setShowLengthOptions(!showLengthOptions)}
            >
              <span>Length: {lengthOptions[summaryLength].split(' ')[0]}</span>
              <ChevronDown
                size={14}
                className={showLengthOptions ? styles.rotatedChevron : ''}
              />
            </button>

            {showLengthOptions && (
              <div className={styles.dropdownMenu}>
                {Object.entries(lengthOptions).map(([key, value]) => (
                  <button
                    key={key}
                    className={`${styles.dropdownItem} ${summaryLength === key ? styles.activeItem : ''}`}
                    onClick={() => handleLengthChange(key)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.dropdownControl}>
            <button
              className={styles.dropdownButton}
              onClick={() => setShowFormatOptions(!showFormatOptions)}
            >
              <span>Format: {formatOptions[summaryFormat]}</span>
              <ChevronDown
                size={14}
                className={showFormatOptions ? styles.rotatedChevron : ''}
              />
            </button>

            {showFormatOptions && (
              <div className={styles.dropdownMenu}>
                {Object.entries(formatOptions).map(([key, value]) => (
                  <button
                    key={key}
                    className={`${styles.dropdownItem} ${summaryFormat === key ? styles.activeItem : ''}`}
                    onClick={() => handleFormatChange(key)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button
            className={`${styles.actionButton} ${loading ? styles.disabledButton : ''}`}
            onClick={onRefresh}
            title="Regenerate Summary"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? styles.rotatingIcon : ''} />
          </button>

          <button
            className={styles.actionButton}
            onClick={onCopy}
            title={isCopied ? 'Copied!' : 'Copy to Clipboard'}
          >
            <Copy size={16} />
            {isCopied && <span className={styles.copiedBadge}>Copied!</span>}
          </button>

          <button
            className={styles.actionButton}
            onClick={onDownload}
            title="Download Summary"
          >
            <Download size={16} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default SummaryViewer;