import React from 'react';
import styles from '../../styles/Documents/SummaryViewer.module.css';

const SummaryPlaceholder = ({ isLoading, error }) => {
  if (isLoading) {
    return (
      <div className={styles.placeholder}>
        <div className={styles.loadingAnimation}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
        <p className={styles.loadingText}>Generating your summary...</p>
        <p className={styles.loadingSubtext}>Analyzing content and extracting key points</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorPlaceholder}>
        <div className={styles.errorIcon}>!</div>
        <p className={styles.errorText}>We encountered an issue</p>
        <p className={styles.errorSubtext}>{error}</p>
        <button className={styles.retryButton}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={styles.emptyPlaceholder}>
      <div className={styles.emptyIcon}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 10H48C50.2091 10 52 11.7909 52 14V50C52 52.2091 50.2091 54 48 54H16C13.7909 54 12 52.2091 12 50V14C12 11.7909 13.7909 10 16 10Z" stroke="#B0BEC5" strokeWidth="2"/>
          <path d="M20 20H44" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 28H44" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 36H36" stroke="#B0BEC5" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <p className={styles.emptyText}>Select a document to summarize</p>
      <p className={styles.emptySubtext}>Choose a document from your collection to generate a summary</p>
    </div>
  );
};

export default SummaryPlaceholder;