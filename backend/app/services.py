from sqlalchemy.orm import Session
from app import models
from app.google_places_service import places_service
import random

def calculate_opportunities(db: Session, city_id: int, business_type: str):
    # Get search volume for the latest month
    trend = db.query(models.DemandTrend).filter(
        models.DemandTrend.city_id == city_id,
        models.DemandTrend.business_type == business_type
    ).order_by(models.DemandTrend.id.desc()).first()
    
    demand_volume = trend.search_volume if trend else random.randint(100, 1000)
    
    city = db.query(models.City).filter(models.City.id == city_id).first()
    
    # Try fetching real competitors if API key is present
    real_competitors = places_service.get_competitors(city.name, business_type, city.lat, city.lng)
    
    if real_competitors:
        competitors_list = real_competitors
        comp_count = len(competitors_list)
        is_live = True
    else:
        # Fallback to mock competitors from database
        competitors = db.query(models.Competitor).filter(
            models.Competitor.city_id == city_id,
            models.Competitor.type == business_type
        ).all()
        competitors_list = [
            {"name": c.name, "rating": c.rating, "lat": c.lat, "lng": c.lng}
            for c in competitors
        ]
        comp_count = len(competitors_list)
        is_live = False
    
    # Score algorithm (Normalized to 0-100)
    # Score = (Demand / (Competition + 1)) * scaling
    raw_score = (demand_volume / (comp_count + 1)) * 0.5
    score = min(int(raw_score), 100)
    
    # Tiering (0-30: Saturated, 30-60: Medium, 60-100: High)
    tier = "Saturated"
    color = "#10b981" # Green
    if score > 60:
        tier = "High"
        color = "#ef4444" # Red
    elif score > 30:
        tier = "Medium"
        color = "#f59e0b" # Orange
        
    # Generate some sub-zones (simulated points around the city center)
    city = db.query(models.City).filter(models.City.id == city_id).first()
    zones = []
    
    # Create 5-8 sub-zones with slightly varying scores
    for i in range(random.randint(5, 8)):
        lat_offset = random.uniform(-0.05, 0.05)
        lng_offset = random.uniform(-0.05, 0.05)
        zone_score = max(0, min(100, score + random.randint(-15, 15)))
        
        zone_color = "#10b981"
        zone_tier = "Saturated"
        if zone_score > 60:
            zone_color = "#ef4444"
            zone_tier = "High"
        elif zone_score > 30:
            zone_color = "#f59e0b"
            zone_tier = "Medium"
            
        zones.append({
            "id": i,
            "lat": city.lat + lat_offset,
            "lng": city.lng + lng_offset,
            "score": zone_score,
            "tier": zone_tier,
            "color": zone_color,
            "demand": int(demand_volume * (zone_score/score if score > 0 else 1)),
            "competitors": max(0, comp_count + random.randint(-2, 2))
        })
        
    return {
        "city": city.name,
        "business_type": business_type,
        "base_score": score,
        "tier": tier,
        "color": color,
        "is_live": is_live,
        "competitors_list": competitors_list,
        "zones": zones
    }

def get_demand_trends(db: Session, city_id: int, business_type: str):
    trends = db.query(models.DemandTrend).filter(
        models.DemandTrend.city_id == city_id,
        models.DemandTrend.business_type == business_type
    ).all()
    
    return [
        {"month": t.month, "volume": t.search_volume}
        for t in trends
    ]

def get_summary_stats(db: Session):
    total_cities = db.query(models.City).count()
    total_opportunities = 124 # Mocked for now
    high_demand_zones = 42 # Mocked for now
    
    return {
        "total_cities": total_cities,
        "total_opportunities": total_opportunities,
        "high_demand_zones": high_demand_zones,
        "top_cities": ["Mumbai", "Dubai", "New York", "London", "Singapore"]
    }

def resolve_city(db: Session, city_name: str):
    print(f"Resolving city: {city_name}")
    # Check if city already exists
    city = db.query(models.City).filter(models.City.name.ilike(city_name)).first()
    if city:
        print(f"Found existing city: {city.name} (ID: {city.id})")
        return city
        
    # If not, try to geocode it
    print(f"Geocoding city via Google: {city_name}")
    coords = places_service.get_coordinates(city_name)
    if coords:
        print(f"Geocode successful: {coords['formatted_address']} ({coords['lat']}, {coords['lng']})")
        # Check again if the formatted address exists to avoid duplicates
        existing = db.query(models.City).filter(models.City.name == coords["formatted_address"]).first()
        if existing:
            print(f"City already exists under formatted name: {existing.name}")
            return existing

        # Create new city
        new_city = models.City(
            name=coords["formatted_address"],
            lat=coords["lat"],
            lng=coords["lng"]
        )
        db.add(new_city)
        db.commit()
        db.refresh(new_city)
        
        print(f"Created new city: {new_city.name} (ID: {new_city.id})")
        
        # Seed some data for this new city (trends, etc.)
        from app import seed_data
        seed_data.seed_city_content(db, new_city)
        
        return new_city
    
    print(f"Geocoding failed for: {city_name}")
    return None
