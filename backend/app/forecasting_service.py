import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sqlalchemy.orm import Session
from app import models

def predict_future_demand(db: Session, city_id: int, business_type: str, months_ahead=6):
    """
    Predict future search demand using simple linear regression.
    """
    trends = db.query(models.DemandTrend).filter(
        models.DemandTrend.city_id == city_id,
        models.DemandTrend.business_type == business_type
    ).all()
    
    if len(trends) < 3:
        return {"growth_rate": 0, "confidence": 0, "prediction": 0}
        
    # Prepare data
    data = []
    for i, t in enumerate(trends):
        data.append({"x": i, "y": t.search_volume})
        
    df = pd.DataFrame(data)
    X = df[['x']].values
    y = df['y'].values
    
    # Train model
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict
    future_x = np.array([[len(trends) + months_ahead]])
    prediction = model.predict(future_x)[0]
    
    # Calculate growth rate and simple confidence (R^2)
    current_val = y[-1]
    growth_rate = ((prediction - current_val) / current_val) * 100
    confidence = model.score(X, y) * 100 # R^2 as percentage
    
    return {
        "current_demand": int(current_val),
        "predicted_demand": int(prediction),
        "growth_percent": round(growth_rate, 2),
        "confidence": round(max(0, confidence), 1),
        "status": "Rising Star" if growth_rate > 10 else "Stable"
    }

def identify_hotspots(db: Session, city_id: int):
    """
    Identify which business types have the highest predicted growth in a city.
    """
    business_types = ["Hotel", "Restaurant", "Pharmacy", "EV Charging", "Grocery Store"]
    predictions = []
    
    for b_type in business_types:
        pred = predict_future_demand(db, city_id, b_type)
        predictions.append({
            "type": b_type,
            "growth": pred["growth_percent"],
            "status": pred["status"]
        })
        
    # Sort by growth
    predictions.sort(key=lambda x: x["growth"], reverse=True)
    return predictions
