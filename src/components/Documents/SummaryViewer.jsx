import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Copy, 
  Download, 
  BookOpen, 
  Award, 
  BarChart3, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Code,
  Printer,
  Maximize2,
  RefreshCw,
  Translate,
  Volume2,
  Search,
  MessageSquare,
  Share2,
  Moon,
  ExternalLink,
  Bookmark
} from 'lucide-react';
import styles from '../../styles/Documents/SummaryViewer.module.css';

const SummaryControls = ({ 
  summaryLength, 
  setSummaryLength, 
  summaryFormat, 
  setSummaryFormat, 
  onRefresh, 
  isLoading 
}) => {
  return (
    <div className={styles.summaryControlsContainer}>
      <div className={styles.controlGroup}>
        <label htmlFor="summaryLength" className={styles.controlLabel}>
          <BarChart3 size={14} className={styles.controlIcon} />
          Length:
        </label>
        <div className={styles.segmentedControl}>
          <button 
            className={`${styles.segmentButton} ${summaryLength === 'short' ? styles.activeSegment : ''}`}
            onClick={() => setSummaryLength('short')}
            disabled={isLoading}
          >
            Short
          </button>
          <button 
            className={`${styles.segmentButton} ${summaryLength === 'medium' ? styles.activeSegment : ''}`}
            onClick={() => setSummaryLength('medium')}
            disabled={isLoading}
          >
            Medium
          </button>
          <button 
            className={`${styles.segmentButton} ${summaryLength === 'long' ? styles.activeSegment : ''}`}
            onClick={() => setSummaryLength('long')}
            disabled={isLoading}
          >
            Long
          </button>
        </div>
      </div>
      
      <div className={styles.controlGroup}>
        <label htmlFor="summaryFormat" className={styles.controlLabel}>
          <FileText size={14} className={styles.controlIcon} />
          Format:
        </label>
        <div className={styles.segmentedControl}>
          <button 
            className={`${styles.segmentButton} ${summaryFormat === 'paragraphs' ? styles.activeSegment : ''}`}
            onClick={() => setSummaryFormat('paragraphs')}
            disabled={isLoading}
          >
            Paragraphs
          </button>
          <button 
            className={`${styles.segmentButton} ${summaryFormat === 'bullets' ? styles.activeSegment : ''}`}
            onClick={() => setSummaryFormat('bullets')}
            disabled={isLoading}
          >
            Bullets
          </button>
          <button 
            className={`${styles.segmentButton} ${summaryFormat === 'outline' ? styles.activeSegment : ''}`}
            onClick={() => setSummaryFormat('outline')}
            disabled={isLoading}
          >
            Outline
          </button>
        </div>
      </div>
      
      <button 
        className={styles.refreshButton} 
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw size={14} className={styles.refreshIcon} />
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </button>

      <div className={styles.translationContainer}>
        <select className={styles.translationSelect} disabled>
          <option value="original">Translate (Coming Soon)</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>
    </div>
  );
};

const SummaryActions = ({ onCopy, onDownload, onPrint, disabled }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={styles.summaryActionsContainer}>
      <button 
        className={styles.actionButton} 
        onClick={handleCopy} 
        disabled={disabled}
        aria-label="Copy to clipboard"
      >
        {copied ? <Check size={16} className={styles.copySuccess} /> : <Copy size={16} />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
      <button 
        className={styles.actionButton} 
        onClick={onDownload} 
        disabled={disabled}
        aria-label="Download summary"
      >
        <Download size={16} />
        <span>Download</span>
      </button>
      <button 
        className={styles.actionButton} 
        onClick={onPrint} 
        disabled={disabled}
        aria-label="Print summary"
      >
        <Printer size={16} />
        <span>Print</span>
      </button>
    </div>
  );
};

const AdvancedFeatures = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.advancedFeaturesContainer}>
      <button 
        className={styles.advancedFeaturesToggle}
        onClick={() => setExpanded(!expanded)}
      >
        <span>Advanced Features</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className={styles.advancedFeaturesList}>
          <button className={`${styles.featureButton} ${styles.comingSoon}`} disabled>
            <Volume2 size={16} />
            <span>Text-to-Speech</span>
            <span className={styles.comingSoonBadge}>Soon</span>
          </button>
          <button className={`${styles.featureButton} ${styles.comingSoon}`} disabled>
            <Search size={16} />
            <span>Highlight Keywords</span>
            <span className={styles.comingSoonBadge}>Soon</span>
          </button>
          <button className={`${styles.featureButton} ${styles.comingSoon}`} disabled>
            <MessageSquare size={16} />
            <span>Add Notes</span>
            <span className={styles.comingSoonBadge}>Soon</span>
          </button>
          <button className={`${styles.featureButton} ${styles.comingSoon}`} disabled>
            <Share2 size={16} />
            <span>Share Summary</span>
            <span className={styles.comingSoonBadge}>Soon</span>
          </button>
          <button className={`${styles.featureButton} ${styles.comingSoon}`} disabled>
            <Bookmark size={16} />
            <span>Bookmark</span>
            <span className={styles.comingSoonBadge}>Soon</span>
          </button>
          <button className={`${styles.featureButton} ${styles.comingSoon}`} disabled>
            <Moon size={16} />
            <span>Dark Mode</span>
            <span className={styles.comingSoonBadge}>Soon</span>
          </button>
          <button className={`${styles.featureButton} ${styles.comingSoon}`} disabled>
            <ExternalLink size={16} />
            <span>Open in New Tab</span>
            <span className={styles.comingSoonBadge}>Soon</span>
          </button>
        </div>
      )}
    </div>
  );
};

const SummaryPlaceholder = ({ isLoading, error }) => {
  if (isLoading) {
    return (
      <div className={styles.summaryPlaceholder}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.placeholderText}>Generating AI summary...</p>
        <p className={styles.placeholderSubtext}>This may take a few moments</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.summaryPlaceholder}>
        <div className={styles.errorIcon}>!</div>
        <p className={styles.placeholderText}>Error: {error}</p>
        <button className={styles.retryButton}>Try Again</button>
      </div>
    );
  }
  
  return (
    <div className={styles.summaryPlaceholder}>
      <div className={styles.placeholderIcon}>
        <BarChart3 size={36} />
      </div>
      <p className={styles.placeholderText}>
        No summary available
      </p>
      <p className={styles.placeholderSubtext}>
        Click the "Summarize" button to generate an AI summary of this document
      </p>
    </div>
  );
};

const KeyPointsSection = ({ keyPoints }) => {
  const [expanded, setExpanded] = useState(true);
  
  return (
    <div className={styles.keyPointsSection}>
      <div 
        className={styles.keyPointsHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className={styles.keyPointsTitle}>
          <Award size={16} className={styles.keyPointsIcon} />
          Key Points
        </h3>
        <button className={styles.expandButton}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {expanded && (
        <ul className={styles.keyPointsList}>
          {keyPoints.map((point, index) => (
            <li key={index} className={styles.keyPoint}>
              <div className={styles.keyPointBullet}>{index + 1}</div>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState({
    originalWordCount: 0,
    summaryWordCount: 0,
    compressionRatio: '0%'
  });
  const [keyPoints, setKeyPoints] = useState([]);
  const [showSummaryTips, setShowSummaryTips] = useState(false);

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
      const ratio = documentContent && stats.originalWordCount > 0 ? 
        Math.round(100 - ((wordCount / stats.originalWordCount) * 100)) : 0;
      
      setStats(prev => ({
        ...prev,
        summaryWordCount: wordCount,
        compressionRatio: `${ratio}%`
      }));
      
      // Extract key points from summary
      if (summary.keyPoints && Array.isArray(summary.keyPoints)) {
        setKeyPoints(summary.keyPoints);
      } else {
        // Generate placeholder key points if not available
        setKeyPoints([
          'First key point extracted from the document',
          'Second important concept from the text',
          'Third significant idea from the content',
          'Fourth notable element from the document'
        ]);
      }
    }
  }, [summary, documentContent, stats.originalWordCount]);

  const handleCopy = () => {
    if (!summary || !summary.content) return;
    
    navigator.clipboard.writeText(summary.content)
      .then(() => {
        setSuccessMessage('Summary copied to clipboard!');
        setTimeout(() => setSuccessMessage(''), 2000);
      })
      .catch(err => console.error('Failed to copy summary:', err));
  };

  const handleDownload = () => {
    if (!summary || !summary.content) return;
    
    const blob = new Blob([summary.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `summary-${documentId || 'document'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setSuccessMessage('Summary downloaded!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handlePrint = () => {
    if (!summary || !summary.content) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Document Summary</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; line-height: 1.6; }
            h1 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            .summary { margin-top: 20px; }
            .key-points { margin-top: 30px; }
            .key-points h2 { color: #555; }
            .key-points ul { padding-left: 20px; }
            .key-points li { margin-bottom: 10px; }
            .stats { color: #777; font-size: 0.9em; margin-top: 30px; }
          </style>
        </head>
        <body>
          <h1>Document Summary</h1>
          <div class="summary">${summary.content.replace(/\n/g, '<br>')}</div>
          <div class="key-points">
            <h2>Key Points</h2>
            <ul>
              ${keyPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
          </div>
          <div class="stats">
            Original: ${stats.originalWordCount} words | Summary: ${stats.summaryWordCount} words | Compression: ${stats.compressionRatio}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    
    setSuccessMessage('Preparing print view...');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const toggleSummaryTips = () => {
    setShowSummaryTips(!showSummaryTips);
  };

  return (
    <div className={styles.summaryViewerContainer}>
      {successMessage && (
        <div className={styles.successMessage}>
          <Check size={16} className={styles.successIcon} />
          {successMessage}
        </div>
      )}
      
      <div className={styles.summaryHeader}>
        <h3 className={styles.summaryTitle}>
          <FileText size={18} className={styles.summaryIcon} />
          AI Summary
        </h3>
        
        {!loading && summary && (
          <SummaryActions 
            onCopy={handleCopy}
            onDownload={handleDownload}
            onPrint={handlePrint}
            disabled={!summary || !summary.content}
          />
        )}
      </div>
      
      {!loading && summary && (
        <SummaryControls
          summaryLength={summaryLength}
          setSummaryLength={setSummaryLength}
          summaryFormat={summaryFormat}
          setSummaryFormat={setSummaryFormat}
          onRefresh={() => {
            if (onExportSummary) onExportSummary();
          }}
          isLoading={loading}
        />
      )}
      
      {summary && !loading && !error && (
        <div className={styles.insightBar}>
          <div className={styles.insightItem}>
            <span className={styles.insightLabel}>Original</span>
            <span className={styles.insightValue}>{stats.originalWordCount} words</span>
          </div>
          <div className={styles.insightDivider}></div>
          <div className={styles.insightItem}>
            <span className={styles.insightLabel}>Summary</span>
            <span className={styles.insightValue}>{stats.summaryWordCount} words</span>
          </div>
          <div className={styles.insightDivider}></div>
          <div className={styles.insightItem}>
            <span className={styles.insightLabel}>Compression</span>
            <span className={styles.insightValue}>{stats.compressionRatio}</span>
          </div>
        </div>
      )}
      
      <div className={styles.summaryContentWrapper}>
        <div className={styles.summaryContent}>
          {loading ? (
            <SummaryPlaceholder isLoading={true} />
          ) : error ? (
            <SummaryPlaceholder error={error} />
          ) : !summary ? (
            <SummaryPlaceholder />
          ) : (
            <>
              <div className={styles.summaryText}>
                {summaryFormat === 'paragraphs' && (
                  <div className={styles.paragraphView}>
                    {summary.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className={styles.summaryParagraph}>{paragraph}</p>
                    ))}
                  </div>
                )}
                
                {summaryFormat === 'bullets' && (
                  <ul className={styles.bulletList}>
                    {summary.content.split('\n').filter(line => line.trim()).map((bullet, index) => (
                      <li key={index} className={styles.bulletItem}>{bullet}</li>
                    ))}
                  </ul>
                )}
                
                {summaryFormat === 'outline' && (
                  <div className={styles.outlineView}>
                    {summary.content.split('\n\n').map((section, index) => {
                      const lines = section.split('\n');
                      const title = lines[0];
                      const content = lines.slice(1).join('\n');
                      
                      return (
                        <div key={index} className={styles.outlineSection}>
                          {title && <h4 className={styles.outlineTitle}>{title}</h4>}
                          {content && <p className={styles.outlineContent}>{content}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <KeyPointsSection keyPoints={keyPoints} />
              
              <div className={styles.summaryFooter}>
                <div className={styles.summaryButtons}>
                  <button 
                    className={styles.quizButton}
                    onClick={onGenerateQuiz}
                  >
                    Generate Quiz
                  </button>
                  <button 
                    className={styles.exportButton}
                    onClick={onExportSummary}
                  >
                    Export Summary
                  </button>
                </div>
                
                <AdvancedFeatures />
                
                <div className={styles.summaryTipsToggle} onClick={toggleSummaryTips}>
                  <Code size={14} className={styles.tipsIcon} />
                  <span>Summary Tips</span>
                  {showSummaryTips ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                
                {showSummaryTips && (
                  <div className={styles.summaryTips}>
                    <h4>Tips for using AI summaries effectively:</h4>
                    <ul>
                      <li>Use shorter summaries for quick overview, longer ones for more detail</li>
                      <li>Bullet points help identify key concepts quickly</li>
                      <li>The outline format is useful for structured information</li>
                      <li>Check accuracy by comparing with the original document</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryViewer;