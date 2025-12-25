from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from config import OPENWEATHER_API_KEY

app = Flask(__name__)
CORS(app)

CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"


@app.route("/")
def home():
    return "Weather Backend Running"


@app.route("/weather")
def get_weather():
    city = request.args.get("city")

    if not city:
        return jsonify({"error": "City is required"}), 400

    params = {
        "q": city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    response = requests.get(CURRENT_URL, params=params)

    if response.status_code != 200:
        return jsonify({"error": "City not found"}), 404

    data = response.json()

    cleaned_data = {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "condition": data["weather"][0]["description"],
        "icon": data["weather"][0]["icon"],
        "humidity": data["main"]["humidity"],
        "wind": data["wind"]["speed"],
        "sunrise": data["sys"]["sunrise"],
        "sunset": data["sys"]["sunset"]
    }

    return jsonify(cleaned_data)


@app.route("/forecast")
def get_forecast():
    city = request.args.get("city")

    if not city:
        return jsonify({"error": "City is required"}), 400

    params = {
        "q": city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    response = requests.get(FORECAST_URL, params=params)

    if response.status_code != 200:
        return jsonify({"error": "Forecast not found"}), 404

    data = response.json()

    hourly = []
    for item in data["list"][:6]:
        hourly.append({
            "time": item["dt"],
            "temp": item["main"]["temp"],
            "icon": item["weather"][0]["icon"],
            "wind": item["wind"]["speed"]
        })

    return jsonify(hourly)


if __name__ == "__main__":
    app.run(debug=True)
