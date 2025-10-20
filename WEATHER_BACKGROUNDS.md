# Dynamic Weather Backgrounds

Your weather app now features **immersive, animated backgrounds** that change dynamically based on the current weather conditions!

## 🌈 Weather Types & Effects

### ☀️ Sunny / Clear

- **Background**: Beautiful blue gradient sky
- **Animation**: Glowing animated sun in the top-right corner
- **Effect**: Pulsing glow effect simulating sunlight
- **Trigger**: When weather condition is "Clear"

### 🌧️ Rainy

- **Background**: Dark gray gradient sky
- **Animation**: 100 animated raindrops falling
- **Effect**: Realistic rain with varying speeds and opacity for depth
- **Details**:
  - Drops fall at different speeds (0.5-1s)
  - Random delays for natural effect
  - Semi-transparent for layered depth
- **Trigger**: When weather includes "Rain" or "Drizzle"

### ⛈️ Thunderstorm

- **Background**: Very dark, dramatic gradient
- **Animation**: Rain drops + lightning flashes
- **Effect**:
  - Same rain as rainy weather
  - Periodic lightning flashes (every 8 seconds)
  - Screen flashes white briefly to simulate lightning
- **Trigger**: When weather includes "Thunder" or "Storm"

### ❄️ Snow

- **Background**: Light gray/blue winter gradient
- **Animation**: 50 animated snowflakes falling and rotating
- **Effect**:
  - Snowflakes of varying sizes (5-10px)
  - Rotation while falling for realistic effect
  - Soft glow around each flake
  - Slow, gentle falling motion (5-8s duration)
- **Trigger**: When weather condition is "Snow"

### ☁️ Cloudy

- **Background**: Medium gray gradient
- **Animation**: Floating animated clouds
- **Effect**:
  - 5 large, blurred cloud shapes
  - Slow horizontal movement across screen
  - Varying sizes and heights
  - Semi-transparent for depth
- **Trigger**: When weather includes "Cloud"

### 🌫️ Misty / Foggy

- **Background**: Medium-light gray gradient
- **Animation**: Slow-moving fog effect
- **Effect**:
  - Layered radial gradients simulating fog
  - Slow drifting motion (30s cycle)
  - Multiple fog layers for depth
- **Trigger**: When weather includes "Mist", "Fog", or "Haze"

## 🎨 Technical Details

### CSS Animations

All animations are pure CSS for optimal performance:

- `@keyframes fall` - Rain drops falling
- `@keyframes snowfall` - Snow with rotation
- `@keyframes float-cloud` - Clouds moving horizontally
- `@keyframes pulse-sun` - Sun glowing effect
- `@keyframes lightning-flash` - Thunder lightning effect
- `@keyframes drift` - Fog movement

### Dynamic Particle Generation

Particles (rain, snow, clouds) are generated dynamically in TypeScript:

- **Rain**: 100 drops with randomized position, speed, and timing
- **Snow**: 50 flakes with randomized size, position, speed, and timing
- **Clouds**: 5 clouds with randomized size, position, and speed

### Performance Optimizations

- Particles use CSS transforms (GPU-accelerated)
- Blur effects applied with `filter: blur()`
- Transitions are hardware-accelerated
- Particle count balanced for performance vs. visual effect

## 🔧 How It Works

### Weather Detection

The app uses OpenWeatherMap's main weather condition:

```typescript
setWeatherBackground(current.weather[0].main);
```

### Condition Mapping

```typescript
// Rain or Drizzle → Rainy background
// Thunderstorm → Thunderstorm with lightning
// Snow → Snowy background
// Clear → Sunny with sun
// Clouds → Cloudy with clouds
// Mist/Fog/Haze → Misty background
```

### Background Classes

The background element gets a class applied:

- `.rainy` - Rain effect
- `.thunderstorm` - Thunder with rain
- `.snowy` - Snow effect
- `.sunny` - Clear sky with sun
- `.cloudy` - Clouds
- `.misty` - Fog effect
- `.clear` - Default clear sky

## 🎯 User Experience

### Smooth Transitions

- Background colors transition smoothly (1s ease)
- Particles fade in/out gracefully (0.5s ease)
- Weather changes feel natural and immersive

### Visual Feedback

- Users instantly see the weather condition through the background
- Animations reinforce the weather type
- Creates emotional connection to weather data

### Responsive Design

- All animations work on mobile, tablet, and desktop
- Performance optimized for all devices
- Particle count appropriate for screen size

## 🚀 Future Enhancements

Possible additions:

- Wind effect (leaves blowing)
- Sunset/sunrise colors based on time of day
- More dramatic storm effects
- Animated weather transitions between conditions
- Sound effects (optional)

## 📝 Customization

To adjust particle counts, edit in `script.ts`:

```typescript
const numberOfDrops = 100; // Rain
const numberOfFlakes = 50; // Snow
const numberOfClouds = 5; // Clouds
```

To modify animation speeds, edit CSS duration values:

```css
animation-duration: ${Math.random() * 0.5 + 0.5}s;
```

Enjoy your immersive weather experience! 🌦️
