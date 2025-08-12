import requests
import pandas as pd

def get_stock_data(symbol, interval, outputsize, apikey):
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval={interval}&outputsize={outputsize}&apikey={apikey}'
    r = requests.get(url)
    data = r.json()
    
    if 'Time Series (5min)' not in data:
        print(f"Error: Could not retrieve data for {symbol}. Check API key and parameters.")
        return None    source venv/bin/activatesss

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
    # Replace 'YOUR_API_KEY' with your actual Alpha Vantage API key
    api_key = 'TTP9QOHDLRX6OPOY' 
    symbol = 'IBM'
    interval = '5min'
    outputsize = 'compact' # or 'full'

    df = get_stock_data(symbol, interval, outputsize, api_key)
    if df is not None:
        print(f"Successfully retrieved {len(df)} data points for {symbol}")
        print(df.head())
        df.to_csv(f'{symbol}_intraday_{interval}.csv')
        print(f"Data saved to {symbol}_intraday_{interval}.csv")


