import { useChatbot } from '../contexts/ChatbotContext';
import React, { useState, useEffect, useContext } from 'react';
import { MusicMoodContext } from '../contexts/MusicMoodContext';
import styles from '../styles/Pages/MusicPage.module.css';
const PlayIcon = () => (
  <svg 
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    className={styles.controlIcon}
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    className={styles.controlIcon}
  >
    <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
  </svg>
);

const VolumeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    className={styles.volumeIcon}
  >
    <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-4 6.92L6.71 6.71 5.29 8.12 8.17 11H4v2h4.17l-2.88 2.88 1.41 1.41L10 12.41z" />
  </svg>
);


const MusicPage = () => {
  const { switchMode } = useChatbot();

  const { mood, setMood } = useContext(MusicMoodContext);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [showInstructions, setShowInstructions] = useState(false);
  // Switch to music mode on mount
  useEffect(() => {
    switchMode('music');
  }, [switchMode]);

  // Study mood options with emojis
  const moodOptions = [
    { id: 'focused', label: 'Focused 🧠', color: '#4a6fa5' },
    { id: 'relaxed', label: 'Relaxed 😌', color: '#6b9080' },
    { id: 'energetic', label: 'Energetic ⚡', color: '#e76f51' },
    { id: 'creative', label: 'Creative 💡', color: '#9b5de5' },
    { id: 'calm', label: 'Calm 🌊', color: '#457b9d' },
    { id: 'motivated', label: 'Motivated 🔥', color: '#e63946' },
  ];

  // Sample playlists based on mood
  const playlists = {
    focused: [
      { id: 1, title: 'Deep Focus', artist: 'Ambient Sounds', duration: '3:45', url: '/audio/deep-focus.mp3' },
      { id: 2, title: 'Study Concentration', artist: 'Focus Beat', duration: '4:20', url: '/audio/study-concentration.mp3' },
      { id: 3, title: 'Brain Power', artist: 'Alpha Waves', duration: '5:15', url: '/audio/brain-power.mp3' },
    ],
    relaxed: [
      { id: 4, title: 'Gentle Piano', artist: 'Relaxing Notes', duration: '4:10', url: '/audio/gentle-piano.mp3' },
      { id: 5, title: 'Soft Melodies', artist: 'Calm Mind', duration: '3:50', url: '/audio/soft-melodies.mp3' },
      { id: 6, title: 'Easy Listening', artist: 'Peaceful Sounds', duration: '4:45', url: '/audio/easy-listening.mp3' },
    ],
    energetic: [
      { id: 7, title: 'Study Beat', artist: 'Energy Boost', duration: '3:30', url: '/audio/study-beat.mp3' },
      { id: 8, title: 'Productivity Mix', artist: 'Power Session', duration: '4:15', url: '/audio/productivity-mix.mp3' },
      { id: 9, title: 'Focus Drive', artist: 'Momentum', duration: '3:55', url: '/audio/focus-drive.mp3' },
    ],
    creative: [
      { id: 10, title: 'Creative Flow', artist: 'Inspiration', duration: '4:25', url: '/audio/creative-flow.mp3' },
      { id: 11, title: 'Idea Generator', artist: 'Mind Expander', duration: '5:10', url: '/audio/idea-generator.mp3' },
      { id: 12, title: 'Imagination', artist: 'Creative Mind', duration: '4:30', url: '/audio/imagination.mp3' },
    ],
    calm: [
      { id: 13, title: 'Calm Waters', artist: 'Ocean Sounds', duration: '5:20', url: '/audio/calm-waters.mp3' },
      { id: 14, title: 'Peaceful Mind', artist: 'Tranquility', duration: '4:50', url: '/audio/peaceful-mind.mp3' },
      { id: 15, title: 'Serenity', artist: 'Gentle Waves', duration: '6:15', url: '/audio/serenity.mp3' },
    ],
    motivated: [
      { id: 16, title: 'Motivation Mix', artist: 'Achievement', duration: '3:40', url: '/audio/motivation-mix.mp3' },
      { id: 17, title: 'Success Drive', artist: 'Goal Crusher', duration: '4:05', url: '/audio/success-drive.mp3' },
      { id: 18, title: 'Determination', artist: 'Progress Path', duration: '3:35', url: '/audio/determination.mp3' },
    ],
  };

  // Handle mood selection
  const handleMoodSelect = (moodId) => {
    setMood(moodId);
    setCurrentSong(null);
    setIsPlaying(false);
  };

  // Toggle play/pause
  const togglePlay = (song) => {
    if (currentSong && currentSong.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  // Toggle instructions modal
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <div className={styles.musicPage}>
      
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Study Music</h1>
        <p className={styles.pageDescription}>
          Select a mood that matches your study mindset to get personalized music recommendations.
        </p>
        
        {/* Mood Selection */}
        <div className={styles.moodSelector}>
          {moodOptions.map((option) => (
            <button
              key={option.id}
              className={`${styles.moodButton} ${mood === option.id ? styles.activeMood : ''}`}
              style={{ 
                '--mood-color': option.color,
                '--hover-color': `${option.color}88`
              }}
              onClick={() => handleMoodSelect(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Music Player */}
        <div className={styles.musicPlayer}>
          {mood ? (
            <>
              <h2 className={styles.playlistTitle}>
                {moodOptions.find(option => option.id === mood)?.label} Playlist
              </h2>
              
              <div className={styles.songList}>
                {playlists[mood]?.map((song) => (
                  <div 
                    key={song.id} 
                    className={`${styles.songItem} ${currentSong?.id === song.id ? styles.activeSong : ''}`}
                    onClick={() => togglePlay(song)}
                  >
                    <div className={styles.playIconContainer}>
                      {currentSong?.id === song.id && isPlaying ? 
                        <PauseIcon className={styles.controlIcon} /> : 
                        <PlayIcon className={styles.controlIcon} />
                      }
                    </div>
                    <div className={styles.songInfo}>
                      <span className={styles.songTitle}>{song.title}</span>
                      <span className={styles.songArtist}>{song.artist}</span>
                    </div>
                    <span className={styles.songDuration}>{song.duration}</span>
                  </div>
                ))}
              </div>
              
              {/* Player Controls */}
              {currentSong && (
                <div className={styles.playerControls}>
                  <div className={styles.nowPlaying}>
                    <div className={styles.songDetails}>
                      <span className={styles.currentTitle}>{currentSong.title}</span>
                      <span className={styles.currentArtist}>{currentSong.artist}</span>
                    </div>
                  </div>
                  
                  <div className={styles.volumeControl}>
                    <VolumeIcon className={styles.volumeIcon} />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      className={styles.volumeSlider}
                      onChange={handleVolumeChange}
                    />
                    <span className={styles.volumeValue}>{volume}%</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noMoodSelected}>
              <p>Select a mood above to see music recommendations</p>
            </div>
          )}
        </div>

        {/* Music Instructions Button */}
        <button onClick={toggleInstructions} className={styles.instructionsButton}>
          Music Study Guide
        </button>

        {/* Instructions Modal */}
        {showInstructions && (
          <div className={styles.modalOverlay}>
            <div className={styles.instructionsModal}>
              <button className={styles.closeButton} onClick={toggleInstructions}>×</button>
              <h2 className={styles.instructionsTitle}>How to Use Music for Effective Studying</h2>
              
              <div className={styles.instructionsContent}>
                <section className={styles.instructionSection}>
                  <h3>Why Listen to Music While Studying?</h3>
                  <p>Music can enhance focus, reduce stress, and create an optimal environment for learning when used correctly.</p>
                </section>

                <section className={styles.instructionSection}>
                  <h3>When to Listen</h3>
                  <ul>
                    <li>During repetitive tasks that don't require complex verbal processing</li>
                    <li>When you need to create a personal focus bubble in noisy environments</li>
                    <li>For short study sessions to boost motivation</li>
                    <li>During breaks to refresh your mind</li>
                  </ul>
                </section>

                <section className={styles.instructionSection}>
                  <h3>When Not to Listen</h3>
                  <ul>
                    <li>While learning new complex concepts</li>
                    <li>When memorizing verbal information</li>
                    <li>During tasks requiring verbal processing</li>
                  </ul>
                </section>

                <section className={styles.instructionSection}>
                  <h3>How to Choose the Right Music</h3>
                  <ul>
                    <li><strong>Focused 🧠:</strong> Instrumental, minimal lyrics, moderate tempo</li>
                    <li><strong>Relaxed 😌:</strong> Soft piano, ambient sounds, natural white noise</li>
                    <li><strong>Energetic ⚡:</strong> Upbeat instrumentals with consistent rhythm</li>
                    <li><strong>Creative 💡:</strong> New age, classical, or jazz without disruptive elements</li>
                    <li><strong>Calm 🌊:</strong> Nature sounds, gentle ambient music</li>
                    <li><strong>Motivated 🔥:</strong> Inspiring instrumental pieces with building energy</li>
                  </ul>
                </section>

                <section className={styles.instructionSection}>
                  <h3>Best Practices</h3>
                  <ul>
                    <li>Keep volume moderate - loud enough to mask distractions but not so loud it becomes one</li>
                    <li>Use headphones for better focus and sound quality</li>
                    <li>Create specific playlists for different study activities</li>
                    <li>Consider 25-minute focused sessions with music, followed by short breaks</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPage;