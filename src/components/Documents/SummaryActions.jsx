import React, { useState } from 'react';
import styles from '../../styles/Documents/SummaryActions.module.css';
import { MessageSquare, BookOpen, FileText, Check, X, Save, Download, Copy, Share2 } from 'lucide-react';

const SummaryActions = ({ 
  onSave,
  onDownload,
  onCopy,
  onShare,
  disabled = false
}) => {
  const [activeTab, setActiveTab] = useState('key-points');
  const [notification, setNotification] = useState(null);
  
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const handleCopy = () => {
    if (onCopy) {
      onCopy();
      showNotification('Summary copied to clipboard!');
    }
  };
  
  return (
    <div className={styles.actionsContainer}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'key-points' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('key-points')}
        >
          <MessageSquare size={16} />
          <span>Key Points</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'full-summary' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('full-summary')}
        >
          <BookOpen size={16} />
          <span>Full Summary</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'notes' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <FileText size={16} />
          <span>My Notes</span>
        </button>
      </div>
      
      <div className={styles.actionButtons}>
        <button 
          className={styles.actionButton}
          onClick={onSave}
          disabled={disabled}
        >
          <Save size={18} />
          <span>Save</span>
        </button>
        
        <button 
          className={styles.actionButton}
          onClick={onDownload}
          disabled={disabled}
        >
          <Download size={18} />
          <span>Download</span>
        </button>
        
        <button 
          className={styles.actionButton}
          onClick={handleCopy}
          disabled={disabled}
        >
          <Copy size={18} />
          <span>Copy</span>
        </button>
        
        {onShare && (
          <button 
            className={styles.actionButton}
            onClick={onShare}
            disabled={disabled}
          >
            <Share2 size={18} />
            <span>Share</span>
          </button>
        )}
      </div>
      
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.type === 'success' ? (
            <Check size={16} className={styles.notificationIcon} />
          ) : (
            <X size={16} className={styles.notificationIcon} />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default SummaryActions;