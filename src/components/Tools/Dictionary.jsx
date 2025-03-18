// C:\Users\DELL\OneDrive\Desktop\edu-matrix\src\components\Tools\Dictionary.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/Tools/Dictionary.module.css';
import { Book, Search, Volume2, X } from 'lucide-react';

const Dictionary = () => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  useEffect(() => {
    // Load recent searches from localStorage on component mount
    const savedSearches = localStorage.getItem('dictionarySearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const updateRecentSearches = (term) => {
    // Add to recent searches, prevent duplicates, and limit to 5 items
    const updatedSearches = [term, ...recentSearches.filter(item => item !== term)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('dictionarySearches', JSON.stringify(updatedSearches));
  };

  const searchWord = async (term = word) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    setError('');
    setDefinition(null);
    
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${term}`
      );
      
      const data = await response.json();
      
      if (response.status === 404 || data.title === 'No Definitions Found') {
        setError(`No definitions found for "${term}".`);
        setDefinition(null);
      } else {
        setDefinition(data[0]);
        updateRecentSearches(term);
      }
    } catch (error) {
      setError('Error connecting to dictionary service. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchWord();
    setShowRecentSearches(false);
  };

  const handleRecentSearch = (term) => {
    setWord(term);
    searchWord(term);
    setShowRecentSearches(false);
  };

  const playAudio = (audioUrl) => {
    if (!audioUrl) return;
    
    const audio = new Audio(audioUrl);
    audio.play().catch(e => {
      console.error("Audio playback failed:", e);
      setError("Audio playback failed. The audio might not be available.");
    });
  };

  const clearSearch = () => {
    setWord('');
    setDefinition(null);
    setError('');
  };

  return (
    <div className={styles.dictionaryContainer}>
      <div className={styles.dictionaryHeader}>
        <Book size={24} className={styles.toolIcon} />
        <h3>Dictionary</h3>
        <p>Look up definitions, synonyms, and pronunciations</p>
      </div>

      <div className={styles.dictionaryBody}>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <div className={styles.searchBar}>
            <input
              type="text"
              value={word}
              onChange={(e) => {
                setWord(e.target.value);
                if (e.target.value.length > 0) {
                  setShowRecentSearches(true);
                } else {
                  setShowRecentSearches(false);
                }
              }}
              onFocus={() => {
                if (word.length > 0 && recentSearches.length > 0) {
                  setShowRecentSearches(true);
                }
              }}
              onBlur={() => {
                // Delay hiding the dropdown to allow for clicking on items
                setTimeout(() => setShowRecentSearches(false), 200);
              }}
              placeholder="Enter a word"
              className={styles.searchInput}
            />
            
            {word && (
              <button 
                type="button" 
                className={styles.clearButton}
                onClick={clearSearch}
              >
                <X size={16} />
              </button>
            )}
            
            <button 
              type="submit" 
              className={styles.searchButton}
              disabled={isLoading || !word.trim()}
            >
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                <Search size={18} />
              )}
            </button>
          </div>
          
          {showRecentSearches && recentSearches.length > 0 && (
            <div className={styles.recentSearches}>
              <div className={styles.recentSearchesHeader}>Recent Searches</div>
              <ul>
                {recentSearches.map((term, index) => (
                  <li key={index} onClick={() => handleRecentSearch(term)}>
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        {isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Looking up definition...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <p>{error}</p>
          </div>
        )}

        {definition && !isLoading && (
          <div className={styles.results}>
            <div className={styles.wordHeader}>
              <div>
                <h2>{definition.word}</h2>
                {definition.phonetic && <p className={styles.phonetic}>{definition.phonetic}</p>}
              </div>
              
              {definition.phonetics && definition.phonetics.length > 0 && 
                definition.phonetics.some(phonetic => phonetic.audio) && (
                <button 
                  className={styles.audioButton}
                  onClick={() => {
                    // Find the first available audio
                    const audio = definition.phonetics.find(p => p.audio)?.audio;
                    playAudio(audio);
                  }}
                >
                  <Volume2 size={18} />
                  Listen
                </button>
              )}
            </div>

            <div className={styles.meanings}>
              {definition.meanings.map((meaning, index) => (
                <div key={index} className={styles.meaningBlock}>
                  <div className={styles.partOfSpeech}>{meaning.partOfSpeech}</div>
                  
                  {meaning.definitions.map((def, idx) => (
                    <div key={idx} className={styles.definition}>
                      <div className={styles.definitionText}>
                        <span className={styles.definitionNumber}>{idx + 1}.</span> {def.definition}
                      </div>
                      
                      {def.example && (
                        <div className={styles.example}>
                          "{def.example}"
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {meaning.synonyms && meaning.synonyms.length > 0 && (
                    <div className={styles.synonymsContainer}>
                      <span className={styles.synonymsLabel}>Synonyms:</span>
                      <div className={styles.synonyms}>
                        {meaning.synonyms.map((synonym, i) => (
                          <span 
                            key={i} 
                            className={styles.synonym}
                            onClick={() => {
                              setWord(synonym);
                              searchWord(synonym);
                            }}
                          >
                            {synonym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {definition.sourceUrls && definition.sourceUrls.length > 0 && (
              <div className={styles.sources}>
                <p>Source: <a href={definition.sourceUrls[0]} target="_blank" rel="noopener noreferrer">{definition.sourceUrls[0]}</a></p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary;