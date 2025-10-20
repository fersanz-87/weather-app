// script.ts - BBC Weather-style Weather App with TypeScript

// Interface for current weather data from OpenWeatherMap API
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
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  visibility: number;
  dt: number;
  timezone: number; // Timezone offset in seconds from UTC
}

// Interface for forecast data (5-day/3-hour forecast)
interface ForecastData {
  list: Array<{
    dt: number;
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
      deg: number;
    };
    pop: number; // Probability of precipitation
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
}

// Select HTML elements
const cityInput = document.getElementById('city-input') as HTMLInputElement;
const searchBtn = document.getElementById('search-btn') as HTMLButtonElement;
const weatherResultDiv = document.getElementById('weather-result') as HTMLDivElement;
const weatherBackground = document.getElementById('weather-background') as HTMLDivElement;

// Read the API Key from Vite environment variables
const apiKey: string = import.meta.env.VITE_API_KEY;

// Debug: Check if API key is loaded
console.log('API Key loaded:', apiKey ? 'Yes' : 'No');

// Check if elements exist
if (!cityInput || !searchBtn || !weatherResultDiv || !weatherBackground) {
  console.error('Required elements not found!');
}

// Variable to store the clock interval
let clockInterval: number | null = null;

// Add event listener to the search button
searchBtn.addEventListener('click', (): void => {
  console.log('Search button clicked');
  const city: string = cityInput.value.trim();
  console.log('City input value:', city);
  if (city) {
    getWeatherData(city);
  } else {
    showError('Please enter a city name.');
  }
});

// Add event listener for Enter key on input field
cityInput.addEventListener('keypress', (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    const city: string = cityInput.value.trim();
    if (city) {
      getWeatherData(city);
    } else {
      showError('Please enter a city name.');
    }
  }
});

/**
 * Fetches both current weather and forecast data
 * @param city - The name of the city to fetch weather for
 */
async function getWeatherData(city: string): Promise<void> {
  console.log('getWeatherData called for:', city);
  weatherResultDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading weather data...</p></div>';
  
  try {
    console.log('Fetching weather data...');
    // Fetch current weather and forecast in parallel
    const [currentWeather, forecast] = await Promise.all([
      fetchCurrentWeather(city),
      fetchForecast(city)
    ]);
    
    console.log('Weather data fetched successfully:', currentWeather);
    displayWeather(currentWeather, forecast);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    const errorMessage: string = error instanceof Error ? error.message : 'An unexpected error occurred.';
    showError(errorMessage);
  }
}

/**
 * Fetches current weather data from OpenWeatherMap API
 * @param city - The name of the city
 */
async function fetchCurrentWeather(city: string): Promise<WeatherData> {
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
 */
async function fetchForecast(city: string): Promise<ForecastData> {
  const apiUrl: string = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=en`;
  
  const response: Response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error('Unable to fetch forecast data.');
  }
  
  return await response.json();
}

/**
 * Determines if it's nighttime based on the current hour
 * @param timezoneOffset - Timezone offset in seconds from UTC
 * @returns true if it's nighttime (between 6 PM and 6 AM)
 */
function isNightTime(timezoneOffset: number): boolean {
  const cityTime = getCityLocalTime(timezoneOffset);
  const hour = cityTime.getHours();
  // Night is between 6 PM (18:00) and 6 AM (06:00)
  return hour >= 18 || hour < 6;
}

/**
 * Sets the dynamic background based on weather conditions and time of day
 * @param weatherCondition - Main weather condition from API
 * @param timezoneOffset - Timezone offset in seconds from UTC
 */
function setWeatherBackground(weatherCondition: string, timezoneOffset: number): void {
  console.log('Setting weather background for condition:', weatherCondition);
  
  // Remove all existing weather classes
  weatherBackground.className = 'weather-background';
  
  // Clear existing particles
  const rainContainer = weatherBackground.querySelector('.rain-container') as HTMLElement;
  const snowContainer = weatherBackground.querySelector('.snow-container') as HTMLElement;
  const cloudsContainer = weatherBackground.querySelector('.clouds-container') as HTMLElement;
  const starsContainer = weatherBackground.querySelector('.stars-container') as HTMLElement;
  
  rainContainer.innerHTML = '';
  snowContainer.innerHTML = '';
  cloudsContainer.innerHTML = '';
  starsContainer.innerHTML = '';
  
  const condition = weatherCondition.toLowerCase();
  const isNight = isNightTime(timezoneOffset);
  
  console.log('Is nighttime?', isNight);
  
  // Determine weather type and apply appropriate class
  if (condition.includes('rain') || condition.includes('drizzle')) {
    console.log('Applying RAINY background with rain drops');
    weatherBackground.classList.add('rainy');
    createRainDrops();
    if (isNight) {
      weatherBackground.classList.add('night');
    }
  } else if (condition.includes('thunder') || condition.includes('storm')) {
    console.log('Applying THUNDERSTORM background with rain and lightning');
    weatherBackground.classList.add('thunderstorm');
    createRainDrops();
    if (isNight) {
      weatherBackground.classList.add('night');
    }
  } else if (condition.includes('snow')) {
    console.log('Applying SNOWY background with snowflakes');
    weatherBackground.classList.add('snowy');
    createSnowFlakes();
    if (isNight) {
      weatherBackground.classList.add('night');
    }
  } else if (condition.includes('clear')) {
    if (isNight) {
      console.log('Applying CLEAR NIGHT background with moon and stars');
      weatherBackground.classList.add('clear-night');
      createStars();
    } else {
      console.log('Applying SUNNY background with sun and clouds');
      weatherBackground.classList.add('sunny');
      createClouds();
    }
  } else if (condition.includes('cloud')) {
    console.log('Applying CLOUDY background with clouds');
    if (isNight) {
      weatherBackground.classList.add('cloudy-night');
      createStars();
    } else {
      weatherBackground.classList.add('cloudy');
    }
    createClouds();
  } else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
    console.log('Applying MISTY background');
    weatherBackground.classList.add('misty');
    if (isNight) {
      weatherBackground.classList.add('night');
    }
  } else {
    console.log('Applying CLEAR background (default)');
    if (isNight) {
      weatherBackground.classList.add('clear-night');
      createStars();
    } else {
      weatherBackground.classList.add('clear');
    }
  }
  
  console.log('Background classes:', weatherBackground.className);
}

/**
 * Creates animated rain drops
 */
function createRainDrops(): void {
  const rainContainer = weatherBackground.querySelector('.rain-container') as HTMLElement;
  const numberOfDrops = 100;
  
  for (let i = 0; i < numberOfDrops; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    
    // Random positioning
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
    
    // Random opacity for depth effect
    drop.style.opacity = `${Math.random() * 0.5 + 0.3}`;
    
    rainContainer.appendChild(drop);
  }
}

/**
 * Creates animated snow flakes
 */
function createSnowFlakes(): void {
  const snowContainer = weatherBackground.querySelector('.snow-container') as HTMLElement;
  const numberOfFlakes = 50;
  
  for (let i = 0; i < numberOfFlakes; i++) {
    const flake = document.createElement('div');
    flake.className = 'snow-flake';
    
    // Random positioning and size
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.width = `${Math.random() * 5 + 5}px`;
    flake.style.height = flake.style.width;
    flake.style.animationDuration = `${Math.random() * 3 + 5}s`;
    flake.style.animationDelay = `${Math.random() * 5}s`;
    
    // Random opacity for depth effect
    flake.style.opacity = `${Math.random() * 0.6 + 0.4}`;
    
    snowContainer.appendChild(flake);
  }
}

/**
 * Creates animated clouds with varied sizes and positioning
 */
function createClouds(): void {
  console.log('Creating animated clouds...');
  const cloudsContainer = weatherBackground.querySelector('.clouds-container') as HTMLElement;
  const numberOfClouds = 18; // Even more clouds for better coverage
  
  for (let i = 0; i < numberOfClouds; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud-particle';
    
    // Create varied cloud sizes - some small, some large
    const sizeVariation = Math.random();
    let width: number;
    let height: number;
    
    if (sizeVariation < 0.3) {
      // Small clouds (30% chance)
      width = Math.random() * 150 + 180;
      height = Math.random() * 70 + 60;
    } else if (sizeVariation < 0.7) {
      // Medium clouds (40% chance)
      width = Math.random() * 200 + 250;
      height = Math.random() * 100 + 90;
    } else {
      // Large clouds (30% chance)
      width = Math.random() * 280 + 350;
      height = Math.random() * 140 + 120;
    }
    
    // Random vertical positioning across the upper portion of the screen
    const top = Math.random() * 70; // Spread clouds across more vertical space
    
    // Varied animation speeds for depth effect
    const duration = Math.random() * 50 + 70; // 70-120 seconds
    const delay = Math.random() * 25; // Stagger the start times
    
    cloud.style.top = `${top}%`;
    cloud.style.left = `-${width}px`; // Start off-screen to the left
    cloud.style.width = `${width}px`;
    cloud.style.height = `${height}px`;
    cloud.style.animationDuration = `${duration}s`;
    cloud.style.animationDelay = `${delay}s`;
    
    // Add slight opacity variation for depth
    const opacity = 0.75 + Math.random() * 0.25; // 0.75 to 1.0 (more visible)
    cloud.style.opacity = `${opacity}`;
    
    cloudsContainer.appendChild(cloud);
    console.log(`Cloud ${i + 1} created:`, { top, width, height, duration, delay, opacity });
  }
  console.log(`Total clouds created: ${numberOfClouds}`);
}

/**
 * Creates animated stars for nighttime
 */
function createStars(): void {
  console.log('Creating stars for nighttime...');
  const starsContainer = weatherBackground.querySelector('.stars-container') as HTMLElement;
  const numberOfStars = 150; // Lots of stars for a beautiful night sky
  
  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random positioning across entire screen
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    
    // Varied star sizes
    const size = Math.random() * 2 + 1; // 1-3px
    
    // Varied animation for twinkling effect
    const duration = Math.random() * 3 + 2; // 2-5 seconds
    const delay = Math.random() * 5; // 0-5 seconds delay
    
    star.style.left = `${left}%`;
    star.style.top = `${top}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;
    
    starsContainer.appendChild(star);
  }
  console.log(`Total stars created: ${numberOfStars}`);
}

/**
 * Gets the current local time for a city based on its timezone offset
 * @param timezoneOffset - Timezone offset in seconds from UTC
 * @returns Date object adjusted to the city's local time
 */
function getCityLocalTime(timezoneOffset: number): Date {
  // Get current UTC time
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  
  // Add the city's timezone offset (in milliseconds)
  const cityTime = new Date(utcTime + (timezoneOffset * 1000));
  
  return cityTime;
}

/**
 * Formats the date in a readable format (e.g., "Monday October 20, 2025")
 * @param date - Date object to format
 * @returns Formatted date string
 */
function formatDate(date: Date): string {
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
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  });
}

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
 * Displays comprehensive weather information in BBC Weather style
 * @param current - Current weather data
 * @param forecast - Forecast data
 */
function displayWeather(current: WeatherData, forecast: ForecastData): void {
  const timezoneOffset: number = current.timezone;
  
  // Set dynamic background based on weather condition and time of day
  setWeatherBackground(current.weather[0].main, timezoneOffset);
  
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
  weatherResultDiv.innerHTML = weatherHTML;
  console.log('Weather HTML set successfully! Display should be visible now.');
  
  // Start the clock for the city's timezone
  startClock(timezoneOffset);
}

/**
 * Processes forecast data to get daily summaries
 * @param forecastList - Array of forecast entries
 */
function getDailyForecast(forecastList: ForecastData['list']): Array<{
  dt: number;
  temp_max: number;
  temp_min: number;
  icon: string;
  description: string;
}> {
  const dailyData = new Map<string, {
    temps: number[];
    icons: Map<string, number>;
    descriptions: string[];
    dt: number;
  }>();
  
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
    
    const iconCount = dayData.icons.get(item.weather[0].icon) || 0;
    dayData.icons.set(item.weather[0].icon, iconCount + 1);
    dayData.descriptions.push(item.weather[0].description);
  });
  
  const result: Array<{
    dt: number;
    temp_max: number;
    temp_min: number;
    icon: string;
    description: string;
  }> = [];
  
  dailyData.forEach((data, date) => {
    const temps = data.temps;
    let mostCommonIcon = '';
    let maxCount = 0;
    
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
  
  return result.slice(0, 7);
}

/**
 * Converts wind degree to direction
 * @param deg - Wind direction in degrees
 */
function getWindDirection(deg: number): string {
  const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
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
