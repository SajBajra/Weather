const temperatureField = document.querySelector(".temp p");
const locationField = document.querySelector(".time_location p:first-child");
const dateandTimeField = document.querySelector(".time_location p:last-child");
const conditionField = document.querySelector(".condition p");
const conditionIcon = document.querySelector(".condition i");
const searchField = document.querySelector(".search_area");
const form = document.querySelector('form');
const ctx = document.getElementById('weatherChart').getContext('2d');

form.addEventListener('submit', searchforLocation);

let target = 'Kathmandu';
let weatherChart;

const fetchResults = async (targetLocation) => {
    showLoading();
    let url = `https://api.weatherapi.com/v1/forecast.json?key=a43a64bda30a4c32a47103111240912&q=${targetLocation}&days=5&aqi=no&alerts=no`;
    
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Location not found');
        const data = await res.json();
        console.log(data);

        let locationName = data.location.name;
        let time = data.location.localtime;
        let temp = data.current.temp_c;
        let condition = data.current.condition.text;
        let conditionCode = data.current.condition.code;
        let forecast = data.forecast.forecastday;

        updateDetails(temp, locationName, time, condition, conditionCode);
        updateChart(forecast);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
};

function updateDetails(temp, locationName, time, condition, conditionCode) {
    let splitDate = time.split(' ')[0];
    let splitTime = time.split(' ')[1];
    let currentDate = new Date(splitDate).getDay();
    let dayName = getDayName(currentDate);

    temperatureField.innerText = temp;
    locationField.innerText = locationName;
    dateandTimeField.innerText = `${splitDate} ${dayName} ${splitTime}`;
    conditionField.innerText = condition;
    conditionIcon.className = `wi ${getIconClass(conditionCode)}`;
}

function searchforLocation(e) {
    e.preventDefault();
    target = searchField.value;
    fetchResults(target);
}

fetchResults(target);

function getDayName(number) {
    switch (number) {
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
    }
}

function getIconClass(code) {
    switch (code) {
        case 1000: return 'wi-day-sunny'; // Clear
        case 1003: return 'wi-day-cloudy'; // Partly cloudy
        case 1006: return 'wi-cloud'; // Cloudy
        case 1009: return 'wi-cloudy'; // Overcast
        case 1030: return 'wi-fog'; // Mist
        case 1063: return 'wi-rain'; // Patchy rain possible
        case 1066: return 'wi-snow'; // Patchy snow possible
        case 1069: return 'wi-rain-mix'; // Patchy sleet possible
        case 1072: return 'wi-rain-mix'; // Patchy freezing drizzle possible
        case 1087: return 'wi-thunderstorm'; // Thundery outbreaks possible
        case 1114: return 'wi-snow-wind'; // Blowing snow
        case 1117: return 'wi-snow'; // Blizzard
        case 1135: return 'wi-fog'; // Fog
        case 1147: return 'wi-fog'; // Freezing fog
        case 1150: return 'wi-sprinkle'; // Patchy light drizzle
        case 1153: return 'wi-sprinkle'; // Light drizzle
        case 1168: return 'wi-rain-mix'; // Freezing drizzle
        case 1171: return 'wi-rain-mix'; // Heavy freezing drizzle
        case 1180: return 'wi-showers'; // Patchy light rain
        case 1183: return 'wi-showers'; // Light rain
        case 1186: return 'wi-rain'; // Moderate rain at times
        case 1189: return 'wi-rain'; // Moderate rain
        case 1192: return 'wi-rain'; // Heavy rain at times
        case 1195: return 'wi-rain'; // Heavy rain
        case 1198: return 'wi-rain-mix'; // Light freezing rain
        case 1201: return 'wi-rain-mix'; // Moderate or heavy freezing rain
        case 1204: return 'wi-rain-mix'; // Light sleet
        case 1207: return 'wi-rain-mix'; // Moderate or heavy sleet
        case 1210: return 'wi-snow'; // Patchy light snow
        case 1213: return 'wi-snow'; // Light snow
        case 1216: return 'wi-snow'; // Patchy moderate snow
        case 1219: return 'wi-snow'; // Moderate snow
        case 1222: return 'wi-snow'; // Patchy heavy snow
        case 1225: return 'wi-snow'; // Heavy snow
        case 1237: return 'wi-hail'; // Ice pellets
        case 1240: return 'wi-showers'; // Light rain shower
        case 1243: return 'wi-rain'; // Moderate or heavy rain shower
        case 1246: return 'wi-rain'; // Torrential rain shower
        case 1249: return 'wi-rain-mix'; // Light sleet showers
        case 1252: return 'wi-rain-mix'; // Moderate or heavy sleet showers
        case 1255: return 'wi-snow'; // Light snow showers
        case 1258: return 'wi-snow'; // Moderate or heavy snow showers
        case 1261: return 'wi-hail'; // Light showers of ice pellets
        case 1264: return 'wi-hail'; // Moderate or heavy showers of ice pellets
        case 1273: return 'wi-thunderstorm'; // Patchy light rain with thunder
        case 1276: return 'wi-thunderstorm'; // Moderate or heavy rain with thunder
        case 1279: return 'wi-thunderstorm'; // Patchy light snow with thunder
        case 1282: return 'wi-thunderstorm'; // Moderate or heavy snow with thunder
        default: return 'wi-na'; // Not available
    }
}


function updateChart(forecast) {
    const labels = forecast.map(day => day.date);
    const temps = forecast.map(day => day.day.avgtemp_c);

    if (weatherChart) {
        weatherChart.destroy();
    }

    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Temperature (°C)',
                data: temps,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function showLoading() {
    const loadingIndicator = document.createElement('p');
    loadingIndicator.className = 'loading';
    loadingIndicator.innerText = 'Loading...';
    document.body.appendChild(loadingIndicator);
}

function hideLoading() {
    const loadingIndicator = document.querySelector('.loading');
    if (loadingIndicator) loadingIndicator.remove();
}

function showError(message) {
    hideError();
    const errorIndicator = document.createElement('p');
    errorIndicator.className = 'error';
    errorIndicator.innerText = message;
    document.body.appendChild(errorIndicator);
}

function hideError() {
    const errorIndicator = document.querySelector('.error');
    if (errorIndicator) errorIndicator.remove();
}
