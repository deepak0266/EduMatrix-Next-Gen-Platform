import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../../styles/InterviewPreparation/InterviewPreparation.module.css';

const InterviewPreparation = () => {
  // States
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome, interview, result
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTech, setSelectedTech] = useState('');
  const [questionCount, setQuestionCount] = useState(2);
  const [difficulty, setDifficulty] = useState('mix');
  const [trickyLevel, setTrickyLevel] = useState('easy');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  // API key - in a real application, this should be in environment variables
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  // HR question to start with
  const hrQuestion = "Tell me about yourself, what's your expertise and skills?";

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Chrome.');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let newFinalTranscript = finalTranscript;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setFinalTranscript(newFinalTranscript);
      setTranscript(interimTranscript);
    };

    recognitionRef.current.onend = () => {
      // This is a key fix - when recognition ends unexpectedly (like during a pause),
      // restart it if we're still in recording mode
      if (isRecording) {
        console.log('Recognition ended, restarting...');
        recognitionRef.current.start();
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use speech recognition.');
      }
    };

    return true;
  };

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return true;
    } catch (err) {
      console.error('Camera/mic initialization error:', err);
      alert('Error accessing camera/microphone: ' + err.message);
      return false;
    }
  };

  const startTimer = () => {
    let time = 60;
    setTimeLeft(time);
    
    timerRef.current = setInterval(() => {
      time--;
      setTimeLeft(time);
      
      if (time <= 0) {
        clearInterval(timerRef.current);
        handleTimeUp();
      }
    }, 1000);
  };

  const handleTimeUp = () => {
    alert('Time is up!');
    submitAnswer();
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startInterview = async () => {
    if (!selectedRole && !selectedTech) {
      alert('Please select either a role or a technology!');
      return;
    }

    setLoading(true);
    
    // Initialize camera and speech recognition
    const cameraInitialized = await initializeCamera();
    if (!cameraInitialized) {
      setLoading(false);
      return;
    }

    // Start with HR question and generate remaining questions
    try {
      const dynamicQuestions = await generateDynamicQuestions(
        selectedRole || selectedTech,
        questionCount - 1
      );
      
      const fullQuestions = [hrQuestion, ...dynamicQuestions];
      setQuestions(fullQuestions);
      
      // Move to interview screen
      setCurrentScreen('interview');
      setCurrentQuestionIndex(0);
      
      // Start timer for first question
      startTimer();
      
      // Speak the first question
      const utterance = new SpeechSynthesisUtterance(fullQuestions[0]);
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateDynamicQuestions = async (type, count) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o-mini",
          messages: [{
            role: "user",
            content: `You are an AI interview coach. Generate only most common interview questions for a ${type}.  
            Questions should be:  
            - Clear and concise
            - Brief 
            - Only oral questions
            - Mix of easy, tricky, and confusing.
            
            Example Output:  
            "if c++, in program you declare variable float main. Due to main, does it give error? if not then why if yes then why."
            
            Remember generate only most common interview questions for related to ${type}.`
          }],
          temperature: 0.7,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedQuestions = response.data.choices[0].message.content
        .split('\n')
        .filter(q => q.trim().length > 0);
        
      // Ensure we return exactly the requested number of questions
      return generatedQuestions.slice(0, count);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return Array(count).fill("Could not generate question. Please try again.");
    }
  };

  const evaluateResponse = async (question, answer) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o-mini",
          messages: [{
            role: "user",
            content: `Evaluate this answer to the question "${question}":\n\n${answer}\n\n Give short answer only accordingly \n\nProvide concise feedback within 3 bullet points. use <br> tags to separate the lines`
          }],
          temperature: 0.5,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Evaluation error:', error);
      return "Could not evaluate response";
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      setFinalTranscript('');
      setTranscript('');
      
      if (!recognitionRef.current) {
        if (!initializeSpeechRecognition()) return;
      }
      
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  const submitAnswer = async () => {
    if (!finalTranscript.trim()) {
      alert('Please record your answer first!');
      return;
    }

    setLoading(true);
    
    // Stop recording if still active
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    }

    try {
      const evaluation = await evaluateResponse(
        questions[currentQuestionIndex],
        finalTranscript
      );

      const newAnswers = [...answers, {
        question: questions[currentQuestionIndex],
        answer: finalTranscript,
        evaluation: evaluation
      }];
      
      setAnswers(newAnswers);
      
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      if (nextQuestionIndex < questions.length) {
        // Move to next question
        setCurrentQuestionIndex(nextQuestionIndex);
        setFinalTranscript('');
        setTranscript('');
        resetTimer();
        startTimer();
        
        // Speak the next question
        const utterance = new SpeechSynthesisUtterance(questions[nextQuestionIndex]);
        speechSynthesis.speak(utterance);
      } else {
        // End of interview
        showResults(newAnswers);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showResults = (finalAnswers) => {
    setAnswers(finalAnswers);
    resetTimer();
    setCurrentScreen('result');
    
    // Stop camera and audio
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const quitInterview = () => {
    if (window.confirm('Are you sure you want to quit the interview?')) {
      resetTimer();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      resetInterview();
    }
  };

  const resetInterview = () => {
    setCurrentScreen('welcome');
    setSelectedRole(null);
    setSelectedTech('');
    setQuestionCount(2);
    setDifficulty('mix');
    setTrickyLevel('easy');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setFinalTranscript('');
    setTranscript('');
    setIsRecording(false);
  };

  return (
    <div className={styles.container}>
      {/* Welcome Screen */}
      {currentScreen === 'welcome' && (
        <div className={styles.welcomeScreen}>
          <h1 className={styles.welcomeTitle}>Welcome to AI Interview Preparation</h1>
          <p>Prepare for your next interview with our AI-powered system</p>

          <div className={styles.roleGrid}>
            <div 
              className={`${styles.roleCard} ${selectedRole === 'frontend' ? styles.selected : ''}`} 
              onClick={() => {
                setSelectedRole('frontend');
                setSelectedTech('');
              }}
              style={{ opacity: selectedTech ? 0.5 : 1, pointerEvents: selectedTech ? 'none' : 'auto' }}
            >
              <h3>Frontend Developer</h3>
              <p>HTML, CSS, JavaScript, React</p>
            </div>
            <div 
              className={`${styles.roleCard} ${selectedRole === 'backend' ? styles.selected : ''}`} 
              onClick={() => {
                setSelectedRole('backend');
                setSelectedTech('');
              }}
              style={{ opacity: selectedTech ? 0.5 : 1, pointerEvents: selectedTech ? 'none' : 'auto' }}
            >
              <h3>Backend Developer</h3>
              <p>Python, Node.js, Databases</p>
            </div>
            <div 
              className={`${styles.roleCard} ${selectedRole === 'fullstack' ? styles.selected : ''}`} 
              onClick={() => {
                setSelectedRole('fullstack');
                setSelectedTech('');
              }}
              style={{ opacity: selectedTech ? 0.5 : 1, pointerEvents: selectedTech ? 'none' : 'auto' }}
            >
              <h3>Full Stack Developer</h3>
              <p>Frontend + Backend Technologies</p>
            </div>
            <div 
              className={`${styles.roleCard} ${selectedRole === 'datascience' ? styles.selected : ''}`} 
              onClick={() => {
                setSelectedRole('datascience');
                setSelectedTech('');
              }}
              style={{ opacity: selectedTech ? 0.5 : 1, pointerEvents: selectedTech ? 'none' : 'auto' }}
            >
              <h3>Data Scientist</h3>
              <p>Machine Learning, Statistics, Python</p>
            </div>
            <div 
              className={`${styles.roleCard} ${selectedRole === 'android' ? styles.selected : ''}`} 
              onClick={() => {
                setSelectedRole('android');
                setSelectedTech('');
              }}
              style={{ opacity: selectedTech ? 0.5 : 1, pointerEvents: selectedTech ? 'none' : 'auto' }}
            >
              <h3>Android Developer</h3>
              <p>Java, Kotlin, Android SDK</p>
            </div>
          </div>

          <div className={styles.techSelect}>
            <h3>Or select specific technology:</h3>
            <select 
              value={selectedTech} 
              onChange={(e) => {
                setSelectedTech(e.target.value);
                if (e.target.value) setSelectedRole(null);
              }}
            >
              <option value="" disabled>Select Technology</option>
              <option value="oops">OOPS</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="kotlin">Kotlin</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <div className={styles.settingsContainer}>
            <div>
              <label htmlFor="questionCount">Number of Questions (2-20):</label>
              <input 
                type="number" 
                id="questionCount" 
                min="2" 
                max="20" 
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.max(2, Math.min(20, parseInt(e.target.value) || 2)))}
              />
            </div>
            <div>
              <label htmlFor="difficulty">Difficulty Level:</label>
              <select 
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="mix">Mix (Default)</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label htmlFor="tricky">Tricky Level:</label>
              <select 
                id="tricky"
                value={trickyLevel}
                onChange={(e) => setTrickyLevel(e.target.value)}
              >
                <option value="easy">Easy (Default)</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <button 
            className={styles.button}
            onClick={startInterview}
            disabled={!selectedRole && !selectedTech}
          >
            Start Interview
          </button>
          
          {loading && <div className={styles.loadingOverlay}>Processing...</div>}
        </div>
      )}

      {/* Interview Screen */}
      {currentScreen === 'interview' && (
        <div className={styles.interviewScreen}>
          <div className={styles.cameraContainer}>
            <video ref={videoRef} className={styles.camera} autoPlay muted></video>
          </div>

          <div className={styles.timerDisplay}>Time Left: {timeLeft}s</div>

          <div className={styles.botContainer}>
            <div className={styles.botAnimation}></div>
          </div>
          
          <div className={styles.questionContainer}>
            <h2>{questions[currentQuestionIndex]}</h2>
            <p className={styles.transcriptionText}>
              <span>{finalTranscript}</span>
              <span style={{ color: '#999' }}>{transcript}</span>
            </p>
          </div>

          <div className={styles.controls}>
            <button 
              className={`${styles.button} ${styles.quitButton}`}
              onClick={quitInterview}
            >
              Quit
            </button>
            <button 
              className={`${styles.button} ${isRecording ? styles.recordingButton : ''}`}
              onClick={toggleRecording}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <button 
              className={styles.button}
              onClick={submitAnswer}
            >
              Submit Answer
            </button>
          </div>
          
          {loading && <div className={styles.loadingOverlay}>Processing...</div>}
        </div>
      )}

      {/* Result Screen */}
      {currentScreen === 'result' && (
        <div className={styles.resultScreen}>
          <h1>Interview Results</h1>
          <div className={styles.feedbackContainer}>
            <h2>Performance Analysis</h2>
            <div>
              {answers.map((answer, index) => (
                <div className={styles.feedbackItem} key={index}>
                  <h4>Question {index + 1}:</h4>
                  <p><strong>Question:</strong> {answer.question}</p>
                  <p><strong>Your Answer:</strong> {answer.answer}</p>
                  <p><strong>Feedback:</strong> <span dangerouslySetInnerHTML={{ __html: answer.evaluation }} /></p>
                </div>
              ))}
            </div>
          </div>
          <button 
            className={styles.button}
            onClick={resetInterview}
          >
            Start New Interview
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewPreparation;