import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Award, 
  Calendar, 
  BookOpen, 
  Target, 
  Star, 
  Zap, 
  Trophy 
} from 'lucide-react';
import styles from '../styles/Pages/ProfilePage.module.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Passionate learner and tech enthusiast',
    avatar: '/assets/images/user.jpeg',
    joinDate: 'March 2024',
    stats: {
      completedCourses: 12,
      gameScore: 4560,
      studyHours: 156,
      achievements: 8
    }
  };

  const achievements = [
    { 
      id: 1, 
      title: 'Master Learner', 
      description: 'Completed 10 courses', 
      icon: <Award size={24} style={{color: '#eab308'}} /> 
    },
    { 
      id: 2, 
      title: 'Game Champion', 
      description: 'Top 5% in problem-solving games', 
      icon: <Trophy size={24} style={{color: '#3b82f6'}} /> 
    }
  ];

  const recentActivity = [
    { 
      id: 1, 
      type: 'course', 
      title: 'Advanced React Development', 
      date: '2 days ago',
      icon: <BookOpen size={20} style={{color: '#10b981'}} />
    },
    { 
      id: 2, 
      type: 'game', 
      title: 'Algorithm Challenge', 
      date: '5 days ago',
      icon: <Target size={20} style={{color: '#8b5cf6'}} />
    }
  ];

  const renderActiveTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewTab userProfile={userProfile} />;
      case 'achievements':
        return <AchievementsTab achievements={achievements} />;
      case 'activity':
        return <ActivityTab recentActivity={recentActivity} />;
      default:
        return <OverviewTab userProfile={userProfile} />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <img 
            src={userProfile.avatar} 
            alt="Profile" 
            className={styles.profileAvatar}
          />
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{userProfile.name}</h1>
            <p className={styles.profileEmail}>{userProfile.email}</p>
            <p className={styles.profileBio}>{userProfile.bio}</p>
            <p className={styles.profileJoinDate}>Joined {userProfile.joinDate}</p>
          </div>
          <div>
            <button className={styles.editProfileButton}>
              <Settings size={18} style={{marginRight: '0.5rem'}} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className={styles.tabContainer}>
          <div className={styles.tabHeader}>
            {[
              { id: 'overview', label: 'Overview', icon: <Zap size={18} /> },
              { id: 'achievements', label: 'Achievements', icon: <Star size={18} /> },
              { id: 'activity', label: 'Recent Activity', icon: <Calendar size={18} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabButton} ${
                  activeTab === tab.id 
                    ? styles.tabButtonActive 
                    : styles.tabButtonInactive
                }`}
              >
                {tab.icon}
                <span style={{marginLeft: '0.5rem'}}>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {renderActiveTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewTab = ({ userProfile }) => {
  const overviewStats = [
    { 
      icon: <BookOpen size={24} style={{color: '#3b82f6'}} />, 
      title: 'Completed Courses', 
      value: userProfile.stats.completedCourses 
    },
    { 
      icon: <Zap size={24} style={{color: '#eab308'}} />, 
      title: 'Study Hours', 
      value: userProfile.stats.studyHours 
    },
    { 
      icon: <Trophy size={24} style={{color: '#10b981'}} />, 
      title: 'Game Score', 
      value: userProfile.stats.gameScore 
    },
    { 
      icon: <Award size={24} style={{color: '#8b5cf6'}} />, 
      title: 'Achievements', 
      value: userProfile.stats.achievements 
    }
  ];

  return (
    <div>
      <h2 className={styles.sectionTitle}>Quick Stats</h2>
      <div className={styles.statsGrid}>
        {overviewStats.map((stat, index) => (
          <div 
            key={index} 
            className={styles.statCard}
          >
            {stat.icon}
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statTitle}>{stat.title}</span>
          </div>
        ))}
      </div>

      <div className={styles.progressSection}>
        <h2 className={styles.sectionTitle}>Learning Progress</h2>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Course Completion</span>
          <span className={styles.progressPercentage}>65%</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressBarFill} 
            style={{width: '65%'}}
          ></div>
        </div>
      </div>
    </div>
  );
};

const AchievementsTab = ({ achievements }) => {
  return (
    <div>
      <h2 className={styles.sectionTitle}>Achievements</h2>
      <div className={styles.achievementsGrid}>
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={styles.achievementCard}
          >
            <div className={styles.achievementIcon}>
              {achievement.icon}
            </div>
            <div>
              <h3 className={styles.achievementTitle}>{achievement.title}</h3>
              <p className={styles.achievementDescription}>{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivityTab = ({ recentActivity }) => {
  return (
    <div>
      <h2 className={styles.sectionTitle}>Recent Activity</h2>
      <div className={styles.activityList}>
        {recentActivity.map(activity => (
          <div 
            key={activity.id} 
            className={styles.activityCard}
          >
            <div className={styles.activityIcon}>
              {activity.icon}
            </div>
            <div>
              <h3 className={styles.activityTitle}>{activity.title}</h3>
              <p className={styles.activityDate}>{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;