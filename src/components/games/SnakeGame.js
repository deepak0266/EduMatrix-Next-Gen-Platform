import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/games/SnakeGame.module.css';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [direction, setDirection] = useState([0, -1]);
  const [isGameOver, setIsGameOver] = useState(false);

  const boardSize = 20;
  const cellSize = 20;

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection([0, -1]);
          break;
        case 'ArrowDown':
          setDirection([0, 1]);
          break;
        case 'ArrowLeft':
          setDirection([-1, 0]);
          break;
        case 'ArrowRight':
          setDirection([1, 0]);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGameOver) moveSnake();
    }, 150);
    return () => clearInterval(interval);
  }, [snake, direction, isGameOver]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = [...newSnake[0]];
    head[0] += direction[0];
    head[1] += direction[1];

    // Collision check
    if (
      head[0] < 0 ||
      head[1] < 0 ||
      head[0] >= boardSize ||
      head[1] >= boardSize ||
      newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])
    ) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head[0] === food[0] && head[1] === food[1]) {
      placeFood(newSnake);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const placeFood = (snakeBody) => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * boardSize),
        Math.floor(Math.random() * boardSize)
      ];
    } while (snakeBody.some(([x, y]) => x === newFood[0] && y === newFood[1]));
    setFood(newFood);
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, boardSize * cellSize, boardSize * cellSize);

    // Draw snake
    ctx.fillStyle = '#4caf50';
    snake.forEach(([x, y]) => {
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    });

    // Draw food
    ctx.fillStyle = '#f44336';
    ctx.fillRect(food[0] * cellSize, food[1] * cellSize, cellSize, cellSize);
  }, [snake, food]);

  const restartGame = () => {
    setSnake([[10, 10]]);
    setFood([15, 15]);
    setDirection([0, -1]);
    setIsGameOver(false);
  };

  return (
    <div className={styles.snakeContainer}>
      <canvas
        ref={canvasRef}
        width={boardSize * cellSize}
        height={boardSize * cellSize}
        className={styles.snakeCanvas}
      />
      {isGameOver && (
        <div className={styles.overlay}>
          <h2>Game Over</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
