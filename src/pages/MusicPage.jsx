/* C:\Users\DELL\OneDrive\Desktop\edu-matrix\src\pages\MusicPage.jsx*/
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, List, Search, Plus, Heart, Clock, MoreHorizontal, Shuffle, Repeat } from 'lucide-react';
import styles from '../styles/Pages/MusicPage.module.css';

const MusicPage = () => {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const fetchMusicData = () => {
      setTimeout(() => {
        const sampleTracks = [
          { id: 1, title: 'Calm Focus', artist: 'Ambient Sounds', duration: 183, coverUrl: '/api/placeholder/80/80' },
          { id: 2, title: 'Deep Concentration', artist: 'Study Beats', duration: 241, coverUrl: '/api/placeholder/80/80' },
          { id: 3, title: 'Productive Morning', artist: 'Work Mode', duration: 197, coverUrl: '/api/placeholder/80/80' },
          { id: 4, title: 'Meditation Flow', artist: 'Zen Tracks', duration: 321, coverUrl: '/api/placeholder/80/80' },
          { id: 5, title: 'Energy Boost', artist: 'Motivation Mix', duration: 164, coverUrl: '/api/placeholder/80/80' },
          { id: 6, title: 'Creative Space', artist: 'Idea Generator', duration: 289, coverUrl: '/api/placeholder/80/80' },
          { id: 7, title: 'Relaxed Mind', artist: 'Chill Vibes', duration: 254, coverUrl: '/api/placeholder/80/80' },
          { id: 8, title: 'Night Focus', artist: 'Late Hours', duration: 212, coverUrl: '/api/placeholder/80/80' }
        ];

        const samplePlaylists = [
          { id: 1, name: 'Study Focus', trackCount: 12, coverUrl: '/api/placeholder/60/60' },
          { id: 2, name: 'Interview Prep', trackCount: 8, coverUrl: '/api/placeholder/60/60' },
          { id: 3, name: 'Relaxation', trackCount: 15, coverUrl: '/api/placeholder/60/60' },
          { id: 4, name: 'Energy & Motivation', trackCount: 10, coverUrl: '/api/placeholder/60/60' }
        ];

        setTracks(sampleTracks);
        setPlaylists(samplePlaylists);
        setCurrentTrack(sampleTracks[0]);
        setIsLoading(false);
      }, 1000);
    };

    fetchMusicData();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => { });
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleProgressChange = (e) => {
    const progressBar = progressBarRef.current;
    const clickPosition = (e.pageX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;

    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePlaylistSelect = (playlist) => {
    setActivePlaylist(playlist);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const filteredTracks = searchQuery
    ? tracks.filter(track =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : tracks;

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <audio ref={audioRef} src="" />

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

      <div className={styles.mainLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <h2 className={styles.playlistTitle}>Your Playlists</h2>
            <button className={styles.createPlaylistButton}>
              <Plus size={16} className={styles.icon} />
              Create New Playlist
            </button>

            <div className={styles.playlistList}>
              {playlists.map(playlist => (
                <div
                  key={playlist.id}
                  onClick={() => handlePlaylistSelect(playlist)}
                  className={`${styles.playlistItem} ${activePlaylist?.id === playlist.id ? styles.playlistItemActive : ''}`}
                >
                  <img src={playlist.coverUrl} alt={playlist.name} className={styles.playlistCover} />
                  <div>
                    <h3 className={styles.playlistName}>{playlist.name}</h3>
                    <p className={styles.playlistTrackCount}>{playlist.trackCount} tracks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {activePlaylist ? activePlaylist.name : 'All Tracks'}
            </h2>
            <p className={styles.sectionSubtitle}>
              {filteredTracks.length} tracks available
            </p>
          </div>

          <div className={styles.tracksTable}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>#</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>
                    <Clock size={14} />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredTracks.map((track, index) => (
                  <tr
                    key={track.id}
                    className={`${styles.tableRow} ${currentTrack?.id === track.id ? styles.tableRowActive : ''}`}
                    onClick={() => handleTrackSelect(track)}
                  >
                    <td className={styles.trackIndex}>{index + 1}</td>
                    <td>
                      <div className={styles.trackInfo}>
                        <img className={styles.trackCover} src={track.coverUrl} alt="" />
                        <div className={styles.trackTitle}>{track.title}</div>
                      </div>
                    </td>
                    <td className={styles.trackArtist}>{track.artist}</td>
                    <td className={styles.trackDuration}>{formatTime(track.duration)}</td>
                    <td>
                      <div className={styles.trackActions}>
                        <Heart size={18} className={styles.trackActionIcon} />
                        <MoreHorizontal size={18} className={styles.trackActionIcon} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.currentTrackInfo}>
            {currentTrack && (
              <>
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className={styles.currentTrackCover}
                />
                <div className={styles.trackInfo}>
                  <h3 className={styles.currentTrackTitle}>{currentTrack.title}</h3>
                  <p className={styles.currentTrackArtist}>{currentTrack.artist}</p>
                </div>
              </>
            )}
          </div>

          {/* Player controls */}
          <div className={styles.playerControls}>
            <div className={styles.controlButtons}>
              <Shuffle size={18} className={styles.controlButton} />
              <SkipBack size={20} className={styles.controlButton} />
              <button
                onClick={handlePlayPause}
                className={styles.playPauseButton}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <SkipForward size={20} className={styles.controlButton} />
              <Repeat size={18} className={styles.controlButton} />
            </div>

            {/* Progress bar */}
            <div className={styles.progressBarContainer}>
              <span className={styles.timeLabel}>
                {formatTime(currentTime)}
              </span>
              <div
                ref={progressBarRef}
                className={styles.progressBar}
                onClick={handleProgressChange}
              >
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <span className={styles.timeLabel}>
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume control */}
          <div className={styles.volumeControl}>
            <Volume2 size={18} className={styles.controlButton} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className={styles.volumeSlider}
            />
            <button className={styles.queueButton}>
              <List size={20} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MusicPage;