import { getRandomCharacterImage } from '../utils/characterImages';

export interface VillageItem {
  id: string;
  name: string;
  type: 'critter' | 'building' | 'gear';
  level?: number;
  description?: string;
  image?: string;
  isExhausted?: boolean; // Temporarily disabled status
}

// Mock exhausted end times (timestamps when exhaustion expires)
// In a real app, these would come from your backend/game state
export const EXHAUSTED_END_TIMES: Record<string, number> = {
  'c2': Date.now() + 2 * 60 * 1000 + 45 * 1000,  // Mountain Bear - 2:45 from now
  'c4': Date.now() + 5 * 60 * 1000 + 12 * 1000,  // Sky Hawk - 5:12 from now
};

// Helper function to format remaining time
export function formatTimeRemaining(endTime: number): string {
  const now = Date.now();
  const remaining = Math.max(0, endTime - now);

  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

// Mock Critters
export const MOCK_CRITTERS: VillageItem[] = [
  { id: 'c1', name: 'Forest Fox', type: 'critter', level: 5, description: 'Swift and clever', image: getRandomCharacterImage() },
  { id: 'c2', name: 'Mountain Bear', type: 'critter', level: 8, description: 'Strong and brave', image: getRandomCharacterImage(), isExhausted: true },
  { id: 'c3', name: 'River Otter', type: 'critter', level: 3, description: 'Playful swimmer', image: getRandomCharacterImage() },
  { id: 'c4', name: 'Sky Hawk', type: 'critter', level: 6, description: 'Sharp-eyed scout', image: getRandomCharacterImage(), isExhausted: true },
  { id: 'c5', name: 'Garden Rabbit', type: 'critter', level: 2, description: 'Quick gatherer', image: getRandomCharacterImage() },
];

// Mock Buildings
export const MOCK_BUILDINGS: VillageItem[] = [
  { id: 'b1', name: 'Town Hall', type: 'building', level: 10, description: 'Heart of the village' },
  { id: 'b2', name: 'Blacksmith', type: 'building', level: 7, description: 'Forge powerful gear' },
  { id: 'b3', name: 'Market', type: 'building', level: 5, description: 'Trade goods here' },
  { id: 'b4', name: 'Library', type: 'building', level: 4, description: 'Study and learn' },
];

// Mock Gear
export const MOCK_GEAR: VillageItem[] = [
  { id: 'g1', name: 'Iron Sword', type: 'gear', level: 5, description: '+10 Attack' },
  { id: 'g2', name: 'Wooden Shield', type: 'gear', level: 3, description: '+8 Defense' },
  { id: 'g3', name: 'Leather Boots', type: 'gear', level: 4, description: '+5 Speed' },
  { id: 'g4', name: 'Magic Ring', type: 'gear', level: 7, description: '+12 Magic' },
  { id: 'g5', name: 'Steel Helmet', type: 'gear', level: 6, description: '+9 Defense' },
  { id: 'g6', name: 'Crystal Amulet', type: 'gear', level: 8, description: '+15 Magic' },
];

// Collection limits
export const MAX_CRITTERS = 10;
export const MAX_BUILDINGS = 8;
export const MAX_GEAR = 12;
