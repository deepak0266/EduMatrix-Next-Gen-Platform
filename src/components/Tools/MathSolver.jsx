import React, { useState } from 'react';
import styles from '../../styles/Tools/MathSolver.module.css';
import { Calculator, Hash, XCircle, ArrowRight, Divide, BookOpen } from 'lucide-react';

const MathSolver = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [calculationType, setCalculationType] = useState('basic'); // basic, algebra, calculus

  const calculateResult = () => {
    if (!expression.trim()) {
      setError('Please enter a math expression');
      return;
    }

    setError('');
    try {
      // Basic arithmetic - using eval safely with checks
      if (calculationType === 'basic') {
        // Security check - only allow basic arithmetic operations and numbers
        if (!/^[0-9+\-*/().%\s^]+$/.test(expression)) {
          throw new Error('Invalid characters in expression');
        }

        // Replace ^ with ** for exponentiation
        const processedExpression = expression.replace(/\^/g, '**');

        // Using Function constructor instead of eval for slightly better safety
        // eslint-disable-next-line no-new-func
        const calculatedResult = new Function('return ' + processedExpression)();
        const finalResult = typeof calculatedResult === 'number' ?
          calculatedResult.toString() : 'Error: Invalid expression';

        setResult(finalResult);
        addToHistory(expression, finalResult);
      }
      // For algebra and calculus, we'd need a math library like math.js
      // This is a simplified implementation
      else if (calculationType === 'algebra') {
        // Simplified algebra solver for basic equations like x+5=10
        if (expression.includes('=')) {
          const parts = expression.split('=');
          if (parts.length !== 2) throw new Error('Invalid equation format');

          // Very simple x solving - only works for basic cases
          if (parts[0].includes('x')) {
            const xTerm = parts[0].trim();
            const value = parseFloat(parts[1].trim());

            if (xTerm === 'x') {
              setResult(`x = ${value}`);
              addToHistory(expression, `x = ${value}`);
            } else if (xTerm === '-x') {
              setResult(`x = ${-value}`);
              addToHistory(expression, `x = ${-value}`);
            } else if (xTerm.match(/x[+\-][0-9]+/)) {
              // Handle x+5=10 or x-5=10
              const operator = xTerm.match(/[+\-]/)[0];
              const number = parseFloat(xTerm.split(operator)[1]);

              if (operator === '+') {
                setResult(`x = ${value - number}`);
                addToHistory(expression, `x = ${value - number}`);
              } else {
                setResult(`x = ${value + number}`);
                addToHistory(expression, `x = ${value + number}`);
              }
            } else {
              throw new Error('Cannot solve this type of equation');
            }
          } else {
            throw new Error('Equation must contain x');
          }
        } else {
          throw new Error('Algebra mode requires an equation with =');
        }
      } else if (calculationType === 'calculus') {
        setResult('Calculus functionality requires advanced math libraries');
        setError('Advanced calculus is not implemented in this demo');
      }
    } catch (err) {
      setError(err.message || 'Invalid expression');
      setResult('Error');
    }
  };

  const addToHistory = (expr, res) => {
    const newEntry = {
      id: Date.now(),
      expression: expr,
      result: res,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prevHistory => [newEntry, ...prevHistory.slice(0, 9)]);
  };

  const clearHistory = () => {
    setHistory([]);
    setShowHistory(false);
  };

  const handleUseHistory = (expr) => {
    setExpression(expr);
    setShowHistory(false);
  };

  const clearExpression = () => {
    setExpression('');
    setResult('');
    setError('');
  };

  // Calculator buttons for basic mode
  const basicButtons = [
    { label: '7', action: () => setExpression(prev => prev + '7') },
    { label: '8', action: () => setExpression(prev => prev + '8') },
    { label: '9', action: () => setExpression(prev => prev + '9') },
    { label: '÷', action: () => setExpression(prev => prev + '/') },
    { label: '4', action: () => setExpression(prev => prev + '4') },
    { label: '5', action: () => setExpression(prev => prev + '5') },
    { label: '6', action: () => setExpression(prev => prev + '6') },
    { label: '×', action: () => setExpression(prev => prev + '*') },
    { label: '1', action: () => setExpression(prev => prev + '1') },
    { label: '2', action: () => setExpression(prev => prev + '2') },
    { label: '3', action: () => setExpression(prev => prev + '3') },
    { label: '-', action: () => setExpression(prev => prev + '-') },
    { label: '0', action: () => setExpression(prev => prev + '0') },
    { label: '.', action: () => setExpression(prev => prev + '.') },
    { label: '=', action: calculateResult, isWide: true },
    { label: '+', action: () => setExpression(prev => prev + '+') },
  ];

  // Additional scientific buttons
  const scientificButtons = [
    { label: '(', action: () => setExpression(prev => prev + '(') },
    { label: ')', action: () => setExpression(prev => prev + ')') },
    { label: '^', action: () => setExpression(prev => prev + '^') },
    { label: '%', action: () => setExpression(prev => prev + '%') },
  ];

  // Algebra buttons
  const algebraButtons = [
    { label: 'x', action: () => setExpression(prev => prev + 'x') },
    { label: '=', action: () => setExpression(prev => prev + '=') },
    { label: 'Solve', action: calculateResult, isWide: true },
  ];

  return (
    <div className={styles.mathSolverContainer}>
      <div className={styles.solverHeader}>
        <Calculator size={24} className={styles.toolIcon} />
        <h3>Math Solver</h3>
        <p>Calculate and solve mathematical problems</p>
      </div>

      <div className={styles.calculatorModes}>
        <button
          className={`${styles.modeButton} ${calculationType === 'basic' ? styles.activeMode : ''}`}
          onClick={() => setCalculationType('basic')}
        >
          <Hash size={16} />
          <span>Basic</span>
        </button>
        <button
          className={`${styles.modeButton} ${calculationType === 'algebra' ? styles.activeMode : ''}`}
          onClick={() => setCalculationType('algebra')}
        >
          <ArrowRight size={16} />
          <span>Algebra</span>
        </button>
        <button
          className={`${styles.modeButton} ${calculationType === 'calculus' ? styles.activeMode : ''}`}
          onClick={() => setCalculationType('calculus')}
        >
          <Divide size={16} />
          <span>Calculus</span>
        </button>
      </div>

      <div className={styles.calculatorDisplay}>
        <div className={styles.displayControls}>
          <button
            className={styles.historyButton}
            onClick={() => setShowHistory(!showHistory)}
          >
            <BookOpen size={16} />
          </button>
          <button
            className={styles.clearButton}
            onClick={clearExpression}
          >
            <XCircle size={16} />
          </button>
        </div>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder={calculationType === 'basic' ?
            '2 + 2 * 3' : calculationType === 'algebra' ?
              'x + 5 = 10' : 'Not implemented'
          }
          className={styles.expressionInput}
          onKeyPress={(e) => e.key === 'Enter' && calculateResult()}
        />
        {error && <div className={styles.errorMessage}>{error}</div>}
        {result && (
          <div className={styles.resultDisplay}>
            <span className={styles.resultLabel}>Result:</span>
            <span className={styles.resultValue}>{result}</span>
          </div>
        )}
      </div>

      {showHistory && history.length > 0 && (
        <div className={styles.historyPanel}>
          <div className={styles.historyHeader}>
            <h4>Calculation History</h4>
            <button
              className={styles.clearHistoryButton}
              onClick={clearHistory}
            >
              Clear
            </button>
          </div>
          <ul className={styles.historyList}>
            {history.map(item => (
              <li key={item.id} className={styles.historyItem}>
                <div onClick={() => handleUseHistory(item.expression)}>
                  <div className={styles.historyExpression}>{item.expression}</div>
                  <div className={styles.historyResult}>= {item.result}</div>
                </div>
                <div className={styles.historyTime}>{item.timestamp}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.calculatorKeypad}>
        {calculationType === 'basic' && (
          <>
            <div className={styles.scientificRow}>
              {scientificButtons.map((button, index) => (
                <button
                  key={index}
                  className={styles.calculatorButton}
                  onClick={button.action}
                >
                  {button.label}
                </button>
              ))}
            </div>
            <div className={styles.keypadGrid}>
              {basicButtons.map((button, index) => (
                <button
                  key={index}
                  className={`${styles.calculatorButton} ${button.isWide ? styles.wideButton : ''}`}
                  onClick={button.action}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </>
        )}

        {calculationType === 'algebra' && (
          <div className={styles.algebraKeypad}>
            <div className={styles.basicButtonsRow}>
              {basicButtons.slice(0, 10).map((button, index) => (
                <button
                  key={index}
                  className={styles.calculatorButton}
                  onClick={button.action}
                >
                  {button.label}
                </button>
              ))}
            </div>
            <div className={styles.algebraButtonsRow}>
              {algebraButtons.map((button, index) => (
                <button
                  key={index}
                  className={`${styles.calculatorButton} ${button.isWide ? styles.wideButton : ''}`}
                  onClick={button.action}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {calculationType === 'calculus' && (
          <div className={styles.notImplemented}>
            <p>Calculus functionality is not implemented in this demo.</p>
            <p>This would require a math library like math.js or mathsteps.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathSolver;