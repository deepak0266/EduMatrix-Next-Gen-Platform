import React, { useState } from 'react';
import styles from '../../styles/games/TicTacToe.module.css'; // Correct CSS path

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const handleClick = (index) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  };

  const checkWinner = (squares) => {
    const lines = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // columns
      [0,4,8], [2,4,6]           // diagonals
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>Tic Tac Toe</h1>
      <div className={styles.board}>
        {board.map((square, index) => (
          <div 
            key={index} 
            className={styles.square}
            onClick={() => handleClick(index)}
          >
            {square}
          </div>
        ))}
      </div>
      <div className={styles.gameInfo}>
        {winner ? (
          <h2 className={styles.winnerText}>Winner: {winner}</h2>
        ) : board.every(Boolean) ? (
          <h2 className={styles.drawText}>It's a Draw!</h2>
        ) : (
          <h2 className={styles.nextTurnText}>Next Turn: {isXNext ? 'X' : 'O'}</h2>
        )}
        <button className={styles.restartButton} onClick={handleRestart}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
