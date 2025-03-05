import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../styles/common.module.css';
import Button from './Button';

/**
 * Modal component with customizable size and content
 * @param {boolean} isOpen - controls modal visibility
 * @param {function} onClose - function to close the modal
 * @param {string} title - modal title
 * @param {node} children - modal content
 * @param {string} size - sm, md, lg, xl, full
 * @param {boolean} showCloseButton - whether to show the close button in the header
 * @param {node} footer - custom footer content (optional)
 * @param {boolean} closeOnOutsideClick - whether clicking outside closes the modal
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  footer,
  closeOnOutsideClick = true,
}) => {
  const modalRef = useRef(null);
  const modalSize = styles[`modal-${size}`];
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    const handleOutsideClick = (e) => {
      if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, closeOnOutsideClick]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={`${styles.modalContainer} ${modalSize}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          {showCloseButton && (
            <button className={styles.modalCloseButton} onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className={styles.modalContent}>
          {children}
        </div>
        {footer && (
          <div className={styles.modalFooter}>
            {footer}
          </div>
        )}
        {!footer && (
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary">Confirm</Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;