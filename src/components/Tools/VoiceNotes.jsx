import React, { useState, useEffect } from 'react';
import styles from '../../styles/Tools/VoiceNotes.module.css';

const VoiceNotes = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const rec = new window.webkitSpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript((prev) => prev + currentTranscript);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(rec);
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setTranscript('');
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className={styles.voiceContainer}>
      <h3>Voice Notes</h3>
      <button
        onClick={toggleRecording}
        className={`${styles.recordButton} ${isRecording ? styles.recording : ''}`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <div className={styles.transcriptContainer}>
        <textarea
          value={transcript}
          readOnly
          placeholder="Your speech will appear here..."
          className={styles.transcriptArea}
        />
      </div>
    </div>
  );
};

export default VoiceNotes;