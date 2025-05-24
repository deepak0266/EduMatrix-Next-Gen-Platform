import React, { useState, useEffect, useRef } from 'react'; // Added useState import
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMood } from '../../contexts/MoodContext';
import MoodCheckModal from './MoodCheckModal';

const SessionTracker = () => {
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef(null);
  const sessionTimeRef = useRef(0);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateMood } = useMood();

  // Make SESSION_TIMEOUT a constant outside the component
  const SESSION_TIMEOUT = 30 *60* 1000;

  // User activity detection
  useEffect(() => {
    const resetTimer = () => {
      if (!showModal) {
        sessionTimeRef.current = 0;
      }
    };

    const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [showModal]);

  // Session timer - added SESSION_TIMEOUT to dependencies
  useEffect(() => {
    if (currentUser) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        sessionTimeRef.current += 1000;

        if (sessionTimeRef.current >= SESSION_TIMEOUT && !showModal) {
          setShowModal(true);
          clearInterval(timerRef.current);
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentUser, showModal, SESSION_TIMEOUT]); // Added SESSION_TIMEOUT here

  const handleMoodSelect = (path, mood) => {
    setShowModal(false);
    sessionTimeRef.current = 0;
    updateMood(mood);
    navigate(path);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    sessionTimeRef.current = 0;
  };

  return (
    <>
      {showModal && (
        <MoodCheckModal 
          onMoodSelect={handleMoodSelect} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default SessionTracker;
