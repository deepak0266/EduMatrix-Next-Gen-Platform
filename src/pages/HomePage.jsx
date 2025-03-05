import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/Common/Button';

// CSS Module will be created separately
import styles from '../styles/HomePage.module.css';

const HomePage = () => {
  const { currentUser } = useContext(AuthContext);

  const features = [
    {
      icon: '📚',
      title: 'Smart Document Management',
      description: 'Upload and organize your study materials with AI-powered summaries and notes.'
    },
    {
      icon: '⏱️',
      title: 'Productivity Tools',
      description: 'Stay focused with Pomodoro timers, flashcards, and other study aids.'
    },
    {
      icon: '🎮',
      title: 'Study Breaks',
      description: 'Take effective breaks with brain games designed to refresh your mind.'
    },
    {
      icon: '🎵',
      title: 'Focus Music',
      description: 'Enhance concentration with curated lo-fi and ambient sound playlists.'
    },
    {
      icon: '🤖',
      title: 'AI Interview Prep',
      description: 'Practice for interviews with AI-generated questions based on your documents.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your study habits and improve your learning efficiency.'
    }
  ];

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Transform Your Study Experience</h1>
          <p className={styles.subtitle}>
            The all-in-one platform for students to organize notes, study efficiently, and ace exams.
          </p>
          <div className={styles.cta}>
            {currentUser ? (
              <Link to="/dashboard">
                <Button variant="primary" size="large">Go to Dashboard</Button>
              </Link>
            ) : (
              <div className={styles.ctaButtons}>
                <Link to="/signup">
                  <Button variant="primary" size="large">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="large">Log In</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className={styles.heroImage}>
          {/* This would be a modern illustration of students using the platform */}
          <div className={styles.imageContainer}>
            <div className={styles.imageMain}></div>
            <div className={styles.imageShadow}></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why Students Love EduMatrix</h2>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>



      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Studies?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of students who are achieving their academic goals with EduMatrix.
          </p>
          <div className={styles.ctaButton}>
            <Link to="/signup">
              <Button variant="primary" size="large">Get Started for Free</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;