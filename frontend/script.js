// ================= ELEMENT SELECTION =================
const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");
const cityEl = document.querySelector(".city-name");

const tempEl = document.querySelector(".temperature h1");
const feelsEl = document.querySelector(".temperature p");
const conditionEl = document.querySelector(".condition p");
const iconEl = document.querySelector(".weather-icon");
const detailEls = document.querySelectorAll(".details p");

const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");
const errorEl = document.querySelector(".error-message");

const hourlyListEl = document.querySelector(".hourly-list");

// ================= LIVE CLOCK =================
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

// ================= API CONFIG =================
const API_KEY = "41c012f3992f0d43321f59b6531b6117";
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// ================= ERROR HANDLING =================
function showError(message) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
}

function clearError() {
    errorEl.textContent = "";
    errorEl.style.display = "none";
}

// ================= CURRENT WEATHER =================
async function getWeather(city) {
    try {
        clearError();

        const response = await fetch(
            `${CURRENT_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        updateWeatherUI(data);

    } catch (error) {
        showError(error.message);
    }
}

// ================= UPDATE CURRENT WEATHER UI =================
function updateWeatherUI(data) {
    cityEl.textContent = data.name;

    tempEl.textContent = `${Math.round(data.main.temp)}°C`;
    feelsEl.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;

    const iconCode = data.weather[0].icon;
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.alt = data.weather[0].description;

    conditionEl.textContent = data.weather[0].description;

    detailEls[0].textContent = `Humidity: ${data.main.humidity}%`;
    detailEls[1].textContent = `Wind: ${data.wind.speed} m/s`;
    detailEls[2].textContent = `Pressure: ${data.main.pressure} hPa`;
    detailEls[3].textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    detailEls[4].textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
}

// ================= HOURLY FORECAST =================
async function getHourlyForecast(city) {
    try {
        const response = await fetch(
            `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();
        updateHourlyUI(data.list);

    } catch {
        // silently fail for now
    }
}

// ================= UPDATE HOURLY UI =================
function updateHourlyUI(hourlyData) {
    hourlyListEl.innerHTML = "";

    const nextHours = hourlyData.slice(0, 6);

    nextHours.forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });

        const temp = Math.round(item.main.temp);
        const wind = item.wind.speed;
        const icon = item.weather[0].icon;

        const hourItem = document.createElement("div");
        hourItem.classList.add("hour-item");

        hourItem.innerHTML = `
            <p class="hour-time">${time}</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
            <p class="hour-temp">${temp}°C</p>
            <p class="hour-wind">${wind} km/h</p>
        `;

        hourlyListEl.appendChild(hourItem);
    });
}

// ================= SEARCH HANDLER =================
searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();

    if (city === "") {
        showError("Please enter a city name");
        return;
    }

    getWeather(city);
    getHourlyForecast(city);

    searchInput.value = "";
});
