import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../../styles/common.module.css';
import Button from './Button';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * Application header with navigation, user profile and responsive design
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu on location change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const isActive = (path) => {
    return location.pathname === path ? styles.activeNavLink : '';
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect handled by auth context
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Link to="/" className={styles.logoLink}>
            <span className={styles.logoText}>EduMatrix</span>
          </Link>
        </div>
        
        <button className={styles.mobileMenuButton} onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.active : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.active : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.active : ''}`}></span>
        </button>
        
        <nav className={`${styles.navigation} ${isMenuOpen ? styles.mobileNavOpen : ''}`}>
          <ul className={styles.navList}>
            <li>
              <Link to="/dashboard" className={`${styles.navLink} ${isActive('/dashboard')}`}>Dashboard</Link>
            </li>
            <li>
              <Link to="/study" className={`${styles.navLink} ${isActive('/study')}`}>Study</Link>
            </li>
            <li>
              <Link to="/music" className={`${styles.navLink} ${isActive('/music')}`}>Music</Link>
            </li>
            <li>
              <Link to="/games" className={`${styles.navLink} ${isActive('/games')}`}>Games</Link>
            </li>
          </ul>
        </nav>
        
        <div className={styles.headerActions}>
          {currentUser ? (
            <div className={styles.userProfile}> 
              <button className={styles.profileButton} onClick={toggleDropdown}>
                <img 
                  src={currentUser.photoURL || '/assets/images/user.jpeg'} 
                  alt="Profile" 
                  className={styles.profileImage} 
                />
                <span className={styles.profileName}>{currentUser.displayName || 'User'}</span>
                <svg 
                  className={`${styles.dropdownArrow} ${dropdownOpen ? styles.dropdownOpen : ''}`} 
                  width="10" 
                  height="6" 
                  viewBox="0 0 10 6" 
                  fill="none"
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className={styles.profileDropdown}>
                  <Link to="/profile" className={styles.dropdownItem}>My Profile</Link>
                  <Link to="/settings" className={styles.dropdownItem}>Settings</Link>
                  <div className={styles.dropdownDivider}></div>
                  <button className={styles.dropdownItem} onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;