import React, { useState } from 'react';
import styles from '../../styles/games/NumberGuessBattle.module.css'; // correct import

const NumberGuessBattle = () => {
  const [targetNumber, setTargetNumber] = useState(generateRandomNumber());
  const [playerGuess, setPlayerGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1; // 1-100
  }

  const handleGuess = () => {
    if (!playerGuess) return;

    const guess = parseInt(playerGuess, 10);
    setAttempts(attempts + 1);

    if (guess === targetNumber) {
      setFeedback(`🎉 Correct! You won in ${attempts + 1} tries!`);
      setGameOver(true);
    } else if (guess < targetNumber) {
      setFeedback('🔼 Too Low!');
    } else {
      setFeedback('🔽 Too High!');
    }
    setPlayerGuess('');
  };

  const handleRestart = () => {
    setTargetNumber(generateRandomNumber());
    setPlayerGuess('');
    setFeedback('');
    setAttempts(0);
    setGameOver(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Number Guess Battle</h1>
      <p className={styles.subtitle}>Guess a number between 1 and 100!</p>

      {!gameOver && (
        <div className={styles.inputSection}>
          <input
            type="number"
            value={playerGuess}
            onChange={(e) => setPlayerGuess(e.target.value)}
            className={styles.input}
            min="1"
            max="100"
          />
          <button onClick={handleGuess} className={styles.guessButton}>
            Guess
          </button>
        </div>
      )}

      <div className={styles.feedback}>
        {feedback && <p>{feedback}</p>}
      </div>

      <div className={styles.attempts}>
        {attempts > 0 && !gameOver && <p>Attempts: {attempts}</p>}
      </div>

      {gameOver && (
        <button onClick={handleRestart} className={styles.restartButton}>
          Play Again
        </button>
      )}
    </div>
  );
};

export default NumberGuessBattle;
