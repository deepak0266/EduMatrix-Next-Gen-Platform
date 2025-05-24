import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/games/CarRacingGame.module.css';

const CarRacingGame = () => {
  const gameAreaRef = useRef(null);
  const [playerX, setPlayerX] = useState(140); // Middle position
  const [enemyY, setEnemyY] = useState(-50);
  const [enemyX, setEnemyX] = useState(140);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Move player car with arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft' && playerX > 0) {
        setPlayerX((x) => x - 70);
      } else if (e.key === 'ArrowRight' && playerX < 280) {
        setPlayerX((x) => x + 70);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerX, gameOver]);

  // Enemy car movement
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setEnemyY((y) => {
        if (y >= 400) {
          setScore((s) => s + 1);
          const lanes = [0, 140, 280];
          setEnemyX(lanes[Math.floor(Math.random() * lanes.length)]);
          return -50;
        }
        return y + 5;
      });

      // Collision detection
      if (Math.abs(enemyY - 340) < 40 && enemyX === playerX) {
        setGameOver(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [enemyY, enemyX, playerX, gameOver]);

  return (
    <div className={styles.container}>
      <h2>Car Racing Game</h2>
      <div className={styles.gameArea} ref={gameAreaRef}>
        <div
          className={styles.car}
          style={{ bottom: 10, left: `${playerX}px`, backgroundColor: 'blue' }}
        />
        <div
          className={styles.car}
          style={{ top: `${enemyY}px`, left: `${enemyX}px`, backgroundColor: 'red' }}
        />
        {gameOver && <div className={styles.gameOver}>Game Over</div>}
      </div>
      <p className={styles.score}>Score: {score}</p>
    </div>
  );
};

export default CarRacingGame;
