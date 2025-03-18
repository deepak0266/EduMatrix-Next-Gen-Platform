// C:\Users\DELL\OneDrive\Desktop\edu-matrix\src\components\Tools\FlashcardTool.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/Tools/FlashcardTool.module.css';
import { Bookmark, ArrowLeft, ArrowRight, Pencil, Trash, Plus, X, Save } from 'lucide-react';

const FlashcardTool = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editMode, setEditMode] = useState(false); // for editing or adding cards
  
  // Load flashcards from localStorage on component mount
  useEffect(() => {
    const savedFlashcards = localStorage.getItem('studyFlashcards');
    if (savedFlashcards) {
      setFlashcards(JSON.parse(savedFlashcards));
    } else {
      // Default flashcards if none exist
      const defaultCards = [
        { question: "What is the capital of France?", answer: "Paris" },
        { question: "What is the formula for water?", answer: "H₂O" },
        { question: "Who wrote Romeo and Juliet?", answer: "William Shakespeare" }
      ];
      setFlashcards(defaultCards);
      localStorage.setItem('studyFlashcards', JSON.stringify(defaultCards));
    }
  }, []);

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem('studyFlashcards', JSON.stringify(flashcards));
    }
  }, [flashcards]);

  const flipCard = () => {
    if (!isEditing) {
      setIsFlipped(!isFlipped);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const startEditing = () => {
    setEditedQuestion(flashcards[currentIndex].question);
    setEditedAnswer(flashcards[currentIndex].answer);
    setIsEditing(true);
    setEditMode(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditMode(false);
  };

  const saveEdit = () => {
    if (!editedQuestion.trim() || !editedAnswer.trim()) {
      alert("Both question and answer fields must be filled out.");
      return;
    }

    const updatedFlashcards = [...flashcards];
    updatedFlashcards[currentIndex] = {
      question: editedQuestion,
      answer: editedAnswer
    };
    setFlashcards(updatedFlashcards);
    setIsEditing(false);
    setEditMode(false);
    setIsFlipped(false);
  };

  const deleteCard = () => {
    if (flashcards.length <= 1) {
      alert("You cannot delete the last flashcard. Add a new one first.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this flashcard?")) {
      const updatedFlashcards = flashcards.filter((_, index) => index !== currentIndex);
      setFlashcards(updatedFlashcards);
      
      // Adjust current index if necessary
      if (currentIndex >= updatedFlashcards.length) {
        setCurrentIndex(updatedFlashcards.length - 1);
      }
      setIsFlipped(false);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      setNewQuestion('');
      setNewAnswer('');
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  };

  const addFlashcard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      alert("Both question and answer fields must be filled out.");
      return;
    }

    const newFlashcard = {
      question: newQuestion,
      answer: newAnswer
    };

    const updatedFlashcards = [...flashcards, newFlashcard];
    setFlashcards(updatedFlashcards);
    setNewQuestion('');
    setNewAnswer('');
    setShowAddForm(false);
    setEditMode(false);
    
    // Move to the newly added card
    setCurrentIndex(updatedFlashcards.length - 1);
    setIsFlipped(false);
  };

  // If there are no flashcards, show a message
  if (flashcards.length === 0) {
    return (
      <div className={styles.flashcardContainer}>
        <div className={styles.flashcardHeader}>
          <Bookmark size={24} className={styles.toolIcon} />
          <h3>Flashcards</h3>
          <p>Create and study with digital flashcards</p>
        </div>
        
        <div className={styles.emptyState}>
          <p>No flashcards available. Create your first one!</p>
          <button onClick={toggleAddForm} className={styles.addButton}>
            <Plus size={18} />
            Create Flashcard
          </button>
          
          {showAddForm && (
            <div className={styles.addFormContainer}>
              <div className={styles.addForm}>
                <div className={styles.formHeader}>
                  <h4>Create New Flashcard</h4>
                  <button onClick={toggleAddForm} className={styles.closeButton}>
                    <X size={18} />
                  </button>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="newQuestion">Question:</label>
                  <textarea
                    id="newQuestion"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter the question"
                    className={styles.textArea}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="newAnswer">Answer:</label>
                  <textarea
                    id="newAnswer"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Enter the answer"
                    className={styles.textArea}
                  />
                </div>
                
                <div className={styles.formActions}>
                  <button onClick={toggleAddForm} className={styles.cancelButton}>
                    Cancel
                  </button>
                  <button onClick={addFlashcard} className={styles.saveButton}>
                    <Save size={16} />
                    Save Flashcard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.flashcardContainer} ${editMode ? styles.editMode : ''}`}>
      <div className={styles.flashcardHeader}>
        <Bookmark size={24} className={styles.toolIcon} />
        <h3>Flashcards</h3>
        <p>Create and study with digital flashcards</p>
      </div>
      
      <div className={styles.flashcardControls}>
        <div className={styles.navigation}>
          <button 
            onClick={prevCard} 
            disabled={currentIndex === 0}
            className={styles.navButton}
          >
            <ArrowLeft size={18} />
            Previous
          </button>
          
          <div className={styles.cardCounter}>
            {currentIndex + 1} / {flashcards.length}
          </div>
          
          <button 
            onClick={nextCard} 
            disabled={currentIndex === flashcards.length - 1}
            className={styles.navButton}
          >
            Next
            <ArrowRight size={18} />
          </button>
        </div>
        
        <div className={styles.actionsButtons}>
          <button onClick={toggleAddForm} className={styles.actionButton}>
            <Plus size={16} />
          </button>
          <button onClick={startEditing} className={styles.actionButton}>
            <Pencil size={16} />
          </button>
          <button onClick={deleteCard} className={styles.actionButton}>
            <Trash size={16} />
          </button>
        </div>
      </div>
      
      {showAddForm && (
        <div className={styles.addFormContainer}>
          <div className={styles.addForm}>
            <div className={styles.formHeader}>
              <h4>Create New Flashcard</h4>
              <button onClick={toggleAddForm} className={styles.closeButton}>
                <X size={18} />
              </button>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="newQuestion">Question:</label>
              <textarea
                id="newQuestion"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter the question"
                className={styles.textArea}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="newAnswer">Answer:</label>
              <textarea
                id="newAnswer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Enter the answer"
                className={styles.textArea}
              />
            </div>
            
            <div className={styles.formActions}>
              <button onClick={toggleAddForm} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={addFlashcard} className={styles.saveButton}>
                <Save size={16} />
                Save Flashcard
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div 
        className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
        onClick={flipCard}
      >
        <div className={`${styles.front} ${isFlipped ? styles.hidden : ''}`}>
          {isEditing ? (
            <textarea
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className={styles.editTextarea}
              placeholder="Enter question"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className={styles.content}>
              <div className={styles.cardLabel}>Question</div>
              <div className={styles.cardText}>{flashcards[currentIndex].question}</div>
              <div className={styles.flipInstructions}>Click to flip</div>
            </div>
          )}
        </div>
        
        <div className={`${styles.back} ${isFlipped ? '' : styles.hidden}`}>
          {isEditing ? (
            <textarea
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              className={styles.editTextarea}
              placeholder="Enter answer"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className={styles.content}>
              <div className={styles.cardLabel}>Answer</div>
              <div className={styles.cardText}>{flashcards[currentIndex].answer}</div>
              <div className={styles.flipInstructions}>Click to flip back</div>
            </div>
          )}
        </div>
      </div>
      
      {isEditing && (
        <div className={styles.editControls}>
          <button onClick={cancelEditing} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={saveEdit} className={styles.saveButton}>
            <Save size={16} />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardTool;