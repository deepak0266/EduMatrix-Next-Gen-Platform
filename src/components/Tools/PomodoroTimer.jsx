import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import styles from '../../styles/Tools/PomodoroTimer.module.css';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const timerModes = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      playAlarm();
      handleTimerComplete();
    }
  }, [timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(timerModes[mode]);
    setIsRunning(false);
  };

  const switchMode = (newMode) => {
    clearInterval(timerRef.current);
    setMode(newMode);
    setTimeLeft(timerModes[newMode]);
    setIsRunning(false);
  };

  const handleTimerComplete = () => {
    if (mode === 'pomodoro') {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      if (newCycles % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      switchMode('pomodoro');
    }
  };

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.pomodoroContainer}>
      <h2 className={styles.title}>Pomodoro Timer</h2>
      
      <div className={styles.timerDisplay}>
        <div className={styles.time}>{formatTime(timeLeft)}</div>
        <div className={styles.mode}>{mode === 'pomodoro' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}</div>
      </div>
      
      <div className={styles.controls}>
        <button 
          className={styles.controlButton}
          onClick={isRunning ? pauseTimer : startTimer}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? <Pause /> : <Play />}
        </button>
        
        <button 
          className={styles.controlButton}
          onClick={resetTimer}
          aria-label="Reset timer"
        >
          <RotateCcw />
        </button>
      </div>
      
      <div className={styles.modeButtons}>
        <button 
          className={`${styles.modeButton} ${mode === 'pomodoro' ? styles.activeMode : ''}`} 
          onClick={() => switchMode('pomodoro')}
        >
          Pomodoro
        </button>
        <button 
          className={`${styles.modeButton} ${mode === 'shortBreak' ? styles.activeMode : ''}`} 
          onClick={() => switchMode('shortBreak')}
        >
          Short Break
        </button>
        <button 
          className={`${styles.modeButton} ${mode === 'longBreak' ? styles.activeMode : ''}`} 
          onClick={() => switchMode('longBreak')}
        >
          Long Break
        </button>
      </div>
      
      <div className={styles.cycles}>
        <p>Completed cycles: {Math.floor(cycles / 4)}</p>
        <div className={styles.cycleIndicators}>
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`${styles.cycleIndicator} ${i < (cycles % 4) ? styles.completedCycle : ''}`}
            />
          ))}
        </div>
      </div>
      
      <div className={styles.infoBox}>
        <h3>How to use:</h3>
        <p>1. Work for 25 minutes (Pomodoro)</p>
        <p>2. Take a 5-minute break (Short Break)</p>
        <p>3. After 4 Pomodoros, take a 15-minute break (Long Break)</p>
        <p>4. Repeat to maximize productivity!</p>
      </div>
      
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/timer-complete.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default PomodoroTimer;