import React from 'react';
import styles from '../../styles/common.module.css';

/**
 * Loading spinner component with customizable size and color
 * @param {string} size - sm, md, lg, xl
 * @param {string} color - primary, secondary, light, dark
 * @param {string} text - optional loading text
 * @param {boolean} overlay - whether to display as a fullscreen overlay
 * @param {string} className - additional classes
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  text,
  overlay = false,
  className = '',
}) => {
  const spinnerSize = styles[`spinner-${size}`];
  const spinnerColor = styles[`spinner-${color}`];

  if (overlay) {
    return (
      <div className={styles.spinnerOverlay}>
        <div className={styles.spinnerContainer}>
          <div className={`${styles.spinner} ${spinnerSize} ${spinnerColor} ${className}`}></div>
          {text && <p className={styles.spinnerText}>{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.spinnerContainer}>
      <div className={`${styles.spinner} ${spinnerSize} ${spinnerColor} ${className}`}></div>
      {text && <p className={styles.spinnerText}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;