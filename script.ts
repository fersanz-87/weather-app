// script.ts - Weather App with TypeScript

// Interface for OpenWeatherMap API response structure
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

// Interface for error handling
interface WeatherError {
  message: string;
}

// Select HTML elements that we'll need - Type assertions for DOM elements
const cityInput = document.getElementById('city-input') as HTMLInputElement;
const searchBtn = document.getElementById('search-btn') as HTMLButtonElement;
const weatherResultDiv = document.getElementById('weather-result') as HTMLDivElement;

// Read the API Key from Vite environment variables
const apiKey: string = import.meta.env.VITE_API_KEY;

// Add event listener to the search button
searchBtn.addEventListener('click', (): void => {
  const city: string = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    showError('Please enter a city name.');
  }
});

// Add event listener for Enter key on input field
cityInput.addEventListener('keypress', (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    const city: string = cityInput.value.trim();
    if (city) {
      getWeather(city);
    } else {
      showError('Please enter a city name.');
    }
  }
});

/**
 * Fetches weather data from OpenWeatherMap API
 * @param city - The name of the city to fetch weather for
 */
async function getWeather(city: string): Promise<void> {
  weatherResultDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading...</p></div>';
  
  const apiUrl: string = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=en`;

  try {
    const response: Response = await fetch(apiUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else {
        throw new Error('Unable to fetch weather data. Please try again later.');
      }
    }
    
    const data: WeatherData = await response.json();
    displayWeather(data);
  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : 'An unexpected error occurred.';
    showError(errorMessage);
  }
}

/**
 * Displays weather information in the UI
 * @param data - Weather data object from the API
 */
function displayWeather(data: WeatherData): void {
  const cityName: string = data.name;
  const country: string = data.sys.country;
  const temperature: number = Math.round(data.main.temp);
  const feelsLike: number = Math.round(data.main.feels_like);
  const description: string = data.weather[0].description;
  const icon: string = data.weather[0].icon;
  const humidity: number = data.main.humidity;
  const windSpeed: number = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
  const pressure: number = data.main.pressure;

  const weatherHTML: string = `
    <div class="weather-info fade-in">
      <div class="location">
        <h2>${cityName}, ${country}</h2>
      </div>
      
      <div class="weather-main">
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}" class="weather-icon">
        <div class="temperature">
          <span class="temp-value">${temperature}</span>
          <span class="temp-unit">°C</span>
        </div>
        <p class="description">${capitalizeWords(description)}</p>
      </div>
      
      <div class="weather-details">
        <div class="detail-item">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
            <path d="M13 7h-2v5.41l4.29 4.29 1.41-1.41-3.7-3.7V7z" fill="currentColor"/>
          </svg>
          <div>
            <p class="detail-label">Feels Like</p>
            <p class="detail-value">${feelsLike}°C</p>
          </div>
        </div>
        
        <div class="detail-item">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div>
            <p class="detail-label">Humidity</p>
            <p class="detail-value">${humidity}%</p>
          </div>
        </div>
        
        <div class="detail-item">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div>
            <p class="detail-label">Wind Speed</p>
            <p class="detail-value">${windSpeed} km/h</p>
          </div>
        </div>
        
        <div class="detail-item">
          <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <div>
            <p class="detail-label">Pressure</p>
            <p class="detail-value">${pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  `;

  weatherResultDiv.innerHTML = weatherHTML;
}

/**
 * Displays an error message in the UI
 * @param message - The error message to display
 */
function showError(message: string): void {
  weatherResultDiv.innerHTML = `
    <div class="error-message fade-in">
      <svg class="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p>${message}</p>
    </div>
  `;
}

/**
 * Helper function to capitalize each word in a string
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

