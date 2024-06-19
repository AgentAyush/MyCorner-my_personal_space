// Import necessary Firebase functions
import { app } from './firebase-config.js';
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Initialize Firebase Auth and Database
const auth = getAuth(app);
const database = getDatabase(app);

// DOM elements
const usernameDisplay = document.getElementById('username-display');
const welcomeText = document.getElementById('welcome-text');
const displayUsername = document.getElementById('display-username');
const logoutOptions = document.getElementById('logout-options');
const logoutDialog = document.getElementById('logout-dialog');
const confirmLogoutBtn = document.getElementById('confirm-logout');
const cancelLogoutBtn = document.getElementById('cancel-logout');

// Function to show logout dialog
const showLogoutDialog = () => {
    logoutDialog.style.display = 'flex';
    logoutOptions.style.display = 'none'; // Hide logout options
};
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('logo');

    logo.addEventListener('click', () => {
        location.reload(); // Reload the page when logo is clicked
    });
});

// Fetch the username from Firebase and display it
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        const userRef = ref(database, 'users/' + userId);

        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const username = userData.username || user.email;
                displayUsername.textContent = username;
                usernameDisplay.textContent = username;
                usernameDisplay.classList.remove('hidden');
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    } else {
        window.location.href = 'index.html'; // Redirect to login page if not authenticated
    }
});

// Toggle logout options visibility
usernameDisplay.addEventListener('click', () => {
    logoutOptions.style.display = logoutOptions.style.display === 'block' ? 'none' : 'block';
});

// Show logout confirmation dialog on back button click
window.addEventListener('popstate', () => {
    if (logoutDialog.style.display === 'none') {
        showLogoutDialog();
    }
});

// Show logout confirmation dialog
document.getElementById('logout-btn').addEventListener('click', () => {
    showLogoutDialog();
});

// Confirm logout
confirmLogoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html'; // Redirect to login page after logout
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
});

// Cancel logout
cancelLogoutBtn.addEventListener('click', () => {
    logoutDialog.style.display = 'none';
});

// Your YouTube Data API Key
const API_KEY = 'AIzaSyAYrd-v8TKAND7H-kRdqYOgFlZ9_PzerRw';

// DOM elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const videosContainer = document.getElementById('videos-container');

// Event listener for search button click
searchButton.addEventListener('click', searchVideos);

//Handle Enter keypress for search
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchVideos();
    }
});

// Function to search videos on YouTube
function searchVideos() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        return; // Don't search if input is empty
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchTerm}&key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            videosContainer.innerHTML = ''; // Clear previous results
            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const videoTitle = item.snippet.title;
                const videoThumbnail = item.snippet.thumbnails.medium.url;

                const videoElement = document.createElement('div');
                videoElement.classList.add('video-item');
                videoElement.innerHTML = `
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                        <img src="${videoThumbnail}" alt="${videoTitle}">
                        <p>${videoTitle}</p>
                    </a>
                `;
                videosContainer.appendChild(videoElement);
            });
        })
        .catch(error => console.error('Error fetching videos:', error));
}




// Function to fetch news headlines from News API
const fetchNewsHeadlines = async () => {
    const apiKey = '48dfb20021064c9db9c88421e52ef426'; // Replace with your News API key
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if data retrieval was successful
        if (data.status === 'ok') {
            const newsHeadlines = data.articles.slice(0, 5); // Get first 5 headlines
            const newsList = document.getElementById('news-headlines');

            // Clear any existing content
            newsList.innerHTML = '';

            // Populate news headlines
            newsHeadlines.forEach((article) => {
                const headline = document.createElement('li');
                headline.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
                newsList.appendChild(headline);
            });
        } else {
            console.error('Error fetching news:', data.message);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
};

// Load news headlines on page load
fetchNewsHeadlines();


//WEATHER
const wapiKey = 'ae09a5f9d214b80d4cfef010207874c1';

const fetchWeather = async (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${wapiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            updateWeatherUI(data);
        } else {
            console.error('Error fetching weather:', data.message);
            alert('Weather information not found for the entered city.');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Failed to fetch weather information. Please try again later.');
    }
};

const updateWeatherUI = (data) => {
    const cityName = document.getElementById('city-name');
    const suggestions = document.getElementById('suggestions');
    const temperature = document.getElementById('temperature');
    const feelslike = document.getElementById('feelslike');
    const description = document.getElementById('description');
    const wind = document.getElementById('wind');
    const humidity = document.getElementById('humidity');
    const visibility = document.getElementById('visibility');
    const pressure = document.getElementById('pressure'); 
    const weatherIcon = document.getElementById('weather-icon');
    const weatherContainer = document.querySelector('.weather-container');

    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    feelslike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    description.textContent = data.weather[0].description;
    wind.textContent = `Wind: ${data.wind.speed} m/s, Direction: ${data.wind.deg}°`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    visibility.textContent = `Visibility: ${data.visibility} meters`;
    pressure.textContent = `Pressure: ${data.main.pressure} hPa`;

    updateWeatherBackground(data.weather[0].main);
};
const updateWeatherBackground = (weatherCondition) => {
    let weatherBackground = '';

    switch (weatherCondition) {
        case 'Clear':
            weatherBackground = 'sunny.mp4';
            break;
        case 'Haze':
            weatherBackground = 'cloudy.mp4';
            break;
        case 'Thunderstorm':
            weatherBackground = 'thunder.mp4';
            break;
        case 'Rain':
            weatherBackground = 'rainy.mp4';
            break;
        case 'Drizzle':
            weatherBackground = 'drizzle.mp4';
            break;
        case 'Snow':
            weatherBackground = 'snowy.mp4';
            break;
        case 'Clouds':
            weatherBackground = 'partlycloud.mp4';
            break;
        default:
            weatherBackground = 'defaultvid.mp4'; // Default video
            break;
    }

    const videoElement = document.getElementById('weather-video');
    const currentOpacity = parseFloat(window.getComputedStyle(videoElement).opacity);

    // Fade out current video
    videoElement.style.opacity = 0;

    setTimeout(() => {
        // Change video source
        videoElement.src = weatherBackground;
        videoElement.load();
        // Fade in new video
        videoElement.style.opacity = 1;
    }, currentOpacity * 1000); // Use current opacity to determine timeout duration
};


document.getElementById('search-btn').addEventListener('click', () => {
    const cityInput = document.getElementById('city-input').value.trim();
    if (cityInput==""){
        return;
    }
    if (cityInput) {
        fetchWeather(cityInput);
    } else {
        alert('Please enter a city name.');
    }
});
//Handle Enter keypress for search
document.getElementById('city-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const cityInput = document.getElementById('city-input').value.trim();

        if (cityInput) {
            fetchWeather(cityInput);
            document.getElementById('city-input').value = '';
        }
    }
    
});








// Default city to fetch weather on page load
// Function to fetch user's current location
const fetchCurrentLocation = () => {
    let defaultCity = 'Ghatsila'; // Default city to use if location is not available
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const reverseGeocodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
                const response = await fetch(reverseGeocodingUrl);
                const data = await response.json();
                
                if (response.ok && data.length > 0) {
                    defaultCity = data[0].name; // Use the city name from reverse geocoding
                    fetchWeather(defaultCity); // Fetch weather for the default city
                } else {
                    console.error('Error fetching location:', data.message || 'No city found');
                    fetchWeather(defaultCity); // Use default city if reverse geocoding fails
                }
            } catch (error) {
                console.error('Error fetching location:', error);
                fetchWeather(defaultCity); // Use default city on error
            }
        }, (error) => {
            console.error('Error getting location:', error);
            fetchWeather(defaultCity); // Use default city if geolocation is denied
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        fetchWeather(defaultCity); // Use default city if geolocation is not supported
    }
};
fetchCurrentLocation();
