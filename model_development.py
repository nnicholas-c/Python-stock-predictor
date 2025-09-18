import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import joblib

def develop_model(file_path):
    df = pd.read_csv(file_path, index_col=0, parse_dates=True)

    df["target"] = df["close"].shift(-1)
    df.dropna(inplace=True)

    X = df[["open", "high", "low", "volume"]]
    y = df["target"]

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize and train a Linear Regression model
    model = LinearRegression()
    model.fit(X_train, y_train)
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


