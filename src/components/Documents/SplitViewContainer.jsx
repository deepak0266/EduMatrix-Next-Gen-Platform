import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/Documents/SplitView.module.css';

const SplitViewContainer = ({ 
  leftContent, 
  rightContent, 
  leftTitle, 
  rightTitle,
  leftControls,
  rightControls,
  leftFooter,
  rightFooter,
  initialSplitRatio = 50,
  presetControls
}) => {
  // Use the prop as initial value and maintain internal state
  const [splitRatio, setSplitRatio] = useState(initialSplitRatio);
  const [showRatioTooltip, setShowRatioTooltip] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef(null);
  const dividerRef = useRef(null);
  const startXRef = useRef(0);
  const startSplitRef = useRef(initialSplitRatio);

  // Apply preset ratio
  const applyPresetRatio = (ratio) => {
    setSplitRatio(ratio);
  };

  // Mouse event handlers with improved calculations
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const container = containerRef.current;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Calculate position as percentage of container width
      const position = e.clientX - containerRect.left;
      const percentage = (position / containerWidth) * 100;
      
      // Clamp between 15% and 85% to prevent panels from becoming too small
      const newSplitRatio = Math.min(Math.max(percentage, 15), 85);
      
      setSplitRatio(newSplitRatio);
      setShowRatioTooltip(true);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setTimeout(() => setShowRatioTooltip(false), 1000);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (e) => {
      e.preventDefault(); // Prevent text selection
      setIsDragging(true);
      startXRef.current = e.clientX;
      startSplitRef.current = splitRatio;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      setShowRatioTooltip(true);
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
  }, [isDragging, splitRatio]);

  // Touch event handlers with improved calculations
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!isDragging || !e.touches.length) return;
      
      const container = containerRef.current;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Calculate position as percentage of container width
      const position = e.touches[0].clientX - containerRect.left;
      const percentage = (position / containerWidth) * 100;
      
      // Clamp between 15% and 85% to prevent panels from becoming too small
      const newSplitRatio = Math.min(Math.max(percentage, 15), 85);
      
      setSplitRatio(newSplitRatio);
      setShowRatioTooltip(true);
      e.preventDefault(); // Prevent scrolling while dragging
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setTimeout(() => setShowRatioTooltip(false), 1000);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleTouchStart = (e) => {
      if (!e.touches.length) return;
      e.preventDefault(); // Prevent default touch behavior
      setIsDragging(true);
      setShowRatioTooltip(true);
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      startXRef.current = e.touches[0].clientX;
      startSplitRef.current = splitRatio;
      
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
  }, [isDragging, splitRatio]);

  // Calculate panel widths
  const leftPanelWidth = `${splitRatio}%`;
  const rightPanelWidth = `${100 - splitRatio}%`;

  // Create CSS class names with conditional active states
  const containerClasses = `${styles.splitViewContainer} ${isDragging ? styles.dragging : ''}`;
  const dividerClasses = `${styles.splitDivider} ${isDragging ? styles.activeDivider : ''}`;
  const leftPanelClasses = `${styles.splitPanel} ${styles.leftPanel} ${styles.animatedPanel}`;
  const rightPanelClasses = `${styles.splitPanel} ${styles.rightPanel} ${styles.animatedPanel}`;

  return (
    <div className={containerClasses} ref={containerRef}>
      {/* Left Panel - Document */}
      <div 
        className={leftPanelClasses}
        style={{ width: leftPanelWidth }}
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
        className={dividerClasses} 
        ref={dividerRef}
        aria-hidden="true"
      >
        <div className={styles.dividerHandleContainer}>
          <div className={styles.dividerHandle}>
            <div className={styles.gripDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        
        {showRatioTooltip && (
          <div className={styles.ratioHint}>
            {`${Math.round(splitRatio)}:${Math.round(100 - splitRatio)}`}
          </div>
        )}
        
        {/* Preset ratio controls */}
        <div className={styles.presetControls}>
          <button 
            className={styles.presetButton} 
            onClick={() => applyPresetRatio(30)}
            aria-label="30:70 split"
          >
            30:70
          </button>
          <button 
            className={styles.presetButton} 
            onClick={() => applyPresetRatio(50)}
            aria-label="50:50 split"
          >
            50:50
          </button>
          <button 
            className={styles.presetButton} 
            onClick={() => applyPresetRatio(70)}
            aria-label="70:30 split"
          >
            70:30
          </button>
        </div>
      </div>
      
      {/* Right Panel - Summary */}
      <div 
        className={rightPanelClasses}
        style={{ width: rightPanelWidth }}
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
      
      {/* Custom preset controls if provided */}
      {presetControls && (
        <div className={styles.customPresetControls}>
          {presetControls}
        </div>
      )}
    </div>
  );
};

export default SplitViewContainer;