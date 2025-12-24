// Select elements
const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");
const cityEl = document.querySelector(".city-name");

const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

// Live Clock
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

// Run clock immediately and every second
updateTime();
setInterval(updateTime, 1000);

// City update (UI only)
searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    cityEl.textContent = city;
    searchInput.value = "";
});
