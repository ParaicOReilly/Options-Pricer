import React, { useState } from 'react';
import HeatMap from 'react-heatmap-grid';
import './App.css';

function App() {
  const [S, setS] = useState('');
  const [K, setK] = useState('');
  const [T, setT] = useState('');
  const [r, setr] = useState('');
  const [sigma, setsigma] = useState('');
  const [optionType, setOptionType] = useState('call');
  const [S_min, setS_min] = useState('');
  const [S_max, setS_max] = useState('');
  const [sigma_min, setsigma_min] = useState('');
  const [sigma_max, setsigma_max] = useState('');
  const [price, setPrice] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { S, K, T, r, sigma, option_type: optionType };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setPrice(result.price);
        setError('');
      } else {
        setError(result.error);
        setPrice(null);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setPrice(null);
    }
  };

  const fetchHeatmapData = async () => {
    const data = {
      S_min,
      S_max,
      sigma_min,
      sigma_max,
      K,
      T,
      r,
      option_type: optionType,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/heatmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setHeatmapData(result);
        setError('');
      } else {
        setError(result.error);
        setHeatmapData(null);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setHeatmapData(null);
    }
  };

  return (
    <div className="App">
      <h1>Black-Scholes Option Pricing</h1>

      <div className="container">
        <div className="left-panel">
          <div className="form-container">
            <h3>Input Parameters</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Current Stock Price (S): </label>
                <input type="number" value={S} onChange={(e) => setS(e.target.value)} required />
              </div>
              <div>
                <label>Strike Price (K): </label>
                <input type="number" value={K} onChange={(e) => setK(e.target.value)} required />
              </div>
              <div>
                <label>Time to Expiration (T) in years: </label>
                <input type="number" value={T} onChange={(e) => setT(e.target.value)} required />
              </div>
              <div>
                <label>Risk-Free Interest Rate (r): </label>
                <input type="number" step="0.01" value={r} onChange={(e) => setr(e.target.value)} required />
              </div>
              <div>
                <label>Volatility (σ): </label>
                <input type="number" step="0.01" value={sigma} onChange={(e) => setsigma(e.target.value)} required />
              </div>
              <div>
                <label>Option Type: </label>
                <select value={optionType} onChange={(e) => setOptionType(e.target.value)}>
                  <option value="call">Call</option>
                  <option value="put">Put</option>
                </select>
              </div>
              <button type="submit">Calculate</button>
            </form>
          </div>

          <div className="heatmap-parameters-container">
            <h3>Heatmap Parameters</h3>
            <form>
              <div>
                <label>Min Spot Price (S_min): </label>
                <input type="number" value={S_min} onChange={(e) => setS_min(e.target.value)} required />
              </div>
              <div>
                <label>Max Spot Price (S_max): </label>
                <input type="number" value={S_max} onChange={(e) => setS_max(e.target.value)} required />
              </div>
              <div>
                <label>Min Volatility (σ_min): </label>
                <input type="number" step="0.01" value={sigma_min} onChange={(e) => setsigma_min(e.target.value)} required />
              </div>
              <div>
                <label>Max Volatility (σ_max): </label>
                <input type="number" step="0.01" value={sigma_max} onChange={(e) => setsigma_max(e.target.value)} required />
              </div>
              <button type="button" onClick={fetchHeatmapData}>Generate Heatmap</button>
            </form>
          </div>
        </div>

        <div className="right-panel">
          <div className="result-container">
            <h3>Option Price:</h3>
            {price !== null ? <p>{price.toFixed(2)}</p> : <p>No price calculated yet.</p>}
          </div>

          <div className="heatmap-container">
            {heatmapData && heatmapData.S_range && heatmapData.sigma_range ? (
              <HeatMap
                xLabels={heatmapData.S_range.map(s => s.toFixed(2))}
                yLabels={heatmapData.sigma_range.map(s => s.toFixed(2))}
                data={heatmapData.heatmap_data}
                squares
                height={45}
                onClick={(x, y) => alert(`Spot Price: ${heatmapData.S_range[x]}, Volatility: ${heatmapData.sigma_range[y]}, Value: ${heatmapData.heatmap_data[y][x]}`)}
              />
            ) : (
              error && (
                <div>
                  <h2 style={{ color: 'red' }}>{error}</h2>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;