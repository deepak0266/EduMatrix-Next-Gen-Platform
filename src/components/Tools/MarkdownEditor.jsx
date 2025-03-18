import React, { useState, useEffect } from 'react';
import styles from '../../styles/Tools/MarkdownEditor.module.css';
import { Edit3, Save, Download, Copy, Trash, FileText, List, Image, Link as LinkIcon, Code, Bold, Italic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');
  const [fileName, setFileName] = useState('untitled-document');
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [showDocumentsList, setShowDocumentsList] = useState(false);
  const [documentNameInput, setDocumentNameInput] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Default markdown template
  const defaultMarkdown = `# Welcome to Markdown Editor
  
## Basic formatting

**Bold text** or __another way__

*Italic text* or _another way_

~~Strikethrough text~~

## Lists

### Unordered list
- Item 1
- Item 2
  - Nested item

### Ordered list
1. First item
2. Second item
3. Third item

## Links and Images

[Link to example](https://example.com)

![Image description](https://via.placeholder.com/150)

## Code

Inline \`code\`

\`\`\`javascript
// Code block
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

## Blockquotes

> This is a blockquote

## Tables

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

## Horizontal rule

---

Start editing to create your own document!
`;

  useEffect(() => {
    // Load saved documents from localStorage
    const savedDocs = localStorage.getItem('markdownDocuments');
    if (savedDocs) {
      const parsedDocs = JSON.parse(savedDocs);
      setDocuments(parsedDocs);
      
      // If there are documents, load the most recently edited one
      if (parsedDocs.length > 0) {
        // Sort by lastEdited and get the most recent one
        const sortedDocs = [...parsedDocs].sort((a, b) => b.lastEdited - a.lastEdited);
        const recentDoc = sortedDocs[0];
        
        setActiveDocId(recentDoc.id);
        setMarkdown(recentDoc.content);
        setFileName(recentDoc.name);
      } else {
        // No documents, set the default template
        createNewDocument();
      }
    } else {
      // No saved documents, create a new one with the template
      createNewDocument();
    }
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('markdownDocuments', JSON.stringify(documents));
    }
  }, [documents]);
  
  // Auto-save current document
  useEffect(() => {
    if (activeDocId && markdown !== '') {
      const timer = setTimeout(() => {
        saveCurrentDocument();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [markdown, activeDocId]);

  const createNewDocument = () => {
    const newDoc = {
      id: Date.now().toString(),
      name: 'Untitled Document',
      content: defaultMarkdown,
      lastEdited: Date.now()
    };
    
    setDocuments([...documents, newDoc]);
    setActiveDocId(newDoc.id);
    setMarkdown(newDoc.content);
    setFileName(newDoc.name);
    setShowDocumentsList(false);
  };
  
  const saveCurrentDocument = () => {
    if (!activeDocId) return;
    
    const updatedDocs = documents.map(doc => {
      if (doc.id === activeDocId) {
        return {
          ...doc,
          content: markdown,
          lastEdited: Date.now()
        };
      }
      return doc;
    });
    
    setDocuments(updatedDocs);
  };
  
  const handleDocumentSelect = (docId) => {
    // Save current document before switching
    saveCurrentDocument();
    
    // Find and load the selected document
    const selectedDoc = documents.find(doc => doc.id === docId);
    if (selectedDoc) {
      setActiveDocId(selectedDoc.id);
      setMarkdown(selectedDoc.content);
      setFileName(selectedDoc.name);
      setShowDocumentsList(false);
    }
  };
  
  const handleDocumentDelete = (e, docId) => {
    e.stopPropagation();
    
    if (documents.length <= 1) {
      alert("You cannot delete the last document.");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this document?")) {
      const updatedDocs = documents.filter(doc => doc.id !== docId);
      setDocuments(updatedDocs);
      
      // If the active document was deleted, load another one
      if (docId === activeDocId) {
        const firstDoc = updatedDocs[0];
        setActiveDocId(firstDoc.id);
        setMarkdown(firstDoc.content);
        setFileName(firstDoc.name);
      }
    }
  };
  
  const startRenameDocument = (e) => {
    e.preventDefault();
    
    // Find the current document
    const currentDoc = documents.find(doc => doc.id === activeDocId);
    if (currentDoc) {
      setDocumentNameInput(currentDoc.name);
      setIsRenaming(true);
    }
  };
  
  const saveDocumentName = () => {
    if (!documentNameInput.trim()) {
      alert("Document name cannot be empty.");
      return;
    }
    
    const updatedDocs = documents.map(doc => {
      if (doc.id === activeDocId) {
        return {
          ...doc,
          name: documentNameInput,
          lastEdited: Date.now()
        };
      }
      return doc;
    });
    
    setDocuments(updatedDocs);
    setFileName(documentNameInput);
    setIsRenaming(false);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown)
      .then(() => {
        // Show a temporary notification
        const notification = document.createElement('div');
        notification.className = styles.notification;
        notification.textContent = 'Copied to clipboard!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text to clipboard.');
      });
  };
  
  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const insertText = (beforeText, afterText = '') => {
    const textarea = document.querySelector(`.${styles.editorTextarea}`);
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + beforeText + selectedText + afterText + markdown.substring(end);
    
    setMarkdown(newText);
    
    // Set cursor position after the operation
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + beforeText.length,
        end + beforeText.length
      );
    }, 0);
  };
  
  const formatToolbar = [
    { icon: <Bold size={18} />, action: () => insertText('**', '**'), tooltip: 'Bold (Ctrl+B)' },
    { icon: <Italic size={18} />, action: () => insertText('*', '*'), tooltip: 'Italic (Ctrl+I)' },
    { icon: <LinkIcon size={18} />, action: () => insertText('[', '](url)'), tooltip: 'Link' },
    { icon: <Image size={18} />, action: () => insertText('![alt text](', ')'), tooltip: 'Image' },
    { icon: <List size={18} />, action: () => insertText('- '), tooltip: 'List' },
    { icon: <Code size={18} />, action: () => insertText('```\n', '\n```'), tooltip: 'Code Block' },
  ];
  
  return (
    <div className={styles.markdownEditorContainer}>
      <div className={styles.editorHeader}>
        <Edit3 size={24} className={styles.toolIcon} />
        <h3>Markdown Editor</h3>
        <p>Create and format text with Markdown syntax</p>
      </div>
      
      <div className={styles.editorToolbar}>
        <div className={styles.documentControls}>
          {isRenaming ? (
            <div className={styles.renameForm}>
              <input
                type="text"
                value={documentNameInput}
                onChange={(e) => setDocumentNameInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && saveDocumentName()}
                className={styles.renameInput}
                autoFocus
              />
              <button className={styles.renameButton} onClick={saveDocumentName}>
                <Save size={16} />
              </button>
            </div>
          ) : (
            <div className={styles.documentTitle} onClick={startRenameDocument}>
              <FileText size={16} />
              <span>{fileName}</span>
            </div>
          )}
          
          <button 
            className={styles.toolbarButton} 
            onClick={() => setShowDocumentsList(!showDocumentsList)}
            title="Documents List"
          >
            <List size={18} />
          </button>
          
          <button 
            className={styles.toolbarButton} 
            onClick={createNewDocument}
            title="New Document"
          >
            <FileText size={18} />
          </button>
        </div>
        
        <div className={styles.formatControls}>
          {formatToolbar.map((tool, index) => (
            <button
              key={index}
              className={styles.toolbarButton}
              onClick={tool.action}
              title={tool.tooltip}
            >
              {tool.icon}
            </button>
          ))}
        </div>
        
        <div className={styles.actionControls}>
          <button 
            className={styles.toolbarButton} 
            onClick={saveCurrentDocument}
            title="Save"
          >
            <Save size={18} />
          </button>
          
          <button 
            className={styles.toolbarButton} 
            onClick={downloadMarkdown}
            title="Download"
          >
            <Download size={18} />
          </button>
          
          <button 
            className={styles.toolbarButton} 
            onClick={copyToClipboard}
            title="Copy to Clipboard"
          >
            <Copy size={18} />
          </button>
          
          <button 
            className={`${styles.toolbarButton} ${previewMode ? styles.activeButton : ''}`}
            onClick={() => setPreviewMode(!previewMode)}
            title={previewMode ? "Edit Mode" : "Preview Mode"}
          >
            {previewMode ? <Edit3 size={18} /> : <FileText size={18} />}
          </button>
        </div>
      </div>
      
      {showDocumentsList && (
        <div className={styles.documentsList}>
          <h4>Your Documents</h4>
          <ul>
            {documents.map(doc => (
              <li 
                key={doc.id} 
                className={doc.id === activeDocId ? styles.activeDocument : ''}
                onClick={() => handleDocumentSelect(doc.id)}
              >
                <span className={styles.documentName}>{doc.name}</span>
                <span className={styles.documentDate}>
                  {new Date(doc.lastEdited).toLocaleDateString()}
                </span>
                <button 
                  className={styles.deleteButton}
                  onClick={(e) => handleDocumentDelete(e, doc.id)}
                >
                  <Trash size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className={styles.editorContent}>
        {previewMode ? (
          <div className={styles.previewContainer}>
            <ReactMarkdown className={styles.markdownPreview}>
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            className={styles.editorTextarea}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write your markdown here..."
          />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;