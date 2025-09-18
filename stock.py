from flask import Blueprint, request, jsonify
import pandas as pd
import joblib
import requests
import os
from flask_cors import cross_origin

stock_bp = Blueprint('stock', __name__)

# Load the trained model
model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'stock_prediction_model.pkl')
try:
    model = joblib.load(model_path)
except:
    model = None

@stock_bp.route('/predict', methods=['POST'])
@cross_origin()
def predict_stock():
    try:
        data = request.get_json()
        
        # Extract features from request
        open_price = float(data.get('open', 0))
        high_price = float(data.get('high', 0))
        low_price = float(data.get('low', 0))
        volume = float(data.get('volume', 0))
        
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Make prediction
        features = [[open_price, high_price, low_price, volume]]
        prediction = model.predict(features)[0]
        
        return jsonify({
            'prediction': round(prediction, 2),
            'features': {
                'open': open_price,
                'high': high_price,
                'low': low_price,
                'volume': volume
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@stock_bp.route('/fetch-data/<symbol>', methods=['GET'])
@cross_origin()
def fetch_stock_data(symbol):
    try:
        api_key = 'TTP9QOHDLRX6OPOY'
        interval = '5min'
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval={interval}&outputsize=compact&apikey={api_key}'
        
        response = requests.get(url)
        data = response.json()
        
        if 'Time Series (5min)' not in data:
            return jsonify({'error': 'Could not fetch data for this symbol'}), 400
        
        # Get the latest data point
        time_series = data['Time Series (5min)']
        latest_time = max(time_series.keys())
        latest_data = time_series[latest_time]
        
        return jsonify({
            'symbol': symbol,
            'timestamp': latest_time,
            'data': {
                'open': float(latest_data['1. open']),
                'high': float(latest_data['2. high']),
                'low': float(latest_data['3. low']),
                'close': float(latest_data['4. close']),
                'volume': float(latest_data['5. volume'])
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@stock_bp.route('/health', methods=['GET'])
@cross_origin()
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

