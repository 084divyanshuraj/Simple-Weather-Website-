const button = document.getElementById("getWeatherBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDesc = document.getElementById("weatherDesc");

button.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    fetch(`http://127.0.0.1:5000/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            cityName.innerText = data.city;
            temperature.innerText = data.temperature + " °C";
            weatherDesc.innerText = data.weather;
        })
        .catch(error => {
            alert("Error connecting to server");
            console.error(error);
        });
});
