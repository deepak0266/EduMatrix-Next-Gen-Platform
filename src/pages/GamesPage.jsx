import React, { useState, useEffect } from 'react';
import { Star, Clock, Trophy, Brain, Heart, Filter, Search } from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';
import styles from '../styles/Pages/GamesPage.module.css';

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const { switchMode } = useChatbot();

  useEffect(() => {
    switchMode('game');
  }, [switchMode]);

  useEffect(() => {
    setTimeout(() => {
      setGames([
        { id: 1, title: 'Code Puzzle', description: 'Solve coding challenges', category: 'coding' },
        { id: 2, title: 'Memory Match', description: 'Match pairs of cards', category: 'memory' },
      ]);
      setCategories(['all', 'coding', 'memory', 'math']);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const renderGameInterface = () => {
    if (!selectedGame) return null;

    return (
      <div className={styles.gameInterfaceContainer}>
        <h2 className={styles.gameTitle}>{selectedGame.title}</h2>
        <p className={styles.gameDescription}>{selectedGame.description}</p>
        <div className={styles.gameInterfaceInner}>
          <p>Game interface for {selectedGame.title} would be implemented here.</p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.gameContainer}>
      <header className={styles.gameHeader}>
        <div className={styles.gameHeaderContent}>
          <h1>Games Library</h1>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.categoriesSection}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`${styles.categoryButton} ${
                activeCategory === category ? styles.activeCategory : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.gamesGrid}>
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className={styles.gameCardContainer}
              onClick={() => handleGameSelect(game)}
            >
              <div className={styles.gameCardContent}>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedGame ? (
          <div className={styles.selectedGameSection}>
            {renderGameInterface()}
          </div>
        ) : (
          <div className={styles.gameInitialSelect}>
            <Brain className={styles.initialSelectIcon} size={48} />
            <h3 className={styles.initialSelectTitle}>Select a Game to Play</h3>
            <p className={styles.initialSelectDescription}>
              Browse through our collection of educational games and challenges.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default GamesPage;