from flask_cors import CORS
from flask import Flask, request, jsonify
import requests
from config import OPENWEATHER_API_KEY, BASE_URL

app = Flask(__name__)
CORS(app)

@app.route("/weather")
def weather():
    city = request.args.get("city")

    if not city:
        return jsonify({"error": "City not provided"}), 400

    params = {
        "q": city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    response = requests.get(BASE_URL, params=params)

    if response.status_code != 200:
        return jsonify({"error": "City not found"}), 404

    data = response.json()

    return jsonify({
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "weather": data["weather"][0]["description"]
    })


if __name__ == "__main__":
    app.run(debug=True)
