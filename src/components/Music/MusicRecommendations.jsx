import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MusicMoodContext } from '../../contexts/MusicMoodContext';
import styles from './MusicRecommendations.module.css';

const MusicRecommendations = () => {
  const { mood, setMood } = useContext(MusicMoodContext);

  // Study mood options with emojis
  const moodOptions = [
    { id: 'focused', label: 'Focused 🧠', description: 'For deep concentration and problem-solving' },
    { id: 'relaxed', label: 'Relaxed 😌', description: 'For calm, stress-free learning' },
    { id: 'energetic', label: 'Energetic ⚡', description: 'For active study sessions requiring energy' },
    { id: 'creative', label: 'Creative 💡', description: 'For brainstorming and creative tasks' },
  ];

  // Handle mood selection
  const handleMoodSelect = (moodId) => {
    setMood(moodId);
  };

  return (
    <div className={styles.recommendationsContainer}>
      <h3 className={styles.recommendationsTitle}>Music Recommendations</h3>
      <p className={styles.recommendationsDescription}>
        Taking a break? Select a mood for study music:
      </p>
      
      <div className={styles.moodOptionsList}>
        {moodOptions.map((option) => (
          <div 
            key={option.id}
            className={styles.moodOption}
            onClick={() => handleMoodSelect(option.id)}
          >
            <span className={styles.moodLabel}>{option.label}</span>
            <span className={styles.moodDescription}>{option.description}</span>
          </div>
        ))}
      </div>
      
      <Link to="/music" className={styles.viewAllLink}>
        View all study music options
      </Link>
    </div>
  );
};

export default MusicRecommendations;