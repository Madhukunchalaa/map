import requests

def test_api():
    try:
        # Mumbai (ID 1) - Pharmacy
        response = requests.get("http://localhost:8000/opportunities?city_id=1&business_type=Pharmacy")
        data = response.json()
        print(f"City: {data.get('city')}")
        print(f"Business Type: {data.get('business_type')}")
        print(f"Is Live: {data.get('is_live')}")
        print(f"Competitor Count: {len(data.get('competitors_list', []))}")
        if data.get('competitors_list'):
            print(f"First Competitor: {data.get('competitors_list')[0].get('name')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
