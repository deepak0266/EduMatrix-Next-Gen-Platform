// src/components/games/BingoGame.js
import React, { useState, useEffect } from 'react';
import styles from '../../styles/games/BingoCard.module.css';

const generateBingoCard = () => {
  const card = [];
  for (let col = 0; col < 5; col++) {
    const numbers = new Set();
    while (numbers.size < 5) {
      const num = Math.floor(Math.random() * 15) + 1 + col * 15;
      numbers.add(num);
    }
    card.push([...numbers]);
  }

  // Transpose for row-major layout and insert "FREE"
  const transposed = Array.from({ length: 5 }, (_, rowIdx) =>
    card.map(col => col[rowIdx])
  );
  transposed[2][2] = 'FREE';
  return transposed;
};

const BingoGame = () => {
  const [bingoCard, setBingoCard] = useState([]);
  const [marked, setMarked] = useState([]);

  useEffect(() => {
    const newCard = generateBingoCard();
    setBingoCard(newCard);
    setMarked(Array.from({ length: 5 }, (_, i) =>
      Array.from({ length: 5 }, (_, j) => (i === 2 && j === 2 ? true : false))
    ));
  }, []);

  const handleCellClick = (row, col) => {
    if (bingoCard[row][col] !== 'FREE') {
      const updated = marked.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? !c : c))
      );
      setMarked(updated);
    }
  };

  const checkBingo = () => {
    for (let i = 0; i < 5; i++) {
      if (marked[i].every(Boolean)) return true; // Row
      if (marked.map(row => row[i]).every(Boolean)) return true; // Column
    }
    if ([0, 1, 2, 3, 4].every(i => marked[i][i])) return true; // Diagonal \
    if ([0, 1, 2, 3, 4].every(i => marked[i][4 - i])) return true; // Diagonal /
    return false;
  };

  const hasBingo = checkBingo();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bingo Game</h2>
      <div className={styles.card}>
        {['B', 'I', 'N', 'G', 'O'].map((letter, i) => (
          <div key={i} className={styles.headerCell}>{letter}</div>
        ))}
        {bingoCard.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${styles.cell} ${
                marked[rowIndex][colIndex] ? styles.marked : ''
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      {hasBingo && <div className={styles.bingoText}>🎉 BINGO! 🎉</div>}
    </div>
  );
};

export default BingoGame;
