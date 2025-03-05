import React from 'react';
import Dashboard from '../components/Dashboard/Dashboard'; // Import Dashboard component
import styles from '../styles/Dashboard/DashboardPage.module.css';
// import Sidebar from '../components/Dashboard/Sidebar'; // Keep commented for now

const DashboardPage = () => {
  return (
    <div className={styles.dashboardPage}>
      {/* Sidebar Component (commented for now) */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Render the Dashboard component */}
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;