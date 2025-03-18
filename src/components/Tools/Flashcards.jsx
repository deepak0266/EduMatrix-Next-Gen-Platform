import React, { useState, useEffect } from 'react';
import styles from '../../styles/Tools/Flashcards.module.css';
import { ChevronLeft, ChevronRight, RotateCw, Star, Trash2 } from 'lucide-react';

const Flashcards = ({ cards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [localCards, setLocalCards] = useState(cards);

  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % localCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + localCards.length) % localCards.length);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
  };

  const deleteCard = (id) => {
    setLocalCards(prev => prev.filter(card => card.id !== id));
    if (currentIndex >= localCards.length - 1) setCurrentIndex(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Flashcards</h2>
        <div className={styles.progress}>
          {currentIndex + 1} / {localCards.length}
        </div>
      </div>

      <div className={styles.cardContainer}>
        <button className={styles.navButton} onClick={handlePrev}>
          <ChevronLeft size={32} />
        </button>

        <div 
          className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={styles.cardFront}>
            <div className={styles.cardContent}>
              {localCards[currentIndex]?.question || "No cards available"}
              <div className={styles.controls}>
                <button 
                  className={`${styles.iconButton} ${favorites.has(localCards[currentIndex]?.id) ? styles.favorite : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(localCards[currentIndex]?.id);
                  }}
                >
                  <Star size={20} />
                </button>
                <button 
                  className={styles.iconButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCard(localCards[currentIndex]?.id);
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className={styles.cardBack}>
            <div className={styles.cardContent}>
              {localCards[currentIndex]?.answer || "Add answer in card maker"}
              <div className={styles.hint}>Click to flip back</div>
            </div>
          </div>
        </div>

        <button className={styles.navButton} onClick={handleNext}>
          <ChevronRight size={32} />
        </button>
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.resetButton}
          onClick={() => {
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
        >
          <RotateCw size={20} />
          Reset Progress
        </button>
      </div>
    </div>
  );
};

export default Flashcards;