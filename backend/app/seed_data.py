from sqlalchemy.orm import Session
from app import models
import random

def populate_db(db: Session):
    # Clear existing data to handle schema changes
    db.query(models.Competitor).delete()
    db.query(models.DemandTrend).delete()
    db.query(models.City).delete()
    db.commit()

    # Cities
    cities_data = [
        {"name": "Mumbai", "lat": 19.0760, "lng": 72.8777, "pop_density": 21000},
        {"name": "Dubai", "lat": 25.2048, "lng": 55.2708, "pop_density": 10500},
        {"name": "New York", "lat": 40.7128, "lng": -74.0060, "pop_density": 10800},
        {"name": "London", "lat": 51.5074, "lng": -0.1278, "pop_density": 5700},
        {"name": "Singapore", "lat": 1.3521, "lng": 103.8198, "pop_density": 8300},
        {"name": "Tokyo", "lat": 35.6762, "lng": 139.6503, "pop_density": 6400},
        {"name": "Berlin", "lat": 52.5200, "lng": 13.4050, "pop_density": 4100},
        {"name": "Lagos", "lat": 6.5244, "lng": 3.3792, "pop_density": 13000},
    ]
    
    city_objects = []
    for c in cities_data:
        city = models.City(
            name=c["name"], 
            lat=c["lat"], 
            lng=c["lng"], 
            population_density=c["pop_density"]
        )
        db.add(city)
        city_objects.append(city)
    
    db.commit()
    
    business_types = ["Hotel", "Restaurant", "Pharmacy", "EV Charging", "Grocery Store"]
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    # Trends and Competitors
    for city in city_objects:
        for b_type in business_types:
            # Add trends
            base_vol = random.randint(300, 800)
            for m in months:
                trend = models.DemandTrend(
                    city_id=city.id,
                    business_type=b_type,
                    search_volume=base_vol + random.randint(-50, 200),
                    month=m
                )
                db.add(trend)
            
            # Add competitors
            num_comps = random.randint(1, 15)
            # If EV Charging, make it harder to find (fewer competitors)
            if b_type == "EV Charging":
                num_comps = random.randint(0, 3)
                
            for i in range(num_comps):
                comp = models.Competitor(
                    city_id=city.id,
                    name=f"{city.name} {b_type} {i+1}",
                    type=b_type,
                    lat=city.lat + random.uniform(-0.03, 0.03),
                    lng=city.lng + random.uniform(-0.03, 0.03),
                    rating=round(random.uniform(3.0, 5.0), 1)
                )
                db.add(comp)
                
    db.commit()

def seed_city_content(db: Session, city: models.City):
    if not city.population_density:
        city.population_density = random.randint(5000, 25000)
        db.add(city)
        db.commit()
    business_types = ["Hotel", "Restaurant", "Pharmacy", "EV Charging", "Grocery Store"]
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    for b_type in business_types:
        # Add trends
        base_vol = random.randint(300, 800)
        for m in months:
            trend = models.DemandTrend(
                city_id=city.id,
                business_type=b_type,
                search_volume=base_vol + random.randint(-50, 200),
                month=m
            )
            db.add(trend)
        
        # Add competitors (mock only if real places fail)
        num_comps = random.randint(1, 15)
        if b_type == "EV Charging":
            num_comps = random.randint(0, 3)
            
        for i in range(num_comps):
            comp = models.Competitor(
                city_id=city.id,
                name=f"{city.name.split(',')[0]} {b_type} {i+1}",
                type=b_type,
                lat=city.lat + random.uniform(-0.03, 0.03),
                lng=city.lng + random.uniform(-0.03, 0.03),
                rating=round(random.uniform(3.0, 5.0), 1)
            )
            db.add(comp)
    db.commit()
