# Machine Learning Frontend

This is the React-based frontend for interacting with the Machine Learning API. It allows users to view the model's training status, train a model, and make predictions.

## Features
- **View Model Status**: See if the model is trained, the algorithm used, and its accuracy.
- **Train a Model**: Train a machine learning model using the available algorithms.
- **Make Predictions**: Enter input data and get predictions from the trained model.

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/danielandrewr/test-frontend
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
4. Set environment variables: Create a .env file in the root directory and add the following:
   ```bash
   REACT_APP_API_URL=http://localhost:8000
   ```
6. Run the application:
   ```bash
   npm start
   ```

## Authentication
The frontend interacts with the backend using JWT authentication. Before making requests, make sure the JWT token is stored in localStorage:
```bash
localStorage.setItem("token", "<your_jwt_token>");
```

## API Integration
The frontend interacts with the backend using Axios, sending the token in the Authorization header:
```js
headers: {
  Authorization: `Bearer ${token}`
}
```
