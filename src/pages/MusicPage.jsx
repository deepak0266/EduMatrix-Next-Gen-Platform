import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';
import styles from '../styles/Pages/MusicPage.module.css';

const MusicPage = () => {
  const { switchMode } = useChatbot();
  const [searchQuery, setSearchQuery] = useState('');

  // Switch to music mode on mount
  useEffect(() => {
    switchMode('music');
  }, [switchMode]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Music Library</h1>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Search music..."
              value={searchQuery}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
        </div>
      </header>

      {/* Add music content here */}
      <div className={styles.musicContent}>
        <p className={styles.comingSoon}>
          Music player interface coming soon!
        </p>
      </div>
    </div>
  );
};

export default MusicPage;