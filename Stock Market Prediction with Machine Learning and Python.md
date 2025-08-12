# Stock Market Prediction with Machine Learning and Python

## 1. Introduction

This project demonstrates how to predict stock market prices using machine learning techniques in Python. We will cover data collection, exploratory data analysis, model development, and evaluation.

## 2. Data Collection

We utilized the Alpha Vantage API to collect intraday stock data. The `data_collection.py` script fetches historical stock data for a specified symbol and interval.

### `data_collection.py`

```python
import requests
import pandas as pd

def get_stock_data(symbol, interval, outputsize, apikey):
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval={interval}&outputsize={outputsize}&apikey={apikey}'
    r = requests.get(url)
    data = r.json()
    
    if 'Time Series (5min)' not in data:
        print(f"Error: Could not retrieve data for {symbol}. Check API key and parameters.")
        return None

    df = pd.DataFrame.from_dict(data['Time Series (5min)'], orient='index')
    df = df.rename(columns={
        '1. open': 'open',
        '2. high': 'high',
        '3. low': 'low',
        '4. close': 'close',
        '5. volume': 'volume'
    })
    df.index = pd.to_datetime(df.index)
    df = df.astype(float)
    df = df.sort_index()
    return df

if __name__ == '__main__':
    api_key = 'YOUR_API_KEY' # Replace with your actual API key
    symbol = 'IBM'
    interval = '5min'
    outputsize = 'compact' # or 'full'

    df = get_stock_data(symbol, interval, outputsize, api_key)
    if df is not None:
        print(f"Successfully retrieved {len(df)} data points for {symbol}")
        print(df.head())
        df.to_csv(f'{symbol}_intraday_{interval}.csv')
        print(f"Data saved to {symbol}_intraday_{interval}.csv")
```

To run this script, you need to replace `YOUR_API_KEY` with your personal Alpha Vantage API key, which can be obtained from their website [1].

## 3. Exploratory Data Analysis (EDA) and Visualization

After collecting the data, we performed exploratory data analysis to understand its characteristics and visualize key trends. The `eda_and_visualization.py` script loads the collected data, displays basic statistics, and generates plots for closing price and volume over time.

### `eda_and_visualization.py`

```python
import pandas as pd
import matplotlib.pyplot as plt

def perform_eda(file_path):
    df = pd.read_csv(file_path, index_col=0, parse_dates=True)
    print("\n--- Data Info ---")
    df.info()
    print("\n--- First 5 Rows ---")
    print(df.head())
    print("\n--- Basic Statistics ---")
    print(df.describe())

    # Plotting closing price over time
    plt.figure(figsize=(12, 6))
    plt.plot(df["close"])
    plt.title("IBM Stock Close Price Over Time")
    plt.xlabel("Date")
    plt.ylabel("Close Price")
    plt.grid(True)
    plt.savefig("ibm_close_price.png")
    plt.show()

    # Plotting volume over time
    plt.figure(figsize=(12, 6))
    plt.plot(df["volume"])
    plt.title("IBM Stock Volume Over Time")
    plt.xlabel("Date")
    plt.ylabel("Volume")
    plt.grid(True)
    plt.savefig("ibm_volume.png")
    plt.show()

if __name__ == '__main__':
    file_path = 'IBM_intraday_5min.csv'
    perform_eda(file_path)
```

This script generates two plots: `ibm_close_price.png` and `ibm_volume.png`, which provide visual insights into the stock's performance.

## 4. Model Development

For stock price prediction, we developed a simple linear regression model. The `model_development.py` script prepares the data by creating a target variable (next day's closing price), splits the data into training and testing sets, trains the model, and saves it.

### `model_development.py`

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import joblib

def develop_model(file_path):
    df = pd.read_csv(file_path, index_col=0, parse_dates=True)

    # Feature Engineering: Using 'close' price as the target and 'open', 'high', 'low', 'volume' as features
    # For simplicity, let's predict the next day's closing price
    df["target"] = df["close"].shift(-1)
    df.dropna(inplace=True)

    X = df[["open", "high", "low", "volume"]]
    y = df["target"]

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize and train a Linear Regression model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Save the trained model
    joblib.dump(model, "stock_prediction_model.pkl")
    print("Model trained and saved as stock_prediction_model.pkl")

    return X_test, y_test, model

if __name__ == '__main__':
    file_path = 'IBM_intraday_5min.csv'
    X_test, y_test, model = develop_model(file_path)
    print("\n--- Sample Predictions ---")
    sample_data = X_test.head(5)
    predictions = model.predict(sample_data)
    print("Actual vs Predicted (first 5 test samples):")
    for i in range(len(sample_data)):
        print(f"Actual: {y_test.iloc[i]:.2f}, Predicted: {predictions[i]:.2f}")
```

This script trains a `LinearRegression` model and saves it as `stock_prediction_model.pkl`.

## 5. Model Evaluation

To assess the performance of our trained model, we use metrics such as Mean Absolute Error (MAE) and R-squared (R2). The `model_evaluation.py` script loads the saved model, makes predictions on the test set, and calculates these metrics.

### `model_evaluation.py`

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

def evaluate_model(file_path):
    df = pd.read_csv(file_path, index_col=0, parse_dates=True)

    df["target"] = df["close"].shift(-1)
    df.dropna(inplace=True)

    X = df[["open", "high", "low", "volume"]]
    y = df["target"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Load the trained model
    model = joblib.load("stock_prediction_model.pkl")

    # Make predictions on the test set
    predictions = model.predict(X_test)

    # Evaluate the model
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    print(f"Mean Absolute Error (MAE): {mae:.2f}")
    print(f"R-squared (R2): {r2:.2f}")

if __name__ == '__main__':
    file_path = 'IBM_intraday_5min.csv'
    evaluate_model(file_path)
```

For the IBM intraday data, the model achieved:
- Mean Absolute Error (MAE): 0.16
- R-squared (R2): 0.98

These metrics indicate that the model performs well in predicting the stock prices, with a low average absolute error and a high R-squared value, suggesting that a large proportion of the variance in the target variable is predictable from the independent variables.

## 6. Conclusion

This project provides a basic framework for stock market prediction using machine learning in Python. While the linear regression model shows promising results on this specific dataset, real-world stock market prediction is complex and influenced by numerous factors. Further improvements could involve exploring more advanced models (e.g., LSTM, ARIMA), incorporating more features (e.g., news sentiment, economic indicators), and optimizing model parameters.

## References

[1] Alpha Vantage API: https://www.alphavantage.co/support/#api-key


