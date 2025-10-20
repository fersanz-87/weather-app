// api.ts - API layer for fetching weather data from OpenWeatherMap

import type { WeatherData, ForecastData } from './types';

// Read the API Key from Vite environment variables
const apiKey: string = import.meta.env.VITE_API_KEY;

// Debug: Check if API key is loaded
console.log('API Key loaded:', apiKey ? 'Yes' : 'No');

/**
 * Fetches current weather data from OpenWeatherMap API
 * @param city - The name of the city
 * @returns Promise with current weather data
 * @throws Error if the API request fails
 */
export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
  const apiUrl: string = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=en`;
  console.log('Fetching current weather from:', apiUrl);
  
  const response: Response = await fetch(apiUrl);
  console.log('Current weather response status:', response.status);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found. Please check the spelling and try again.');
    } else if (response.status === 401) {
      throw new Error('Invalid API key. Please check your configuration.');
    } else {
      throw new Error('Unable to fetch weather data. Please try again later.');
    }
  }
  
  const data = await response.json();
  console.log('Current weather data:', data);
  return data;
}

/**
 * Fetches 5-day forecast data from OpenWeatherMap API
 * @param city - The name of the city
 * @returns Promise with forecast data
 * @throws Error if the API request fails
 */
export async function fetchForecast(city: string): Promise<ForecastData> {
  const apiUrl: string = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=en`;
  
  const response: Response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error('Unable to fetch forecast data.');
  }
  
  return await response.json();
}

/**
 * Fetches both current weather and forecast data in parallel
 * @param city - The name of the city to fetch weather for
 * @returns Promise with tuple containing current weather and forecast data
 * @throws Error if any API request fails
 */
export async function fetchWeatherData(city: string): Promise<[WeatherData, ForecastData]> {
  console.log('Fetching weather data for:', city);
  
  // Fetch current weather and forecast in parallel for better performance
  const [currentWeather, forecast] = await Promise.all([
    fetchCurrentWeather(city),
    fetchForecast(city)
  ]);
  
  console.log('Weather data fetched successfully');
  return [currentWeather, forecast];
}

