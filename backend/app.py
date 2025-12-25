from flask import Flask, request, jsonify
import requests
from config import OPENWEATHER_API_KEY, BASE_URL

app = Flask(__name__)

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

    response = requests.get(BASE_URL, params=params)

    if response.status_code != 200:
        return jsonify({"error": "City not found"}), 404

    data = response.json()

    cleaned_data = {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "condition": data["weather"][0]["description"],
        "humidity": data["main"]["humidity"],
        "wind": data["wind"]["speed"]
    }

    return jsonify(cleaned_data)

if __name__ == "__main__":
    app.run(debug=True)
