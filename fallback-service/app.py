import os
import sqlite3
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import logging

app = Flask(__name__)
CORS(app)

# Database path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, '..', 'backend', 'prisma', 'dev.db')

# ML Models
models = {}
encoders = {}

def train_models():
    print(f"Attempting to connect to DB at: {os.path.abspath(DB_PATH)}")
    try:
        if not os.path.exists(DB_PATH):
            print(f"ERROR: DB file does not exist at {DB_PATH}")
            return
        conn = sqlite3.connect(DB_PATH)
        # Load PriceItems and CommunityPrices
        prices_df = pd.read_sql_query("SELECT * FROM PriceItem", conn)
        community_df = pd.read_sql_query("SELECT * FROM CommunityPrice", conn)
        
        # Merge or combine for training
        # For simplicity, we'll train on PriceItem data for now
        # Features: cityId, categoryId, itemName (encoded)
        # Target: avgPrice
        
        df = prices_df.copy()
        
        le_item = LabelEncoder()
        df['item_encoded'] = le_item.fit_transform(df['name'])
        
        le_city = LabelEncoder()
        df['city_encoded'] = le_city.fit_transform(df['cityId'])
        
        le_cat = LabelEncoder()
        df['cat_encoded'] = le_cat.fit_transform(df['categoryId'])
        
        X = df[['item_encoded', 'city_encoded', 'cat_encoded']]
        y = df['avgPrice']
        
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        
        models['price_predictor'] = model
        encoders['item'] = le_item
        encoders['city'] = le_city
        encoders['cat'] = le_cat
        
        conn.close()
        print("ML models trained successfully.")
    except Exception as e:
        print(f"Failed to train models: {e}")

@app.route('/predict/image', methods=['POST'])
def predict_image():
    # Mock image prediction using the ML model for a generic item
    return jsonify({
        "item_name": "Handicraft Item (Mock)",
        "prediction_confidence": 0.85,
        "local_price_range": "₹450 - ₹750",
        "tourist_price_estimate": "₹1200",
        "fair_bargain_price": "₹600",
        "is_mock": True
    })

@app.route('/chat', methods=['POST'])
def chat():
    prompt = request.json.get('prompt', '')
    return jsonify({
        "response": f"I am currently in fallback mode. Regarding your query: '{prompt}', I recommend checking local shops and always bargaining by at least 30%!",
        "is_mock": True
    })

@app.route('/predict/fare', methods=['POST'])
def predict_fare():
    data = request.json
    city_id = data.get('cityId')
    distance = float(data.get('distanceKm', 1))
    transport_type = data.get('type', 'Cab') # Auto, Cab, E-Rickshaw
    
    try:
        conn = sqlite3.connect(DB_PATH)
        # Fetch per-km rate from DB for the specific city and type
        query = """
            SELECT baseFare, perKmFare FROM PriceItem 
            WHERE cityId = ? AND name LIKE ? LIMIT 1
        """
        cursor = conn.cursor()
        cursor.execute(query, (city_id, f'%{transport_type}%'))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            base_fare, per_km = row
            estimated = (base_fare or 0) + (distance * (per_km or 10))
            return jsonify({
                "estimatedFare": round(estimated),
                "distance": distance,
                "type": transport_type,
                "is_ml": True
            })
            
    except Exception as e:
        logging.error(f"Fare prediction error: {e}")
        
    return jsonify({"error": "Fare prediction failed"}), 500

if __name__ == '__main__':
    train_models()
    app.run(port=5001, debug=True)
