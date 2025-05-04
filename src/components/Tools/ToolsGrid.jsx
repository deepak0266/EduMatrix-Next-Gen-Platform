import React, { useState, useEffect } from 'react';
import styles from '../../styles/Tools/ToolsGrid.module.css';
import { 
  FileText, 
  BookOpen,
  Clock,
  StickyNote,
  Calculator,
  Repeat,
  Book,
  Edit3,
  Mic,
  Layout,
  FileQuestion,
  Bookmark,
  Volume2,
  FileEdit
} from 'lucide-react';

const ToolsGrid = ({ onSelectTool, selectedTool }) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const tools = [
    { 
      id: 'text-to-pdf', 
      name: 'PDF Converter', 
      icon: <FileText />, 
      color: '#3366FF',
      description: 'Convert your text notes to PDF format'
    },
    // { 
    //   id: 'mcq-quiz', 
    //   name: 'Quiz Generator', 
    //   icon: <FileQuestion />, 
    //   color: '#00C48C',
    //   description: 'Create multiple-choice quizzes from your materials'
    // },
    // { 
    //   id: 'flashcards', 
    //   name: 'Flashcards', 
    //   icon: <Bookmark />,
    //   color: '#45b7d1',
    //   description: 'Study with digital flashcards'
    // },
    { 
      id: 'pomodoro-timer', 
      name: 'Pomodoro Timer', 
      icon: <Clock />, 
      color: '#FF7A50',
      description: 'Focus with timed study sessions'
    },
    // { 
    //   id: 'sticky-notes', 
    //   name: 'Sticky Notes', 
    //   icon: <StickyNote />, 
    //   color: '#FFD43B',
    //   description: 'Create digital sticky notes for reminders'
    // },
    { 
      id: 'math-solver', 
      name: 'Math Solver', 
      icon: <Calculator />, 
      color: '#FF5858',
      description: 'Solve mathematical equations and problems'
    },
    { 
      id: 'unit-converter', 
      name: 'Unit Converter', 
      icon: <Repeat />, 
      color: '#6C5CE7',
      description: 'Convert between different units of measurement'
    },
    { 
      id: 'dictionary', 
      name: 'Dictionary', 
      icon: <Book />, 
      color: '#00B894',
      description: 'Look up definitions of words and terms'
    },
    // { 
    //   id: 'markdown-editor', 
    //   name: 'Markdown Editor', 
    //   icon: <Edit3 />, 
    //   color: '#9C67FF',
    //   description: 'Create and edit formatted text with Markdown'
    // },
    { 
      id: 'voice-notes', 
      name: 'Voice Notes', 
      icon: <Mic />, 
      color: '#E84393',
      description: 'Record and transcribe voice notes'
    },
    // { 
    //   id: 'flashcard-generator', 
    //   name: 'Flashcard Maker', 
    //   icon: <Layout />, 
    //   color: '#0984E3',
    //   description: 'Create custom flashcards from your notes'
    // },
  ];

  return (
    <div className={`${styles.toolsGrid} ${mounted ? styles.mounted : ''}`}>
      {tools.map((tool, index) => (
        <button
          key={tool.id}
          className={`
            ${styles.toolCard} 
            ${selectedTool === tool.id ? styles.selected : ''}
            ${hoveredTool === tool.id ? styles.hovered : ''}
            ${mounted ? styles.fadeIn : ''}
          `}
          style={{ 
            '--tool-color': tool.color,
            '--animation-delay': `${index * 60}ms`
          }}
          onClick={() => onSelectTool(tool.id)}
          onMouseEnter={() => setHoveredTool(tool.id)}
          onMouseLeave={() => setHoveredTool(null)}
          aria-label={`Select ${tool.name} tool`}
        >
          <div 
            className={styles.toolIconContainer} 
            style={{ backgroundColor: `${tool.color}15` }}
          >
            <div className={styles.toolIcon} style={{ color: tool.color }}>
              {tool.icon}
            </div>
          </div>
          <h3 className={styles.toolName}>{tool.name}</h3>
          <p className={styles.toolDescription}>{tool.description}</p>
          <div className={styles.glowEffect} style={{ background: tool.color }}></div>
        </button>
      ))}
    </div>
  );
};

export default ToolsGrid;