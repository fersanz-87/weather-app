# Arquitectura Modular del Weather App

Este documento describe la organización modular del código de la aplicación Weather App, que sigue las mejores prácticas de TypeScript y desarrollo frontend.

## 📁 Estructura de Módulos

### 1. **`types.ts`** - Definiciones de Tipos

**Responsabilidad**: Contiene todas las interfaces y tipos TypeScript utilizados en la aplicación.

**Exporta**:

- `WeatherData` - Interfaz para datos del clima actual de OpenWeatherMap
- `ForecastData` - Interfaz para datos de pronóstico (5 días/3 horas)
- `DailyForecast` - Interfaz para pronóstico diario procesado

**Por qué existe**: Centralizar las definiciones de tipos facilita el mantenimiento, la reutilización y proporciona un contrato claro para las estructuras de datos en toda la aplicación.

---

### 2. **`api.ts`** - Capa de API

**Responsabilidad**: Maneja todas las comunicaciones con la API de OpenWeatherMap.

**Exporta**:

- `fetchCurrentWeather(city)` - Obtiene datos del clima actual
- `fetchForecast(city)` - Obtiene pronóstico de 5 días
- `fetchWeatherData(city)` - Función de conveniencia que obtiene ambos en paralelo

**Características**:

- Manejo de errores HTTP específico (404, 401, etc.)
- Validación de respuestas de la API
- Logging detallado para debugging
- Uso de `Promise.all()` para llamadas paralelas

**Por qué existe**: Separar la lógica de red permite cambiar fácilmente el proveedor de API, agregar caché, o implementar lógica de reintento sin afectar otras partes del código.

---

### 3. **`animations.ts`** - Animaciones de Fondo

**Responsabilidad**: Crea y gestiona todas las animaciones visuales del fondo meteorológico.

**Exporta**:

- `createRainDrops(container)` - Crea animación de lluvia
- `createSnowFlakes(container)` - Crea animación de nieve
- `createClouds(container)` - Crea animación de nubes
- `createStars(container)` - Crea animación de estrellas
- `clearAnimations(weatherBackground)` - Limpia todas las animaciones
- `setWeatherBackground(background, condition, isNight)` - Configura el fondo según el clima

**Características**:

- Generación procedural de partículas
- Animaciones CSS optimizadas
- Variación aleatoria para efecto natural
- Manejo de día/noche

**Por qué existe**: Las animaciones son complejas y reutilizables. Aislarlas permite optimización independiente, testing visual, y facilita agregar nuevos efectos.

---

### 4. **`utils.ts`** - Funciones de Utilidad

**Responsabilidad**: Proporciona funciones helper de propósito general para transformación y formateo de datos.

**Exporta**:

- `getCityLocalTime(timezoneOffset)` - Calcula la hora local de una ciudad
- `isNightTime(timezoneOffset)` - Determina si es de noche
- `formatDate(date)` - Formatea fechas legiblemente
- `formatTime(date)` - Formatea horas en formato 24h
- `getWindDirection(deg)` - Convierte grados a dirección cardinal
- `capitalizeWords(str)` - Capitaliza primera letra de cada palabra
- `getDailyForecast(forecastList)` - Procesa datos de pronóstico en resumen diario

**Características**:

- Funciones puras sin efectos secundarios
- Fácilmente testeable
- Reutilizables en múltiples contextos

**Por qué existe**: Las utilidades comunes deben estar centralizadas para evitar duplicación de código, facilitar el testing, y mantener consistencia en toda la aplicación.

---

### 5. **`ui.ts`** - Renderizado del DOM

**Responsabilidad**: Maneja toda la manipulación del DOM y renderizado de la interfaz de usuario.

**Exporta**:

- `showLoading(container)` - Muestra estado de carga
- `showError(container, message)` - Muestra mensajes de error
- `displayWeather(container, current, forecast)` - Renderiza los datos del clima

**Características**:

- Generación de HTML estructurado
- Gestión del reloj en tiempo real
- Presentación estilo BBC Weather
- Diseño responsive

**Por qué existe**: Separar la lógica de presentación del resto permite cambiar el UI fácilmente, implementar diferentes temas, o incluso migrar a un framework de componentes en el futuro.

---

### 6. **`script.ts`** - Punto de Entrada Principal

**Responsabilidad**: Orquesta la aplicación, conecta módulos y maneja eventos del usuario.

**Funcionalidad**:

- Inicializa elementos del DOM
- Configura event listeners
- Coordina el flujo entre módulos
- Maneja errores de alto nivel

**Características**:

- Código mínimo, principalmente orquestación
- Delega funcionalidades específicas a módulos especializados
- Punto de entrada claro para la aplicación

**Por qué existe**: Un archivo principal ligero actúa como el "director de orquesta", facilitando entender el flujo general de la aplicación sin perderse en detalles de implementación.

---

## 🔄 Flujo de Datos

```
Usuario ingresa ciudad
        ↓
   script.ts (Event Handler)
        ↓
   api.ts (Fetch Data)
        ↓
   types.ts (Type Validation)
        ↓
   utils.ts (Data Processing)
        ↓
   animations.ts (Background Setup)
        ↓
   ui.ts (Render Display)
        ↓
   Usuario ve resultado
```

## 📦 Ventajas de esta Arquitectura

### 1. **Separación de Responsabilidades (SRP)**

Cada módulo tiene una única razón para cambiar, siguiendo el principio SOLID.

### 2. **Mantenibilidad**

- Fácil localizar y corregir bugs
- Cambios localizados no afectan otros módulos
- Código más legible y autodocumentado

### 3. **Testabilidad**

- Cada módulo puede ser testeado independientemente
- Funciones puras en `utils.ts` son fáciles de testear
- Mocking simplificado de la API

### 4. **Escalabilidad**

- Fácil agregar nuevas funcionalidades
- Nuevos desarrolladores pueden contribuir sin entender todo el código
- Posible migración gradual a frameworks (React, Vue, etc.)

### 5. **Reutilización**

- Módulos como `utils.ts` y `animations.ts` pueden usarse en otros proyectos
- APIs claras facilitan la integración

### 6. **Type Safety**

- TypeScript proporciona autocompletado robusto
- Errores detectados en tiempo de compilación
- Documentación implícita a través de tipos

## 🛠️ Cómo Extender la Aplicación

### Agregar un nuevo proveedor de clima:

1. Crear `api-weather-provider.ts`
2. Implementar las mismas funciones de `api.ts`
3. Cambiar el import en `script.ts`

### Agregar nuevas animaciones:

1. Agregar función en `animations.ts` (ej: `createFog()`)
2. Actualizar `setWeatherBackground()` con la nueva condición

### Agregar nuevas utilidades:

1. Agregar función en `utils.ts`
2. Exportarla para uso en otros módulos

### Cambiar el diseño:

1. Modificar solo `ui.ts`
2. Los datos y la lógica permanecen intactos

## 📝 Convenciones de Código

- **Imports**: Usar imports nombrados explícitos
- **Exports**: Exportar solo lo necesario, mantener implementación interna privada
- **Comentarios JSDoc**: Todas las funciones exportadas deben tener documentación
- **Type Safety**: Preferir tipos explícitos sobre inferencia implícita
- **Naming**: Nombres descriptivos y específicos para funciones y variables

## 🚀 Próximos Pasos Recomendados

1. **Testing**: Agregar tests unitarios para cada módulo
2. **Caché**: Implementar caché de API en `api.ts`
3. **i18n**: Agregar soporte multiidioma en `ui.ts`
4. **PWA**: Convertir en Progressive Web App
5. **Error Boundary**: Mejorar manejo de errores global
6. **Accessibility**: Audit y mejoras de accesibilidad

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0  
**Autor**: Fernando Sanz
