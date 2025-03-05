// // src/components/Tools/PomodoroTimer.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import styles from '../../styles/Tools/PomodoroTimer.module.css';
// import Button from '../Common/Button';
// import { FaPlay, FaPause, FaRedo, FaCog } from 'react-icons/fa';

// const DEFAULT_TIMER_CONFIG = {
//   work: 25 * 60, // 25 minutes in seconds
//   shortBreak: 5 * 60, // 5 minutes
//   longBreak: 15 * 60, // 15 minutes
//   sessionsBeforeLongBreak: 4
// };

// // Timer states
// const TIMER_STATES = {
//   WORK: 'work',
//   SHORT_BREAK: 'shortBreak',
//   LONG_BREAK: 'longBreak'
// };

// const PomodoroTimer = () => {
//   const [config, setConfig] = useState(DEFAULT_TIMER_CONFIG);
//   const [isRunning, setIsRunning] = useState(false);
//   const [currentState, setCurrentState] = useState(TIMER_STATES.WORK);
//   const [timeLeft, setTimeLeft] = useState(config.work);
//   const [sessionsCompleted, setSessionsCompleted] = useState(0);
//   const [showSettings, setShowSettings] = useState(false);
  
//   // Timer interval ref
//   const timerRef = useRef(null);
  
//   // Play notification sound
//   const playNotification = () => {
//     try {
//       const audio = new Audio('/notification.mp3');
//       audio.play();
//     } catch (error) {
//       console.error('Error playing notification sound:', error);
//     }
//   };
  
//   // Start the timer
//   const startTimer = () => {
//     if (!isRunning) {
//       setIsRunning(true);
//       timerRef.current = setInterval(() => {
//         setTimeLeft(prev => {
//           if (prev <= 1) {
//             // Time's up, transition to next state
//             handleTimerComplete();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//   };
  
//   // Pause the timer
//   const pauseTimer = () => {
//     if (isRunning) {
//       clearInterval(timerRef.current);
//       setIsRunning(false);
//     }
//   };
  
//   // Reset the timer
//   const resetTimer = () => {
//     pauseTimer();
//     setTimeLeft(config[currentState]);
//   };
  
//   // Handle timer completion
//   const handleTimerComplete = () => {
//     pauseTimer();
//     playNotification();
    
//     // Move to next timer state
//     if (currentState === TIMER_STATES.WORK) {
//       const newSessionsCompleted = sessionsCompleted + 1;
//       setSessionsCompleted(newSessionsCompleted);
      
//       if (newSessionsCompleted % config.sessionsBeforeLongBreak === 0) {
//         setCurrentState(TIMER_STATES.LONG_BREAK);
//         setTimeLeft(config.longBreak);
//       } else {
//         setCurrentState(TIMER_STATES.SHORT_BREAK);
//         setTimeLeft(config.shortBreak);
//       }
//     } else {
//       // After any break, go back to work
//       setCurrentState(TIMER_STATES.WORK);
//       setTimeLeft(config.work);
//     }
//   };
  
//   // Update the timer when state changes
//   useEffect(() => {
//     resetTimer();
//   }, [currentState, config]);
  
//   // Clean up timer on unmount
//   useEffect(() => {
//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, []);
  
//   // Format time as MM:SS
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };
  
//   // Update timer settings
//   const updateSettings = (newSettings) => {
//     setConfig({
//       ...config,
//       ...newSettings
//     });
//     setShowSettings(false);
//   };
  
//   // Get the current timer label
//   const getTimerLabel = () => {
//     switch (currentState) {
//       case TIMER_STATES.WORK:
//         return 'Work';
//       case TIMER_STATES.SHORT_BREAK:
//         return 'Short Break';
//       case TIMER_STATES.LONG_BREAK:
//         return 'Long Break';
//       default:
//         return 'Timer';
//     }
//   };
  
//   return (
//     <div className={styles.pomodoroContainer}>
//       <div className={styles.timerHeader}>
//         <h2>Pomodoro Timer</h2>
//         <button 
//           className={styles.settingsButton}
//           onClick={() => setShowSettings(!showSettings)}
//         >
//           <FaCog />
//         </button>
//       </div>
      
//       {showSettings ? (
//         <TimerSettings 
//           config={config} 
//           onSave={updateSettings} 
//           onCancel={() => setShowSettings(false)} 
//         />
//       ) : (
//         <>
//           <div className={styles.timerStates}>
//             <button
//               className={`${styles.stateButton} ${currentState === TIMER_STATES.WORK ? styles.activeState : ''}`}
//               onClick={() => {
//                 setCurrentState(TIMER_STATES.WORK);
//                 setTimeLeft(config.work);
//               }}
//             >
//               Work
//             </button>
//             <button
//               className={`${styles.stateButton} ${currentState === TIMER_STATES.SHORT_BREAK ? styles.activeState : ''}`}
//               onClick={() => {
//                 setCurrentState(TIMER_STATES.SHORT_BREAK);
//                 setTimeLeft(config.shortBreak);
//               }}
//             >
//               Short Break
//             </button>
//             <button
//               className={`${styles.stateButton} ${currentState === TIMER_STATES.LONG_BREAK ? styles.activeState : ''}`}
//               onClick={() => {
//                 setCurrentState(TIMER_STATES.LONG_BREAK);
//                 setTimeLeft(config.longBreak);
//               }}
//             >
//               Long Break
//             </button>
//           </div>
          
//           <div className={styles.timerDisplay}>
//             <div className={styles.timerLabel}>{getTimerLabel()}</div>
//             <div className={styles.timeLeft}>{formatTime(timeLeft)}</div>
//             <div className={styles.sessionCounter}>
//               Session: {Math.floor(sessionsCompleted / config.sessionsBeforeLongBreak) + 1} 
//               ({sessionsCompleted % config.sessionsBeforeLongBreak + 1}/{config.sessionsBeforeLongBreak})
//             </div>
//           </div>
          
//           <div className={styles.timerControls}>
//             {isRunning ? (
//               <Button
//                 variant="secondary"
//                 size="large"
//                 onClick={pauseTimer}
//                 className={styles.controlButton}
//               >
//                 <FaPause /> Pause
//               </Button>
//             ) : (
//               <Button
//                 variant="primary"
//                 size="large" 
//                 onClick={startTimer}
//                 className={styles.controlButton}
//               >
//                 <FaPlay /> Start
//               </Button>
//             )}
//             <Button
//               variant="secondary"
//               size="large"
//               onClick={resetTimer}
//               className={styles.controlButton}
//             >
//               <FaRedo /> Reset
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // Settings sub-component
// const TimerSettings = ({ config, onSave, onCancel }) => {
//   const [workMinutes, setWorkMinutes] = useState(Math.floor(config.work / 60));
//   const [shortBreakMinutes, setShortBreakMinutes] = useState(Math.floor(config.shortBreak / 60));
//   const [longBreakMinutes, setLongBreakMinutes] = useState(Math.floor(config.longBreak / 60));
//   const [sessionsCount, setSessionsCount] = useState(config.sessionsBeforeLongBreak);
  
//   const handleSave = () => {
//     onSave({
//       work: workMinutes * 60,
//       shortBreak: shortBreakMinutes * 60,
//       longBreak: longBreakMinutes * 60,
//       sessionsBeforeLongBreak: sessionsCount
//     });
//   };
  
//   return (
//     <div className={styles.settingsContainer}>
//       <h3>Timer Settings</h3>
      
//       <div className={styles.settingGroup}>
//         <label htmlFor="workTime">Work Time (minutes):</label>
//         <input
//           id="workTime"
//           type="number"
//           min="1"
//           max="60"
//           value={workMinutes}
//           onChange={(e) => setWorkMinutes(Number(e.target.value))}
//         />
//       </div>
      
//       <div className={styles.settingGroup}>
//         <label htmlFor="shortBreak">Short Break (minutes):</label>
//         <input
//           id="shortBreak"
//           type="number"
//           min="1"
//           max="30"
//           value={shortBreakMinutes}
//           onChange={(e) => setShortBreakMinutes(Number(e.target.value))}
//         />
//       </div>
      
//       <div className={styles.settingGroup}>
//         <label htmlFor="longBreak">Long Break (minutes):</label>
//         <input
//           id="longBreak"
//           type="number"
//           min="1"
//           max="60"
//           value={longBreakMinutes}
//           onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
//         />
//       </div>
      
//       <div className={styles.settingGroup}>
//         <label htmlFor="sessionsCount">Sessions before Long Break:</label>
//         <input
//           id="sessionsCount"
//           type="number"
//           min="1"
//           max="10"
//           value={sessionsCount}
//           onChange={(e) => setSessionsCount(Number(e.target.value))}
//         />
//       </div>
      
//       <div className={styles.settingsButtons}>
//         <Button variant="secondary" onClick={onCancel}>Cancel</Button>
//         <Button variant="primary" onClick={handleSave}>Save</Button>
//       </div>
//     </div>
//   );
// };

// export default PomodoroTimer;