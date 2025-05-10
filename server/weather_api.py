from dotenv import load_dotenv
import requests, os
import json

load_dotenv()

# print("API KEY:", os.getenv("OPENWEATHER_API_KEY"))


def get_weather(city, when="today"):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    endpoint = "https://api.openweathermap.org/data/2.5/"
    
    if when == "today":
        url = f"{endpoint}weather?q={city}&appid={api_key}&units=metric"
    elif when == "forecast":
        url = f"{endpoint}forecast?q={city}&appid={api_key}&units=metric"
    else:
        # handle historical (OpenWeather has paid historical data)
        return {"error": "Historical data requires a paid plan."}

    return requests.get(url).json()

# print(json.dumps(get_weather("dhaka")))
