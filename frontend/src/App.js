import React, { useState } from 'react';
import './App.css';

function App() {
  const [S, setS] = useState('');
  const [K, setK] = useState('');
  const [t, setT] = useState('');
  const [r, setr] = useState('');
  const [sigma, setsigma] = useState('');
  const [optionType, setOptionType] = useState('call');
  const [price, setPrice] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { S, K, r, t, sigma, option_type: optionType };

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

  return (
    <div className="App">
      <h1>Black-Scholes Option Pricing</h1>
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
          <label>Time to Expiration (t) in years: </label>
          <input type="number" value={t} onChange={(e) => setT(e.target.value)} required />
        </div>
        <div>
          <label>Risk-Free Interest Rate (r): </label>
          <input type="number" step="0.01" value={r} onChange={(e) => setr(e.target.value)} required />
        </div>
        <div>
          <label>Volatility (sigma): </label>
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
      {price !== null && (
        <div>
          <h2>Option Price: {price.toFixed(2)}</h2>
        </div>
      )}
      {error && (
        <div>
          <h2 style={{ color: 'red' }}>{error}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
