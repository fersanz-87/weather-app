// utils.ts - Utility functions for the Weather App

import type { ForecastData, DailyForecast } from './types';

/**
 * Gets the current local time for a city based on its timezone offset
 * @param timezoneOffset - Timezone offset in seconds from UTC
 * @returns Date object adjusted to the city's local time
 */
export function getCityLocalTime(timezoneOffset: number): Date {
  // Get current UTC time
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  
  // Add the city's timezone offset (in milliseconds)
  const cityTime = new Date(utcTime + (timezoneOffset * 1000));
  
  return cityTime;
}

/**
 * Determines if it's nighttime based on the current hour
 * @param timezoneOffset - Timezone offset in seconds from UTC
 * @returns true if it's nighttime (between 6 PM and 6 AM)
 */
export function isNightTime(timezoneOffset: number): boolean {
  const cityTime = getCityLocalTime(timezoneOffset);
  const hour = cityTime.getHours();
  // Night is between 6 PM (18:00) and 6 AM (06:00)
  return hour >= 18 || hour < 6;
}

/**
 * Formats the date in a readable format (e.g., "Monday October 20, 2025")
 * @param date - Date object to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formats the time in 24-hour format (e.g., "14:35:42")
 * @param date - Date object to format
 * @returns Formatted time string
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  });
}

/**
 * Converts wind degree to direction
 * @param deg - Wind direction in degrees
 * @returns Wind direction as a string (e.g., "North", "South-East")
 */
export function getWindDirection(deg: number): string {
  const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

/**
 * Helper function to capitalize each word in a string
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Processes forecast data to get daily summaries
 * Aggregates multiple forecast entries per day into a single daily forecast
 * @param forecastList - Array of forecast entries from the API
 * @returns Array of daily forecast summaries (max 7 days)
 */
export function getDailyForecast(forecastList: ForecastData['list']): DailyForecast[] {
  const dailyData = new Map<string, {
    temps: number[];
    icons: Map<string, number>;
    descriptions: string[];
    dt: number;
  }>();
  
  // Group forecast entries by day
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    
    if (!dailyData.has(date)) {
      dailyData.set(date, {
        temps: [],
        icons: new Map(),
        descriptions: [],
        dt: item.dt
      });
    }
    
    const dayData = dailyData.get(date)!;
    dayData.temps.push(item.main.temp);
    
    // Track icon frequency to determine most representative icon
    const iconCount = dayData.icons.get(item.weather[0].icon) || 0;
    dayData.icons.set(item.weather[0].icon, iconCount + 1);
    dayData.descriptions.push(item.weather[0].description);
  });
  
  // Process aggregated data into daily forecast
  const result: DailyForecast[] = [];
  
  dailyData.forEach((data) => {
    const temps = data.temps;
    let mostCommonIcon = '';
    let maxCount = 0;
    
    // Find the most frequently occurring icon for the day
    data.icons.forEach((count, icon) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonIcon = icon;
      }
    });
    
    result.push({
      dt: data.dt,
      temp_max: Math.max(...temps),
      temp_min: Math.min(...temps),
      icon: mostCommonIcon,
      description: data.descriptions[0]
    });
  });
  
  // Return up to 7 days of forecast
  return result.slice(0, 7);
}

