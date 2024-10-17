import React, { useState } from 'react';
import axios from 'axios';
import { Algorithm } from '../Types/Types';

interface PredictionFormProps {
  selectedAlgorithm: Algorithm;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ selectedAlgorithm }) => {
  const [inputData, setInputData] = useState<number[]>([5.1, 3.5, 1.4, 0.2]);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Error state

  const featureNames = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];

  const handleInputChange = (index: number, value: number) => {
    if (value < 0) {
      setError('Please enter a positive value.'); // Set error if value is not positive
      return;
    }
    setError(null); // Clear error when valid input is provided

    const newData = [...inputData];
    newData[index] = value;
    setInputData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputData.some(value => value <= 0)) {
      setError('All input values must be positive.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/predict`, { input: inputData });
      setPrediction(`Prediction: ${response.data.prediction}`);
      setError(null); // Clear any previous errors upon successful submission
    } catch (error) {
      console.error('Error during prediction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Prediction Input (for {selectedAlgorithm} model)</h3>
      {inputData.map((value, index) => (
        <div key={index}>
          <label>
            {featureNames[index]}:
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(index, Number(e.target.value))}
              step="any" // Allows floating-point numbers
              min="0" // Sets a minimum value of 0 for the input field
            />
          </label>
        </div>
      ))}
      
      {/* Show error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button type="submit">Predict</button>
      {prediction && <p>{prediction}</p>}
    </form>
  );
};

export default PredictionForm;
