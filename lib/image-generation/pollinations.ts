
export interface ImageGenerationOptions {
  width?: number;
  height?: number;
  seed?: number;
  nologo?: boolean;
  enhance?: boolean;
}

/**
 * Generate an image URL using Pollinations.ai
 * @param prompt - The text description of the image
 * @param options - Optional parameters for image generation
 * @returns URL of the generated image
 */
export function generateImageUrl(prompt: string, options: ImageGenerationOptions = {}): string {
  const {
    width = 512,
    height = 512,
    seed,
    nologo = true,
    enhance = true
  } = options;

  
  const cleanPrompt = prompt.trim().replace(/\s+/g, ' ');
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  const params = new URLSearchParams();
  if (width !== 512) params.append('width', width.toString());
  if (height !== 512) params.append('height', height.toString());
  if (seed) params.append('seed', seed.toString());
  if (nologo) params.append('nologo', 'true');
  if (enhance) params.append('enhance', 'true');

  const queryString = params.toString();
  const baseUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Generate optimized prompt for exercise images
 */
export function createExercisePrompt(exerciseName: string, equipment?: string): string {
  const basePrompt = `professional fitness photo of ${exerciseName} exercise`;
  const equipmentText = equipment && equipment !== "None" ? ` using ${equipment}` : " bodyweight";
  return `${basePrompt}${equipmentText}, gym environment, high quality, detailed, realistic, fitness photography`;
}

/**
 * Generate optimized prompt for meal images
 */
export function createMealPrompt(mealName: string, items: string[]): string {
  const itemsText = items.slice(0, 3).join(', ');
  return `professional food photography of ${mealName}: ${itemsText}, appetizing, colorful, high quality, overhead view, restaurant quality`;
}

/**
 * Preload an image to check if it's ready
 */
export function preloadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Generate and cache image
 */
export async function generateAndCacheImage(
  cacheKey: string,
  prompt: string,
  options?: ImageGenerationOptions
): Promise<string> {
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return cached;
  }

  // Generate new image
  const imageUrl = generateImageUrl(prompt, options);
  
  try {
    await preloadImage(imageUrl);
    localStorage.setItem(cacheKey, imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error('Failed to generate image:', error);
    throw error;
  }
}

/**
 * Clear image cache
 */
export function clearImageCache(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('img_')) {
      localStorage.removeItem(key);
    }
  });
}
