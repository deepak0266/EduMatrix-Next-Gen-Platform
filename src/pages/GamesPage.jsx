import { useState, useEffect } from 'react';
import { Brain, Search } from 'lucide-react';

import MemoryMatch from '../components/games/MemoryMatch';
import SnakeGame from '../components/games/SnakeGame';
import TicTacToe from '../components/games/TicTacToe';
import NumberGuessBattle from '../components/games/NumberGuessBattle';
import CarRacingGame from '../components/games/CarRacingGame';
import ChaseGame from '../components/games/ChaseGame';
import BingoGame from '../components/games/BingoCard';

import styles from '../styles/Pages/GamesPage.module.css';

const GamePage = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setGames([
        { id: 1, title: 'Code Puzzle', description: 'Solve coding challenges', category: 'coding' },
        { id: 2, title: 'Memory Match', description: 'Match pairs of cards', category: 'memory' },
        { id: 3, title: 'Snake Game', description: 'Classic snake game', category: 'arcade' },
        { id: 4, title: 'Tic Tac Toe', description: 'Classic X and O game', category: 'strategy' },
        { id: 5, title: 'Number Guess Battle', description: 'Guess the number and win!', category: 'math' },
        { id: 6, title: 'Chase Game', description: 'Avoid the enemy block!', category: 'arcade' },
        { id: 7, title: 'Car Racing Game', description: 'Dodge enemy cars on the road!', category: 'arcade' },
        { id: 8, title: 'Bingo Game', description: 'Mark your card and get BINGO!', category: 'strategy' },
      ]);
      setCategories(['all', 'coding', 'memory', 'math', 'arcade', 'strategy']);
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
        <button
          onClick={() => setSelectedGame(null)}
          className={styles.backButton}
        >
          ← Back to Games
        </button>
        <h2 className={styles.gameTitle}>{selectedGame.title}</h2>
        <p className={styles.gameDescription}>{selectedGame.description}</p>
        <div className={styles.gameInterfaceInner}>
          {selectedGame.title === 'Memory Match' ? (
            <MemoryMatch />
          ) : selectedGame.title === 'Snake Game' ? (
            <SnakeGame />
          ) : selectedGame.title === 'Tic Tac Toe' ? (
            <TicTacToe />
          ) : selectedGame.title === 'Number Guess Battle' ? (
            <NumberGuessBattle />
          ) : selectedGame.title === 'Chase Game' ? (
            <ChaseGame />
          ) : selectedGame.title === 'Car Racing Game' ? (
            <CarRacingGame />
          ) : selectedGame.title === 'Bingo Game' ? (
            <BingoGame />
          ) : (
            <p>Game interface for {selectedGame.title} would be implemented here.</p>
          )}
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
    (activeCategory === 'all' || game.category === activeCategory) &&
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
        {!selectedGame ? (
          <>
            <div className={styles.categoriesSection}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`${styles.categoryButton} ${
                    activeCategory === category ? styles.activeCategory : ''
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
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
                    <span className={styles.gameCategory}>{game.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.selectedGameSection}>
            {renderGameInterface()}
          </div>
        )}

        {!selectedGame && (
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

export default GamePage;