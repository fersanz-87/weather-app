# Troubleshooting Guide

## Issue: App Not Loading Weather Data

If you see the loading spinner but no weather data appears, follow these steps:

### 1. Check the Browser Console

Open your browser's Developer Tools (F12 or right-click → Inspect) and go to the Console tab.

Look for these log messages:

```
API Key loaded: Yes
Search button clicked
getWeatherData called for: [city name]
Fetching weather data...
Current weather response status: 200
Weather data fetched successfully
```

### 2. Common Issues & Solutions

#### API Key Not Found

**Symptom**: Console shows `API Key loaded: No`

**Solution**:

1. Make sure you have a `.env` file in the project root
2. The file should contain: `VITE_API_KEY=your_api_key_here`
3. Restart the dev server:
   ```bash
   # Stop the server (Ctrl+C), then:
   pnpm dev
   ```

#### Elements Not Found

**Symptom**: Console shows `Required elements not found!`

**Solution**: The HTML structure might be corrupted. Make sure all IDs exist:

- `city-input`
- `search-btn`
- `weather-result`
- `weather-background`

#### API Key Invalid (401 Error)

**Symptom**: Console shows `Response status: 401` or error "Invalid API key"

**Solution**:

1. Verify your API key at [OpenWeatherMap](https://openweathermap.org/api)
2. New API keys can take up to 2 hours to activate
3. Update `.env` with the correct key
4. Restart the dev server

#### City Not Found (404 Error)

**Symptom**: Error message "City not found"

**Solution**:

1. Check spelling of city name
2. Try using just the city name without state/country
3. For cities with spaces, the app handles it automatically

#### Network/CORS Issues

**Symptom**: Console shows CORS errors or network failures

**Solution**:

1. Make sure you're running the dev server (`pnpm dev`)
2. Check if you're accessing via `localhost:5173` (not file://)
3. Check your internet connection
4. Try a different browser

### 3. Quick Fixes

#### Restart Dev Server

```bash
# In terminal, stop the server (Ctrl+C or Cmd+C)
# Then restart:
pnpm dev
```

#### Clear Browser Cache

1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### Check if Server is Running

```bash
# Should show localhost:5173 or similar
lsof -ti:5173
```

### 4. Test API Manually

Test if the API works directly:

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric"
```

Replace `YOUR_API_KEY` with your actual key. You should see JSON data.

### 5. Check File Structure

Make sure you have all required files:

```
weather-app/
├── .env                 ← API key here
├── index.html
├── script.ts
├── style.css
├── package.json
├── tsconfig.json
└── vite-env.d.ts
```

### 6. Verify Dependencies

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### 7. Browser Compatibility

Make sure you're using a modern browser:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### 8. Still Not Working?

1. Open browser console (F12)
2. Copy all error messages
3. Check the Network tab for failed requests
4. Look for red error messages in the Console tab

The console logs will tell you exactly what's failing!

## Common Console Messages

### ✅ Working Correctly

```
API Key loaded: Yes
Search button clicked
getWeatherData called for: San Francisco
Fetching weather data...
Current weather response status: 200
Weather data fetched successfully: {name: "San Francisco", ...}
```

### ❌ Missing API Key

```
API Key loaded: No
```

**Fix**: Add VITE_API_KEY to `.env` file and restart server

### ❌ API Error

```
Current weather response status: 401
Error fetching weather data: Invalid API key
```

**Fix**: Verify API key is correct and activated

### ❌ City Not Found

```
Current weather response status: 404
Error fetching weather data: City not found
```

**Fix**: Check city name spelling
