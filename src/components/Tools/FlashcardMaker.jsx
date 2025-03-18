import React, { useState } from 'react';
import styles from '../../styles/Tools/FlashcardMaker.module.css';
import { PlusCircle, Save, Trash2, Edit, CheckCircle } from 'lucide-react';

const FlashcardMaker = () => {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleAddCard = () => {
    if (!question.trim() || !answer.trim()) return;
    
    if (editingId) {
      setCards(prev => prev.map(card => 
        card.id === editingId ? { ...card, question, answer } : card
      ));
      setEditingId(null);
    } else {
      const newCard = {
        id: Date.now(),
        question,
        answer,
        createdAt: new Date().toISOString()
      };
      setCards(prev => [...prev, newCard]);
    }
    
    setQuestion('');
    setAnswer('');
  };

  const deleteCard = (id) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const startEditing = (card) => {
    setQuestion(card.question);
    setAnswer(card.answer);
    setEditingId(card.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Flashcard Maker</h2>
        <div className={styles.stats}>
          <CheckCircle size={20} />
          {cards.length} Cards Created
        </div>
      </div>

      <div className={styles.creator}>
        <div className={styles.inputGroup}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question..."
            className={styles.input}
            rows={3}
          />
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter answer..."
            className={styles.input}
            rows={3}
          />
          <button 
            className={styles.addButton}
            onClick={handleAddCard}
            disabled={!question.trim() || !answer.trim()}
          >
            {editingId ? <Save size={20} /> : <PlusCircle size={20} />}
            {editingId ? 'Update Card' : 'Add New Card'}
          </button>
        </div>

        <div className={styles.preview}>
          <h3>Preview ({cards.length})</h3>
          <div className={styles.cardGrid}>
            {cards.map(card => (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.cardFront}>
                    {card.question}
                  </div>
                  <div className={styles.cardBack}>
                    {card.answer}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button 
                    className={styles.actionButton}
                    onClick={() => startEditing(card)}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={() => deleteCard(card.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardMaker;