import React, { useState, useEffect } from 'react';
import SummaryControls from './SummaryControls';
import SummaryActions from './SummaryActions';
import SummaryPlaceholder from './SummaryPlaceholder';
import { Check } from 'lucide-react';
import styles from '../../styles/Documents/SummaryViewer.module.css';

const SummaryViewer = ({ 
  documentContent, 
  documentId,
  summary,
  loading,
  error,
  summaryLength,
  setSummaryLength,
  summaryFormat,
  setSummaryFormat,
  onGenerateQuiz,
  onExportSummary
}) => {
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
    if (summary && summary.content) {
      const wordCount = summary.content.trim().split(/\s+/).length;
      const ratio = documentContent ? 
        Math.round(100 - ((wordCount / stats.originalWordCount) * 100)) : 0;
      
      setStats(prev => ({
        ...prev,
        summaryWordCount: wordCount,
        compressionRatio: `${ratio}%`
      }));
    }
  }, [summary, documentContent, stats.originalWordCount]);

  const handleCopy = () => {
    if (!summary || !summary.content) return;
    
    navigator.clipboard.writeText(summary.content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy summary:', err));
  };

  const handleSave = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
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
          onRefresh={() => {
            // This should trigger re-summarization
            if (onExportSummary) onExportSummary();
          }}
          isLoading={loading}
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
        {loading ? (
          <SummaryPlaceholder isLoading={true} />
        ) : error ? (
          <SummaryPlaceholder error={error} />
        ) : (
          <div className={styles.summaryText}>
            {summary && summary.content ? (
              <>
                {summaryFormat === 'paragraphs' && (
                  <div className={styles.paragraphView}>
                    {summary.content.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
                {summaryFormat === 'bullets' && (
                  <ul className={styles.bulletList}>
                    {summary.content.split('\n').filter(line => line.trim()).map((bullet, index) => (
                      <li key={index}>{bullet.replace(/^•\s*/, '')}</li>
                    ))}
                  </ul>
                )}
                {summaryFormat === 'outline' && (
                  <ol className={styles.outlineList}>
                    {summary.content.split('\n\n').map((point, index) => (
                      <li key={index}>{point.replace(/^\d+\.\s/, '')}</li>
                    ))}
                  </ol>
                )}
              </>
            ) : (
              <SummaryPlaceholder />
            )}
          </div>
        )}
      </div>
      
      <div className={styles.summaryActionsBar}>
        <SummaryActions
          onSave={handleSave}
          onDownload={() => {
            if (onExportSummary) onExportSummary();
          }}
          onCopy={handleCopy}
          onShare={() => {
            // Handle sharing functionality
          }}
          disabled={loading || !summary || !summary.content}
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
      
      {summary && summary.content && (
        <div className={styles.quizGenerationSection}>
          <button 
            className={styles.generateQuizButton} 
            onClick={onGenerateQuiz}
            disabled={loading}
          >
            Generate Quiz from Summary
          </button>
          <p className={styles.quizInfo}>
            Create a quiz based on this document to test your understanding.
          </p>
        </div>
      )}
    </div>
  );
};

export default SummaryViewer;