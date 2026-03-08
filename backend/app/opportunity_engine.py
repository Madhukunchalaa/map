from sqlalchemy.orm import Session
from app import models, services, forecasting_service, google_places_service
import numpy as np

class OpportunityEngine:
    @staticmethod
    def calculate_opportunity_score(demand_index: int, pop_density: float, comp_count: int, avg_rating: float) -> int:
        """
        Formula: (Demand Index × Population Density) / (Competitor Count × Average Competitor Rating)
        Normalized to 0-100.
        """
        # Avoid division by zero and handle low values
        adj_comp_count = max(1, comp_count)
        adj_avg_rating = max(1.0, avg_rating)
        
        # Scaling factor to keep it in a reasonable range before normalization
        # Demand (300-1000) * PopDensity (4000-21000) = ~1.2e6 to 2.1e7
        # Comp (1-15) * Rating (1-5) = 1 to 75
        raw_score = (demand_index * pop_density) / (adj_comp_count * adj_avg_rating)
        
        # Logarithmic normalization to 0-100
        # A very high raw_score might be 2.1e7 / 1 = 2.1e7
        # A low raw_score might be 300 * 4100 / 75 = 16400
        # Adjusted mapping for transparency
        min_expected = 1000 
        max_expected = 1000000 
        
        normalized = ((raw_score - min_expected) / (max_expected - min_expected)) * 100
        return int(max(0, min(100, normalized)))

    @staticmethod
    def analyze_city_opportunities(db: Session, city_id: int):
        city = db.query(models.City).filter(models.City.id == city_id).first()
        if not city:
            return None
        
        business_types = ["Hotel", "Restaurant", "Pharmacy", "EV Charging", "Grocery Store"]
        recommendations = []
        
        for b_type in business_types:
            # Get data for score
            opp_data = services.calculate_opportunities(db, city_id, b_type)
            
            # Extract metrics
            demand_index = opp_data.get("base_score", 500) // 10 # Scale back to 10-100 range from current 100-1000
            comp_list = opp_data.get("competitors_list", [])
            comp_count = len(comp_list)
            avg_rating = np.mean([c["rating"] for c in comp_list]) if comp_list else 0
            
            score = OpportunityEngine.calculate_opportunity_score(
                demand_index, 
                city.population_density or 10000, 
                comp_count, 
                avg_rating
            )
            
            # Forecast
            forecast = forecasting_service.predict_future_demand(db, city_id, b_type)
            
            recommendations.append({
                "type": b_type,
                "opportunity_score": score,
                "competitor_count": comp_count,
                "avg_rating": round(float(avg_rating), 1) if not np.isnan(avg_rating) else 0,
                "demand_level": "High" if demand_index > 70 else ("Medium" if demand_index > 40 else "Low"),
                "forecast": forecast
            })
            
        # Sort by opportunity score
        recommendations.sort(key=lambda x: x["opportunity_score"], reverse=True)
        
        return {
            "location": city.name,
            "population_density": city.population_density,
            "top_opportunities": recommendations[:3],
            "all_opportunities": recommendations,
        }

    @staticmethod
    async def analyze_custom_location(location_name: str, category: str):
        # 1. Resolve coordinates
        coords = google_places_service.places_service.get_coordinates(location_name)
        if not coords:
            return {"error": "Could not resolve location"}
        
        lat, lng = coords["lat"], coords["lng"]
        
        # 2. Get competitors
        competitors = google_places_service.places_service.get_competitors(location_name, category, lat, lng)
        comp_count = len(competitors) if competitors else 0
        avg_rating = np.mean([c["rating"] for c in competitors]) if competitors else 0
        
        # 3. Simulated Demand for this custom spot (can be enhanced later)
        demand_index = np.random.randint(40, 95)
        
        # 4. Score
        # Use a high default density for urban spots if we don't know the exact city
        pop_density = 15000 
        score = OpportunityEngine.calculate_opportunity_score(demand_index, pop_density, comp_count, avg_rating)
        
        # 5. Detailed Report
        report = {
            "score": score,
            "metrics": {
                "demand": demand_index,
                "competitors": comp_count,
                "avg_rating": round(float(avg_rating), 1) if not np.isnan(avg_rating) else 0,
                "density": pop_density
            },
            "classification": "High" if score > 60 else ("Medium" if score > 30 else "Low"),
            "location_details": coords,
            "nearby_competitors": competitors[:10] if competitors else []
        }
        return report

opportunity_engine = OpportunityEngine()
