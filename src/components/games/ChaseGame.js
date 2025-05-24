import React, { useEffect, useState } from "react";
import styles from '../../styles/games/ChaseGame.module.css';


const GRID_SIZE = 10;

const ChaseGame = () => {
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [enemy, setEnemy] = useState({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });

  // Handle arrow key movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayer((prev) => {
        let { x, y } = prev;
        if (e.key === "ArrowUp") y = Math.max(0, y - 1);
        else if (e.key === "ArrowDown") y = Math.min(GRID_SIZE - 1, y + 1);
        else if (e.key === "ArrowLeft") x = Math.max(0, x - 1);
        else if (e.key === "ArrowRight") x = Math.min(GRID_SIZE - 1, x + 1);
        return { x, y };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Enemy chases player
  useEffect(() => {
    const interval = setInterval(() => {
      setEnemy((prev) => {
        let { x, y } = prev;
        if (x < player.x) x++;
        else if (x > player.x) x--;
        if (y < player.y) y++;
        else if (y > player.y) y--;
        return { x, y };
      });
    }, 300);
    return () => clearInterval(interval);
  }, [player]);

  // Game over check
  useEffect(() => {
    if (player.x === enemy.x && player.y === enemy.y) {
      alert("Game Over! You've been caught!");
      setPlayer({ x: 0, y: 0 });
      setEnemy({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });
    }
  }, [player, enemy]);

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        let cellClass = styles.cell;
        if (x === player.x && y === player.y) {
          cellClass += ` ${styles.player}`;
        } else if (x === enemy.x && y === enemy.y) {
          cellClass += ` ${styles.enemy}`;
        }
        cells.push(<div key={`${x}-${y}`} className={cellClass}></div>);
      }
    }
    return cells;
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Chase Game</h3>
      <div className={styles.grid}>{renderGrid()}</div>
      <p className={styles.instructions}>Use arrow keys to escape the enemy!</p>
    </div>
  );
};

export default ChaseGame;
