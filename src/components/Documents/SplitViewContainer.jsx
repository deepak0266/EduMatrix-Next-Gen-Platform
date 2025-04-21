import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/Documents/DocumentViewer.module.css';

const SplitViewContainer = ({ 
  leftContent, 
  rightContent, 
  leftTitle, 
  rightTitle,
  leftControls,
  rightControls,
  leftFooter,
  rightFooter,
  splitRatio = 50,
  presetControls
}) => {
  // Use the prop as initial value and maintain internal state
  const [internalSplitRatio, setInternalSplitRatio] = useState(splitRatio);
  const containerRef = useRef(null);
  const dividerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startSplitRef = useRef(splitRatio);

  // Update internal state when prop changes
  useEffect(() => {
    setInternalSplitRatio(splitRatio);
  }, [splitRatio]);

  // Mouse event handlers with improved calculations
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      
      const container = containerRef.current;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Calculate position as percentage of container width
      const position = e.clientX - containerRect.left;
      const percentage = (position / containerWidth) * 100;
      
      // Clamp between 15% and 85% to prevent panels from becoming too small
      const newSplitRatio = Math.min(Math.max(percentage, 15), 85);
      
      setInternalSplitRatio(newSplitRatio);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (e) => {
      e.preventDefault(); // Prevent text selection
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startSplitRef.current = internalSplitRatio;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const divider = dividerRef.current;
    if (divider) {
      divider.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (divider) {
        divider.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [internalSplitRatio]);

  // Touch event handlers with improved calculations
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || !e.touches.length) return;
      
      const container = containerRef.current;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Calculate position as percentage of container width
      const position = e.touches[0].clientX - containerRect.left;
      const percentage = (position / containerWidth) * 100;
      
      // Clamp between 15% and 85% to prevent panels from becoming too small
      const newSplitRatio = Math.min(Math.max(percentage, 15), 85);
      
      setInternalSplitRatio(newSplitRatio);
      e.preventDefault(); // Prevent scrolling while dragging
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleTouchStart = (e) => {
      if (!e.touches.length) return;
      e.preventDefault(); // Prevent default touch behavior
      isDraggingRef.current = true;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      startXRef.current = e.touches[0].clientX;
      startSplitRef.current = internalSplitRatio;
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    };

    const divider = dividerRef.current;
    if (divider) {
      divider.addEventListener('touchstart', handleTouchStart, { passive: false });
    }

    return () => {
      if (divider) {
        divider.removeEventListener('touchstart', handleTouchStart);
      }
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [internalSplitRatio]);

  return (
    <div className={styles.splitViewContainer} ref={containerRef}>
      {/* Left Panel */}
      <div 
        className={styles.splitPanel} 
        style={{ width: `${internalSplitRatio}%` }}
        aria-label={leftTitle}
      >
        <div className={styles.panelHeader}>
          <h3>{leftTitle}</h3>
          {leftControls && (
            <div className={styles.panelControls}>
              {leftControls}
            </div>
          )}
        </div>
        <div className={styles.panelContent}>
          {leftContent}
        </div>
        {leftFooter && (
          <div className={styles.panelFooter}>
            {leftFooter}
          </div>
        )}
      </div>
      
      {/* Divider */}
      <div 
        className={styles.splitDivider} 
        ref={dividerRef}
        aria-hidden="true"
      >
        <div className={styles.dividerHandle}></div>
      </div>
      
      {/* Right Panel */}
      <div 
        className={styles.splitPanel} 
        style={{ width: `${100 - internalSplitRatio}%` }}
        aria-label={rightTitle}
      >
        <div className={styles.panelHeader}>
          <h3>{rightTitle}</h3>
          {rightControls && (
            <div className={styles.panelControls}>
              {rightControls}
            </div>
          )}
        </div>
        <div className={styles.panelContent}>
          {rightContent}
        </div>
        {rightFooter && (
          <div className={styles.panelFooter}>
            {rightFooter}
          </div>
        )}
      </div>
      
      {/* Preset controls if provided */}
      {presetControls && (
        <div className={styles.presetControlsContainer}>
          {presetControls}
        </div>
      )}
    </div>
  );
};

export default SplitViewContainer;