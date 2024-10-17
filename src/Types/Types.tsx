export enum Algorithm {
    DECISION_TREE = 'decision_tree',
    RANDOM_FOREST = 'random_forest'
}

export interface Hyperparameters {
    max_depth?: number[];
    criterion?: string[];
    n_estimators?: number[];
}

export interface TrainResult {
    best_params_: Record<string, any>;
    best_score: number;
}

export interface PredictionInput {
    input: number[];
}

export interface ModelStatus {
    is_trained: boolean;
    model_algorithm: Algorithm | null;
    best_params: Record<string, any> | null;
}