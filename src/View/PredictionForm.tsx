import React, { useState } from 'react'
import axios from 'axios'
import { Algorithm } from '../Types/Types'

interface PredictionFormProps {
  selectedAlgorithm: Algorithm
}

const irisClasses = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'] // Class mapping

const PredictionForm: React.FC<PredictionFormProps> = ({ selectedAlgorithm }) => {
  const [inputData, setInputData] = useState<(number | string)[]>(['5.1', '3.5', '1.4', '0.2'])
  const [prediction, setPrediction] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const featureNames = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];

  const handleInputChange = (index: number, value: string) => {
    const newData = [...inputData]
    newData[index] = value // Allow temporary string value (even empty) during input
    setInputData(newData)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Convert inputData to numbers and perform validation
    const numericData = inputData.map(value => parseFloat(value as string))

    if (numericData.some(value => isNaN(value) || value <= 0)) {
      setError('All input values must be positive numbers.')
      return;
    }

    const token = localStorage.getItem("token")

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/predict`, { 
        input: numericData 
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
      const predictedClass = irisClasses[response.data.prediction] // Map numeric prediction to class name
      setPrediction(`Prediction: ${predictedClass}`);
      setError(null);
    } catch (error) {
      console.error('Error during prediction:', error)
      setError('Failed to get a prediction. Try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Prediction Input (for {selectedAlgorithm} model)</h3>
      {inputData.map((value, index) => (
        <div key={index}>
          <label>
            {featureNames[index]}:
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`Enter ${featureNames[index]}`}
            />
          </label>
        </div>
      ))}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button type="submit">Predict</button>

      {prediction && <p>{prediction}</p>}
    </form>
  );
};

export default PredictionForm
