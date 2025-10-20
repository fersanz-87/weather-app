// animations.ts - Background animations for weather effects

/**
 * Creates animated rain drops
 * @param container - The container element to append rain drops to
 */
export function createRainDrops(container: HTMLElement): void {
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
    
    container.appendChild(drop);
  }
}

/**
 * Creates animated snow flakes
 * @param container - The container element to append snow flakes to
 */
export function createSnowFlakes(container: HTMLElement): void {
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
    
    container.appendChild(flake);
  }
}

/**
 * Creates animated clouds with varied sizes and positioning
 * @param container - The container element to append clouds to
 */
export function createClouds(container: HTMLElement): void {
  console.log('Creating animated clouds...');
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
    
    container.appendChild(cloud);
    console.log(`Cloud ${i + 1} created:`, { top, width, height, duration, delay, opacity });
  }
  console.log(`Total clouds created: ${numberOfClouds}`);
}

/**
 * Creates animated stars for nighttime
 * @param container - The container element to append stars to
 */
export function createStars(container: HTMLElement): void {
  console.log('Creating stars for nighttime...');
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
    
    container.appendChild(star);
  }
  console.log(`Total stars created: ${numberOfStars}`);
}

/**
 * Clears all animation particles from containers
 * @param weatherBackground - The main weather background container
 */
export function clearAnimations(weatherBackground: HTMLElement): void {
  const rainContainer = weatherBackground.querySelector('.rain-container') as HTMLElement;
  const snowContainer = weatherBackground.querySelector('.snow-container') as HTMLElement;
  const cloudsContainer = weatherBackground.querySelector('.clouds-container') as HTMLElement;
  const starsContainer = weatherBackground.querySelector('.stars-container') as HTMLElement;
  
  if (rainContainer) rainContainer.innerHTML = '';
  if (snowContainer) snowContainer.innerHTML = '';
  if (cloudsContainer) cloudsContainer.innerHTML = '';
  if (starsContainer) starsContainer.innerHTML = '';
}

/**
 * Sets the dynamic background based on weather conditions and time of day
 * @param weatherBackground - The background container element
 * @param weatherCondition - Main weather condition from API
 * @param isNight - Whether it's nighttime in the city
 */
export function setWeatherBackground(
  weatherBackground: HTMLElement,
  weatherCondition: string,
  isNight: boolean
): void {
  console.log('Setting weather background for condition:', weatherCondition, 'Night:', isNight);
  
  // Remove all existing weather classes
  weatherBackground.className = 'weather-background';
  
  // Clear existing particles
  clearAnimations(weatherBackground);
  
  const condition = weatherCondition.toLowerCase();
  
  // Get animation containers
  const rainContainer = weatherBackground.querySelector('.rain-container') as HTMLElement;
  const snowContainer = weatherBackground.querySelector('.snow-container') as HTMLElement;
  const cloudsContainer = weatherBackground.querySelector('.clouds-container') as HTMLElement;
  const starsContainer = weatherBackground.querySelector('.stars-container') as HTMLElement;
  
  // Determine weather type and apply appropriate class with animations
  if (condition.includes('rain') || condition.includes('drizzle')) {
    console.log('Applying RAINY background with rain drops');
    weatherBackground.classList.add('rainy');
    createRainDrops(rainContainer);
    if (isNight) {
      weatherBackground.classList.add('night');
    }
  } else if (condition.includes('thunder') || condition.includes('storm')) {
    console.log('Applying THUNDERSTORM background with rain and lightning');
    weatherBackground.classList.add('thunderstorm');
    createRainDrops(rainContainer);
    if (isNight) {
      weatherBackground.classList.add('night');
    }
  } else if (condition.includes('snow')) {
    console.log('Applying SNOWY background with snowflakes');
    weatherBackground.classList.add('snowy');
    createSnowFlakes(snowContainer);
    if (isNight) {
      weatherBackground.classList.add('night');
    }
  } else if (condition.includes('clear')) {
    if (isNight) {
      console.log('Applying CLEAR NIGHT background with moon and stars');
      weatherBackground.classList.add('clear-night');
      createStars(starsContainer);
    } else {
      console.log('Applying SUNNY background with sun and clouds');
      weatherBackground.classList.add('sunny');
      createClouds(cloudsContainer);
    }
  } else if (condition.includes('cloud')) {
    console.log('Applying CLOUDY background with clouds');
    if (isNight) {
      weatherBackground.classList.add('cloudy-night');
      createStars(starsContainer);
    } else {
      weatherBackground.classList.add('cloudy');
    }
    createClouds(cloudsContainer);
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
      createStars(starsContainer);
    } else {
      weatherBackground.classList.add('clear');
    }
  }
  
  console.log('Background classes:', weatherBackground.className);
}

