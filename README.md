# Weather App - BBC Weather Inspired

A modern, professional weather application with a dark theme inspired by BBC Weather. Built with TypeScript, Vite, and the OpenWeatherMap API.

## Features

### 🎨 Design

- **Dark Theme**: Professional dark UI inspired by BBC Weather
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Modern Interface**: Clean navigation bar with integrated search
- **Smooth Animations**: Fade-in effects and hover interactions

### 🌤️ Weather Information

- **Current Weather**: Real-time temperature, description, and weather icon
- **Hourly Forecast**: 24-hour forecast showing time, temperature, weather icon, and precipitation probability
- **7-Day Forecast**: Weekly forecast with daily high/low temperatures
- **Detailed Metrics**:
  - Humidity and pressure
  - Wind speed and direction
  - "Feels like" temperature
  - Visibility conditions

### 🛠️ Technical Features

- **TypeScript**: Fully typed with interfaces for type safety
- **Modular Architecture**: Clean separation of concerns across modules
- **Modern JavaScript**: Async/await for API calls
- **Parallel Data Fetching**: Current weather and forecast loaded simultaneously
- **Error Handling**: Comprehensive error messages for various scenarios
- **Performance**: Optimized API calls and rendering
- **SOLID Principles**: Following best practices for maintainability

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (or npm/yarn)
- OpenWeatherMap API key

### Installation

1. Clone the repository

```bash
cd weather-app
```

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env` file in the root directory

```env
VITE_API_KEY=your_openweathermap_api_key_here
```

4. Run the development server

```bash
pnpm dev
```

5. Build for production

```bash
pnpm build
```

## Documentation

📚 **All project documentation is located in the [`/documentation`](./documentation) folder.**

- **Start here**: [Documentation Index](./documentation/DOCS_INDEX.md) - Complete guide to all documentation
- **Architecture**: [Module Architecture](./documentation/MODULE_ARCHITECTURE.md) - System design and structure
- **Dependencies**: [Module Dependencies](./documentation/MODULE_DEPENDENCIES.md) - How modules connect
- **Refactoring**: [Refactoring Summary](./documentation/REFACTORING_SUMMARY.md) - Recent improvements

## Project Structure

```
weather-app/
├── index.html              # Main HTML file
├── style.css               # BBC Weather-inspired styles
├── script.ts               # Main entry point and event handling
├── types.ts                # TypeScript interfaces and types
├── api.ts                  # API layer (OpenWeatherMap integration)
├── animations.ts           # Background weather animations
├── ui.ts                   # DOM rendering and UI management
├── utils.ts                # Utility functions (formatting, calculations)
├── documentation/          # All project documentation
├── tsconfig.json           # TypeScript configuration
├── vite-env.d.ts           # Vite environment type definitions
├── package.json            # Project dependencies
└── .gitignore              # Git ignore rules
```

### Module Architecture

The codebase follows a modular architecture for better maintainability and scalability:

- **`types.ts`**: Central location for all TypeScript interfaces and types
- **`api.ts`**: API layer handling all external data fetching with error handling
- **`animations.ts`**: Weather background animations (rain, snow, clouds, stars)
- **`ui.ts`**: DOM manipulation and rendering logic
- **`utils.ts`**: Pure utility functions for data transformation and formatting
- **`script.ts`**: Main orchestrator connecting all modules

## API Integration

This app uses the OpenWeatherMap API with two endpoints:

1. **Current Weather**: `/data/2.5/weather`
   - Provides real-time weather conditions
2. **5-Day Forecast**: `/data/2.5/forecast`
   - Provides forecast data in 3-hour intervals
   - Processed to show hourly (8 intervals) and daily forecasts

## Color Scheme

The app uses a professional dark theme:

- **Primary Background**: `#1a1d29`
- **Secondary Background**: `#252936`
- **Card Background**: `#2d3142`
- **Accent Blue**: `#4a90e2`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#b8c1cc`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

ISC

## Acknowledgments

- Design inspired by [BBC Weather](https://www.bbc.com/weather)
- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from OpenWeatherMap
