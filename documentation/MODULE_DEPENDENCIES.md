# Module Dependencies Diagram

## 📊 Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│                     (Browser / HTML / CSS)                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        script.ts                             │
│                   (Main Entry Point)                         │
│  • Initializes DOM elements                                  │
│  • Sets up event listeners                                   │
│  • Orchestrates application flow                             │
└─────────────────────────────────────────────────────────────┘
         ↓              ↓              ↓              ↓
    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
    │ api.ts │    │  ui.ts │    │ anims  │    │ utils  │
    └────────┘    └────────┘    └────────┘    └────────┘
         ↓              ↓              ↓              ↓
    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
    │ types  │    │ utils  │    │        │    │ types  │
    └────────┘    └────────┘    └────────┘    └────────┘
                       ↓
                  ┌────────┐
                  │ types  │
                  └────────┘
```

## 🔗 Module Dependencies (Detailed)

### Level 0: Foundation (No Dependencies)

```
types.ts
  ↑
  └─ Exports: WeatherData, ForecastData, DailyForecast
  └─ Imports: None
  └─ Description: Pure type definitions
```

### Level 1: Utilities (Depends on types only)

```
utils.ts
  ↑
  ├─ Imports: types.ts
  └─ Exports:
      • getCityLocalTime()
      • isNightTime()
      • formatDate()
      • formatTime()
      • getWindDirection()
      • capitalizeWords()
      • getDailyForecast()
  └─ Description: Pure functions, no side effects

api.ts
  ↑
  ├─ Imports: types.ts
  └─ Exports:
      • fetchCurrentWeather()
      • fetchForecast()
      • fetchWeatherData()
  └─ Description: External API communication
```

### Level 2: Specialized Modules (May depend on types and utils)

```
animations.ts
  ↑
  ├─ Imports: None (standalone)
  └─ Exports:
      • createRainDrops()
      • createSnowFlakes()
      • createClouds()
      • createStars()
      • clearAnimations()
      • setWeatherBackground()
  └─ Description: DOM manipulation for visual effects

ui.ts
  ↑
  ├─ Imports: types.ts, utils.ts
  └─ Exports:
      • showLoading()
      • showError()
      • displayWeather()
  └─ Description: DOM rendering and display logic
```

### Level 3: Application Layer (Orchestrates all modules)

```
script.ts (Entry Point)
  ↑
  ├─ Imports: api.ts, animations.ts, ui.ts, utils.ts
  └─ Exports: None (entry point)
  └─ Description: Application orchestration and event handling
```

## 📦 Import/Export Matrix

| Module          | Imports From               | Exports To     |
| --------------- | -------------------------- | -------------- |
| `types.ts`      | —                          | api, utils, ui |
| `utils.ts`      | types                      | ui, script     |
| `api.ts`        | types                      | script         |
| `animations.ts` | —                          | script         |
| `ui.ts`         | types, utils               | script         |
| `script.ts`     | api, animations, ui, utils | —              |

## 🔄 Data Flow

### 1. User Search Flow

```
User Input
    ↓
script.ts (Event Handler)
    ↓
api.ts (fetchWeatherData)
    ↓
types.ts (Type Validation)
    ↓
script.ts (Receives Data)
    ↓
utils.ts (isNightTime)
    ↓
animations.ts (setWeatherBackground)
    ↓
ui.ts (displayWeather)
    ↓
utils.ts (formatting helpers)
    ↓
DOM Update (User sees result)
```

### 2. Clock Update Flow

```
setInterval (Every 1s)
    ↓
ui.ts (updateClock - private)
    ↓
utils.ts (getCityLocalTime)
    ↓
utils.ts (formatTime, formatDate)
    ↓
DOM Update (Clock display)
```

### 3. Background Animation Flow

```
Weather Condition + Time
    ↓
script.ts (Determines conditions)
    ↓
animations.ts (setWeatherBackground)
    ↓
animations.ts (clearAnimations)
    ↓
animations.ts (create* functions)
    ↓
DOM Update (Animated background)
```

## 🎯 Design Principles

### 1. Dependency Direction

- **Rule**: Dependencies flow downward (or sideways at same level)
- **Benefit**: No circular dependencies
- **Result**: Clean, testable architecture

### 2. Coupling

- **types.ts**: Zero coupling (foundation)
- **utils.ts**: Low coupling (only types)
- **api.ts**: Low coupling (only types)
- **animations.ts**: Zero coupling (standalone)
- **ui.ts**: Medium coupling (types + utils)
- **script.ts**: High coupling (orchestrates all)

### 3. Cohesion

- **Each module**: High cohesion (single responsibility)
- **Related functions**: Grouped together
- **Unrelated concerns**: Separated into different modules

## 🧪 Testing Strategy

Based on dependency graph:

### Unit Testing Order

1. **types.ts** - Type definitions (no tests needed)
2. **utils.ts** - Pure functions (easy to test)
3. **api.ts** - Mock fetch, test responses
4. **animations.ts** - Test DOM manipulation
5. **ui.ts** - Test rendering with mocked utils
6. **script.ts** - Integration tests with mocked modules

### Mocking Strategy

```
Testing ui.ts:
  • Mock: types (interfaces)
  • Mock: utils (return fixed values)
  • Test: DOM output

Testing api.ts:
  • Mock: fetch API
  • Test: Error handling, data transformation

Testing script.ts:
  • Mock: All imported modules
  • Test: Event handling, orchestration
```

## 📊 Complexity Analysis

| Module        | Lines | Complexity | Dependencies | Testability |
| ------------- | ----- | ---------- | ------------ | ----------- |
| types.ts      | 67    | Low        | 0            | N/A         |
| utils.ts      | 112   | Low        | 1            | High        |
| api.ts        | 77    | Medium     | 1            | High        |
| animations.ts | 187   | Medium     | 0            | Medium      |
| ui.ts         | 188   | Medium     | 2            | Medium      |
| script.ts     | 71    | Low        | 4            | Medium      |

**Cyclomatic Complexity**: All modules maintain low-to-medium complexity, making them easy to understand and maintain.

## 🔐 Isolation Benefits

### Types Module

- ✅ Can be updated without code changes
- ✅ Serves as documentation
- ✅ Enables IDE autocomplete

### Utils Module

- ✅ Pure functions (no side effects)
- ✅ Easy to unit test
- ✅ Reusable in other projects

### API Module

- ✅ Can swap providers without UI changes
- ✅ Easy to add caching
- ✅ Centralized error handling

### Animations Module

- ✅ Visual effects isolated
- ✅ Can be disabled/enabled easily
- ✅ Performance optimization isolated

### UI Module

- ✅ Presentation logic separated
- ✅ Can change design without logic changes
- ✅ Easy to A/B test different UIs

### Script Module

- ✅ Minimal orchestration code
- ✅ Clear application flow
- ✅ Easy to understand entry point

## 🚀 Scalability Path

### Phase 1: Current (Complete ✅)

- Modular architecture
- Clean separation of concerns
- Type safety

### Phase 2: Enhanced Testing

- Unit tests for utils.ts
- Integration tests for api.ts
- E2E tests for user flows

### Phase 3: Advanced Features

- Add caching layer (modify only api.ts)
- Add i18n (modify only ui.ts)
- Add PWA (add service-worker.ts)

### Phase 4: Framework Migration (if needed)

- Convert ui.ts to React components
- Keep api.ts, utils.ts, types.ts unchanged
- Minimal refactoring required

---

**Last Updated**: October 20, 2025  
**Architecture Version**: 1.0  
**Maintained By**: Fernando Sanz
