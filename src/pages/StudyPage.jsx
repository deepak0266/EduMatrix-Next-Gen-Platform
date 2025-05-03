import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChatbot } from '../contexts/ChatbotContext';
import ToolsGrid from '../components/Tools/ToolsGrid';
import PdfConverter from '../components/Tools/PdfConverter';
import Dictionary from '../components/Tools/Dictionary';
import QuizGenerator from '../components/Tools/QuizGenerator';
import Flashcards from '../components/Tools/Flashcards';
import PomodoroTimer from '../components/Tools/PomodoroTimer';
import StickyNotes from '../components/Tools/StickyNotes';
import MathSolver from '../components/Tools/MathSolver';
import UnitConverter from '../components/Tools/UnitConverter';
import MarkdownEditor from '../components/Tools/MarkdownEditor';
import VoiceNotes from '../components/Tools/VoiceNotes';
import FlashcardMaker from '../components/Tools/FlashcardMaker';
import styles from '../styles/Study/StudyPage.module.css';

const StudyPage = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [toolVisible, setToolVisible] = useState(false);
  const { switchMode } = useChatbot();

  useEffect(() => {
    switchMode('study');
  }, [switchMode]);

  const handleToolSelect = (toolName) => {
    if (selectedTool) {
      setToolVisible(false);
      setTimeout(() => {
        setSelectedTool(toolName);
        setTimeout(() => setToolVisible(true), 50);
      }, 300);
    } else {
      setSelectedTool(toolName);
      setTimeout(() => setToolVisible(true), 50);
    }
  };
  
  const renderSelectedTool = () => {
    switch(selectedTool) {
      case 'text-to-pdf': return <PdfConverter />;
      case 'dictionary': return <Dictionary />;
      case 'mcq-quiz': return <QuizGenerator />;
      case 'flashcards': return <Flashcards />;
      case 'pomodoro-timer': return <PomodoroTimer />;
      case 'sticky-notes': return <StickyNotes />;
      case 'math-solver': return <MathSolver />;
      case 'unit-converter': return <UnitConverter />;
      case 'markdown-editor': return <MarkdownEditor />;
      case 'voice-notes': return <VoiceNotes />;
      case 'flashcard-generator': return <FlashcardMaker />;
      default: return (
        <div className={styles.toolPlaceholder}>
          <h3>Select a tool from above to get started</h3>
          <p>Choose from our collection of productivity and study tools.</p>
        </div>
      );
    }
  };
  
  return (
    <div className={styles.studyPageContainer}>
      <h1 className={styles.pageTitle}>Study Interface</h1>
      
      <div className={styles.studySections}>
        <div className={styles.studySection}>
          <div className={styles.sectionHeader}>
            <h2>Document Management</h2>
            <p>Upload, organize, and summarize your study materials</p>
          </div>
          <Link to="/documents" className={styles.sectionLink}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionIconContainer}>
                <img 
                  src="https://fonts.gstatic.com/s/i/materialiconsoutlined/folder/v1/24px.svg" 
                  alt="Documents" 
                  className={styles.sectionIcon} 
                />
              </div>
              <div className={styles.sectionContent}>
                <h3>Document Library</h3>
                <p>Manage your study materials, generate summaries, and create quizzes</p>
                <button className={styles.sectionButton}>Open Documents</button>
              </div>
            </div>
          </Link>
        </div>
        
        <div className={styles.studySection}>
          <div className={styles.sectionHeader}>
            <h2>AI Interview Preparation</h2>
            <p>Practice interview questions with AI-powered feedback</p>
          </div>
          <Link to="/interview" className={styles.sectionLink}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionIconContainer}>
                <img 
                  src="https://fonts.gstatic.com/s/i/materialiconsoutlined/mic/v1/24px.svg" 
                  alt="Interview" 
                  className={styles.sectionIcon} 
                />
              </div>
              <div className={styles.sectionContent}>
                <h3>Interview Assistant</h3>
                <p>Get role-specific questions, practice with speech recognition</p>
                <button className={styles.sectionButton}>Start Practice</button>
              </div>
            </div>
          </Link>
        </div>
        
        <div className={styles.studySection}>
          <div className={styles.sectionHeader}>
            <h2>Useful Tools</h2>
            <p>Productivity tools to enhance your study experience</p>
          </div>
          <div className={styles.toolsContainer}>
            <ToolsGrid onSelectTool={handleToolSelect} selectedTool={selectedTool} />
            <div className={`${styles.toolDisplay} ${toolVisible ? styles.toolVisible : ''}`}>
              {renderSelectedTool()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPage;