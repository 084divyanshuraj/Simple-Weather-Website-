// ===== ELEMENT SELECTION =====
const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");
const cityEl = document.querySelector(".city-name");

const tempEl = document.querySelector(".temperature h1");
const feelsEl = document.querySelector(".temperature p");
const conditionEl = document.querySelector(".condition p");
const detailEls = document.querySelectorAll(".details p");

const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

const iconEl = document.querySelector(".weather-icon");

// ===== LIVE CLOCK =====
function updateTime() {
    const now = new Date();

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    timeEl.textContent = `${hours}:${minutes}`;
    dateEl.textContent = `${dayName}, ${date} ${month} ${year}`;
}

updateTime();
setInterval(updateTime, 1000);

// ===== WEATHER API CONFIG =====
const API_KEY = "41c012f3992f0d43321f59b6531b6117";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ===== FETCH WEATHER =====
async function getWeather(city) {
    try {
        const response = await fetch(
            `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        updateWeatherUI(data);

    } catch (error) {
        alert(error.message);
    }
}

// ===== UPDATE UI =====
function updateWeatherUI(data) {
    cityEl.textContent = data.name;

    tempEl.textContent = `${Math.round(data.main.temp)}°C`;
    feelsEl.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    iconEl.src = iconUrl;
    iconEl.alt = data.weather[0].description;

    conditionEl.textContent = data.weather[0].main;


    detailEls[0].textContent = `Humidity: ${data.main.humidity}%`;
    detailEls[1].textContent = `Wind: ${data.wind.speed} m/s`;
    detailEls[2].textContent = `Pressure: ${data.main.pressure} hPa`;
    detailEls[3].textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    detailEls[4].textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
}

// ===== SEARCH BUTTON =====
searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    getWeather(city);
    searchInput.value = "";
});
