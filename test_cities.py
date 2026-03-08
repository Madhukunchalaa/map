import requests

def test_cities():
    try:
        response = requests.get("http://localhost:8000/cities")
        cities = response.json()
        print(f"Total Cities: {len(cities)}")
        for c in cities:
            print(f"ID: {c['id']}, Name: {c['name']}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_cities()
