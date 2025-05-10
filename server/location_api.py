import requests

def get_location():
    response = requests.get("http://ip-api.com/json/")
    data = response.json()
    return {
        "city": data.get("city"),
        "lat": data.get("lat"),
        "lon": data.get("lon")
    }

# print(get_location())
