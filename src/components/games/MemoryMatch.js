// src/components/games/MemoryMatch.js
import React, { useState, useEffect } from 'react';
import styles from '../../styles/games/MemoryMatch.module.css';

const cardsData = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍉'];
const shuffledCards = [...cardsData, ...cardsData]
  .sort(() => 0.5 - Math.random())
  .map((item, index) => ({ id: index, content: item, flipped: false, matched: false }));

const MemoryMatch = () => {
  const [cards, setCards] = useState(shuffledCards);
  const [selected, setSelected] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      if (cards[first].content === cards[second].content) {
        setCards((prev) =>
          prev.map((card, index) =>
            index === first || index === second ? { ...card, matched: true } : card
          )
        );
        setMatchedCount(matchedCount + 1);
      }

      setTimeout(() => {
        setCards((prev) =>
          prev.map((card, index) =>
            index === first || index === second ? { ...card, flipped: false } : card
          )
        );
        setSelected([]);
      }, 800);
    }
  }, [selected]);

  const handleFlip = (index) => {
    if (selected.length === 2 || cards[index].flipped || cards[index].matched) return;

    const flippedCards = [...cards];
    flippedCards[index].flipped = true;
    setCards(flippedCards);
    setSelected((prev) => [...prev, index]);
  };

  const resetGame = () => {
    const reshuffled = [...cardsData, ...cardsData]
      .sort(() => 0.5 - Math.random())
      .map((item, index) => ({ id: index, content: item, flipped: false, matched: false }));
    setCards(reshuffled);
    setSelected([]);
    setMatchedCount(0);
  };

  return (
    <div className={styles.memoryGameContainer}>
      <div className={styles.memoryGrid}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`${styles.card} ${card.flipped || card.matched ? styles.flipped : ''}`}
            onClick={() => handleFlip(index)}
          >
            {card.flipped || card.matched ? card.content : '❓'}
          </div>
        ))}
      </div>
      {matchedCount === cardsData.length && (
        <div className={styles.victoryMessage}>
          🎉 You matched all cards!
          <button className={styles.resetButton} onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;
