// ui.ts - DOM rendering and UI management

import type { WeatherData, ForecastData } from './types';
import { 
  getCityLocalTime, 
  formatDate, 
  formatTime, 
  getWindDirection, 
  capitalizeWords, 
  getDailyForecast 
} from './utils';

/**
 * Variable to store the clock interval for updating the city time
 */
let clockInterval: number | null = null;

/**
 * Updates the clock display for the selected city
 * @param timezoneOffset - Timezone offset in seconds from UTC
 */
function updateClock(timezoneOffset: number): void {
  const timeElement = document.getElementById('city-time');
  const dateElement = document.getElementById('city-date');
  
  if (timeElement && dateElement) {
    const cityTime = getCityLocalTime(timezoneOffset);
    timeElement.textContent = formatTime(cityTime);
    dateElement.textContent = formatDate(cityTime);
  }
}

/**
 * Starts the clock that updates every second
 * @param timezoneOffset - Timezone offset in seconds from UTC
 */
function startClock(timezoneOffset: number): void {
  // Clear any existing interval
  if (clockInterval !== null) {
    clearInterval(clockInterval);
  }
  
  // Update immediately
  updateClock(timezoneOffset);
  
  // Update every second
  clockInterval = window.setInterval(() => {
    updateClock(timezoneOffset);
  }, 1000);
}

/**
 * Displays a loading state in the weather result container
 * @param container - The container element to display loading state in
 */
export function showLoading(container: HTMLElement): void {
  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading weather data...</p></div>';
}

/**
 * Displays an error message in the UI
 * @param container - The container element to display error in
 * @param message - The error message to display
 */
export function showError(container: HTMLElement, message: string): void {
  container.innerHTML = `
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
 * Displays comprehensive weather information in BBC Weather style
 * @param container - The container element to render weather data in
 * @param current - Current weather data
 * @param forecast - Forecast data
 */
export function displayWeather(
  container: HTMLElement,
  current: WeatherData,
  forecast: ForecastData
): void {
  const timezoneOffset: number = current.timezone;
  
  const cityName: string = current.name;
  const temperature: number = Math.round(current.main.temp);
  const feelsLike: number = Math.round(current.main.feels_like);
  const description: string = current.weather[0].description;
  const icon: string = current.weather[0].icon;
  const humidity: number = current.main.humidity;
  const pressure: number = current.main.pressure;
  const windSpeed: number = Math.round(current.wind.speed * 3.6); // Convert m/s to km/h
  const windDirection: string = getWindDirection(current.wind.deg);
  const visibility: number = Math.round(current.visibility / 1000); // Convert to km
  
  // Get hourly forecast for next 24 hours (8 intervals of 3 hours)
  const hourlyForecast = forecast.list.slice(0, 8);
  
  // Get daily forecast (one entry per day)
  const dailyForecast = getDailyForecast(forecast.list);
  
  const weatherHTML: string = `
    <div class="weather-display fade-in">
      <!-- Header Section -->
      <div class="weather-header">
        <div class="location-info">
          <h2 class="city-name">${cityName}</h2>
          <div class="city-time-display">
            <p id="city-time" class="city-time"></p>
            <p id="city-date" class="city-date"></p>
          </div>
        </div>
      </div>
      
      <!-- Current Weather Section -->
      <div class="current-weather">
        <div class="main-temp-section">
          <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}" class="main-weather-icon">
          <div class="main-temperature">
            <span class="temp-value">${temperature}°</span>
          </div>
        </div>
        <div class="main-description">
          <p>${capitalizeWords(description)}</p>
        </div>
      </div>
      
      <!-- Hourly Timeline -->
      <div class="hourly-timeline">
        ${hourlyForecast.map(hour => {
          const time = new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          const temp = Math.round(hour.main.temp);
          const hourIcon = hour.weather[0].icon;
          const pop = Math.round(hour.pop * 100);
          
          return `
            <div class="hour-item">
              <div class="hour-time">${time}</div>
              <img src="https://openweathermap.org/img/wn/${hourIcon}.png" alt="${hour.weather[0].description}" class="hour-icon">
              <div class="hour-temp">${temp}°</div>
              ${pop > 0 ? `<div class="hour-rain">${pop}%</div>` : '<div class="hour-rain">0%</div>'}
            </div>
          `;
        }).join('')}
      </div>
      
      <!-- Detailed Information Grid -->
      <div class="details-grid">
        <div class="detail-card">
          <div class="detail-header">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="detail-label">Humidity</span>
          </div>
          <div class="detail-value">${humidity}%</div>
          <div class="detail-sub">Pressure: ${pressure} mb</div>
          <div class="detail-sub">Visibility: ${visibility > 10 ? 'Good' : 'Moderate'}</div>
        </div>
        
        <div class="detail-card">
          <div class="detail-header">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="detail-label">Wind</span>
          </div>
          <div class="detail-value">${windSpeed} km/h</div>
          <div class="detail-sub">From the ${windDirection.toLowerCase()}</div>
        </div>
        
        <div class="detail-card">
          <div class="detail-header">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="detail-label">Temperature</span>
          </div>
          <div class="detail-value">Feels like ${feelsLike}°</div>
          <div class="detail-sub">Actual: ${temperature}°C</div>
        </div>
      </div>
      
      <!-- 7-Day Forecast -->
      <div class="weekly-forecast">
        <h3 class="forecast-title">7-Day Forecast</h3>
        <div class="forecast-days">
          ${dailyForecast.map(day => {
            const dayName = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
            const maxTemp = Math.round(day.temp_max);
            const minTemp = Math.round(day.temp_min);
            const dayIcon = day.icon;
            
            return `
              <div class="forecast-day">
                <div class="forecast-day-name">${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${dayIcon}.png" alt="${day.description}" class="forecast-icon">
                <div class="forecast-temps">
                  <span class="forecast-max">${maxTemp}°</span>
                  <span class="forecast-min">${minTemp}°</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  
  console.log('Setting weather HTML to display...');
  container.innerHTML = weatherHTML;
  console.log('Weather HTML set successfully! Display should be visible now.');
  
  // Start the clock for the city's timezone
  startClock(timezoneOffset);
}

