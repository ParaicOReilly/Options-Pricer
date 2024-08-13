from black_scholes import black_scholes
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods = ['POST'])
def calculate():
    data = request.json
    S = float(data['S'])
    K = float(data['K'])
    t = float(data['t'])
    r = float(data['r'])
    sigma = float(data['sigma'])
    option = data['option_type']

    try:
        result = black_scholes(S, K, r, t , sigma, option)
        print(result)
        return jsonify({"price":result})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
if __name__ == '__main__':
    app.run(debug=True)