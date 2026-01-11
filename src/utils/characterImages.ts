// Character image paths
export const characterImages = [
  '/characters/Crowman.png',
  '/characters/Foxmist.png',
  '/characters/Frogwiz.png',
  '/characters/Goatguy.png',
  '/characters/Goatmage.png',
  '/characters/Hornsquirrel.png',
  '/characters/Molethief.png',
  '/characters/Ramcat.png',
  '/characters/Ratpirate.png',
  '/characters/Slothmancer.png',
  '/characters/Stoatmancer.png',
];

/**
 * Get a random character image path
 */
export function getRandomCharacterImage(): string {
  const randomIndex = Math.floor(Math.random() * characterImages.length);
  return characterImages[randomIndex];
}

/**
 * Get a specific character image by index
 */
export function getCharacterImage(index: number): string {
  return characterImages[index % characterImages.length];
}
