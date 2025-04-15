import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, ArrowLeft, ArrowRight } from 'lucide-react';
import styles from '../../styles/Documents/SplitView.module.css';

const SplitViewContainer = ({ 
  leftContent, 
  rightContent, 
  leftTitle, 
  rightTitle,
  leftFooter,
  rightFooter
}) => {
  const [splitPosition, setSplitPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [leftFullscreen, setLeftFullscreen] = useState(false);
  const [rightFullscreen, setRightFullscreen] = useState(false);
  const containerRef = useRef(null);
  const splitterRef = useRef(null);
  const [showSplitterTooltip, setShowSplitterTooltip] = useState(false);

  // Handle mouse dragging for splitter
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      
      // Calculate position as percentage (between 20% and 80%)
      const newPosition = Math.max(20, Math.min(80, (mouseX / containerWidth) * 100));
      setSplitPosition(newPosition);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const toggleLeftFullscreen = () => {
    setLeftFullscreen(!leftFullscreen);
    setRightFullscreen(false);
  };

  const toggleRightFullscreen = () => {
    setRightFullscreen(!rightFullscreen);
    setLeftFullscreen(false);
  };

  // Handle keyboard accessibility for splitter
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setSplitPosition(Math.max(20, splitPosition - 5));
    } else if (e.key === 'ArrowRight') {
      setSplitPosition(Math.min(80, splitPosition + 5));
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`${styles.splitContainer} ${leftFullscreen ? styles.leftFullscreen : ''} ${rightFullscreen ? styles.rightFullscreen : ''}`}
    >
      <div 
        className={styles.leftPanel} 
        style={{ width: leftFullscreen ? '100%' : rightFullscreen ? '0' : `${splitPosition}%` }}
      >
        <div className={styles.panelHeader}>
          <h3>{leftTitle || 'Document'}</h3>
          <button 
            className={styles.fullscreenButton} 
            onClick={toggleLeftFullscreen}
            aria-label={leftFullscreen ? "Exit fullscreen" : "Expand document"}
          >
            {leftFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
        <div className={styles.panelContent}>
          {leftContent}
        </div>
        {leftFooter && <div className={styles.panelFooter}>{leftFooter}</div>}
      </div>
      
      {!leftFullscreen && !rightFullscreen && (
        <div 
          ref={splitterRef}
          className={styles.splitter}
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setShowSplitterTooltip(true)}
          onMouseLeave={() => setShowSplitterTooltip(false)}
          tabIndex="0"
          role="separator"
          aria-valuenow={splitPosition}
          aria-valuemin={20}
          aria-valuemax={80}
          aria-label="Resize panels"
        >
          <div className={styles.splitterHandle}>
            <ArrowLeft size={12} />
            <ArrowRight size={12} />
          </div>
          {showSplitterTooltip && (
            <div className={styles.splitterTooltip}>
              Drag to resize
            </div>
          )}
        </div>
      )}
      
      <div 
        className={styles.rightPanel} 
        style={{ width: rightFullscreen ? '100%' : leftFullscreen ? '0' : `${100 - splitPosition}%` }}
      >
        <div className={styles.panelHeader}>
          <h3>{rightTitle || 'Summary'}</h3>
          <button 
            className={styles.fullscreenButton} 
            onClick={toggleRightFullscreen}
            aria-label={rightFullscreen ? "Exit fullscreen" : "Expand summary"}
          >
            {rightFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
        <div className={styles.panelContent}>
          {rightContent}
        </div>
        {rightFooter && <div className={styles.panelFooter}>{rightFooter}</div>}
      </div>
    </div>
  );
};

export default SplitViewContainer;