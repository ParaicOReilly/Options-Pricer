from flask import Flask, request, jsonify
from flask_cors import CORS
from black_scholes import black_scholes  # Import your Black-Scholes function
import numpy as np
import math

app = Flask(__name__)
CORS(app)  # Allow all origins for development

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    S = float(data['S'])
    K = float(data['K'])
    t = float(data['T'])
    r = float(data['r'])
    sigma = float(data['sigma'])
    option = data['option_type']
    
    try:
        result = black_scholes(S, K, r, t, sigma, option)
        return jsonify({"price": result})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@app.route('/heatmap', methods=['POST'])
def heatmap():
    data = request.json
    S_min = float(data['S_min'])
    S_max = float(data['S_max'])
    sigma_min = float(data['sigma_min'])
    sigma_max = float(data['sigma_max'])
    K = float(data['K'])
    T = float(data['T'])
    r = float(data['r'])
    option_type = data['option_type']

    # Generate ranges
    S_range = np.linspace(S_min, S_max, num=10)
    sigma_range = np.linspace(sigma_min, sigma_max, num=10)
    
    # Calculate heatmap data
    heatmap_data = []
    for sigma in sigma_range:
        row = []
        for S in S_range:
            try:
                price = black_scholes(S, K, T, r, sigma, option_type)
                row.append(price)
            except ValueError:
                row.append(None)
        heatmap_data.append(row)
    
    return jsonify({
        'S_range': S_range.tolist(),
        'sigma_range': sigma_range.tolist(),
        'heatmap_data': heatmap_data
    })

if __name__ == '__main__':
    app.run(debug=True)
