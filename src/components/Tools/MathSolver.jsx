import React, { useState } from 'react';
import { Calculator, Hash, XCircle, ArrowRight, Divide, BookOpen, Trash2 } from 'lucide-react';

const MathSolver = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [calculationType, setCalculationType] = useState('basic');

  // Safe math evaluation function
  const evaluateExpression = (expr) => {
    // Remove spaces and validate characters
    const cleanExpr = expr.replace(/\s/g, '');
    
    // Only allow safe characters for basic math
    if (!/^[0-9+\-*/.()^%]+$/.test(cleanExpr)) {
      throw new Error('Invalid characters in expression');
    }

    // Replace ^ with ** for exponentiation
    let processedExpr = cleanExpr.replace(/\^/g, '**');
    
    // Basic validation - check for balanced parentheses
    const openParens = (processedExpr.match(/\(/g) || []).length;
    const closeParens = (processedExpr.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      throw new Error('Unbalanced parentheses');
    }

    // Check for invalid patterns
    if (/[+\-*/.^%]{2,}/.test(processedExpr) || /^[+*/.^%]/.test(processedExpr) || /[+\-*/.^%]$/.test(processedExpr)) {
      throw new Error('Invalid expression format');
    }

    try {
      // Use Function constructor for safer evaluation
      const result = new Function('return ' + processedExpr)();
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid calculation result');
      }
      return result;
    } catch (err) {
      throw new Error('Cannot evaluate expression');
    }
  };

  // Simple algebra solver for basic linear equations
  const solveAlgebra = (equation) => {
    if (!equation.includes('=')) {
      throw new Error('Algebra mode requires an equation with =');
    }

    const [leftSide, rightSide] = equation.split('=').map(s => s.trim());
    
    if (!leftSide.includes('x')) {
      throw new Error('Equation must contain variable x');
    }

    try {
      // Handle simple cases like: x = 5, x + 3 = 10, x - 2 = 8, 2x = 10, etc.
      if (leftSide === 'x') {
        const value = evaluateExpression(rightSide);
        return `x = ${value}`;
      }
      
      // Handle x + number = value
      const addMatch = leftSide.match(/^x\s*\+\s*([0-9.]+)$/);
      if (addMatch) {
        const addend = parseFloat(addMatch[1]);
        const value = evaluateExpression(rightSide);
        return `x = ${value - addend}`;
      }
      
      // Handle x - number = value
      const subMatch = leftSide.match(/^x\s*-\s*([0-9.]+)$/);
      if (subMatch) {
        const subtractend = parseFloat(subMatch[1]);
        const value = evaluateExpression(rightSide);
        return `x = ${value + subtractend}`;
      }
      
      // Handle number * x = value or coefficient x = value
      const multMatch = leftSide.match(/^([0-9.]+)\s*\*?\s*x$/) || leftSide.match(/^([0-9.]+)x$/);
      if (multMatch) {
        const coefficient = parseFloat(multMatch[1]);
        const value = evaluateExpression(rightSide);
        return `x = ${value / coefficient}`;
      }
      
      // Handle x / number = value
      const divMatch = leftSide.match(/^x\s*\/\s*([0-9.]+)$/);
      if (divMatch) {
        const divisor = parseFloat(divMatch[1]);
        const value = evaluateExpression(rightSide);
        return `x = ${value * divisor}`;
      }
      
      throw new Error('Cannot solve this type of equation');
    } catch (err) {
      throw new Error('Invalid equation format');
    }
  };

  const calculateResult = () => {
    if (!expression.trim()) {
      setError('Please enter a math expression');
      return;
    }

    setError('');
    try {
      let calculatedResult;
      
      if (calculationType === 'basic') {
        calculatedResult = evaluateExpression(expression);
        const finalResult = Number.isInteger(calculatedResult) 
          ? calculatedResult.toString() 
          : calculatedResult.toFixed(8).replace(/\.?0+$/, '');
        
        setResult(finalResult);
        addToHistory(expression, finalResult);
      } 
      else if (calculationType === 'algebra') {
        calculatedResult = solveAlgebra(expression);
        setResult(calculatedResult);
        addToHistory(expression, calculatedResult);
      } 
      else if (calculationType === 'calculus') {
        setError('Calculus functionality requires advanced math libraries');
        setResult('Not implemented');
      }
    } catch (err) {
      setError(err.message || 'Invalid expression');
      setResult('');
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

  const addToExpression = (value) => {
    setExpression(prev => prev + value);
  };

  const handleBackspace = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  // Calculator buttons for basic mode
  const basicButtons = [
    { label: 'C', action: clearExpression, type: 'clear' },
    { label: '⌫', action: handleBackspace, type: 'backspace' },
    { label: '(', action: () => addToExpression('(') },
    { label: ')', action: () => addToExpression(')') },
    { label: '7', action: () => addToExpression('7') },
    { label: '8', action: () => addToExpression('8') },
    { label: '9', action: () => addToExpression('9') },
    { label: '÷', action: () => addToExpression('/'), type: 'operator' },
    { label: '4', action: () => addToExpression('4') },
    { label: '5', action: () => addToExpression('5') },
    { label: '6', action: () => addToExpression('6') },
    { label: '×', action: () => addToExpression('*'), type: 'operator' },
    { label: '1', action: () => addToExpression('1') },
    { label: '2', action: () => addToExpression('2') },
    { label: '3', action: () => addToExpression('3') },
    { label: '-', action: () => addToExpression('-'), type: 'operator' },
    { label: '0', action: () => addToExpression('0'), span: 2 },
    { label: '.', action: () => addToExpression('.') },
    { label: '+', action: () => addToExpression('+'), type: 'operator' },
    { label: '=', action: calculateResult, type: 'equals' },
  ];

  // Scientific buttons
  const scientificButtons = [
    { label: '^', action: () => addToExpression('^'), type: 'operator' },
    { label: '%', action: () => addToExpression('%'), type: 'operator' },
  ];

  // Algebra buttons
  const algebraButtons = [
    { label: 'x', action: () => addToExpression('x'), type: 'variable' },
    { label: '=', action: () => addToExpression('='), type: 'equals' },
    { label: 'Solve', action: calculateResult, type: 'solve', span: 2 },
  ];

  return (
    <div className="math-solver-container">
      <div className="solver-header">
        <Calculator size={24} className="tool-icon" />
        <h3>Math Solver</h3>
        <p>Calculate and solve mathematical problems</p>
      </div>

      <div className="calculator-modes">
        <button
          className={`mode-button ${calculationType === 'basic' ? 'active-mode' : ''}`}
          onClick={() => setCalculationType('basic')}
        >
          <Hash size={16} />
          <span>Basic</span>
        </button>
        <button
          className={`mode-button ${calculationType === 'algebra' ? 'active-mode' : ''}`}
          onClick={() => setCalculationType('algebra')}
        >
          <ArrowRight size={16} />
          <span>Algebra</span>
        </button>
        <button
          className={`mode-button ${calculationType === 'calculus' ? 'active-mode' : ''}`}
          onClick={() => setCalculationType('calculus')}
        >
          <Divide size={16} />
          <span>Calculus</span>
        </button>
      </div>

      <div className="calculator-display">
        <div className="display-controls">
          <button
            className="history-button"
            onClick={() => setShowHistory(!showHistory)}
            title="Show calculation history"
          >
            <BookOpen size={16} />
          </button>
          <button
            className="clear-button"
            onClick={clearExpression}
            title="Clear expression"
          >
            <XCircle size={16} />
          </button>
        </div>
        
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder={
            calculationType === 'basic' ? '2 + 2 * 3' : 
            calculationType === 'algebra' ? 'x + 5 = 10' : 
            'Not implemented'
          }
          className="expression-input"
          onKeyPress={(e) => e.key === 'Enter' && calculateResult()}
        />
        
        {error && <div className="error-message">{error}</div>}
        
        {result && !error && (
          <div className="result-display">
            <span className="result-label">Result:</span>
            <span className="result-value">{result}</span>
          </div>
        )}
      </div>

      {showHistory && history.length > 0 && (
        <div className="history-panel">
          <div className="history-header">
            <h4>Calculation History</h4>
            <button className="clear-history-button" onClick={clearHistory}>
              <Trash2 size={14} />
              Clear
            </button>
          </div>
          <ul className="history-list">
            {history.map(item => (
              <li key={item.id} className="history-item" onClick={() => handleUseHistory(item.expression)}>
                <div className="history-content">
                  <div className="history-expression">{item.expression}</div>
                  <div className="history-result">= {item.result}</div>
                </div>
                <div className="history-time">{item.timestamp}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="calculator-keypad">
        {calculationType === 'basic' && (
          <div className="keypad-grid">
            {basicButtons.map((button, index) => (
              <button
                key={index}
                className={`calculator-button ${button.type || ''} ${button.span === 2 ? 'span-2' : ''}`}
                onClick={button.action}
              >
                {button.label}
              </button>
            ))}
            {scientificButtons.map((button, index) => (
              <button
                key={`sci-${index}`}
                className={`calculator-button ${button.type || ''}`}
                onClick={button.action}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}

        {calculationType === 'algebra' && (
          <div className="algebra-keypad">
            <div className="basic-numbers">
              {basicButtons.slice(4, 20).map((button, index) => (
                <button
                  key={`alg-${index}`}
                  className={`calculator-button ${button.type || ''} ${button.span === 2 ? 'span-2' : ''}`}
                  onClick={button.action}
                >
                  {button.label}
                </button>
              ))}
            </div>
            <div className="algebra-controls">
              {algebraButtons.map((button, index) => (
                <button
                  key={`algctrl-${index}`}
                  className={`calculator-button ${button.type || ''} ${button.span === 2 ? 'span-2' : ''}`}
                  onClick={button.action}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {calculationType === 'calculus' && (
          <div className="not-implemented">
            <p>Calculus functionality is not implemented in this demo.</p>
            <p>This would require a math library like math.js or mathsteps.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .math-solver-container {
          max-width: 500px;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .solver-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .tool-icon {
          color: #fff;
          margin-bottom: 8px;
        }

        .solver-header h3 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
        }

        .solver-header p {
          margin: 0;
          opacity: 0.8;
          font-size: 14px;
        }

        .calculator-modes {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 4px;
        }

        .mode-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 12px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .mode-button.active-mode {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .calculator-display {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }

        .display-controls {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .history-button,
        .clear-button {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          padding: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .history-button:hover,
        .clear-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .expression-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 16px;
          color: white;
          font-size: 18px;
          font-weight: 500;
          text-align: right;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }

        .expression-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.15);
        }

        .expression-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .error-message {
          background: rgba(255, 59, 48, 0.2);
          border: 1px solid rgba(255, 59, 48, 0.3);
          color: #ffcdd2;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          margin-top: 8px;
        }

        .result-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.15);
          padding: 16px;
          border-radius: 12px;
          margin-top: 12px;
        }

        .result-label {
          font-size: 14px;
          opacity: 0.8;
        }

        .result-value {
          font-size: 24px;
          font-weight: 700;
          color: #4CAF50;
        }

        .history-panel {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .history-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .clear-history-button {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 59, 48, 0.2);
          border: none;
          border-radius: 6px;
          padding: 6px 10px;
          color: #ffcdd2;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-history-button:hover {
          background: rgba(255, 59, 48, 0.3);
        }

        .history-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 200px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .history-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }

        .history-content {
          flex: 1;
        }

        .history-expression {
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 2px;
        }

        .history-result {
          font-size: 16px;
          font-weight: 600;
          color: #4CAF50;
        }

        .history-time {
          font-size: 12px;
          opacity: 0.6;
        }

        .calculator-keypad {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 16px;
          backdrop-filter: blur(10px);
        }

        .keypad-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .algebra-keypad {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .basic-numbers {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .algebra-controls {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .calculator-button {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .calculator-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .calculator-button:active {
          transform: scale(0.95);
        }

        .calculator-button.operator {
          background: rgba(255, 149, 0, 0.3);
          border-color: rgba(255, 149, 0, 0.4);
        }

        .calculator-button.operator:hover {
          background: rgba(255, 149, 0, 0.4);
        }

        .calculator-button.equals,
        .calculator-button.solve {
          background: rgba(52, 199, 89, 0.3);
          border-color: rgba(52, 199, 89, 0.4);
        }

        .calculator-button.equals:hover,
        .calculator-button.solve:hover {
          background: rgba(52, 199, 89, 0.4);
        }

        .calculator-button.clear {
          background: rgba(255, 59, 48, 0.3);
          border-color: rgba(255, 59, 48, 0.4);
        }

        .calculator-button.clear:hover {
          background: rgba(255, 59, 48, 0.4);
        }

        .calculator-button.backspace {
          background: rgba(255, 193, 7, 0.3);
          border-color: rgba(255, 193, 7, 0.4);
        }

        .calculator-button.backspace:hover {
          background: rgba(255, 193, 7, 0.4);
        }

        .calculator-button.variable {
          background: rgba(138, 43, 226, 0.3);
          border-color: rgba(138, 43, 226, 0.4);
        }

        .calculator-button.variable:hover {
          background: rgba(138, 43, 226, 0.4);
        }

        .calculator-button.span-2 {
          grid-column: span 2;
        }

        .not-implemented {
          text-align: center;
          padding: 40px 20px;
          opacity: 0.7;
        }

        .not-implemented p {
          margin: 8px 0;
          font-size: 14px;
        }

        /* Responsive design */
        @media (max-width: 600px) {
          .math-solver-container {
            margin: 16px;
            padding: 16px;
          }

          .calculator-button {
            padding: 12px;
            min-height: 50px;
            font-size: 16px;
          }

          .keypad-grid {
            gap: 8px;
          }

          .basic-numbers,
          .algebra-controls {
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default MathSolver;