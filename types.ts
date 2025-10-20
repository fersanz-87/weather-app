// types.ts - TypeScript interfaces and types for the Weather App

/**
 * Interface for current weather data from OpenWeatherMap API
 */
export interface WeatherData {
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

/**
 * Interface for forecast data (5-day/3-hour forecast)
 */
export interface ForecastData {
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

/**
 * Interface for processed daily forecast data
 */
export interface DailyForecast {
  dt: number;
  temp_max: number;
  temp_min: number;
  icon: string;
  description: string;
}

