import React from 'react';
import styles from '../../styles/common.module.css';

/**
 * Reusable Button component with multiple variants
 * @param {string} variant - primary, secondary, danger, success, or ghost
 * @param {string} size - sm, md, lg
 * @param {boolean} fullWidth - whether button should take full width
 * @param {boolean} isLoading - shows loading spinner when true
 * @param {boolean} disabled - disables the button
 * @param {function} onClick - click handler function
 * @param {node} children - button content
 * @param {string} className - additional classes
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  ...props
}) => {
  const baseClass = styles.button;
  const variantClass = styles[`button-${variant}`];
  const sizeClass = styles[`button-${size}`];
  const widthClass = fullWidth ? styles.buttonFullWidth : '';
  
  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className={styles.buttonLoading}>
          <span className={styles.buttonLoadingSpinner}></span>
          <span className={styles.buttonLoadingText}>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;