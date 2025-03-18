// src/components/Tools/UnitConverter.jsx
import React, { useState } from 'react';
import styles from '../../styles/Tools/UnitConverter.module.css';

const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('kilometers');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const units = {
    length: ['meters', 'kilometers', 'miles', 'feet'],
    weight: ['grams', 'kilograms', 'pounds', 'ounces'],
    temperature: ['celsius', 'fahrenheit', 'kelvin']
  };

  const convertValue = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    if (category === 'length') {
      const factors = {
        meters: 1,
        kilometers: 0.001,
        miles: 0.000621371,
        feet: 3.28084
      };
      setResult(value * factors[toUnit] / factors[fromUnit]);
    } else if (category === 'weight') {
      const factors = {
        grams: 1,
        kilograms: 0.001,
        pounds: 0.00220462,
        ounces: 0.035274
      };
      setResult(value * factors[toUnit] / factors[fromUnit]);
    } else if (category === 'temperature') {
      let tempResult;
      if (fromUnit === 'celsius') {
        if (toUnit === 'fahrenheit') tempResult = (value * 9/5) + 32;
        else if (toUnit === 'kelvin') tempResult = value + 273.15;
        else tempResult = value;
      } else if (fromUnit === 'fahrenheit') {
        if (toUnit === 'celsius') tempResult = (value - 32) * 5/9;
        else if (toUnit === 'kelvin') tempResult = (value - 32) * 5/9 + 273.15;
        else tempResult = value;
      } else if (fromUnit === 'kelvin') {
        if (toUnit === 'celsius') tempResult = value - 273.15;
        else if (toUnit === 'fahrenheit') tempResult = (value - 273.15) * 9/5 + 32;
        else tempResult = value;
      }
      setResult(tempResult);
    }
  };

  return (
    <div className={styles.converterContainer}>
      <select 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={styles.selectInput}
      >
        <option value="length">Length</option>
        <option value="weight">Weight</option>
        <option value="temperature">Temperature</option>
      </select>

      <div className={styles.unitSelectors}>
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className={styles.unitSelect}
        >
          {units[category].map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>

        <span>to</span>

        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className={styles.unitSelect}
        >
          {units[category].map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>

      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter value"
        className={styles.valueInput}
      />

      <button onClick={convertValue} className={styles.convertButton}>
        Convert
      </button>

      {result !== '' && (
        <div className={styles.result}>
          {inputValue} {fromUnit} = {result.toFixed(2)} {toUnit}
        </div>
      )}
    </div>
  );
};

export default UnitConverter;