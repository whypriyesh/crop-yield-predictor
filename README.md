# Crop Yield Predictor

The Crop Yield Predictor is a full-stack web application designed to forecast agricultural yields based on environmental and regional inputs such as location, season, crop type, and area size. 

## Overview

The application is split into two primary components:
1. A FastAPI backend that serves predictions from a trained machine learning model.
2. A React frontend that provides a clean, modern interface for users to input data and view results.

When a user submits the required parameters, the backend processes the input through a Random Forest Regressor, which analyzes historical agricultural data to estimate the expected yield.

## The Model

Our initial approach used a Multiple Linear Regression model. However, predicting crop yields is highly non-linear, especially when factoring in over 100 different crop varieties across various states and seasons. The Linear Regression model could not capture these complex relationships, resulting in a low accuracy score (R² = 0.11).

To address this, we transitioned to a Random Forest Regressor. A Random Forest uses an ensemble of multiple decision trees. Rather than trying to draw a single line of best fit, it evaluates continuous branching decisions (e.g., specific crops during specific seasons in specific states). This allowed the model to effectively learn customized rules for each crop type, dramatically improving the prediction accuracy to roughly 88% (R² = 0.88).

## Tech Stack

### Backend
- **Language**: Python
- **Framework**: FastAPI
- **Machine Learning**: scikit-learn (Random Forest Regressor)
- **Role**: Loads the trained model pipelines and provides the `/predict` API endpoint.

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **Role**: Handles user interaction, form validation, and displays the prediction results.

## Local Development Setup

To run this project locally, you will need to start both the backend server and the frontend development server.

### 1. Start the Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Activate the virtual environment:
- On Windows:
  ```bash
  venv\Scripts\activate
  ```
- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

Install the required dependencies (only required once):
```bash
pip install -r requirements.txt
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

### 2. Start the Frontend

Open a second terminal window and navigate to the frontend directory:

```bash
cd frontend
```

Install the Node modules (only required once):
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The web interface will typically be available at `http://localhost:5173`. 

## Usage

1. Open the frontend local URL in your web browser.
2. Select the relevant parameters from the dropdowns and enter the area size.
3. Submit the form to receive the predicted yield based on the trained model.