# Predicting Stock Market Using Machine Learning and Python

## Overview

This project explores stock market prediction using various machine learning techniques implemented in Python. It includes data collection, exploratory data analysis (EDA), model development, evaluation, and a web application to showcase the predictions.

## Features

- Collect historical stock market data
- Perform exploratory data analysis and visualization
- Develop and train machine learning models to predict stock prices
- Evaluate model performance using appropriate metrics
- Web application interface for user interaction with the prediction model

## Technologies Used

- Python 3.11
- Libraries: pandas, numpy, scikit-learn, matplotlib, seaborn, Flask/Django (for web app)
- Git for version control

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/nnicholas-c/Python-stock-predictor.git
    cd Python-stock-predictor
    ```

2. (Optional) Create and activate a virtual environment:
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate   # macOS/Linux
    .venv\Scripts\activate      # Windows
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

1. Run the data collection and preprocessing scripts:
    ```bash
    python data_collection.py
    python eda_and_visualization.py
    ```

2. Train and evaluate the models:
    ```bash
    python model_development.py
    python model_evaluation.py
    ```

3. Run the web application:
    ```bash
    cd stock_prediction_web
    python main.py
    ```

4. Open your browser and visit:
    ```
    http://localhost:5000
    ```

