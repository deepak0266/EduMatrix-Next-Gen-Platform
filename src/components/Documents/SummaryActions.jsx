import React, { useState, useEffect } from 'react';
import styles from '../../styles/Documents/SummaryActions.module.css';
import { MessageSquare, BookOpen, FileText, Check, X } from 'lucide-react';

const SummaryActions = ({ summary, documentTitle }) => {
  const [activeTab, setActiveTab] = useState('key-points');
  const [notification, setNotification] = useState(null);
  
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary)
      .then(() => showNotification('Summary copied to clipboard!'))
      .catch(() => showNotification('Failed to copy to clipboard', 'error'));
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