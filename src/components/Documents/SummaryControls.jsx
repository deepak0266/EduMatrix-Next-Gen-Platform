import React from 'react';
import styles from '../../styles/Documents/SummaryControls.module.css';
import { ChevronDown } from 'lucide-react';

const SummaryControls = ({ 
  summaryLength, 
  setSummaryLength, 
  summaryFormat,
  setSummaryFormat,
  onRefresh,
  isLoading
}) => {
  return (
    <div className={styles.controlsContainer}>
      <div className={styles.lengthSelector}>
        <label htmlFor="summary-length" className={styles.label}>Summary Length:</label>
        <div className={styles.selectWrapper}>
          <select 
            id="summary-length" 
            value={summaryLength} 
            onChange={(e) => setSummaryLength(e.target.value)}
            disabled={isLoading}
            className={styles.select}
          >
            <option value="short">Short (1-2 paragraphs)</option>
            <option value="medium">Medium (3-4 paragraphs)</option>
            <option value="long">Long (5+ paragraphs)</option>
          </select>
          <ChevronDown className={styles.selectIcon} size={18} />
        </div>
      </div>
      
      {summaryFormat && (
        <div className={styles.formatSelector}>
          <label htmlFor="summary-format" className={styles.label}>Format:</label>
          <div className={styles.selectWrapper}>
            <select 
              id="summary-format" 
              value={summaryFormat} 
              onChange={(e) => setSummaryFormat(e.target.value)}
              disabled={isLoading}
              className={styles.select}
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="bullets">Bullet Points</option>
              <option value="outline">Outline</option>
            </select>
            <ChevronDown className={styles.selectIcon} size={18} />
          </div>
        </div>
      )}
      
      <div className={styles.actionButtons}>
        <button 
          className={styles.actionButton} 
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Regenerate summary"
          title="Regenerate summary"
        >
          <svg className={styles.regenerateIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.8273 3 17.35 4.30367 19 6.34267" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 8C17 8 20 5 20 5C20 5 20 2 20 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isLoading ? 'Generating...' : 'Regenerate'}
        </button>
      </div>
    </div>
  );
};

export default SummaryControls;