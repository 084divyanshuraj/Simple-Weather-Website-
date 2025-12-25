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
const themeToggle = document.querySelector(".theme-toggle");

// ================= BACKEND URL =================
const BACKEND_URL = "http://127.0.0.1:5000";

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

    timeEl.textContent = `${hours}:${minutes}`;
    dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

updateTime();
setInterval(updateTime, 1000);

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

        const response = await fetch(`${BACKEND_URL}/weather?city=${city}`);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        cityEl.textContent = data.city;
        tempEl.textContent = `${Math.round(data.temperature)}°C`;
        feelsEl.textContent = `Feels like ${Math.round(data.feels_like)}°C`;
        conditionEl.textContent = data.condition;

        iconEl.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

        detailEls[0].textContent = `Humidity: ${data.humidity}%`;
        detailEls[1].textContent = `Wind: ${data.wind} m/s`;
        detailEls[3].textContent = `Sunrise: ${new Date(data.sunrise * 1000).toLocaleTimeString()}`;
        detailEls[4].textContent = `Sunset: ${new Date(data.sunset * 1000).toLocaleTimeString()}`;

    } catch (error) {
        showError(error.message);
    }
}

// ================= HOURLY FORECAST =================
async function getHourlyForecast(city) {
    try {
        const response = await fetch(`${BACKEND_URL}/forecast?city=${city}`);
        if (!response.ok) return;

        const data = await response.json();
        updateHourlyUI(data);

    } catch {
        console.log("Hourly forecast error");
    }
}

function updateHourlyUI(hourlyData) {
    hourlyListEl.innerHTML = "";

    hourlyData.forEach(item => {
        const time = new Date(item.time * 1000).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });

        const hourItem = document.createElement("div");
        hourItem.classList.add("hour-item");

        hourItem.innerHTML = `
            <p class="hour-time">${time}</p>
            <img src="https://openweathermap.org/img/wn/${item.icon}@2x.png">
            <p class="hour-temp">${Math.round(item.temp)}°C</p>
            <p class="hour-wind">${item.wind} km/h</p>
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

// ================= DARK MODE =================
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "☀️ Light Mode";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeToggle.textContent = "☀️ Light Mode";
        localStorage.setItem("theme", "light");
    } else {
        themeToggle.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "dark");
    }
});
