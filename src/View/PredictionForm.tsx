import React, { useState } from 'react';
import axios from 'axios';
import { Algorithm } from '../Types/Types';

interface PredictionFormProps {
  selectedAlgorithm: Algorithm;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ selectedAlgorithm }) => {
  const [inputData, setInputData] = useState<number[]>([5.1, 3.5, 1.4, 0.2]);
  const [prediction, setPrediction] = useState<string | null>(null);

  const featureNames = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];

  const handleInputChange = (index: number, value: number) => {
    const newData = [...inputData];
    newData[index] = value;
    setInputData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/predict`, { input: inputData });
      setPrediction(`Prediction: ${response.data.prediction}`);
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
            />
          </label>
        </div>
      ))}
      <button type="submit">Predict</button>
      {prediction && <p>{prediction}</p>}
    </form>
  );
};

export default PredictionForm;