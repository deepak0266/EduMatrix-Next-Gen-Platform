import React, { useState } from 'react';
import { FileText, ThumbsUp, ThumbsDown, Loader, Send, RefreshCw } from 'lucide-react';
import styles from '../../styles/Tools/QuizGenerator.module.css';

const QuizGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  // Mock function to simulate quiz generation - in a real app, this would call an API
  const generateQuiz = () => {
    if (!inputText.trim()) {
      setError('Please enter some content to generate a quiz from.');
      return;
    }

    setError('');
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // This is a mock response - you would replace this with actual API integration
        const mockQuiz = {
          title: "Generated Quiz",
          questions: Array(numQuestions).fill().map((_, i) => ({
            id: `q${i}`,
            question: `Sample question ${i+1} based on your content (difficulty: ${difficulty})`,
            options: [
              { id: `q${i}_a`, text: "Sample answer option A" },
              { id: `q${i}_b`, text: "Sample answer option B" },
              { id: `q${i}_c`, text: "Sample answer option C" },
              { id: `q${i}_d`, text: "Sample answer option D" }
            ],
            correctAnswer: `q${i}_${['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)]}`
          }))
        };
        
        setQuiz(mockQuiz);
        setSelectedAnswers({});
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setIsGenerating(false);
      } catch (err) {
        setError('Failed to generate quiz. Please try again.');
        setIsGenerating(false);
      }
    }, 2000);
  };

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const restartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const generateNewQuiz = () => {
    setQuiz(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    
    let correctCount = 0;
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    return {
      score: correctCount,
      total: quiz.questions.length,
      percentage: Math.round((correctCount / quiz.questions.length) * 100)
    };
  };

  // Render quiz input form
  const renderQuizForm = () => (
    <div className={styles.quizForm}>
      <h2 className={styles.title}>Quiz Generator</h2>
      <p className={styles.description}>
        Paste your study material below and I'll generate a quiz to test your knowledge.
      </p>
      
      <div className={styles.inputGroup}>
        <label htmlFor="quiz-content" className={styles.label}>Study Material:</label>
        <textarea
          id="quiz-content"
          className={styles.textArea}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your notes, textbook excerpt, or study material here..."
          rows={8}
        />
      </div>
      
      <div className={styles.optionsRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="num-questions" className={styles.label}>Number of Questions:</label>
          <select
            id="num-questions"
            className={styles.select}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="difficulty" className={styles.label}>Difficulty:</label>
          <select
            id="difficulty"
            className={styles.select}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
      
      {error && <p className={styles.error}>{error}</p>}
      
      <button 
        className={styles.generateButton}
        onClick={generateQuiz}
        disabled={isGenerating || !inputText.trim()}
      >
        {isGenerating ? (
          <>
            <Loader className={styles.spinIcon} />
            Generating Quiz...
          </>
        ) : (
          <>
            <FileText />
            Generate Quiz
          </>
        )}
      </button>
    </div>
  );

  // Render current question
  const renderQuestion = () => {
    if (!quiz) return null;
    
    const question = quiz.questions[currentQuestionIndex];
    
    return (
      <div className={styles.questionContainer}>
        <h2 className={styles.quizTitle}>{quiz.title}</h2>
        
        <div className={styles.questionProgress}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
        
        <div className={styles.questionCard}>
          <h3 className={styles.question}>{question.question}</h3>
          
          <div className={styles.options}>
            {question.options.map(option => (
              <div 
                key={option.id}
                className={`${styles.optionItem} ${selectedAnswers[question.id] === option.id ? styles.selectedOption : ''}`}
                onClick={() => handleOptionSelect(question.id, option.id)}
              >
                <div className={styles.optionSelector}>
                  {selectedAnswers[question.id] === option.id ? '●' : '○'}
                </div>
                <div className={styles.optionText}>{option.text}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.navigationButtons}>
          <button 
            className={styles.navButton}
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          
          <button 
            className={styles.navButton}
            onClick={nextQuestion}
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  // Render quiz results
  const renderResults = () => {
    if (!quiz) return null;
    
    const result = calculateScore();
    
    return (
      <div className={styles.resultsContainer}>
        <h2 className={styles.resultsTitle}>Quiz Results</h2>
        
        <div className={styles.scoreCard}>
          <div className={styles.scoreCircle}>
            <div className={styles.scorePercentage}>{result.percentage}%</div>
            <div className={styles.scoreFraction}>
              {result.score}/{result.total}
            </div>
          </div>
          
          <div className={styles.scoreMessage}>
            {result.percentage >= 80 ? (
              <div className={styles.excellentScore}>
                <ThumbsUp />
                <span>Excellent work!</span>
              </div>
            ) : result.percentage >= 60 ? (
              <div className={styles.goodScore}>
                <ThumbsUp />
                <span>Good job!</span>
              </div>
            ) : (
              <div className={styles.needsImprovement}>
                <ThumbsDown />
                <span>Keep practicing!</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.questionReview}>
          <h3>Review Questions</h3>
          {quiz.questions.map((question, index) => (
            <div key={question.id} className={styles.reviewQuestion}>
              <div className={styles.reviewQuestionHeader}>
                <span className={styles.questionNumber}>Q{index + 1}.</span>
                <span className={styles.questionText}>{question.question}</span>
              </div>
              
              <div className={styles.reviewAnswers}>
                {question.options.map(option => (
                  <div 
                    key={option.id} 
                    className={`${styles.reviewOption} ${
                      option.id === question.correctAnswer ? styles.correctAnswer : ''
                    } ${
                      selectedAnswers[question.id] === option.id && 
                      option.id !== question.correctAnswer ? styles.incorrectAnswer : ''
                    }`}
                  >
                    <span className={styles.optionText}>{option.text}</span>
                    {option.id === question.correctAnswer && (
                      <span className={styles.correctMark}>✓</span>
                    )}
                    {selectedAnswers[question.id] === option.id && 
                      option.id !== question.correctAnswer && (
                      <span className={styles.incorrectMark}>✗</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.actionButtons}>
          <button className={styles.actionButton} onClick={restartQuiz}>
            <RefreshCw />
            Retake Quiz
          </button>
          <button className={styles.actionButton} onClick={generateNewQuiz}>
            <Send />
            Create New Quiz
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.quizGeneratorContainer}>
      {!quiz && renderQuizForm()}
      {quiz && !showResults && renderQuestion()}
      {quiz && showResults && renderResults()}
    </div>
  );
};

export default QuizGenerator;