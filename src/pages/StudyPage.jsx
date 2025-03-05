import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Study/StudyPage.module.css';
import ToolsGrid from '../components/Tools/ToolsGrid';
// import PdfConverter from '../components/Tools/PdfConverter';
// import FlashcardTool from '../components/Tools/FlashcardTool';
// import PomodoroTimer from '../components/Tools/PomodoroTimer';
// import MathSolver from '../components/Tools/MathSolver';
// import UnitConverter from '../components/Tools/UnitConverter';
// import Dictionary from '../components/Tools/Dictionary';
// import MarkdownEditor from '../components/Tools/MarkdownEditor';
// import VoiceNotes from '../components/Tools/VoiceNotes';
// import StickyNotes from '../components/Tools/StickyNotes';
// import QuizGenerator from '../components/Tools/QuizGenerator';

const StudyPage = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  
  // Function to handle tool selection
  const handleToolSelect = (toolName) => {
    setSelectedTool(toolName);
  };
  
  // Function to render the selected tool
  const renderSelectedTool = () => {
    switch(selectedTool) {
      // case 'pdf-converter':
      //   return <PdfConverter />;
      // case 'flashcard-tool':
      //   return <FlashcardTool />;
      // case 'pomodoro-timer':
      //   return <PomodoroTimer />;
      // case 'math-solver':
      //   return <MathSolver />;
      // case 'unit-converter':
      //   return <UnitConverter />;
      // case 'dictionary':
      //   return <Dictionary />;
      // case 'markdown-editor':
      //   return <MarkdownEditor />;
      // case 'voice-notes':
      //   return <VoiceNotes />;
      // case 'sticky-notes':
      //   return <StickyNotes />;
      // case 'quiz-generator':
      //   return <QuizGenerator />;
      default:
        return (
          <div className={styles.toolPlaceholder}>
            <h3>Select a tool from above to get started</h3>
            <p>Choose from our collection of productivity and study tools to enhance your learning experience.</p>
          </div>
        );
    }
  };
  
  return (
    <div className={styles.studyPageContainer}>
      <h1 className={styles.pageTitle}>Study Interface</h1>
      
      <div className={styles.studySections}>
        {/* Section 1: Document Management System */}
        <div className={styles.studySection}>
          <div className={styles.sectionHeader}>
            <h2>Document Management</h2>
            <p>Upload, organize, and summarize your study materials</p>
          </div>
          <Link to="/documents" className={styles.sectionLink}>
            <div className={styles.sectionCard}>
              <img src="/assets/icons/document-icon.svg" alt="Documents" className={styles.sectionIcon} />
              <div className={styles.sectionContent}>
                <h3>Document Library</h3>
                <p>Manage your study materials, generate summaries, and create quizzes</p>
                <button className={styles.sectionButton}>Open Documents</button>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Section 2: AI Interview Preparation */}
        <div className={styles.studySection}>
          <div className={styles.sectionHeader}>
            <h2>AI Interview Preparation</h2>
            <p>Practice interview questions with AI-powered feedback</p>
          </div>
          <Link to="/interview" className={styles.sectionLink}>
            <div className={styles.sectionCard}>
              <img src="/assets/icons/interview-icon.svg" alt="Interview" className={styles.sectionIcon} />
              <div className={styles.sectionContent}>
                <h3>Interview Assistant</h3>
                <p>Get role-specific questions, practice with speech recognition, and receive instant feedback</p>
                <button className={styles.sectionButton}>Start Practice</button>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Section 3: Useful Tools */}
        <div className={styles.studySection}>
          <div className={styles.sectionHeader}>
            <h2>Useful Tools</h2>
            <p>Productivity tools to enhance your study experience</p>
          </div>
          <div className={styles.toolsContainer}>
            <ToolsGrid onSelectTool={handleToolSelect} />
            
            <div className={styles.toolDisplay}>
              {renderSelectedTool()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPage;