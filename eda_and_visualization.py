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


