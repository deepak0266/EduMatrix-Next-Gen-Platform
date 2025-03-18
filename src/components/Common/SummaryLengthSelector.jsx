import React from 'react';
import styles from '../../styles/Common/SummaryLengthSelector.module.css';
import { ChevronDown } from 'lucide-react';

const SummaryLengthSelector = ({ value, onChange, disabled }) => {
  const options = [
    { value: 'short', label: 'Short (1-2 paragraphs)', description: 'Quick overview of main points' },
    { value: 'medium', label: 'Medium (3-4 paragraphs)', description: 'Balanced summary with key details' },
    { value: 'long', label: 'Long (5+ paragraphs)', description: 'Comprehensive coverage of content' }];

    return (
      <div className={styles.container}>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className={styles.icon} size={18} />
        </div>
        <p className={styles.description}>
          {options.find(option => option.value === value)?.description}
        </p>
      </div>
    );
  };
  
  export default SummaryLengthSelector;