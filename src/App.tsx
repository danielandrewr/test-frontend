import React, { useState } from 'react';
import './App.css';
import SelectionForm from './View/SelectionForm';
import PredictionForm from './View/PredictionForm';
import ModelStatusView from './View/ModelStatusView';
import { Algorithm } from './Types/Types';

const App: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>(Algorithm.DECISION_TREE)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fata Organa Python and TypeScript Assessment</h1>
      </header>

      <section>
        <h2>Check Model Status</h2>
        <ModelStatusView />
      </section>

      <section>
        <h2>Model Training</h2>
        <SelectionForm setSelectedAlgorithm={setSelectedAlgorithm} />
      </section>

      <section>
        <h2>Prediction</h2>
        <PredictionForm selectedAlgorithm={selectedAlgorithm}/>
      </section>
    </div>
  );
}

export default App;
