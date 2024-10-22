import React, { useState } from 'react';
import { Algorithm, Hyperparameters } from '../Types/Types';
import axios from 'axios';

interface SelectionFormProps {
    setSelectedAlgorithm: (algorithm: Algorithm) => void;
}

const hyperparameterOptions: Record<Algorithm, Partial<Record<keyof Hyperparameters, string>>> = {
    [Algorithm.DECISION_TREE]: {
        max_depth: 'Max Depth',
        criterion: 'Criterion'
    },
    [Algorithm.RANDOM_FOREST]: {
        max_depth: 'Max Depth',
        n_estimators: 'Number of Estimators'
    }
};

const SelectionForm: React.FC<SelectionFormProps> = ({ setSelectedAlgorithm }) => {
    const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.DECISION_TREE);
    const [params, setParams] = useState<Hyperparameters>({});
    const [message, setMessage] = useState<string>("");
    const [selectedParam, setSelectedParam] = useState<keyof Hyperparameters>('max_depth');
    const [newValue, setNewValue] = useState<string | number | undefined>(undefined);
    const [error, setError] = useState<string>("");

    const handleAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAlgorithm = event.target.value as Algorithm;
        setAlgorithm(selectedAlgorithm);
        setSelectedAlgorithm(selectedAlgorithm);
        setParams({});
        setSelectedParam('max_depth');
        setNewValue(undefined); 
        setError("");
    };

    const handleParamAddition = () => {
        // Validate input before adding
        if (selectedParam === 'max_depth' || selectedParam === 'n_estimators') {
            if (!Number.isInteger(newValue)) {
                setError("Please enter a valid integer");
                return;
            }
        }

        if (newValue !== undefined && newValue !== "") {
            setParams({
                ...params,
                [selectedParam]: [...(params[selectedParam] || []), newValue]
            });
            setNewValue(""); 
            setError("");
        }
    };

    const handleTextChange = (index: number, paramName: keyof Hyperparameters, value: string | number) => {
        const updatedArray = [...(params[paramName] || [])];
        updatedArray[index] = value;
        setParams({
            ...params,
            [paramName]: updatedArray
        });
    };

    const handleCriterionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewValue(event.target.value);
    };

    const handleTraining = async (event: React.FormEvent) => {
        event.preventDefault();

        const token = localStorage.getItem('token')
        try {
            // console.log(algorithm)
            // console.log(params)
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/train`, {
                algorithm,
                param_grid: params
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            console.log(response.data)
            setMessage(`Successfully trained model. Best Params: ${JSON.stringify(response.data.best_params_)}`);
        } catch (e) {
            setMessage('Model Training Failed');
            console.error(e)
        }
    };

    // Filter hyperparameters based on the selected algorithm
    const availableHyperparameters = hyperparameterOptions[algorithm];

    return (
        <form onSubmit={handleTraining}>
            <h3>Configurations</h3>

            <div>
                <label>Algorithm: </label>
                <select value={algorithm} onChange={handleAlgorithmChange}>
                    <option value={Algorithm.DECISION_TREE}>Decision Tree</option>
                    <option value={Algorithm.RANDOM_FOREST}>Random Forest</option>
                </select>
            </div>

            <div>
                <label>Select Hyperparameter to Add: </label>
                <select value={selectedParam} onChange={(e) => setSelectedParam(e.target.value as keyof Hyperparameters)}>
                    {Object.keys(availableHyperparameters).map((param) => (
                        <option key={param} value={param}>
                            {availableHyperparameters[param as keyof Hyperparameters]}
                        </option>
                    ))}
                </select>

                {/* Show dropdown for 'criterion', number input for others */}
                {selectedParam === 'criterion' ? (
                    <select value={newValue || ""} onChange={handleCriterionChange}>
                        <option value="">Select Criterion</option>
                        <option value="gini">Gini</option>
                        <option value="entropy">Entropy</option>
                    </select>
                ) : (
                    <input
                        type="number"
                        value={newValue as number | string}
                        onChange={(e) => setNewValue(parseInt(e.target.value))}
                        placeholder={`Enter ${availableHyperparameters[selectedParam]}`}
                    />
                )}

                <button type="button" onClick={handleParamAddition}>Add Parameter</button>

                {/* Show error message if validation fails */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            {/* Display the added hyperparameters with text fields to edit */}
            {Object.entries(params).map(([paramName, values]) => (
                <div key={paramName}>
                    <h4>{availableHyperparameters[paramName as keyof Hyperparameters]}</h4>
                    {(values as Array<string | number>).map((value, index) => (
                        <div key={index}>
                            {paramName === 'criterion' ? (
                                <select
                                    value={value}
                                    onChange={(e) =>
                                        handleTextChange(
                                            index,
                                            paramName as keyof Hyperparameters,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="gini">Gini</option>
                                    <option value="entropy">Entropy</option>
                                </select>
                            ) : (
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) =>
                                        handleTextChange(
                                            index,
                                            paramName as keyof Hyperparameters,
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}

            <button type="submit">Train</button>

            {message && <p>{message}</p>}
        </form>
    );
};

export default SelectionForm;