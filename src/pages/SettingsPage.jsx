import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Palette 
} from 'lucide-react';
import styles from '../styles/Pages/SettingsPage.module.css';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    emailNotifs: true,
    pushNotifs: false,
    marketingEmails: false
  });

  const settingsSections = [
    { 
      id: 'profile', 
      title: 'Profile Settings', 
      icon: <User size={20} />,
      component: ProfileSettingsSection
    },
    { 
      id: 'notifications', 
      title: 'Notifications', 
      icon: <Bell size={20} />,
      component: NotificationsSection
    },
    { 
      id: 'security', 
      title: 'Security', 
      icon: <Lock size={20} />,
      component: SecuritySection
    },
    { 
      id: 'appearance', 
      title: 'Appearance', 
      icon: <Palette size={20} />,
      component: AppearanceSection
    }
  ];

  const renderActiveSection = () => {
    const ActiveComponent = settingsSections.find(section => section.id === activeSection)?.component;
    return ActiveComponent ? <ActiveComponent /> : null;
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsWrapper}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <h2 className={styles.sidebarTitle}>Settings</h2>
            {settingsSections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`${styles.sidebarButton} ${
                  activeSection === section.id 
                    ? styles.sidebarButtonActive 
                    : styles.sidebarButtonInactive
                }`}
              >
                <span className="mr-3">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

const ProfileSettingsSection = () => {
  return (
    <div>
      <h3 className={styles.sectionTitle}>Profile Settings</h3>
      <div className="space-y-6">
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Full Name</label>
          <input 
            type="text" 
            className={styles.formInput}
            placeholder="Your full name"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email</label>
          <input 
            type="email" 
            className={styles.formInput}
            placeholder="your.email@example.com"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Bio</label>
          <textarea 
            className={styles.formInput}
            rows="4"
            placeholder="Tell us about yourself"
          />
        </div>
        <button className={styles.saveButton}>
          Save Profile
        </button>
      </div>
    </div>
  );
};

const NotificationsSection = () => {
  return (
    <div>
      <h3 className={styles.sectionTitle}>Notifications</h3>
      <div className="space-y-4">
        <div className={styles.notificationItem}>
          <div className={styles.notificationText}>
            <h4 className={styles.notificationTitle}>Email Notifications</h4>
            <p className={styles.notificationDescription}>Receive emails about platform updates</p>
          </div>
          <div className={styles.formSwitch}>
            <input 
              type="checkbox" 
              className={styles.switchInput} 
              id="emailNotif" 
            />
            <label 
              htmlFor="emailNotif" 
              className={styles.switchLabel}
            />
          </div>
        </div>
        {/* Add more notification toggles */}
      </div>
    </div>
  );
};

const SecuritySection = () => {
  return (
    <div>
      <h3 className={styles.sectionTitle}>Security</h3>
      <div className={styles.securitySection}>
        <div>
          <label className={styles.formLabel}>Change Password</label>
          <input 
            type="password" 
            className={`${styles.formInput} ${styles.passwordInput}`}
            placeholder="Current password"
          />
          <input 
            type="password" 
            className={`${styles.formInput} ${styles.passwordInput}`}
            placeholder="New password"
          />
        </div>
        <button className={styles.changePasswordButton}>
          Change Password
        </button>
      </div>
    </div>
  );
};

const AppearanceSection = () => {
  return (
    <div>
      <h3 className={styles.sectionTitle}>Appearance</h3>
      <div className={styles.appearanceSection}>
        <div>
          <h4 className={styles.notificationTitle}>Theme</h4>
          <div className={styles.themeOptions}>
            <button className={`${styles.themeButton} ${styles.themeButtonLight}`}>Light</button>
            <button className={`${styles.themeButton} ${styles.themeButtonDark}`}>Dark</button>
          </div>
        </div>
        <div>
          <h4 className={styles.notificationTitle}>Color Scheme</h4>
          <div className={styles.colorSchemeOptions}>
            <div className={`${styles.colorOption} ${styles.blueColor}`} />
            <div className={`${styles.colorOption} ${styles.greenColor}`} />
            <div className={`${styles.colorOption} ${styles.purpleColor}`} />
            <div className={`${styles.colorOption} ${styles.orangeColor}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;