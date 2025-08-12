import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { TrendingUp, DollarSign, BarChart3, Activity } from 'lucide-react'
import './App.css'

function App() {
  const [stockData, setStockData] = useState({
    open: '',
    high: '',
    low: '',
    volume: ''
  })
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [symbol, setSymbol] = useState('IBM')

  const handleInputChange = (field, value) => {
    setStockData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const fetchStockData = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/stock/fetch-data/${symbol}`)
      const data = await response.json()
      
      if (response.ok) {
        setStockData({
          open: data.data.open.toString(),
          high: data.data.high.toString(),
          low: data.data.low.toString(),
          volume: data.data.volume.toString()
        })
      } else {
        setError(data.error || 'Failed to fetch stock data')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
    setLoading(false)
  }

  const makePrediction = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/stock/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          open: parseFloat(stockData.open),
          high: parseFloat(stockData.high),
          low: parseFloat(stockData.low),
          volume: parseFloat(stockData.volume)
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setPrediction(data.prediction)
      } else {
        setError(data.error || 'Failed to make prediction')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Stock Market Predictor
          </h1>
          <p className="text-lg text-gray-600">
            Predict stock prices using machine learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Stock Data Input
              </CardTitle>
              <CardDescription>
                Enter stock data or fetch real-time data for prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Stock Symbol (e.g., IBM)"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button onClick={fetchStockData} disabled={loading}>
                  Fetch Data
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="open">Open Price</Label>
                  <Input
                    id="open"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={stockData.open}
                    onChange={(e) => handleInputChange('open', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="high">High Price</Label>
                  <Input
                    id="high"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={stockData.high}
                    onChange={(e) => handleInputChange('high', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="low">Low Price</Label>
                  <Input
                    id="low"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={stockData.low}
                    onChange={(e) => handleInputChange('low', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="volume">Volume</Label>
                  <Input
                    id="volume"
                    type="number"
                    placeholder="0"
                    value={stockData.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={makePrediction} 
                disabled={loading || !stockData.open || !stockData.high || !stockData.low || !stockData.volume}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Predict Next Price'}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Prediction Results
              </CardTitle>
              <CardDescription>
                Machine learning prediction based on your input
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {prediction !== null && (
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                  <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Predicted Price
                  </h3>
                  <p className="text-4xl font-bold text-green-600">
                    ${prediction}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Based on Linear Regression Model
                  </p>
                </div>
              )}

              {prediction === null && !error && (
                <div className="text-center p-6 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Enter stock data and click "Predict Next Price" to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About This Predictor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This stock market predictor uses a Linear Regression machine learning model trained on historical stock data. 
              The model analyzes patterns in opening price, high price, low price, and trading volume to predict the next closing price.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <strong>Model Type:</strong> Linear Regression
              </div>
              <div className="bg-green-50 p-3 rounded">
                <strong>Accuracy:</strong> R² = 0.98
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <strong>Features:</strong> OHLCV Data
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

