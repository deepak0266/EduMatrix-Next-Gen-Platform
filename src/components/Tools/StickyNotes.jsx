import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, Save, X, Move, StickyNote } from 'lucide-react'; 
import styles from '../../styles/Tools/StickyNotes.module.css';

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentNote, setCurrentNote] = useState({ title: '', content: '', color: '#ffcb6b' });
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('sticky-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Error loading notes from localStorage:', e);
      }
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: currentNote.title.trim() || 'New Note',
      content: currentNote.content,
      color: currentNote.color,
      position: { x: Math.random() * 100, y: Math.random() * 100 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setNotes([...notes, newNote]);
    setCurrentNote({ title: '', content: '', color: '#ffcb6b' });
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    setCurrentNote({
      title: note.title,
      content: note.content,
      color: note.color
    });
  };

  const updateNote = () => {
    if (!editingId) return;
    
    const updatedNotes = notes.map(note => {
      if (note.id === editingId) {
        return {
          ...note,
          title: currentNote.title.trim() || 'Untitled',
          content: currentNote.content,
          color: currentNote.color,
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    });
    
    setNotes(updatedNotes);
    setEditingId(null);
    setCurrentNote({ title: '', content: '', color: '#ffcb6b' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setCurrentNote({ title: '', content: '', color: '#ffcb6b' });
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    
    if (editingId === id) {
      cancelEditing();
    }
  };

  const handleDragStart = (e, note) => {
    // Prevent default drag behavior
    e.preventDefault();
    
    const noteElement = e.currentTarget;
    const rect = noteElement.getBoundingClientRect();
    
    setDraggingId(note.id);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Add events for drag and drop
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!draggingId) return;
    
    const container = document.querySelector(`.${styles.notesGrid}`);
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    const x = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
    const y = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;
    
    // Ensure the note stays within the container bounds
    const clampedX = Math.max(0, Math.min(95, x));
    const clampedY = Math.max(0, Math.min(95, y));
    
    setNotes(notes.map(note => {
      if (note.id === draggingId) {
        return {
          ...note,
          position: { x: clampedX, y: clampedY }
        };
      }
      return note;
    }));
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const NoteColors = [
    { value: '#ffcb6b', name: 'Yellow' },
    { value: '#ff9a8b', name: 'Coral' },
    { value: '#a5d8ff', name: 'Blue' },
    { value: '#b5e8ca', name: 'Green' },
    { value: '#d8bbff', name: 'Purple' },
    { value: '#ffec99', name: 'Pastel Yellow' }
  ];

  return (
    <div className={styles.stickyNotesContainer}>
      <div className={styles.notesHeader}>
        <h2 className={styles.title}>Sticky Notes</h2>
        <p className={styles.description}>
          Create and organize your study notes. Drag to reposition.
        </p>
      </div>
      
      <div className={styles.noteEditor}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.titleInput}
            value={currentNote.title}
            onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
            placeholder="Note title"
          />
        </div>
        
        <div className={styles.inputGroup}>
          <textarea
            className={styles.contentInput}
            value={currentNote.content}
            onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
            placeholder="Write your note here..."
            rows={4}
          />
        </div>
        
        <div className={styles.colorSelector}>
          <span className={styles.colorLabel}>Color:</span>
          {NoteColors.map(color => (
            <button
              key={color.value}
              className={`${styles.colorOption} ${currentNote.color === color.value ? styles.selectedColor : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => setCurrentNote({...currentNote, color: color.value})}
              aria-label={`Select ${color.name} color`}
              title={color.name}
            />
          ))}
        </div>
        
        <div className={styles.editorButtons}>
          {editingId ? (
            <>
              <button 
                className={styles.saveButton}
                onClick={updateNote}
                disabled={!currentNote.title && !currentNote.content}
              >
                <Save size={16} />
                Update Note
              </button>
              <button 
                className={styles.cancelButton}
                onClick={cancelEditing}
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button 
              className={styles.addButton}
              onClick={createNote}
              disabled={!currentNote.title && !currentNote.content}
            >
              <Plus size={16} />
              Add Note
            </button>
          )}
        </div>
      </div>
      
      <div className={styles.notesGrid}>
        {notes.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><StickyNote size={32} /></div>
            <p>No notes yet! Create your first note above.</p>
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`${styles.stickyNote} ${draggingId === note.id ? styles.dragging : ''}`}
              style={{
                backgroundColor: note.color,
                left: `${note.position ? note.position.x : 0}%`,
                top: `${note.position ? note.position.y : 0}%`,
              }}
            >
              <div 
                className={styles.noteDragHandle}
                onMouseDown={(e) => handleDragStart(e, note)}
              >
                <Move size={16} />
              </div>
              
              <div className={styles.noteHeader}>
                <h3 className={styles.noteTitle}>{note.title}</h3>
                <div className={styles.noteActions}>
                  <button
                    className={styles.noteAction}
                    onClick={() => startEditing(note)}
                    aria-label="Edit note"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className={styles.noteAction}
                    onClick={() => deleteNote(note.id)}
                    aria-label="Delete note"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className={styles.noteContent}>
                {note.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              
              <div className={styles.noteFooter}>
                <span className={styles.noteDate}>
                  Updated: {formatDate(note.updatedAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StickyNotes;