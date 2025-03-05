import React from 'react';
import styles from '../../styles/Tools/ToolsGrid.module.css';
import { 
  FileText, 
  Clock, 
  Calculator, 
  Repeat, 
  Book, 
  Edit3, 
  Mic, 
  StickyNote, 
  BarChart2, 
  Layout 
} from 'lucide-react';

const ToolsGrid = ({ onSelectTool }) => {
  const tools = [
    { 
      id: 'pdf-converter', 
      name: 'PDF Converter', 
      description: 'Convert documents to PDF format', 
      icon: <FileText className={styles.toolIcon} />
    },
  ];
  
  return (
    <div className={styles.toolsGrid}>
      {tools.map((tool) => (
        <div 
          key={tool.id} 
          className={styles.toolCard} 
          onClick={() => onSelectTool(tool.id)}
        >
          <div className={styles.toolIconContainer}>
            {tool.icon}
          </div>
          <h3 className={styles.toolName}>{tool.name}</h3>
          <p className={styles.toolDescription}>{tool.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ToolsGrid;