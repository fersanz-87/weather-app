// script.ts - Main entry point for BBC Weather-style Weather App

import { fetchWeatherData } from './api';
import { setWeatherBackground } from './animations';
import { displayWeather, showError, showLoading } from './ui';
import { isNightTime } from './utils';

// Select HTML elements
const cityInput = document.getElementById('city-input') as HTMLInputElement;
const searchBtn = document.getElementById('search-btn') as HTMLButtonElement;
const weatherResultDiv = document.getElementById('weather-result') as HTMLDivElement;
const weatherBackground = document.getElementById('weather-background') as HTMLDivElement;

// Check if required elements exist
if (!cityInput || !searchBtn || !weatherResultDiv || !weatherBackground) {
  console.error('Required elements not found!');
}

/**
 * Main function to get and display weather data
 * @param city - The name of the city to fetch weather for
 */
async function getWeatherData(city: string): Promise<void> {
  console.log('getWeatherData called for:', city);
  showLoading(weatherResultDiv);
  
  try {
    console.log('Fetching weather data...');
    // Fetch current weather and forecast in parallel
    const [currentWeather, forecast] = await fetchWeatherData(city);
    
    console.log('Weather data fetched successfully:', currentWeather);
    
    // Set dynamic background based on weather condition and time of day
    const timezoneOffset: number = currentWeather.timezone;
    const isNight = isNightTime(timezoneOffset);
    setWeatherBackground(weatherBackground, currentWeather.weather[0].main, isNight);
    
    // Display weather information
    displayWeather(weatherResultDiv, currentWeather, forecast);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    const errorMessage: string = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred.';
    showError(weatherResultDiv, errorMessage);
  }
}

/**
 * Handles the search action when user submits a city
 */
function handleSearch(): void {
  console.log('Search button clicked');
  const city: string = cityInput.value.trim();
  console.log('City input value:', city);
  
  if (city) {
    getWeatherData(city);
  } else {
    showError(weatherResultDiv, 'Please enter a city name.');
  }
}

// Add event listener to the search button
searchBtn.addEventListener('click', (): void => {
  handleSearch();
});

// Add event listener for Enter key on input field
cityInput.addEventListener('keypress', (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    handleSearch();
  }
});
