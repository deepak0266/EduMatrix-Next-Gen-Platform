import React, { useState, useEffect } from 'react';
import { useSummary } from '../../contexts/SummaryContext';
import SummaryControls from './SummaryControls';
import SummaryActions from './SummaryActions';
import SummaryPlaceholder from './SummaryPlaceholder';
import { Check, Copy } from 'lucide-react';
import styles from '../../styles/Documents/SummaryViewer.module.css';

const SummaryViewer = ({ documentContent, documentId }) => {
  const { 
    summary, 
    summaryLoading, 
    summaryError, 
    summaryLength, 
    summaryFormat,
    setSummaryLength, 
    setSummaryFormat, 
    generateSummary, 
    saveSummary 
  } = useSummary();
  
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    originalWordCount: 0,
    summaryWordCount: 0,
    compressionRatio: '0%'
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (documentContent) {
      const wordCount = documentContent.trim().split(/\s+/).length;
      setStats(prev => ({
        ...prev,
        originalWordCount: wordCount
      }));
    }
  }, [documentContent]);

  useEffect(() => {
    if (summary) {
      const wordCount = summary.trim().split(/\s+/).length;
      const ratio = documentContent ? 
        Math.round((wordCount / stats.originalWordCount) * 100) : 0;
      
      setStats(prev => ({
        ...prev,
        summaryWordCount: wordCount,
        compressionRatio: `${ratio}%`
      }));
    }
  }, [summary, documentContent, stats.originalWordCount]);

  const handleGenerateSummary = async () => {
    if (!documentContent) return;
    await generateSummary(documentContent, { 
      length: summaryLength, 
      format: summaryFormat 
    });
  };

  useEffect(() => {
    if (documentContent) {
      handleGenerateSummary();
    }
  }, [documentContent, summaryLength, summaryFormat]);

  const handleSave = async () => {
    if (!summary || !documentId) return;
    
    try {
      await saveSummary(documentId, summary);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Failed to save summary:', error);
    }
  };

  const handleDownload = () => {
    if (!summary) return;
    
    const element = document.createElement('a');
    const file = new Blob([summary], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `summary-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    if (!summary) return;
    
    navigator.clipboard.writeText(summary)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy summary:', err));
  };

  const handleShare = () => {
    if (!summary || !navigator.share) return;
    
    navigator.share({
      title: 'Document Summary',
      text: summary,
    }).catch(err => console.error('Failed to share summary:', err));
  };

  if (!documentContent) {
    return <SummaryPlaceholder />;
  }

  return (
    <div className={styles.summaryViewerContainer}>
      <div className={styles.summaryHeader}>
        <h3 className={styles.summaryTitle}>Document Summary</h3>
        
        <SummaryControls
          summaryLength={summaryLength}
          setSummaryLength={setSummaryLength}
          summaryFormat={summaryFormat}
          setSummaryFormat={setSummaryFormat}
          onRefresh={handleGenerateSummary}
          isLoading={summaryLoading}
        />
      </div>
      
      <div className={styles.summaryStatsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Original</span>
          <span className={styles.statValue}>{stats.originalWordCount} words</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Summary</span>
          <span className={styles.statValue}>{stats.summaryWordCount} words</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Compression</span>
          <span className={styles.statValue}>{stats.compressionRatio}</span>
        </div>
      </div>
      
      <div className={styles.summaryContent}>
        {summaryLoading ? (
          <SummaryPlaceholder isLoading={true} />
        ) : summaryError ? (
          <SummaryPlaceholder error={summaryError} />
        ) : (
          <div className={styles.summaryText}>
            {summaryFormat === 'paragraphs' && (
              <p>{summary}</p>
            )}
            {summaryFormat === 'bullets' && (
              <ul className={styles.bulletList}>
                {summary.split('\n\n').map((bullet, index) => (
                  <li key={index}>{bullet.replace('• ', '')}</li>
                ))}
              </ul>
            )}
            {summaryFormat === 'outline' && (
              <ol className={styles.outlineList}>
                {summary.split('\n\n').map((point, index) => (
                  <li key={index}>{point.replace(/^\d+\.\s/, '')}</li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.summaryActionsBar}>
        <SummaryActions
          onSave={handleSave}
          onDownload={handleDownload}
          onCopy={handleCopy}
          onShare={handleShare}
          disabled={summaryLoading || !summary}
        />
        
        {copied && (
          <div className={styles.copiedToast}>
            <Check size={16} className={styles.checkIcon} />
            <span>Copied to clipboard</span>
          </div>
        )}
        
        {showSuccessMessage && (
          <div className={styles.successToast}>
            <Check size={16} className={styles.checkIcon} />
            <span>Summary saved successfully</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryViewer;