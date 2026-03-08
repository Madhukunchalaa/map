import requests
import os
from googlemaps import Client
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")

def test_geocode(query):
    key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not key:
        print("Error: No API key found in .env")
        return

    gmaps = Client(key=key)
    try:
        print(f"Testing geocode for: '{query}'")
        res = gmaps.geocode(query)
        if res:
            loc = res[0]['geometry']['location']
            addr = res[0].get('formatted_address')
            print(f"Success!")
            print(f"Address: {addr}")
            print(f"Lat: {loc['lat']}, Lng: {loc['lng']}")
        else:
            print("No results found.")
    except Exception as e:
        print(f"Geocode error: {e}")

if __name__ == "__main__":
    test_geocode("500055")
    print("-" * 20)
    test_geocode("Jeedimetla")
