import googlemaps
import os
from dotenv import load_dotenv

# Load .env from the backend root (one level up from app/)
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

class GooglePlacesService:
    def __init__(self):
        self.gmaps = None
        if GOOGLE_MAPS_API_KEY:
            print(f"Initializing Google Maps Client with key: {GOOGLE_MAPS_API_KEY[:8]}...")
            self.gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
        else:
            print("WARNING: GOOGLE_MAPS_API_KEY not found in environment!")

    def get_competitors(self, city_name, business_type, lat, lng, radius=5000):
        """
        Fetch real competitors using Google Places API.
        If no API key provided, defaults to simulated data logic.
        """
        if not self.gmaps:
            return None # Fallback to existing mock logic in services.py
            
        try:
            # Search for businesses of the specific type within the radius
            places_result = self.gmaps.places_nearby(
                location=(lat, lng),
                radius=radius,
                type=business_type.lower().replace(" ", "_")
            )
            
            competitors = []
            for place in places_result.get('results', []):
                competitors.append({
                    "name": place.get('name'),
                    "lat": place['geometry']['location']['lat'],
                    "lng": place['geometry']['location']['lng'],
                    "rating": place.get('rating', 0),
                    "address": place.get('vicinity', '')
                })
            return competitors
        except Exception as e:
            print(f"Error fetching from Google Places: {e}")
            return None

    def get_coordinates(self, city_name):
        """
        Resolve a city name to coordinates. 
        Flow: Google Geocoding -> Google Places Search -> OpenStreetMap (Fallback)
        """
        if not self.gmaps:
            print("No Google Maps Client initialized, skipping Google resolution.")
        else:
            # 1. Try Google Geocoding API
            try:
                geocode_result = self.gmaps.geocode(city_name)
                if geocode_result:
                    location = geocode_result[0]['geometry']['location']
                    return {
                        "lat": location['lat'],
                        "lng": location['lng'],
                        "formatted_address": geocode_result[0].get('formatted_address', city_name)
                    }
            except Exception as e:
                print(f"Google Geocoding API error: {e}")

            # 2. Try Google Places Text Search
            try:
                print(f"Attempting fallback resolution via Places Text Search: {city_name}")
                places_result = self.gmaps.places(query=city_name)
                if places_result.get('results'):
                    location = places_result['results'][0]['geometry']['location']
                    return {
                        "lat": location['lat'],
                        "lng": location['lng'],
                        "formatted_address": places_result['results'][0].get('formatted_address', city_name)
                    }
            except Exception as e:
                print(f"Google Places Text Search error: {e}")

        # 3. Last Resort: OpenStreetMap (Nominatim) - Free and no key required!
        try:
            print(f"Attempting final fallback via OpenStreetMap (Nominatim): {city_name}")
            import requests
            headers = {'User-Agent': 'OpportunityMap/1.0'}
            osm_res = requests.get(
                f"https://nominatim.openstreetmap.org/search?q={city_name}&format=json&limit=1",
                headers=headers
            )
            if osm_res.status_code == 200:
                data = osm_res.json()
                if data:
                    print(f"OSM Success! {data[0]['display_name']}")
                    return {
                        "lat": float(data[0]['lat']),
                        "lng": float(data[0]['lon']),
                        "formatted_address": data[0].get('display_name', city_name)
                    }
        except Exception as e:
            print(f"OpenStreetMap fallback failed: {e}")
            
        return None

places_service = GooglePlacesService()
