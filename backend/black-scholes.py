import math
from scipy.stats import norm


 


# S = Current stock (or other underlying) price
# K = Strike price
# r = Risk-free interest rate
# t = Time to maturity
# sigma = volatility



def black_scholes(S, K, r, t , sigma, option):
    a = math.log(S/K) + ((r+0.5*sigma**2)*t)
    b = sigma*math.sqrt(t)
    d1 = a/b
    d2 = d1 - (sigma * math.sqrt(t))

    if(option == "call"):
        C = S*norm.cdf(d1) - K*math.exp(-r*t)*norm.cdf(d2)
        return C
    elif(option == "put"):
        P = K*math.exp(-r*t)*norm.cdf(-d2) - S*norm.cdf(-d1)
        return P
    else: 
        raise ValueError("Incorrect option type. Must be a call or put")
    

# call_price = black_scholes(100, 100, 0.05, 1, 0.2, "call")
# print(call_price)


