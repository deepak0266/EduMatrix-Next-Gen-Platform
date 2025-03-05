// C:\Users\DELL\OneDrive\Desktop\edu-matrix\src\components\Dashboard\Sidebar.jsx
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styles from '../../styles/Dashboard/Sidebar.module.css';

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  
  // Navigation items
  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/study', icon: '📚', label: 'Study' },
    { path: '/tools', icon: '🛠️', label: 'Tools' },
    { path: '/music', icon: '🎵', label: 'Music' },
    { path: '/games', icon: '🎮', label: 'Games' },
    { path: '/interview', icon: '💬', label: 'Interview Prep' },
  ];

  return (
    <div className={styles.sidebar}>
      {/* User Profile Section */}
      <div className={styles.profileSection}>
        <div className={styles.profileImage}>
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>
            {currentUser?.displayName || 'Student'}
          </h3>
          <p className={styles.userEmail}>{currentUser?.email}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.path} className={styles.navItem}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <h4 className={styles.statsTitle}>Weekly Stats</h4>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Study Time</span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: '65%' }}
              data-tooltip="6.5 hours of 10 hour goal"
            ></div>
          </div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Documents</span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: '40%' }}
              data-tooltip="4 of 10 document goal"
            ></div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className={styles.sidebarFooter}>
        <button className={styles.settingsButton}>
          <span className={styles.settingsIcon}>⚙️</span>
          <span>Settings</span>
        </button>
        <p className={styles.version}>v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;