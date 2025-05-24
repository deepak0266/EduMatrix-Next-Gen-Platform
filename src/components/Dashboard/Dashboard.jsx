import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Music, Gamepad, FileText, Video, User, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../../styles/Dashboard/Dashboard.module.css'; // Import CSS module
import interviews from '../../pages/InterviewPage'; 


const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    upcomingInterviews: 0,
    musicTracks: 0,
    documents: 0,
    games: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls to fetch dashboard data
    const fetchDashboardData = () => {
      setTimeout(() => {
        setStats({
          totalInterviews: 1,
          completedInterviews: 8,
          upcomingInterviews: 4,
          musicTracks: 2,
          documents: 1,
          games: 6,
        });

        setRecentActivities([
          { id: 1, type: 'interview', title: 'Technical Interview Completed', date: '2 hours ago' },
          { id: 2, type: 'document', title: 'Resume Updated', date: '5 hours ago' },
          { id: 3, type: 'music', title: 'Added Relaxation Playlist', date: '1 day ago' },
          { id: 4, type: 'game', title: 'Completed Logic Game Level 5', date: '2 days ago' },
          { id: 5, type: 'interview', title: 'Mock Interview Scheduled', date: '3 days ago' },
        ]);

        setNotifications([
          { id: 1, message: 'Interview reminder: Technical Interview tomorrow at 2:00 PM', read: false },
          { id: 2, message: 'New interview preparation tips available', read: true },
          { id: 3, message: 'Profile completion reminder', read: false },
        ]);

        setIsLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);


  const StatCard = ({ icon, title, value, bgColor }) => (
    <div className={`${styles.statCard} ${styles[bgColor]}`}>
      <div className={styles.statCardContent}>
        <div>
          <h3 className={styles.statCardTitle}>{title}</h3>
          <p className={styles.statCardValue}>{value}</p>
        </div>
        <div className={styles.statCardIcon}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickAccessCard = ({ icon, title, description, path }) => (
    <Link to={path} className={styles.quickAccessCard}>
      <div className={styles.quickAccessCardContent}>
        <div className={styles.quickAccessCardIcon}>
          {icon}
        </div>
        <div className={styles.quickAccessCardText}>
          <h3 className={styles.quickAccessCardTitle}>{title}</h3>
          <p className={styles.quickAccessCardDescription}>{description}</p>
        </div>
        <ArrowRight size={18} className={styles.quickAccessCardArrow} />
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header Section */}
      <header className={styles.header}>
        <p className={styles.headerSubtitle}>
          Welcome back! Here's an overview of your activities.
        </p>
      </header>

      {/* Stats Overview Section */}
      <section className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>Stats Overview</h2>
        <div className={styles.statsGrid}>
          <StatCard
            icon={<Video size={24} className={styles.statIcon} />}
            title="Total Interviews"
            value={stats.totalInterviews}
            bgColor="purple1" // CSS module class
          />
          <StatCard
            icon={<Music size={24} className={styles.statIcon} />}
            title="Music Tracks"
            value={stats.musicTracks}
            bgColor="green1" // CSS module class
          />
          <StatCard
            icon={<FileText size={24} className={styles.statIcon} />}
            title="Documents"
            value={stats.documents}
            bgColor="blue1" // CSS module class
          />
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className={styles.mainGrid}>
        {/* Recent Activities Section */}

        {/* Quick Access Section */}
        <section className={styles.quickAccess}>
          <h2 className={styles.sectionTitle}>Quick Access</h2>
          <div className={styles.quickAccessGrid}>
            <QuickAccessCard
              icon={<Video size={20} className={styles.quickAccessIcon} />}
              title="Interviews"
              description="Manage your interview schedule"
              path="/interview"
            />
            <QuickAccessCard
              icon={<Music size={20} className={styles.quickAccessIcon} />}
              title="Music Library"
              description="Access your playlists and tracks"
              path="/music"
            />
            <QuickAccessCard
              icon={<Gamepad size={20} className={styles.quickAccessIcon} />}
              title="Games"
              description="Practice with interactive games"
              path="/games"
            />
            <QuickAccessCard
              icon={<FileText size={20} className={styles.quickAccessIcon} />}
              title="Documents"
              description="View and manage your documents"
              path="/documents"
            />
            <QuickAccessCard
              icon={<User size={20} className={styles.quickAccessIcon} />}
              title="Profile"
              description="Update your personal information"
              path="/profile"
            />
            <QuickAccessCard
              icon={<Settings size={20} className={styles.quickAccessIcon} />}
              title="Settings"
              description="Configure your account preferences"
              path="/settings"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;